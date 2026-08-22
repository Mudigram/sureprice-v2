import { createClient } from '@/lib/supabase/server'
import { assertEntityStatus } from '@/lib/types/status'
import type { Business } from './types'

function toBusiness(row: Business): Business {
  assertEntityStatus(row.status, 'businesses.status')
  return row
}

export async function getBusinessesForOrg(organizationId: string): Promise<Business[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []).map(toBusiness)
}

export async function getBusinessById(businessId: string): Promise<Business | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', businessId)
    .maybeSingle()

  if (error) throw error
  if (data) toBusiness(data)
  return data
}

export async function getBusinessSlugById(businessId: string): Promise<string | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('businesses')
    .select('slug')
    .eq('id', businessId)
    .maybeSingle()

  if (error) throw error
  return data?.slug ?? null
}