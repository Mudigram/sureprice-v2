import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getStorefrontBusiness, getStorefrontItems } from '@/features/storefront/queries'
import { StoreDetailClient } from './store-detail-client'

export const revalidate = 60

interface Props {
  params: Promise<{ businessSlug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { businessSlug } = await params
  const business = await getStorefrontBusiness(businessSlug)
  if (!business) return {}

  const typeLabel = business.business_type === 'restaurant'
    ? 'Digital Menu'
    : business.business_type === 'cafe'
    ? 'Café & Menu'
    : business.business_type === 'popup_vendor'
    ? 'Pop-Up Stall'
    : 'Store & Live Prices'

  const title = `${business.name} · ${typeLabel}`
  const description = `Browse verified products, menu items, and real-time prices in Naira at ${business.name} on SurePrice.`

  const coverUrl = (() => {
    const st = business.storefront as Record<string, unknown> | null
    if (!st) return undefined
    const candidates = [
      st.cover_url,
      (st.theme as Record<string, unknown> | null)?.cover_url,
      (st.theme as Record<string, unknown> | null)?.coverUrl,
    ]
    const raw = candidates.find((c) => typeof c === 'string') as string | undefined
    if (!raw) return undefined
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
    if (raw.startsWith('http')) return raw
    return `${supabaseUrl}/storage/v1/object/public/catalog-media/${raw}`
  })()

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'SurePrice',
      ...(coverUrl ? { images: [{ url: coverUrl, width: 1200, height: 630, alt: `${business.name} — Verified Menu` }] } : {}),
    },
    twitter: {
      card: coverUrl ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(coverUrl ? { images: [coverUrl] } : {}),
    },
  }
}

export default async function StorefrontPage({ params }: Props) {
  const { businessSlug } = await params
  const business = await getStorefrontBusiness(businessSlug)
  if (!business) notFound()

  if (!business.storefront || !business.storefront.is_published) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
        <span className="text-5xl">🔒</span>
        <h1 className="mt-6 text-2xl font-bold text-foreground">{business.name}</h1>
        <p className="mt-3 max-w-xs text-muted-foreground">
          This store isn&apos;t available yet. Check back soon.
        </p>
      </div>
    )
  }

  const items = await getStorefrontItems(business.id)

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://sureprice.app'
  const storeUrl = `${siteUrl}/s/${businessSlug}`

  const schemaType =
    business.business_type === 'restaurant'
      ? 'Restaurant'
      : business.business_type === 'cafe'
      ? 'CafeOrCoffeeShop'
      : 'Store'

  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name: business.name,
    url: storeUrl,
    description: `Verified prices and catalog for ${business.name}.`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.locations?.[0]?.address_text || undefined,
      addressCountry: 'NG',
    },
    telephone: business.locations?.[0]?.phone || undefined,
    currenciesAccepted: 'NGN',
    hasMenu: business.business_type === 'restaurant' || business.business_type === 'cafe' ? storeUrl : undefined,
    itemListElement: items.slice(0, 15).map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'Product',
        name: item.name,
        offers: {
          '@type': 'Offer',
          priceCurrency: 'NGN',
          price: item.base_price ?? undefined,
        },
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <StoreDetailClient business={business} items={items} businessSlug={businessSlug} />
    </>
  )
}
