'use client'

import { usePathname, useRouter } from 'next/navigation'
import { ChevronLeft, RefreshCcw, Bell, Sun, Moon } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

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
  const { theme, toggleTheme } = useTheme()

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
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-slate-200/80 bg-white/90 px-5 shadow-sm backdrop-blur-xl dark:border-slate-800/90 dark:bg-slate-950/90">
      {/* Left: Back or brand logo */}
      {!isHome ? (
        <button
          onClick={handleBack}
          id="header-back-btn"
          aria-label={`Go back to ${backLabel}`}
          className="flex items-center gap-1 font-black text-emerald-600 dark:text-[var(--lime-base)] transition-all hover:opacity-85 active:scale-95"
        >
          <ChevronLeft size={22} strokeWidth={2.5} />
          <span className="text-xs font-black uppercase tracking-wider">{backLabel}</span>
        </button>
      ) : (
        <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
          <span className="text-emerald-600 dark:text-[var(--lime-base)]">Sure</span>Price
        </span>
      )}

      {/* Center: Dynamic page title */}
      <div className="flex flex-1 justify-center overflow-hidden px-2">
        {title && !isHome && (
          <span className="truncate text-sm font-black text-slate-900 dark:text-white">
            {title}
          </span>
        )}
      </div>

      {/* Right: Theme Toggle + Refresh/Bell Actions */}
      <div className="flex items-center justify-end gap-2">
        {/* Sun/Moon Theme Toggle */}
        <button
          id="header-theme-toggle-btn"
          onClick={toggleTheme}
          aria-label="Toggle Dark Mode"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-slate-100/80 text-slate-700 transition-all hover:bg-slate-200 active:scale-90 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          {theme === 'dark' ? (
            <Sun size={16} className="text-amber-400" />
          ) : (
            <Moon size={16} className="text-slate-700" />
          )}
        </button>

        {isStorefrontItem ? (
          <button
            id="header-refresh-btn"
            onClick={() => router.refresh()}
            aria-label="Refresh"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-slate-100/80 text-slate-500 transition-all hover:text-emerald-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:text-[var(--lime-base)] active:rotate-180 active:duration-500"
          >
            <RefreshCcw size={16} />
          </button>
        ) : (
          <button
            id="header-notifications-btn"
            aria-label="Notifications"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-slate-100/80 text-slate-500 transition-all hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            <Bell size={16} />
          </button>
        )}
      </div>
    </header>
  )
}

