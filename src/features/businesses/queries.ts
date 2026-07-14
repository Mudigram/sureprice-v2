import { createClient } from '@/lib/supabase/server'
import type { Business } from './types'

export async function getBusinessesForOrg(organizationId: string): Promise<Business[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function getBusinessById(businessId: string): Promise<Business | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', businessId)
    .maybeSingle()

  if (error) throw error
  return data
}