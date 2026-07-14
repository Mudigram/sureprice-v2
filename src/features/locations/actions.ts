'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { requireBusinessManage, requireLocationManage } from '@/lib/auth/require-access'
import {
  createLocationSchema,
  updateLocationSchema,
  type CreateLocationInput,
  type UpdateLocationInput,
} from './schema'

export async function createLocation(input: CreateLocationInput) {
  const parsed = createLocationSchema.parse(input)

  await requireBusinessManage(parsed.business_id)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data, error } = await supabase
    .from('locations')
    .insert({
      business_id: parsed.business_id,
      name: parsed.name,
      address_line1: parsed.address_line1 || null,
      city: parsed.city || null,
      created_by: user.id,
    })
    .select('id')
    .single()

  if (error) throw error

  revalidatePath(`/businesses/${parsed.business_id}`)
  redirect(`/locations/${data.id}`)
}

export async function updateLocation(locationId: string, businessId: string, input: UpdateLocationInput) {
  const parsed = updateLocationSchema.parse(input)

  await requireLocationManage(locationId)

  const supabase = await createClient()

  const { error } = await supabase
    .from('locations')
    .update({ name: parsed.name, address_line1: parsed.address_line1 || null, city: parsed.city || null })
    .eq('id', locationId)

  if (error) throw error

  revalidatePath(`/locations/${locationId}`)
  redirect(`/locations/${locationId}`)
}