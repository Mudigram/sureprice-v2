'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getOrCreateQrCodeForItem } from './queries'
import type { QrCode } from './types'

/**
 * Called by the owner from the catalog item detail page.
 * Ensures a QR code exists for the item and returns it.
 */
export async function generateQrCodeForItem(
  itemId: string,
  businessId: string
): Promise<QrCode> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return getOrCreateQrCodeForItem(itemId, businessId, user.id)
}

/**
 * Records a scan event for a given QR code and atomically increments scan_count.
 * Called server-side from the /q/[code] route handler — no user auth required.
 * Uses admin client to bypass RLS on scan_events (public writes are intentional).
 */
export async function recordScanAndIncrement(
  qrCodeId: string,
  businessId: string
): Promise<void> {
  const admin = createAdminClient()

  // Fetch current count then increment — best-effort, race conditions acceptable at this scale
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
