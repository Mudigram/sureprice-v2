import { createClient } from '@/lib/supabase/server'
import { assertEntityStatus } from '@/lib/types/status'
import type { QrCode, QrTargetType } from './types'

const VALID_QR_TARGET_TYPES = ['business', 'location', 'table', 'catalog_item', 'collection', 'promotion'] as const

function toQrCode(row: QrCode): QrCode {
  assertEntityStatus(row.status, 'qr_codes.status')
  if (!VALID_QR_TARGET_TYPES.includes(row.target_type as typeof VALID_QR_TARGET_TYPES[number])) {
    throw new Error(`Unexpected qr_codes.target_type value: "${row.target_type}"`)
  }
  return row
}

export async function getQrCodesForBusiness(
  businessId: string,
  includeArchived = false
): Promise<QrCode[]> {
  const supabase = await createClient()

  let query = supabase
    .from('qr_codes')
    .select('*')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false })

  if (!includeArchived) query = query.eq('status', 'active')

  const { data, error } = await query
  if (error) throw error
  return (data ?? []).map(toQrCode)
}

export async function getActiveQrCodeForTarget(
  targetType: QrTargetType,
  targetId: string
): Promise<QrCode | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('qr_codes')
    .select('*')
    .eq('target_type', targetType)
    .eq('target_id', targetId)
    .eq('status', 'active')
    .maybeSingle()

  if (error) throw error
  if (data) toQrCode(data)
  return data
}

/**
 * Used by Phase 8's scan resolution route (/q/[code])
 */
export async function getQrCodeByCode(code: string): Promise<QrCode | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('qr_codes')
    .select('*')
    .eq('code', code)
    .eq('status', 'active')
    .maybeSingle()

  if (error) throw error
  if (data) toQrCode(data)
  return data
}
