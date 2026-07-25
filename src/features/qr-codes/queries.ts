import { createClient } from '@/lib/supabase/server'
import type { QrCode, QrTargetType } from './types'

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
  return data ?? []
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
  return data
}

/**
 * Used by Phase 8's scan resolution route (/q/[code] or /scan/[code])
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
  return data
}
