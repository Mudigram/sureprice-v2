import type { Tables } from '@/types/database'

export type LocationHours = {
  id: string
  location_id: string
  day_of_week: number
  open_time: string | null
  close_time: string | null
  is_closed: boolean
}

export type DayHours = {
  open: string
  close: string
  closed: boolean
}

export type WeeklyOperatingHours = {
  sunday: DayHours
  monday: DayHours
  tuesday: DayHours
  wednesday: DayHours
  thursday: DayHours
  friday: DayHours
  saturday: DayHours
}

export type StatusOverride = {
  mode: 'auto' | 'force_open' | 'force_closed'
  notice?: string | null
}

export type StorefrontLocation = Tables<'locations'> & {
  location_hours?: LocationHours[]
  address_text?: string | null
  phone?: string | null
}

export type StorefrontThemeConfig = {
  logo_url?: string | null
  cover_url?: string | null
  tagline?: string | null
  primary_color?: string | null
  highlights?: string[]
  announcement?: {
    enabled?: boolean
    text?: string
  } | string | null
  status_override?: StatusOverride | null
  operating_hours?: WeeklyOperatingHours | null
  ordering?: {
    whatsapp_phone?: string | null
  } | null
}

export type StorefrontBusiness = Tables<'businesses'> & {
  storefront: (Tables<'storefronts'> & {
    logo_url?: string | null
    theme?: StorefrontThemeConfig | Record<string, unknown> | null
  }) | null
  locations?: StorefrontLocation[]
  itemCount?: number
}

export type StorefrontCategory = Tables<'categories'>

export type StorefrontItem = Tables<'catalog_items'> & {
  category: StorefrontCategory | null
  sku?: string | null
}

export type StorefrontItemDetail = Tables<'catalog_items'> & {
  category: StorefrontCategory | null
  images: Tables<'media'>[]
  sku?: string | null
}

export type AttributeEntry = { key: string; value: string }

const DAY_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as const

/**
 * Computes whether a store location or business is currently open based on operating hours or status override
 */
export function computeIsOpen(
  hoursOrSchedule?: LocationHours[] | WeeklyOperatingHours | null,
  statusOverride?: StatusOverride | null
): { isOpen: boolean; text: string } {
  // 1. Manual Force Override has top priority
  if (statusOverride?.mode === 'force_open') {
    return {
      isOpen: true,
      text: statusOverride.notice ? `Open · ${statusOverride.notice}` : 'Open Now',
    }
  }

  if (statusOverride?.mode === 'force_closed') {
    return {
      isOpen: false,
      text: statusOverride.notice ? statusOverride.notice : 'Temporarily Closed',
    }
  }

  // 2. If weekly schedule object (from storefront theme)
  if (hoursOrSchedule && typeof hoursOrSchedule === 'object' && !Array.isArray(hoursOrSchedule)) {
    const now = new Date()
    const currentDayKey = DAY_KEYS[now.getDay()]
    const today = (hoursOrSchedule as WeeklyOperatingHours)[currentDayKey]

    if (!today || today.closed) {
      return { isOpen: false, text: 'Closed Today' }
    }

    if (!today.open || !today.close) {
      return { isOpen: true, text: 'Open' }
    }

    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    const isOpen = currentTime >= today.open && currentTime <= today.close
    return { isOpen, text: isOpen ? 'Open Now' : `Closed · Opens at ${today.open}` }
  }

  // 3. If LocationHours array (legacy DB structure)
  if (Array.isArray(hoursOrSchedule) && hoursOrSchedule.length > 0) {
    const now = new Date()
    const currentDay = now.getDay()
    const todayHours = hoursOrSchedule.find((h) => h.day_of_week === currentDay)

    if (!todayHours || todayHours.is_closed) {
      return { isOpen: false, text: 'Closed' }
    }

    if (!todayHours.open_time || !todayHours.close_time) {
      return { isOpen: true, text: 'Open' }
    }

    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    const isOpen = currentTime >= todayHours.open_time && currentTime <= todayHours.close_time
    return { isOpen, text: isOpen ? 'Open' : 'Closed' }
  }

  // Default fallback if no hours configured
  return { isOpen: true, text: 'Open' }
}
