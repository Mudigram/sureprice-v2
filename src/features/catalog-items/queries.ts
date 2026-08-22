import { createClient } from '@/lib/supabase/server'
import { assertEntityStatus } from '@/lib/types/status'
import type { CatalogItem } from './types'

function toCatalogItem(row: CatalogItem): CatalogItem {
  assertEntityStatus(row.status, 'catalog_items.status')
  return row
}

export async function getCatalogItemsForBusiness(
  businessId: string,
  includeArchived = false
): Promise<CatalogItem[]> {
  const supabase = await createClient()

  let query = supabase.from('catalog_items').select('*').eq('business_id', businessId).order('created_at', { ascending: false })
  if (!includeArchived) query = query.eq('status', 'active')

  const { data, error } = await query
  if (error) throw error
  return (data ?? []).map(toCatalogItem)
}

export async function getCatalogItemById(itemId: string): Promise<CatalogItem | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from('catalog_items').select('*').eq('id', itemId).maybeSingle()
  if (error) throw error
  if (data) toCatalogItem(data)
  return data
}