import Link from 'next/link'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { requireBusinessView } from '@/lib/auth/require-access'
import { getCatalogItemById } from '@/features/catalog-items/queries'
import { getMediaForTarget } from '@/features/media/queries'
import { ImageUploader } from '@/features/catalog-items/components/image-uploader'
import { QrPanel } from '@/features/qr-codes/components/qr-panel'
import { getOrCreateQrCodeForItem } from '@/features/qr-codes/queries'
import { createClient } from '@/lib/supabase/server'

export default async function CatalogItemDetailPage({
  params,
}: {
  params: Promise<{ businessId: string; itemId: string }>
}) {
  const { businessId, itemId } = await params
  await requireBusinessView(businessId)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return notFound()

  const item = await getCatalogItemById(itemId)
  if (!item || item.business_id !== businessId) notFound()

  const [images, qrCode] = await Promise.all([
    getMediaForTarget('catalog_item', itemId),
    // Pre-load existing QR code if it already exists (null = not yet generated)
    getOrCreateQrCodeForItem(itemId, businessId, user.id).catch(() => null),
  ])

  const attributes =
    item.attributes && typeof item.attributes === 'object' && !Array.isArray(item.attributes)
      ? (item.attributes as Record<string, string>)
      : {}

  // Derive base URL for QR panel
  const headersList = await headers()
  const host = headersList.get('host') ?? 'localhost:3000'
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
  const baseUrl = `${protocol}://${host}`

  return (
    <div className="mx-auto max-w-lg p-8">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{item.name}</h1>
          {item.base_price !== null && <p className="text-muted-foreground">₦{item.base_price.toLocaleString()}</p>}
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

      {/* QR Code panel */}
      <QrPanel
        itemId={itemId}
        businessId={businessId}
        initialQrCode={qrCode}
        baseUrl={baseUrl}
      />
    </div>
  )
}