import { z } from 'zod'

export const HIGHLIGHT_OPTIONS = [
  { id: 'pos', label: 'POS Available', icon: '💳' },
  { id: 'delivery', label: 'Delivery Available', icon: '🛵' },
  { id: 'pickup', label: 'In-Store Pickup', icon: '🛍️' },
  { id: 'wifi', label: 'Free Wi-Fi', icon: '📶' },
  { id: 'ac', label: 'Air Conditioned', icon: '❄️' },
  { id: 'parking', label: 'On-Site Parking', icon: '🅿️' },
  { id: 'halal', label: 'Halal Certified', icon: '🕌' },
  { id: 'outdoor', label: 'Outdoor Seating', icon: '🌿' },
  { id: 'cocktails', label: 'Cocktails & Bar', icon: '🍸' },
] as const

const dayHoursSchema = z.object({
  open: z.string().default('09:00'),
  close: z.string().default('21:00'),
  closed: z.boolean().default(false),
})

export const weeklyOperatingHoursSchema = z.object({
  sunday: dayHoursSchema,
  monday: dayHoursSchema,
  tuesday: dayHoursSchema,
  wednesday: dayHoursSchema,
  thursday: dayHoursSchema,
  friday: dayHoursSchema,
  saturday: dayHoursSchema,
})

export const updateStorefrontStudioSchema = z.object({
  is_published: z.boolean().default(true),
  status_mode: z.enum(['auto', 'force_open', 'force_closed']).default('auto'),
  status_notice: z.string().max(100, 'Notice must be 100 characters or less').nullable().optional(),
  operating_hours: weeklyOperatingHoursSchema.optional(),
  logo_url: z.string().nullable().optional(),
  cover_url: z.string().nullable().optional(),
  tagline: z.string().max(120, 'Tagline must be 120 characters or less').nullable().optional(),
  primary_color: z.string().nullable().optional(),
  announcement_enabled: z.boolean().default(false),
  announcement_text: z.string().max(180, 'Announcement must be 180 characters or less').nullable().optional(),
  whatsapp_phone: z.string().max(20, 'Phone number too long').nullable().optional(),
  highlights: z.array(z.string()).default([]),
})

export type UpdateStorefrontStudioInput = z.input<typeof updateStorefrontStudioSchema>
export type UpdateStorefrontStudioParsed = z.infer<typeof updateStorefrontStudioSchema>

// Legacy schema alias for backward compatibility
export const updateStorefrontBrandingSchema = updateStorefrontStudioSchema
export type UpdateStorefrontBrandingInput = UpdateStorefrontStudioInput
