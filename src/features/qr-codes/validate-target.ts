import { createClient } from '@/lib/supabase/server'
import type { QrTargetType } from './types'

export async function validateTargetExists(targetType: QrTargetType, targetId: string): Promise<boolean> {
  const supabase = await createClient()

  const tableMap: Record<QrTargetType, 'businesses' | 'locations' | 'catalog_items' | 'collections'> = {
    business: 'businesses',
    location: 'locations',
    catalog_item: 'catalog_items',
    collection: 'collections',
  }

  const { data, error } = await supabase
    .from(tableMap[targetType])
    .select('id')
    .eq('id', targetId)
    .maybeSingle()

  if (error) throw error
  return data !== null
}

/**
 * Resolves the business_id that owns a given target — needed because
 * qr_codes.business_id must be set on every row for authorization checks,
 * regardless of what the target itself is.
 */
export async function resolveBusinessIdForTarget(targetType: QrTargetType, targetId: string): Promise<string> {
  const supabase = await createClient()

  if (targetType === 'business') return targetId

  const columnMap: Record<Exclude<QrTargetType, 'business'>, 'locations' | 'catalog_items' | 'collections'> = {
    location: 'locations',
    catalog_item: 'catalog_items',
    collection: 'collections',
  }

  const table = columnMap[targetType as Exclude<QrTargetType, 'business'>]
  const { data, error } = await supabase
    .from(table)
    .select('business_id')
    .eq('id', targetId)
    .single()

  if (error) throw error
  return data.business_id
}
