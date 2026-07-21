'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { requireBusinessManage } from '@/lib/auth/require-access'
import { createCatalogItemSchema, type CreateCatalogItemInput } from './schema'
import { updateCatalogItemSchema, type UpdateCatalogItemInput } from './schema'
import type { Json } from '@/types/database'

function attributesToJson(attrs: { key: string; value: string }[]): Json {
  return attrs.reduce((acc, { key, value }) => {
    if (key) acc[key] = value
    return acc
  }, {} as Record<string, string>)
}

export async function updateCatalogItem(itemId: string, businessId: string, input: UpdateCatalogItemInput) {
  const parsed = updateCatalogItemSchema.parse(input)
  await requireBusinessManage(businessId)

  const supabase = await createClient()
  const { error } = await supabase
    .from('catalog_items')
    .update({
      category_id: parsed.category_id || null,
      name: parsed.name,
      description: parsed.description || null,
      base_price: parsed.base_price ?? null,
      attributes: attributesToJson(parsed.attributes),
    })
    .eq('id', itemId)

  if (error) throw error

  revalidatePath(`/businesses/${businessId}/catalog-items/${itemId}`)
  redirect(`/businesses/${businessId}/catalog-items/${itemId}`)
}

export async function createCatalogItem(input: CreateCatalogItemInput) {
  const parsed = createCatalogItemSchema.parse(input)
  await requireBusinessManage(parsed.business_id)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data, error } = await supabase
    .from('catalog_items')
    .insert({
      business_id: parsed.business_id,
      category_id: parsed.category_id || null,
      name: parsed.name,
      description: parsed.description || null,
      base_price: parsed.base_price ?? null,
      attributes: attributesToJson(parsed.attributes),
      created_by: user.id,
    })
    .select('id')
    .single()

  if (error) throw error

  revalidatePath(`/businesses/${parsed.business_id}/catalog-items`)
  redirect(`/businesses/${parsed.business_id}/catalog-items/${data.id}`)
}