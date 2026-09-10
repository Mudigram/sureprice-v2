'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireBusinessManage } from '@/lib/auth/require-access'
import {
  updateStorefrontStudioSchema,
  type UpdateStorefrontStudioInput,
} from './schema'

export async function updateStorefrontStudio(
  businessId: string,
  rawInput: UpdateStorefrontStudioInput
) {
  await requireBusinessManage(businessId)

  const parsed = updateStorefrontStudioSchema.parse(rawInput)

  const supabase = await createClient()

  // Fetch parent business for slug revalidation
  const { data: business, error: bizError } = await supabase
    .from('businesses')
    .select('slug')
    .eq('id', businessId)
    .single()

  if (bizError || !business) {
    throw new Error('Business not found')
  }

  // Fetch existing storefront if any
  const { data: existingStorefront } = await supabase
    .from('storefronts')
    .select('*')
    .eq('business_id', businessId)
    .maybeSingle()

  const currentTheme = (existingStorefront?.theme && typeof existingStorefront.theme === 'object' && !Array.isArray(existingStorefront.theme))
    ? (existingStorefront.theme as Record<string, any>)
    : {}

  const updatedTheme: Record<string, any> = {
    ...currentTheme,
    logo_url: parsed.logo_url ?? null,
    cover_url: parsed.cover_url ?? null,
    tagline: parsed.tagline ?? null,
    description: parsed.description ?? null,
    primary_color: parsed.primary_color ?? null,
    highlights: parsed.highlights ?? [],
    stall_number: parsed.stall_number ?? null,
    location_zone: parsed.location_zone ?? null,
    directions_landmark: parsed.directions_landmark ?? null,
    bank_details: {
      enabled: parsed.bank_enabled ?? false,
      bank_name: parsed.bank_name ?? null,
      account_number: parsed.account_number ?? null,
      account_name: parsed.account_name ?? null,
    },
    socials: {
      instagram: parsed.social_instagram ?? null,
      tiktok: parsed.social_tiktok ?? null,
      twitter: parsed.social_twitter ?? null,
      facebook: parsed.social_facebook ?? null,
      website: parsed.social_website ?? null,
    },
    payments: parsed.payments ?? ['Cash', 'Bank Transfer', 'POS Card'],
    status_override: {
      mode: parsed.status_mode,
      notice: parsed.status_notice ?? null,
    },
    operating_hours: parsed.operating_hours ?? null,
    event: parsed.event ? {
      mode: parsed.event.mode,
      startDate: parsed.event.startDate ?? null,
      endDate: parsed.event.endDate ?? null,
      liveNotice: parsed.event.liveNotice ?? null,
      endedNotice: parsed.event.endedNotice ?? null,
    } : (currentTheme.event ?? null),
    announcement: {
      enabled: parsed.announcement_enabled,
      text: parsed.announcement_text ?? '',
    },
    ordering: {
      whatsapp_phone: parsed.whatsapp_phone ?? null,
    },
  }

  if (existingStorefront) {
    const { error } = await supabase
      .from('storefronts')
      .update({
        is_published: parsed.is_published,
        theme: updatedTheme,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingStorefront.id)

    if (error) throw error
  } else {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { error } = await supabase
      .from('storefronts')
      .insert({
        business_id: businessId,
        created_by: user.id,
        template: 'default',
        is_published: parsed.is_published,
        theme: updatedTheme,
      })

    if (error) throw error
  }

  // Record cover in media table if provided
  if (parsed.cover_url) {
    try {
      const { data: user } = await supabase.auth.getUser()
      if (user.user) {
        const { data: existingCoverMedia } = await supabase
          .from('media')
          .select('id')
          .eq('business_id', businessId)
          .eq('target_type', 'business')
          .eq('target_id', businessId)
          .maybeSingle()

        if (!existingCoverMedia) {
          await supabase.from('media').insert({
            business_id: businessId,
            target_type: 'business',
            target_id: businessId,
            storage_path: parsed.cover_url,
            file_type: 'image/jpeg',
            alt_text: 'Storefront Header Banner',
            created_by: user.user.id,
          })
        }
      }
    } catch (mediaErr) {
      console.warn('Optional media table record insert skipped:', mediaErr)
    }
  }

  revalidatePath(`/businesses/${businessId}`)
  revalidatePath(`/businesses/${businessId}/storefront`)
  revalidatePath(`/businesses/${businessId}/edit`)
  revalidatePath(`/s/${business.slug}`)

  return { success: true }
}

// Legacy alias
export const updateStorefrontBranding = updateStorefrontStudio
