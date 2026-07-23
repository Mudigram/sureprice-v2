'use client'

import { usePathname, useRouter } from 'next/navigation'
import { ChevronLeft, RefreshCcw, Bell } from 'lucide-react'

const ROUTE_TITLES: Record<string, string> = {
  '/home': 'Home',
  '/stores': 'All Stores',
  '/cart': 'My Price List',
  '/history': 'History',
  '/scan': 'Scan Item',
}

function getTitle(pathname: string): string | null {
  // Exact matches first
  if (ROUTE_TITLES[pathname]) return ROUTE_TITLES[pathname]
  // Storefront routes
  if (pathname.match(/^\/s\/[^/]+\/[^/]+/)) return 'Product Details'
  if (pathname.match(/^\/s\/[^/]+/)) return 'Store'
  return null
}

export function DynamicHeader() {
  const pathname = usePathname()
  const router = useRouter()

  const isHome = pathname === '/home' || pathname === '/'
  const isStorefrontItem = /^\/s\/[^/]+\/[^/]+/.test(pathname)
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

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-gray-100 bg-white/80 px-5 shadow-sm backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      {/* Left: Back or brand logo */}
      {!isHome ? (
        <button
          onClick={() => router.back()}
          id="header-back-btn"
          className="flex items-center gap-1 font-bold text-[var(--lime-dark)] transition-opacity hover:opacity-80"
        >
          <ChevronLeft size={22} strokeWidth={2.5} />
          <span className="text-sm font-semibold">Back</span>
        </button>
      ) : (
        <span className="text-xl font-black tracking-tight text-[var(--lime-dark)]">
          SurePrice
        </span>
      )}

      {/* Center: Dynamic page title */}
      <div className="flex flex-1 justify-center overflow-hidden px-2">
        {title && !isHome && (
          <span className="truncate text-base font-bold text-slate-800 dark:text-zinc-100">
            {title}
          </span>
        )}
      </div>

      {/* Right: Refresh button on product pages, Notification Bell on others */}
      <div className="flex items-center justify-end">
        {isStorefrontItem ? (
          <button
            id="header-refresh-btn"
            onClick={() => router.refresh()}
            aria-label="Refresh"
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-all hover:text-[var(--lime-dark)] active:rotate-180 active:duration-500"
          >
            <RefreshCcw size={18} />
          </button>
        ) : (
          <button
            id="header-notifications-btn"
            aria-label="Notifications"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
          >
            <Bell size={16} />
          </button>
        )}
      </div>
    </header>
  )
}
