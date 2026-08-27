'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Store,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { useCart, type ListItem } from '@/context/CartContext'

interface CartBottomSheetProps {
  isOpen: boolean
  onClose: () => void
}

export function CartBottomSheet({ isOpen, onClose }: CartBottomSheetProps) {
  const { items, totalCount, updateQuantity, clearStoreItems, clearList } =
    useCart()
  const params = useParams()
  const router = useRouter()
  const currentBusinessSlug = (params?.businessSlug as string) || ''

  const [showOtherStores, setShowOtherStores] = useState(false)

  // Prevent background scroll when bottom sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  // Segregate items by current store vs other stores
  const activeStoreItems = currentBusinessSlug
    ? items.filter((i) => i.businessSlug === currentBusinessSlug)
    : items

  const otherStoreItems = currentBusinessSlug
    ? items.filter((i) => i.businessSlug !== currentBusinessSlug)
    : []

  const activeStoreName =
    activeStoreItems.length > 0
      ? activeStoreItems[0].businessName
      : 'Current Store'

  const grandTotal = items.reduce(
    (sum, item) => sum + (item.base_price ?? 0) * item.quantity,
    0
  )

  // Group other store items by businessSlug
  const otherStoresGrouped = otherStoreItems.reduce(
    (acc, item) => {
      if (!acc[item.businessSlug]) {
        acc[item.businessSlug] = {
          name: item.businessName,
          slug: item.businessSlug,
          items: [],
          total: 0,
        }
      }
      acc[item.businessSlug].items.push(item)
      acc[item.businessSlug].total += (item.base_price ?? 0) * item.quantity
      return acc
    },
    {} as Record<
      string,
      { name: string; slug: string; items: ListItem[]; total: number }
    >
  )

  const handleNavigateToCart = () => {
    onClose()
    router.push('/cart')
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet Container */}
      <div
        className="relative z-10 flex max-h-[85vh] w-full flex-col rounded-t-[28px] border-t border-slate-800 bg-slate-950 p-5 shadow-2xl animate-in slide-in-from-bottom duration-300 max-w-lg mx-auto"
        style={{ paddingBottom: 'calc(1.25rem + env(safe-area-inset-bottom))' }}
      >
        {/* Drag handle */}
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-700/60 shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3.5 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--lime-base)] text-black font-extrabold shadow-sm">
              <ShoppingBag size={18} />
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-base font-black text-white">
                {currentBusinessSlug && activeStoreItems.length > 0
                  ? activeStoreName
                  : 'My Price List'}
              </h2>
              <p className="text-[11px] font-medium text-slate-400">
                {totalCount} item{totalCount !== 1 ? 's' : ''} in list
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            aria-label="Close bottom sheet"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="my-3 space-y-4 overflow-y-auto pr-1">
          {/* ── Active Store Items Section ── */}
          {activeStoreItems.length > 0 ? (
            <div className="space-y-3">
              {currentBusinessSlug && (
                <div className="flex items-center justify-between px-1">
                  <span className="flex items-center gap-1.5 rounded-full bg-[var(--lime-base)]/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-[var(--lime-base)] border border-[var(--lime-base)]/20">
                    <Store size={12} />
                    Current Store Session
                  </span>
                  {activeStoreItems.length > 0 && (
                    <button
                      onClick={() => clearStoreItems(currentBusinessSlug)}
                      className="text-[11px] font-semibold text-rose-400 hover:text-rose-300 transition-colors"
                    >
                      Clear Store
                    </button>
                  )}
                </div>
              )}

              {/* Item Cards */}
              <div className="space-y-2.5">
                {activeStoreItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/90 p-3 transition-colors hover:border-slate-700"
                  >
                    {/* Item Thumbnail / Icon */}
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                      {item.image_url ? (
                        <Image
                          src={item.image_url}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <Sparkles size={18} className="text-slate-600" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-white">
                        {item.name}
                      </p>
                      <p className="mt-0.5 text-xs font-extrabold text-[var(--lime-base)]">
                        ₦{((item.base_price ?? 0) * item.quantity).toLocaleString()}
                        {item.quantity > 1 && (
                          <span className="ml-1 text-[10px] font-normal text-slate-400">
                            (₦{(item.base_price ?? 0).toLocaleString()} ea)
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Stepper buttons */}
                    <div className="flex items-center gap-1.5 rounded-xl bg-slate-950 p-1 border border-slate-800 shrink-0">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors active:scale-95"
                        aria-label="Decrease quantity"
                      >
                        {item.quantity === 1 ? <Trash2 size={13} className="text-rose-400" /> : <Minus size={13} />}
                      </button>
                      <span className="w-5 text-center text-xs font-black text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--lime-base)] text-black font-extrabold transition-transform active:scale-95 hover:bg-[var(--lime-dark)]"
                        aria-label="Increase quantity"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-6 text-center">
              <p className="text-xs font-semibold text-slate-400">
                No items added from this store yet.
              </p>
            </div>
          )}

          {/* ── Secondary / Other Stores Accordion ── */}
          {otherStoreItems.length > 0 && (
            <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/50 overflow-hidden">
              <button
                onClick={() => setShowOtherStores(!showOtherStores)}
                className="flex w-full items-center justify-between p-3 text-left transition-colors hover:bg-slate-900"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="flex h-2 w-2 rounded-full bg-amber-400" />
                  <p className="truncate text-xs font-black text-slate-300">
                    Other Stores Saved ({otherStoreItems.length} items)
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span className="text-[11px] font-bold text-amber-400">
                    ₦
                    {Object.values(otherStoresGrouped)
                      .reduce((sum, g) => sum + g.total, 0)
                      .toLocaleString()}
                  </span>
                  {showOtherStores ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </button>

              {showOtherStores && (
                <div className="space-y-3 border-t border-slate-800 p-3 bg-slate-950/60">
                  {Object.values(otherStoresGrouped).map((storeGroup) => (
                    <div key={storeGroup.slug} className="space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-400">
                        <span>{storeGroup.name}</span>
                        <div className="flex items-center gap-2">
                          <span>₦{storeGroup.total.toLocaleString()}</span>
                          <button
                            onClick={() => clearStoreItems(storeGroup.slug)}
                            className="text-rose-400 hover:underline"
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        {storeGroup.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between rounded-xl bg-slate-900 px-3 py-2 text-xs"
                          >
                            <span className="truncate text-slate-200">{item.name} (x{item.quantity})</span>
                            <span className="font-bold text-slate-300">
                              ₦{((item.base_price ?? 0) * item.quantity).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sticky Footer Summary & Actions */}
        <div className="border-t border-slate-800 pt-3.5 space-y-3 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {otherStoreItems.length > 0 ? 'Grand Reference Total' : 'Store Subtotal'}
              </p>
              <p className="text-lg font-black text-[var(--lime-base)]">
                ₦{grandTotal.toLocaleString()}
              </p>
            </div>

            <button
              onClick={clearList}
              className="text-xs font-semibold text-slate-400 hover:text-rose-400 transition-colors"
            >
              Clear All Items
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="flex-1 rounded-2xl border border-slate-700 bg-slate-900 py-3 text-xs font-bold text-white transition-all active:scale-[0.98] hover:bg-slate-800"
            >
              Continue Shopping
            </button>
            <button
              onClick={handleNavigateToCart}
              className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-[var(--lime-base)] py-3 text-xs font-black text-black transition-all active:scale-[0.98] hover:bg-[var(--lime-dark)] shadow-lg shadow-[var(--lime-base)]/20"
            >
              View Full Cart
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
