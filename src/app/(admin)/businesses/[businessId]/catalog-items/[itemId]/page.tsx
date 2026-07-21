import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireBusinessView } from '@/lib/auth/require-access'
import { getCatalogItemById } from '@/features/catalog-items/queries'
import { getMediaForTarget } from '@/features/media/queries'
import { ImageUploader } from '@/features/catalog-items/components/image-uploader'

export default async function CatalogItemDetailPage({
  params,
}: {
  params: Promise<{ businessId: string; itemId: string }>
}) {
  const { businessId, itemId } = await params
  await requireBusinessView(businessId)

  const item = await getCatalogItemById(itemId)
  if (!item || item.business_id !== businessId) notFound()

  const images = await getMediaForTarget('catalog_item', itemId)
  const attributes =
    item.attributes && typeof item.attributes === 'object' && !Array.isArray(item.attributes)
      ? (item.attributes as Record<string, string>)
      : {}

  return (
    <div className="mx-auto max-w-lg p-8">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{item.name}</h1>
          {item.base_price !== null && <p className="text-muted-foreground">₦{item.base_price}</p>}
        </div>
        <Link
          href={`/businesses/${businessId}/catalog-items/${itemId}/edit`}
          className="text-sm text-muted-foreground underline hover:text-foreground"
        >
          Edit
        </Link>
      </div>

      <ImageUploader businessId={businessId} itemId={itemId} images={images} />

      {item.description && <p className="mt-6 text-foreground">{item.description}</p>}

      {Object.keys(attributes).length > 0 && (
        <div className="mt-6">
          <h2 className="mb-2 text-sm font-medium text-foreground">Attributes</h2>
          <dl className="space-y-1 text-sm">
            {Object.entries(attributes).map(([key, value]) => (
              <div key={key} className="flex gap-2">
                <dt className="font-medium text-muted-foreground">{key}:</dt>
                <dd className="text-foreground">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  )
}