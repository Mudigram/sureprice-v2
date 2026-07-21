import { createClient } from '@/lib/supabase/server'
import type { CatalogItem } from './types'

export async function getCatalogItemsForBusiness(
  businessId: string,
  includeArchived = false
): Promise<CatalogItem[]> {
  const supabase = await createClient()

  let query = supabase.from('catalog_items').select('*').eq('business_id', businessId).order('created_at', { ascending: false })
  if (!includeArchived) query = query.eq('status', 'active')

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function getCatalogItemById(itemId: string): Promise<CatalogItem | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('catalog_items').select('*').eq('id', itemId).maybeSingle()
  if (error) throw error
  return data
}