'use server'

import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Called from the anonymous scan resolution route — there is no logged-in
 * user here, so this uses the admin (service-role) client rather than the
 * per-request server client. This is a narrow, server-only, non-user-attributed write.
 * Invokes the atomic record_scan_and_increment Postgres RPC.
 */
export async function recordScanAndIncrement(
  qrCodeId: string,
  businessId: string
): Promise<void> {
  const supabase = createAdminClient()

  const { error } = await (supabase as unknown as {
    rpc: (fn: string, args: Record<string, unknown>) => Promise<{ error: unknown }>
  }).rpc('record_scan_and_increment', {
    p_qr_code_id: qrCodeId,
    p_business_id: businessId,
  })

  if (error) {
    // Fallback: if RPC fails or hasn't been created yet, perform explicit table write
    const { data: qr } = await supabase
      .from('qr_codes')
      .select('scan_count')
      .eq('id', qrCodeId)
      .single()

    await Promise.allSettled([
      supabase.from('scan_events').insert({ qr_code_id: qrCodeId, business_id: businessId }),
      qr !== null
        ? supabase
            .from('qr_codes')
            .update({ scan_count: (qr.scan_count ?? 0) + 1 })
            .eq('id', qrCodeId)
        : Promise.resolve(),
    ])
  }
}
