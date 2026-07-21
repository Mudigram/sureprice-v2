import type { Tables } from '@/types/database'

export type QrCode = Tables<'qr_codes'>
export type ScanEvent = Tables<'scan_events'>

export const QR_TARGET_TYPES = ['catalog_item', 'business', 'storefront'] as const
export type QrTargetType = (typeof QR_TARGET_TYPES)[number]
