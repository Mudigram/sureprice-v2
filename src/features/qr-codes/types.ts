import type { Tables } from '@/types/database'

export type QrCode = Tables<'qr_codes'>
export type ScanEvent = Tables<'scan_events'>

// Only types with real backing entities are selectable in this phase.
// 'table' and 'promotion' are valid at DB level but intentionally
// excluded here until backing entities exist.
export type QrTargetType = 'business' | 'location' | 'catalog_item' | 'collection'

export const QR_TARGET_TYPES: QrTargetType[] = ['business', 'location', 'catalog_item', 'collection']

export const QR_CODE_PREFIXES: Record<QrTargetType, string> = {
  business: 'biz_',
  location: 'loc_',
  catalog_item: 'ci_',
  collection: 'col_',
}
