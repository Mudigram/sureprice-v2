import type { Metadata } from 'next'
import { QrScanner } from './qr-scanner'

export const metadata: Metadata = {
  title: 'Scan Item — SurePrice',
  description: 'Scan an in-store product QR code for instant price & spec details.',
}

export default function ScanPage() {
  return (
    <div className="flex min-h-screen flex-col px-5 pt-3 pb-8">
      {/* Title Header */}
      <div className="mb-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--lime-dark)]">
          Instant Price Lookup
        </p>
        <h1 className="mt-0.5 text-2xl font-black tracking-tight text-foreground">
          Scan Product QR
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Point camera at any shelf tag, menu, or stall QR code
        </p>
      </div>

      {/* Scanner Component */}
      <div className="flex-1">
        <QrScanner />
      </div>
    </div>
  )
}
