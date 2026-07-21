import { createClient } from '@/lib/supabase/server'
import type { Media, MediaTargetType } from './types'

export async function getMediaForTarget(targetType: MediaTargetType, targetId: string): Promise<Media[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('media')
    .select('*')
    .eq('target_type', targetType)
    .eq('target_id', targetId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data ?? []
}