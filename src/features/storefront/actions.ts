'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireBusinessManage } from '@/lib/auth/require-access'
import { updateStorefrontBrandingSchema, type UpdateStorefrontBrandingInput } from './schema'

export async function updateStorefrontBranding(
  businessId: string,
  rawInput: UpdateStorefrontBrandingInput
) {
  await requireBusinessManage(businessId)

  const parsed = updateStorefrontBrandingSchema.parse(rawInput)

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

  const currentTheme = (existingStorefront?.theme && typeof existingStorefront.theme === 'object')
    ? existingStorefront.theme as Record<string, unknown>
    : {}

  const updatedTheme = {
    ...currentTheme,
    logo_url: parsed.logo_url ?? null,
    tagline: parsed.tagline ?? null,
    primary_color: parsed.primary_color ?? null,
    highlights: parsed.highlights ?? [],
    cover_url: parsed.cover_url ?? null,
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

  // If cover_url provided, record in media table for target_type = 'business'
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
  revalidatePath(`/businesses/${businessId}/edit`)
  revalidatePath(`/s/${business.slug}`)

  return { success: true }
}
