import { NextResponse } from 'next/server'
import { getQrCodeByCode } from '@/features/qr-codes/queries'
import { recordScanAndIncrement } from '@/features/qr-codes/actions'
import { getStorefrontBusinessById } from '@/features/storefront/queries'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params

  const qrCode = await getQrCodeByCode(code).catch(() => null)

  if (!qrCode || qrCode.status !== 'active') {
    return new NextResponse('QR code not found or inactive.', { status: 404 })
  }

  const business = await getStorefrontBusinessById(qrCode.business_id).catch(() => null)
  if (!business) {
    return new NextResponse('Business not found.', { status: 404 })
  }

  // Build the redirect path based on target type
  let redirectPath: string
  if (qrCode.target_type === 'catalog_item') {
    redirectPath = `/s/${business.slug}/${qrCode.target_id}`
  } else {
    // storefront or business QR → goes to the storefront landing
    redirectPath = `/s/${business.slug}`
  }

  // Fire-and-forget scan recording — must never block the redirect
  recordScanAndIncrement(qrCode.id, qrCode.business_id).catch(() => undefined)

  return NextResponse.redirect(new URL(redirectPath, request.url), { status: 307 })
}
