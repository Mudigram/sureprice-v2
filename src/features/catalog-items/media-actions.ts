'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { requireBusinessManage } from '@/lib/auth/require-access'
import { getMediaForTarget } from '@/features/media/queries'
import { insertMediaRecord, deleteMediaRecord } from '@/features/media/actions'
import { getCatalogMediaPublicUrl } from '@/lib/supabase/storage'

const MAX_IMAGES_PER_ITEM = 2

export async function attachCatalogItemImage(params: {
  businessId: string
  itemId: string
  storagePath: string
  fileType: string
}) {
  await requireBusinessManage(params.businessId)

  const existing = await getMediaForTarget('catalog_item', params.itemId)
  if (existing.length >= MAX_IMAGES_PER_ITEM) {
    throw new Error(`Catalog items can have at most ${MAX_IMAGES_PER_ITEM} images`)
  }

  await insertMediaRecord({
    businessId: params.businessId,
    targetType: 'catalog_item',
    targetId: params.itemId,
    storagePath: params.storagePath,
    fileType: params.fileType,
  })

  // First image for this item becomes the denormalized primary
  if (existing.length === 0) {
    const supabase = await createClient()
    const { error } = await supabase
      .from('catalog_items')
      .update({ image_url: getCatalogMediaPublicUrl(params.storagePath) })
      .eq('id', params.itemId)
    if (error) throw error
  }

  revalidatePath(`/businesses/${params.businessId}/catalog-items/${params.itemId}`)
}

export async function removeCatalogItemImage(params: {
  businessId: string
  itemId: string
  mediaId: string
  storagePath: string
}) {
  await requireBusinessManage(params.businessId)

  const supabase = await createClient()

  const { error: storageError } = await supabase.storage.from('catalog-media').remove([params.storagePath])
  if (storageError) throw storageError

  await deleteMediaRecord(params.mediaId)

  // Recompute the primary image after deletion — promote whichever image
  // is left, or clear it if none remain
  const remaining = await getMediaForTarget('catalog_item', params.itemId)
  const newPrimaryUrl = remaining.length > 0 ? getCatalogMediaPublicUrl(remaining[0].storage_path) : null

  const { error } = await supabase.from('catalog_items').update({ image_url: newPrimaryUrl }).eq('id', params.itemId)
  if (error) throw error

  revalidatePath(`/businesses/${params.businessId}/catalog-items/${params.itemId}`)
}