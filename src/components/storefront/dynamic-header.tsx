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

      {/* Right: Theme Toggle + Refresh/Bell Actions */}
      <div className="flex items-center justify-end gap-2">
        {/* Sun/Moon Theme Toggle */}
        <button
          id="header-theme-toggle-btn"
          onClick={toggleTheme}
          aria-label="Toggle Dark Mode"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-slate-50 text-slate-700 transition-all hover:bg-slate-100 active:scale-90 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
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
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-all hover:text-[var(--lime-dark)] active:rotate-180 active:duration-500"
          >
            <RefreshCcw size={18} />
          </button>
        ) : (
          <button
            id="header-notifications-btn"
            aria-label="Notifications"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-slate-500 transition-colors hover:text-slate-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            <Bell size={16} />
          </button>
        )}
      </div>
    </header>
  )
}
