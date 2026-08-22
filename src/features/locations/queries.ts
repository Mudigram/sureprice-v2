import { createClient } from '@/lib/supabase/server'
import { assertEntityStatus } from '@/lib/types/status'
import type { Location } from './types'

function toLocation(row: Location): Location {
  assertEntityStatus(row.status, 'locations.status')
  return row
}

export async function getLocationsForBusiness(businessId: string): Promise<Location[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []).map(toLocation)
}

export async function getLocationById(locationId: string): Promise<Location | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('id', locationId)
    .maybeSingle()

  if (error) throw error
  if (data) toLocation(data)
  return data
}