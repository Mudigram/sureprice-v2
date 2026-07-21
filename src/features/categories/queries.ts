import { createClient } from '@/lib/supabase/server'
import type { Category } from './types'

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
  return data ?? []
}