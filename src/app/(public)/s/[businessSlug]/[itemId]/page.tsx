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

  const item = await getStorefrontItem(business.id, itemId)
  if (!item) notFound()

  return (
    <ItemDetailClient
      item={item}
      business={business}
      businessSlug={businessSlug}
    />
  )
}
