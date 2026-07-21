import type { Tables } from '@/types/database'

export type Media = Tables<'media'>
export type MediaTargetType = 'catalog_item' | 'business' | 'storefront' | 'collection'
export const MEDIA_TARGET_TYPES: MediaTargetType[] = ['catalog_item', 'business', 'storefront', 'collection']