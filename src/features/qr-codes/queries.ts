import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { nanoid } from 'nanoid'
import type { QrCode } from './types'

/**
 * Returns the existing QR code for a catalog item, or creates one.
 * Uses service-role admin client since this runs in a server action called by an
 * authenticated owner — the qr_codes table is owner-managed.
 */
export async function getOrCreateQrCodeForItem(
  itemId: string,
  businessId: string,
  userId: string
): Promise<QrCode> {
  const admin = createAdminClient()

  // Check for an existing active QR code for this item
  const { data: existing, error: fetchError } = await admin
    .from('qr_codes')
    .select('*')
    .eq('target_id', itemId)
    .eq('target_type', 'catalog_item')
    .eq('business_id', businessId)
    .eq('status', 'active')
    .maybeSingle()

  if (fetchError) throw fetchError
  if (existing) return existing

  // Create a new one with a short nanoid code
  const code = nanoid(10)
  const { data: created, error: insertError } = await admin
    .from('qr_codes')
    .insert({
      business_id: businessId,
      target_id: itemId,
      target_type: 'catalog_item',
      code,
      label: null,
      status: 'active',
      scan_count: 0,
      created_by: userId,
    })
    .select()
    .single()

  if (insertError) throw insertError
  return created
}

/**
 * Looks up a QR code by its short code string. Used in the redirect route.
 */
export async function getQrCodeByCode(code: string): Promise<QrCode | null> {
  // Public lookup — uses server (anon) client, RLS must allow public SELECT on qr_codes
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('qr_codes')
    .select('*')
    .eq('code', code)
    .maybeSingle()

  if (error) throw error
  return data
}
