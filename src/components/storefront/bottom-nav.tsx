'use client'

import Link from 'next/link'
import { Home, ClipboardList, Store, History } from 'lucide-react'
import ScanButton from '@/components/ui/ScanButton'
import { usePathname } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { useScrollDirection } from '@/hooks/useScrollDirection'

const navItems = [
  { name: 'Home',    href: '/home',    icon: Home },
  { name: 'Stores',  href: '/stores',  icon: Store },
  { name: 'List',    href: '/cart',    icon: ClipboardList },
  { name: 'History', href: '/history', icon: History },
] as const

export function BottomNav() {
  const pathname = usePathname()
  const { totalCount } = useCart()
  const isVisible = useScrollDirection()

  return (
    /* Outer wrapper: centres the pill, handles scroll transition and safe-area spacing */
    <div
      className={`fixed bottom-4 left-0 right-0 z-50 flex justify-center px-5 transition-all duration-300 ease-in-out transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-[200px] opacity-0 pointer-events-none'
      }`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {/* Pill container with glassmorphism */}
      <div className="relative flex h-[64px] w-full max-w-md items-center justify-around rounded-2xl border border-slate-200/80 bg-white/90 px-3 shadow-2xl shadow-black/40 backdrop-blur-2xl dark:border-slate-800/90 dark:bg-slate-950/90">

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
                className={`relative flex flex-col items-center gap-0.5 min-w-[52px] py-1 transition-all active:scale-95 ${
                  isActive ? 'opacity-100' : 'opacity-50 hover:opacity-85'
                }`}
              >
                <div className="relative">
                  <Icon
                    size={22}
                    strokeWidth={isActive ? 2.5 : 1.8}
                    className={isActive ? 'text-emerald-600 dark:text-[var(--lime-base)]' : 'text-slate-700 dark:text-slate-300'}
                  />
                  {/* Live badge on List tab */}
                  {isListTab && totalCount > 0 && (
                    <span className="absolute -right-2 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[var(--lime-base)] px-1 text-[9px] font-black text-black shadow-sm">
                      {totalCount > 99 ? '99+' : totalCount}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[10px] font-extrabold tracking-wide ${
                    isActive ? 'text-emerald-600 dark:text-[var(--lime-base)]' : 'text-slate-600 dark:text-slate-400'
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

