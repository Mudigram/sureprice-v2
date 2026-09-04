import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getStorefrontBusiness, getStorefrontItem } from '@/features/storefront/queries'
import { ItemDetailClient } from './item-detail-client'

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

  const title = `${item.name} · ${business.name}`
  const priceText = item.base_price !== null ? ` (₦${item.base_price.toLocaleString()})` : ''
  const description =
    item.description ??
    `Verified live price${priceText} and details for ${item.name} at ${business.name} on SurePrice.`

  const imageUrl = item.image_url ?? undefined

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'SurePrice',
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 800,
              height: 800,
              alt: item.name,
            },
          ]
        : [],
    },
    twitter: {
      card: imageUrl ? 'summary_large_image' : 'summary',
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  }
}

export default async function StorefrontItemPage({ params }: Props) {
  const { businessSlug, itemId } = await params
  const business = await getStorefrontBusiness(businessSlug)
  if (!business) notFound()

  const item = await getStorefrontItem(business.id, itemId)
  if (!item) notFound()

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://sureprice.app'
  const itemUrl = `${siteUrl}/s/${businessSlug}/${itemId}`
  const storeUrl = `${siteUrl}/s/${businessSlug}`

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: item.name,
    image: item.image_url ? [item.image_url] : undefined,
    description: item.description || `Verified price and details for ${item.name} at ${business.name}.`,
    sku: item.sku || item.id,
    offers: {
      '@type': 'Offer',
      url: itemUrl,
      priceCurrency: 'NGN',
      price: item.base_price !== null ? item.base_price : undefined,
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: business.name,
      },
    },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: business.name,
        item: storeUrl,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: item.name,
        item: itemUrl,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ItemDetailClient
        item={item}
        business={business}
        businessSlug={businessSlug}
      />
    </>
  )
}
