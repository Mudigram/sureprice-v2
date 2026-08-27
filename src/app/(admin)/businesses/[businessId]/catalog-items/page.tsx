import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { requireBusinessView } from '@/lib/auth/require-access'
import { getStorefrontBusinessById, getStorefrontItems } from '@/features/storefront/queries'
import { CatalogItemsClient } from './catalog-items-client'

export const metadata: Metadata = {
  title: 'Catalog & Menu Items | SurePrice Admin',
  description: 'Manage digitized catalog items, prices, and QR tags for your store.',
}

export default async function CatalogItemsPage({
  params,
}: {
  params: Promise<{ businessId: string }>
}) {
  const { businessId } = await params
  await requireBusinessView(businessId)

  const [business, items] = await Promise.all([
    getStorefrontBusinessById(businessId),
    getStorefrontItems(businessId),
  ])

  if (!business) notFound()

  return <CatalogItemsClient business={business} items={items} />
}