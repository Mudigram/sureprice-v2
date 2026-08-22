import { createClient } from '@/lib/supabase/server'
import type { Media, MediaTargetType } from './types'

const VALID_MEDIA_TARGET_TYPES: MediaTargetType[] = ['catalog_item', 'business', 'storefront', 'collection']

function toMedia(row: Media): Media {
  if (!VALID_MEDIA_TARGET_TYPES.includes(row.target_type as MediaTargetType)) {
    throw new Error(`Unexpected media.target_type value: "${row.target_type}"`)
  }
  return row
}

export async function getMediaForTarget(targetType: MediaTargetType, targetId: string): Promise<Media[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('media')
    .select('*')
    .eq('target_type', targetType)
    .eq('target_id', targetId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return (data ?? []).map(toMedia)
}