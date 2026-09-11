import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { requireBusinessManage } from '@/lib/auth/require-access'
import { getBusinessByIdForAdmin } from '@/features/businesses/queries'
import { getCatalogItemsForBusiness } from '@/features/catalog-items/queries'
import { getQrCodesForBusiness } from '@/features/qr-codes/queries'
import { QrStudioClient } from './qr-studio-client'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'QR Print Studio — Qarty Admin',
  description: 'Batch generate and print physical shelf tags, packaging stickers, and restaurant table standees.',
}

export default async function QrStudioPage({
  params,
}: {
  params: Promise<{ businessId: string }>
}) {
  const { businessId } = await params
  await requireBusinessManage(businessId)

  const business = await getBusinessByIdForAdmin(businessId)
  if (!business) notFound()

  const [catalogItems, existingQrCodes] = await Promise.all([
    getCatalogItemsForBusiness(businessId),
    getQrCodesForBusiness(businessId, true),
  ])

  return (
    <QrStudioClient
      business={business}
      catalogItems={catalogItems}
      existingQrCodes={existingQrCodes}
    />
  )
}
