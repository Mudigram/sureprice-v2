import { createClient } from '@/lib/supabase/server'
import { assertEntityStatus } from '@/lib/types/status'
import type { Category } from './types'

function toCategory(row: Category): Category {
  assertEntityStatus(row.status, 'categories.status')
  return row
}

export async function getCategoriesForBusiness(
  businessId: string,
  includeArchived = false
): Promise<Category[]> {
  const supabase = await createClient()

  let query = supabase
    .from('categories')
    .select('*')
    .eq('business_id', businessId)
    .order('sort_order', { ascending: true })

  if (!includeArchived) query = query.eq('status', 'active')

  const { data, error } = await query
  if (error) throw error
  return (data ?? []).map(toCategory)
}