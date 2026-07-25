'use server'

import { nanoid } from 'nanoid'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireBusinessManage } from '@/lib/auth/require-access'
import { validateTargetExists, resolveBusinessIdForTarget } from './validate-target'
import { QR_CODE_PREFIXES, type QrTargetType, type QrCode } from './types'

function generateCode(targetType: QrTargetType): string {
  return `${QR_CODE_PREFIXES[targetType]}${nanoid(10)}`
}

/**
 * Returns the existing active QR code for a target if one exists, otherwise
 * creates one. Primary entry point for single and batch generation.
 */
export async function getOrCreateActiveQrCode(
  targetType: QrTargetType,
  targetId: string
): Promise<QrCode> {
  const businessId = await resolveBusinessIdForTarget(targetType, targetId)
  await requireBusinessManage(businessId)

  const supabase = await createClient()

  const { data: existing, error: findError } = await supabase
    .from('qr_codes')
    .select('*')
    .eq('target_type', targetType)
    .eq('target_id', targetId)
    .eq('status', 'active')
    .maybeSingle()

  if (findError) throw findError
  if (existing) return existing

  const targetExists = await validateTargetExists(targetType, targetId)
  if (!targetExists) {
    throw new Error(`Cannot generate QR code: ${targetType} with id ${targetId} does not exist`)
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('qr_codes')
    .insert({
      business_id: businessId,
      target_type: targetType,
      target_id: targetId,
      code: generateCode(targetType),
      created_by: user.id,
      status: 'active',
    })
    .select('*')
    .single()

  if (error) throw error

  revalidatePath(`/businesses/${businessId}/qr-codes`)
  return data
}

/**
 * Archives current active code and creates a new replacement code.
 * Old code stops resolving scans; historical scan events & scan_count are preserved.
 */
export async function regenerateQrCode(qrCodeId: string): Promise<QrCode> {
  const supabase = await createClient()

  const { data: current, error: fetchError } = await supabase
    .from('qr_codes')
    .select('*')
    .eq('id', qrCodeId)
    .single()

  if (fetchError) throw fetchError

  await requireBusinessManage(current.business_id)

  const { error: archiveError } = await supabase
    .from('qr_codes')
    .update({ status: 'archived' })
    .eq('id', qrCodeId)

  if (archiveError) throw archiveError

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: fresh, error: insertError } = await supabase
    .from('qr_codes')
    .insert({
      business_id: current.business_id,
      target_type: current.target_type,
      target_id: current.target_id,
      code: generateCode(current.target_type as QrTargetType),
      created_by: user.id,
      status: 'active',
    })
    .select('*')
    .single()

  if (insertError) throw insertError

  revalidatePath(`/businesses/${current.business_id}/qr-codes`)
  return fresh
}

/**
 * Permanently disables a code with no replacement.
 */
export async function revokeQrCode(qrCodeId: string): Promise<void> {
  const supabase = await createClient()

  const { data: current, error: fetchError } = await supabase
    .from('qr_codes')
    .select('business_id')
    .eq('id', qrCodeId)
    .single()

  if (fetchError) throw fetchError

  await requireBusinessManage(current.business_id)

  const { error } = await supabase
    .from('qr_codes')
    .update({ status: 'archived' })
    .eq('id', qrCodeId)

  if (error) throw error

  revalidatePath(`/businesses/${current.business_id}/qr-codes`)
}

/**
 * Records a scan event for a given QR code and atomically increments scan_count.
 * Called server-side from the /q/[code] route handler.
 */
export async function recordScanAndIncrement(
  qrCodeId: string,
  businessId: string
): Promise<void> {
  const admin = createAdminClient()

  const { data: qr } = await admin
    .from('qr_codes')
    .select('scan_count')
    .eq('id', qrCodeId)
    .single()

  await Promise.allSettled([
    admin.from('scan_events').insert({ qr_code_id: qrCodeId, business_id: businessId }),
    qr !== null
      ? admin
          .from('qr_codes')
          .update({ scan_count: (qr.scan_count ?? 0) + 1 })
          .eq('id', qrCodeId)
      : Promise.resolve(),
  ])
}
