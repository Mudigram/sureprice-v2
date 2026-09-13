'use server'

import { z } from 'zod'
import { createAnonClient } from '@/lib/supabase/server'

export const STOREFRONT_EVENT_TYPES = ['whatsapp_click', 'note_price', 'page_view'] as const
export type StorefrontEventType = (typeof STOREFRONT_EVENT_TYPES)[number]

const trackEventSchema = z.object({
  businessId: z.string().uuid(),
  eventType: z.enum(STOREFRONT_EVENT_TYPES),
  catalogItemId: z.string().uuid().optional().nullable(),
})

export type TrackEventInput = z.infer<typeof trackEventSchema>

export async function trackStorefrontEvent(input: TrackEventInput): Promise<void> {
  const parsed = trackEventSchema.safeParse(input)
  if (!parsed.success) {
    return
  }

  try {
    const supabase = createAnonClient()
    await (supabase as any).from('storefront_events').insert({
      business_id: parsed.data.businessId,
      event_type: parsed.data.eventType,
      catalog_item_id: parsed.data.catalogItemId ?? null,
    })
  } catch {
    // Fail silently so storefront interaction is never disrupted
  }
}
