import type { Tables, Database } from '@/types/database'

export type Business = Tables<'businesses'>
export type BusinessType = Database['public']['Enums']['business_type']

export const BUSINESS_TYPES = [
  'retail',
  'restaurant',
  'cafe',
  'popup_vendor',
  'event_vendor',
] as const satisfies readonly BusinessType[]