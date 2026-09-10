import type { Metadata } from 'next'
import { CartProvider } from '@/context/CartContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { LivePriceSyncProvider } from '@/components/storefront/live-price-sync-provider'
import { PullToRefresh } from '@/components/storefront/pull-to-refresh'
import { FloatingListBar } from '@/components/storefront/floating-list-bar'
import { DynamicHeader } from '@/components/storefront/dynamic-header'
import { OfflineIndicator } from '@/components/storefront/offline-indicator'

export const metadata: Metadata = {
  title: {
    template: '%s | Qarty',
    default: 'Qarty',
  },
  description: 'Scan to see verified prices and menus in Ibadan — zero app required.',
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <CartProvider>
        <LivePriceSyncProvider>
          <OfflineIndicator />
          <DynamicHeader />
          <PullToRefresh>
            {children}
          </PullToRefresh>
          <FloatingListBar />
        </LivePriceSyncProvider>
      </CartProvider>
    </ThemeProvider>
  )
}
