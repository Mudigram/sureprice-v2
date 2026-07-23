'use client'

import Link from 'next/link'
import { Home, ShoppingCart, Store, History } from 'lucide-react'
import ScanButton from '@/components/ui/ScanButton'
import { usePathname } from 'next/navigation'
import { useCart } from '@/context/CartContext'

const navItems = [
  { name: 'Home',    href: '/home',    icon: Home },
  { name: 'Stores',  href: '/stores',  icon: Store },
  { name: 'List',    href: '/cart',    icon: ShoppingCart },
  { name: 'History', href: '/history', icon: History },
] as const

export function BottomNav() {
  const pathname = usePathname()
  const { totalCount } = useCart()

  return (
    /* Outer wrapper: centres the pill and keeps safe-area spacing */
    <div
      className="fixed bottom-4 left-0 right-0 z-50 flex justify-center px-5"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {/* Pill container with glassmorphism */}
      <div className="relative flex h-[62px] w-full max-w-md items-center justify-around rounded-2xl border border-white/30 bg-white/75 px-3 shadow-2xl shadow-black/15 backdrop-blur-xl dark:border-zinc-700/40 dark:bg-zinc-950/75">

        {/* Floating Scan FAB — elevated above the pill centre */}
        <ScanButton />

        {navItems.map((item, index) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href === '/home' && pathname === '/')
          const isListTab = item.name === 'List'

          return (
            <div key={item.name} className="contents">
              {/* Centre gap for the ScanButton */}
              {index === 2 && <div className="w-14 shrink-0" />}

              <Link
                href={item.href}
                id={`nav-${item.name.toLowerCase()}`}
                className={`relative flex flex-col items-center gap-0.5 min-w-[52px] py-1 transition-opacity ${
                  isActive ? 'opacity-100' : 'opacity-50 hover:opacity-75'
                }`}
              >
                <div className="relative">
                  <Icon
                    size={22}
                    strokeWidth={isActive ? 2.5 : 1.8}
                    className={isActive ? 'text-[var(--lime-dark)]' : 'text-foreground'}
                  />
                  {/* Live badge on List tab */}
                  {isListTab && totalCount > 0 && (
                    <span className="absolute -right-2 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[var(--lime-base)] px-1 text-[9px] font-black text-black">
                      {totalCount > 99 ? '99+' : totalCount}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[10px] font-semibold tracking-wide ${
                    isActive ? 'text-[var(--lime-dark)]' : 'text-foreground'
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
