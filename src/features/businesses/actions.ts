'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { requireOrgAccess, requireBusinessManage } from '@/lib/auth/require-access'
import {
  createBusinessSchema,
  updateBusinessSchema,
  type CreateBusinessInput,
  type UpdateBusinessInput,
} from './schema'

import { nanoid } from 'nanoid'

export async function createBusiness(input: CreateBusinessInput) {
  const parsed = createBusinessSchema.parse(input) // server-side re-validation

  await requireOrgAccess(parsed.organization_id)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data, error } = await supabase
    .from('businesses')
    .insert({
      organization_id: parsed.organization_id,
      name: parsed.name,
      slug: parsed.slug,
      business_type: parsed.business_type,
      created_by: user.id,
    })
    .select('id')
    .single()

  if (error) throw error

  // Auto-generate Master Storefront QR Code (target_type: 'business', target_id: data.id)
  // This ensures the stall immediately has an active, trackable QR code linking to /s/[slug]
  try {
    await supabase.from('qr_codes').insert({
      business_id: data.id,
      target_type: 'business',
      target_id: data.id,
      code: `biz_${nanoid(10)}`,
      created_by: user.id,
      status: 'active',
    })
  } catch (qrErr) {
    console.warn('Non-fatal: could not auto-create master QR code for new business:', qrErr)
  }

  // Auto-provision initial storefront row so the business is immediately published and configurable
  try {
    await supabase.from('storefronts').insert({
      business_id: data.id,
      created_by: user.id,
      template: 'default',
      is_published: true,
      theme: {
        tagline: 'Point. Scan. Know. · 1-Tap In-Store QR Tags & Menus',
      },
    })
  } catch (sfErr) {
    console.warn('Non-fatal: could not auto-create initial storefront record:', sfErr)
  }

  revalidatePath('/dashboard')
  redirect(`/businesses/${data.id}`)
}


export async function updateBusiness(businessId: string, input: UpdateBusinessInput) {
  const parsed = updateBusinessSchema.parse(input)

  await requireBusinessManage(businessId)

  const supabase = await createClient()

  const { error } = await supabase
    .from('businesses')
    .update({
      name: parsed.name,
      slug: parsed.slug,
      business_type: parsed.business_type,
    })
    .eq('id', businessId)

  if (error) throw error

  revalidatePath(`/businesses/${businessId}`)
  redirect(`/businesses/${businessId}`)
}