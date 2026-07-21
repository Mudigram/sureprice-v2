import type { Tables } from '@/types/database'

export type StorefrontBusiness = Tables<'businesses'> & {
  storefront: Tables<'storefronts'> | null
}

export type StorefrontCategory = Tables<'categories'>

export type StorefrontItem = Tables<'catalog_items'> & {
  category: StorefrontCategory | null
}

export type StorefrontItemDetail = Tables<'catalog_items'> & {
  category: StorefrontCategory | null
  images: Tables<'media'>[]
}

export type AttributeEntry = { key: string; value: string }
