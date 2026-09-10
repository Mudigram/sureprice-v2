'use client'

import { usePathname, useRouter } from 'next/navigation'
import { ChevronLeft, RefreshCcw, Zap } from 'lucide-react'
import { useLivePriceSync } from '@/components/storefront/live-price-sync-provider'

const ROUTE_TITLES: Record<string, string> = {
  '/home': 'Home',
  '/stores': 'All Stores',
  '/cart': 'My Price List',
  '/history': 'History',
  '/scan': 'Scan Item',
}

function getTitle(pathname: string): string | null {
  if (ROUTE_TITLES[pathname]) return ROUTE_TITLES[pathname]
  if (pathname.match(/^\/s\/[^/]+\/[^/]+/)) return 'Product Details'
  if (pathname.match(/^\/s\/[^/]+/)) return 'Store'
  return null
}

export function DynamicHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const { isRefreshing, triggerManualRefresh } = useLivePriceSync()

  const isHome = pathname === '/home' || pathname === '/'
  const title = getTitle(pathname)

  // Don't render on owner/admin routes
  if (
    pathname.startsWith('/businesses') ||
    pathname.startsWith('/locations') ||
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/login')
  ) {
    return null
  }

  const handleBack = () => {
    const parts = pathname.split('/')
    if (parts.length >= 4 && parts[1] === 's') {
      // On item detail page: always go back to store menu
      router.push(`/s/${parts[2]}`)
      return
    }
    if (parts.length === 3 && parts[1] === 's') {
      // On store menu page: go back to stores directory
      router.push('/stores')
      return
    }
    if (typeof window !== 'undefined' && window.history.length > 2) {
      router.back()
      return
    }
    router.push('/home')
  }

  const backLabel = (() => {
    const parts = pathname.split('/')
    if (parts.length >= 4 && parts[1] === 's') return 'Menu'
    if (parts.length === 3 && parts[1] === 's') return 'Stores'
    return 'Back'
  })()

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-slate-200/80 bg-white/90 px-5 shadow-sm backdrop-blur-xl">
      {/* Left: Back or brand logo */}
      {!isHome ? (
        <button
          onClick={handleBack}
          id="header-back-btn"
          aria-label={`Go back to ${backLabel}`}
          className="flex items-center gap-1 font-black text-emerald-600 transition-all hover:opacity-85 active:scale-95"
        >
          <ChevronLeft size={22} strokeWidth={2.5} />
          <span className="text-xs font-black uppercase tracking-wider">{backLabel}</span>
        </button>
      ) : (
        <span className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-0.5">
          <span className="text-emerald-600">Q</span>arty
        </span>
      )}

      {/* Center: Dynamic page title */}
      <div className="flex flex-1 justify-center overflow-hidden px-2">
        {title && !isHome && (
          <span className="truncate text-sm font-black text-slate-900">
            {title}
          </span>
        )}
      </div>

      {/* Right: Page Refresh Action & Live Sync Badge */}
      <div className="flex items-center justify-end gap-2">
        <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-black text-emerald-700 border border-emerald-200/60">
          <Zap size={11} className="fill-emerald-600 text-emerald-600" />
          <span>Live Sync</span>
        </span>

        <button
          id="header-refresh-btn"
          onClick={triggerManualRefresh}
          aria-label="Refresh live price data"
          title="Refresh live price data"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-slate-100/80 text-slate-600 transition-all hover:bg-slate-200 hover:text-emerald-600 active:scale-90"
        >
          <RefreshCcw
            size={16}
            className={`transition-all ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`}
          />
        </button>
      </div>
    </header>
  )
}
