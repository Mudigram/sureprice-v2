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

/**
 * Fetches the business by ID using authenticated client, joined with storefront config.
 * Used across admin console routes to guarantee access to newly created/unpublished businesses.
 */
export async function getBusinessByIdForAdmin(
  businessId: string
): Promise<import('@/features/storefront/types').StorefrontBusiness | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('businesses')
    .select('*, storefront:storefronts(*)')
    .eq('id', businessId)
    .maybeSingle()

  if (error) throw error
  if (!data) return null

  const raw = data as typeof data & { storefront: unknown }
  const storefront = Array.isArray(raw.storefront)
    ? (raw.storefront[0] ?? null)
    : (raw.storefront ?? null)

  return { ...data, storefront } as import('@/features/storefront/types').StorefrontBusiness
}