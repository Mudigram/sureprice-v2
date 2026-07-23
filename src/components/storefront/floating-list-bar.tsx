'use client'

import Link from 'next/link'
import { ClipboardList, ChevronRight, ShoppingBag } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { usePathname } from 'next/navigation'

export function FloatingListBar() {
  const { items, totalCount } = useCart()
  const pathname = usePathname()

  // Don't show on the cart page itself or when list is empty
  const isCartPage = pathname === '/cart'
  if (isCartPage || totalCount === 0) return null

  // Check if BottomNav is present on this page
  const hasBottomNav =
    pathname === '/' ||
    pathname === '/home' ||
    pathname === '/stores' ||
    pathname === '/history' ||
    pathname === '/scan'

  const total = items.reduce(
    (sum, item) => sum + (item.base_price ?? 0) * item.quantity,
    0
  )

  // Group by business to extract unique store names
  const businessNames = [...new Set(items.map((i) => i.businessName))]
  const multiStore = businessNames.length > 1

  // Format store label text explicitly
  const formatStoreLabel = () => {
    if (businessNames.length === 1) {
      return businessNames[0]
    }
    if (businessNames.length === 2) {
      return `${businessNames[0]} & ${businessNames[1]}`
    }
    return `${businessNames[0]}, ${businessNames[1]} +${businessNames.length - 2}`
  }

  return (
    <div
      className={`fixed left-0 right-0 z-40 flex justify-center px-5 transition-all duration-300 ${
        hasBottomNav ? 'bottom-[86px]' : 'bottom-4'
      }`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <Link
        href="/cart"
        id="floating-list-bar"
        className="flex w-full max-w-md items-center gap-3.5 rounded-2xl border border-[var(--lime-base)]/40 bg-slate-900 px-4 py-3 shadow-2xl shadow-black/50 transition-all hover:scale-[1.01] active:scale-[0.99] dark:bg-zinc-900"
      >
        {/* Icon + count badge */}
        <div className="relative shrink-0">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--lime-base)] text-black shadow-inner">
            {multiStore ? (
              <ShoppingBag size={20} className="text-black" />
            ) : (
              <ClipboardList size={20} className="text-black" />
            )}
          </div>
          <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white px-1 text-[10px] font-black text-black shadow-sm">
            {totalCount > 99 ? '99+' : totalCount}
          </span>
        </div>

        {/* Label & multi-store detail */}
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-black text-white">
            {formatStoreLabel()}
          </p>
          <div className="mt-0.5 flex items-center gap-1.5">
            {multiStore && (
              <span className="rounded bg-[var(--lime-base)]/20 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-[var(--lime-base)]">
                {businessNames.length} Stores
              </span>
            )}
            <p className="truncate text-[10px] font-medium text-slate-400">
              {totalCount} item{totalCount !== 1 ? 's' : ''} noted · Tap to view list
            </p>
          </div>
        </div>

        {/* Total + arrow */}
        <div className="flex items-center gap-2 shrink-0">
          {total > 0 && (
            <div className="text-right">
              <p className="text-base font-black text-[var(--lime-base)]">
                ₦{total.toLocaleString()}
              </p>
              <p className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400">
                Reference Total
              </p>
            </div>
          )}
          <ChevronRight size={18} className="text-slate-400" />
        </div>
      </Link>
    </div>
  )
}
