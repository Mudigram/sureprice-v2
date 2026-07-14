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