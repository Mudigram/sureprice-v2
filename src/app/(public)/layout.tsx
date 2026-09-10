import type { Metadata } from 'next'
import { CartProvider } from '@/context/CartContext'
import { ThemeProvider } from '@/context/ThemeContext'
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
        <OfflineIndicator />
        <DynamicHeader />
        {children}
        <FloatingListBar />
      </CartProvider>
    </ThemeProvider>
  )
}
