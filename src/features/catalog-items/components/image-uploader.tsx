'use client'

import { useState, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import { attachCatalogItemImage, removeCatalogItemImage } from '../media-actions'
import { CATALOG_MEDIA_BUCKET, getCatalogMediaPublicUrl } from '@/lib/supabase/storage'
import type { Media } from '@/features/media/types'

export function ImageUploader({
  businessId,
  itemId,
  images,
}: {
  businessId: string
  itemId: string
  images: Media[]
}) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const canUploadMore = images.length < 2

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setIsUploading(true)

    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop()
      const storagePath = `${businessId}/${itemId}/${crypto.randomUUID()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from(CATALOG_MEDIA_BUCKET)
        .upload(storagePath, file, { contentType: file.type })

      if (uploadError) throw uploadError

      await attachCatalogItemImage({ businessId, itemId, storagePath, fileType: file.type })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setIsUploading(false)
      e.target.value = ''
    }
  }

  const handleDelete = (media: Media) => {
    startTransition(() => {
      removeCatalogItemImage({ businessId, itemId, mediaId: media.id, storagePath: media.storage_path })
    })
  }

  return (
    <div>
      <label className="block text-sm font-medium text-foreground">Images ({images.length}/2)</label>

      <div className="mt-2 flex gap-3">
        {images.map((media) => (
          <div key={media.id} className="relative">
            <img
              src={getCatalogMediaPublicUrl(media.storage_path)}
              alt={media.alt_text ?? ''}
              className="h-24 w-24 rounded-lg border border-border object-cover"
            />
            <button
              type="button"
              onClick={() => handleDelete(media)}
              disabled={isPending}
              className="absolute -right-2 -top-2 rounded-full bg-destructive px-1.5 text-xs text-white"
            >
              ✕
            </button>
          </div>
        ))}

        {canUploadMore && (
          <label className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-lg border border-dashed border-input text-sm text-muted-foreground hover:border-ring">
            {isUploading ? '…' : '+ Add'}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              disabled={isUploading}
              className="hidden"
            />
          </label>
        )}
      </div>

      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
  )
}