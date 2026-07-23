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
  return {
    title: `${business.name} — SurePrice`,
    description: `Browse products and prices at ${business.name}.`,
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

  return <StoreDetailClient business={business} items={items} businessSlug={businessSlug} />
}
