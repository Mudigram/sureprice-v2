import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getStorefrontBusiness, getStorefrontItem } from '@/features/storefront/queries'
import type { AttributeEntry } from '@/features/storefront/types'

export const revalidate = 60

interface Props {
  params: Promise<{ businessSlug: string; itemId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { businessSlug, itemId } = await params
  const business = await getStorefrontBusiness(businessSlug)
  if (!business) return {}
  const item = await getStorefrontItem(business.id, itemId)
  if (!item) return {}
  return {
    title: `${item.name} — ${business.name}`,
    description: item.description ?? `View price and details for ${item.name} at ${business.name}.`,
    openGraph: {
      title: `${item.name} — ${business.name}`,
      images: item.image_url ? [{ url: item.image_url }] : [],
    },
  }
}

export default async function StorefrontItemPage({ params }: Props) {
  const { businessSlug, itemId } = await params

  const business = await getStorefrontBusiness(businessSlug)
  if (!business) notFound()

  // Gate: unpublished storefront still allows individual item pages to load
  // (so QR scans work even if landing page is gated) — intentional design choice.

  const item = await getStorefrontItem(business.id, itemId)
  if (!item) notFound()

  // Parse attributes (stored as JSON object {key: value})
  const attributeEntries: AttributeEntry[] = (() => {
    if (!item.attributes || typeof item.attributes !== 'object' || Array.isArray(item.attributes)) return []
    return Object.entries(item.attributes as Record<string, string>).map(([key, value]) => ({ key, value }))
  })()

  const images = item.images
  const primaryImage = images[0]

  return (
    <div className="min-h-screen bg-background">
      {/* Back nav */}
      <div className="border-b border-border bg-card px-5 py-3">
        <div className="mx-auto max-w-lg">
          <Link
            href={`/s/${businessSlug}`}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <span aria-hidden>←</span>
            <span>{business.name}</span>
          </Link>
        </div>
      </div>

      <main className="mx-auto max-w-lg px-5 pb-16 pt-6">
        {/* Image gallery */}
        {images.length > 0 ? (
          <div className="mb-6">
            {/* Primary image */}
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-muted">
              <Image
                src={primaryImage.storage_path.startsWith('http')
                  ? primaryImage.storage_path
                  : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/catalog-media/${primaryImage.storage_path}`}
                alt={primaryImage.alt_text ?? item.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 512px) 100vw, 512px"
              />
            </div>
            {/* Thumbnail strip for additional images */}
            {images.length > 1 && (
              <div className="mt-3 flex gap-2">
                {images.map((img, i) => {
                  const src = img.storage_path.startsWith('http')
                    ? img.storage_path
                    : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/catalog-media/${img.storage_path}`
                  return (
                    <div
                      key={img.id}
                      className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-border bg-muted"
                    >
                      <Image
                        src={src}
                        alt={img.alt_text ?? `${item.name} image ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="mb-6 flex aspect-square w-full items-center justify-center rounded-2xl bg-muted text-5xl">
            📦
          </div>
        )}

        {/* Category badge */}
        {item.category && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--lime-base)]">
            {item.category.name}
          </p>
        )}

        {/* Name + price */}
        <h1 className="text-2xl font-bold leading-tight tracking-tight text-foreground">
          {item.name}
        </h1>

        <div className="mt-3">
          {item.base_price !== null ? (
            <p className="text-3xl font-extrabold text-[var(--lime-dark)]">
              ₦{item.base_price.toLocaleString()}
            </p>
          ) : (
            <p className="text-lg text-muted-foreground">Price on request</p>
          )}
        </div>

        {/* Description */}
        {item.description && (
          <p className="mt-5 leading-relaxed text-muted-foreground">{item.description}</p>
        )}

        {/* Attributes */}
        {attributeEntries.length > 0 && (
          <div className="mt-6">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Details
            </h2>
            <dl className="divide-y divide-border rounded-xl border border-border">
              {attributeEntries.map(({ key, value }) => (
                <div key={key} className="flex items-baseline justify-between px-4 py-3">
                  <dt className="text-sm font-medium text-muted-foreground">{key}</dt>
                  <dd className="text-sm font-medium text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {/* Store info */}
        <div className="mt-8 rounded-xl border border-border bg-card p-4">
          <h2 className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Sold by
          </h2>
          <p className="font-semibold text-foreground">{business.name}</p>
          <p className="mt-0.5 text-sm capitalize text-muted-foreground">
            {business.business_type.replace(/_/g, ' ')}
          </p>
        </div>
      </main>

      <footer className="border-t border-border py-5 text-center">
        <p className="text-xs text-muted-foreground">
          Powered by <span className="font-semibold text-foreground">SurePrice</span>
        </p>
      </footer>
    </div>
  )
}
