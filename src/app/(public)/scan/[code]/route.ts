import { NextRequest, NextResponse } from 'next/server'
import { getQrCodeByCode } from '@/features/qr-codes/queries'
import { getBusinessSlugById } from '@/features/businesses/queries'
import { recordScanAndIncrement } from '@/features/scan-events/actions'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params

  // Look up active QR code (filters status = 'active')
  const qrCode = await getQrCodeByCode(code).catch(() => null)

  if (!qrCode) {
    return NextResponse.redirect(new URL('/not-found', request.url))
  }

  // Record scan event
  await recordScanAndIncrement(qrCode.id, qrCode.business_id).catch(() => undefined)

  const destination = await resolveDestination(qrCode)
  return NextResponse.redirect(new URL(destination, request.url))
}

async function resolveDestination(qrCode: {
  target_type: string
  target_id: string
  business_id: string
}): Promise<string> {
  const slug = await getBusinessSlugById(qrCode.business_id)
  if (!slug) return '/not-found'

  switch (qrCode.target_type) {
    case 'catalog_item':
      return `/s/${slug}/${qrCode.target_id}`
    case 'business':
    case 'location':
      return `/s/${slug}`
    case 'collection':
      return `/s/${slug}?collection=${qrCode.target_id}`
    default:
      return '/not-found'
  }
}
