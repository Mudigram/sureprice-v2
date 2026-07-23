import type { Metadata } from 'next'
import { CartProvider } from '@/context/CartContext'
import { FloatingListBar } from '@/components/storefront/floating-list-bar'
import { DynamicHeader } from '@/components/storefront/dynamic-header'
import { OfflineIndicator } from '@/components/storefront/offline-indicator'

export const metadata: Metadata = {
  title: {
    template: '%s | SurePrice',
    default: 'SurePrice',
  },
  description: 'Scan to see prices and product details — no app required.',
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <OfflineIndicator />
      <DynamicHeader />
      {children}
      <FloatingListBar />
    </CartProvider>
  )
}

