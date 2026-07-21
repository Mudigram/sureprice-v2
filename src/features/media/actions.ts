'use server'

import { createClient } from '@/lib/supabase/server'
import type { MediaTargetType } from './types'

export async function insertMediaRecord(params: {
  businessId: string
  targetType: MediaTargetType
  targetId: string
  storagePath: string
  fileType: string
  altText?: string | null
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('media')
    .insert({
      business_id: params.businessId,
      target_type: params.targetType,
      target_id: params.targetId,
      storage_path: params.storagePath,
      file_type: params.fileType,
      alt_text: params.altText ?? null,
      created_by: user.id,
    })
    .select('*')
    .single()

  if (error) throw error
  return data
}

export async function deleteMediaRecord(mediaId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('media').delete().eq('id', mediaId)
  if (error) throw error
}