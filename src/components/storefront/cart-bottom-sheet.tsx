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

  const [showOtherStores, setShowOtherStores] = useState(true)

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

  // Group all items by store for the per-store physical checkout breakdown
  const allStoresGrouped = items.reduce(
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

  const storeGroupsList = Object.values(allStoresGrouped)
  const isMultiStore = storeGroupsList.length > 1

  const handleNavigateToCart = () => {
    onClose()
    router.push('/cart')
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet Container */}
      <div
        className="relative z-10 flex max-h-[85vh] w-full flex-col rounded-t-[28px] border-t border-slate-200 bg-white text-slate-900 p-5 shadow-2xl animate-in slide-in-from-bottom duration-300 max-w-lg mx-auto"
        style={{ paddingBottom: 'calc(1.25rem + env(safe-area-inset-bottom))' }}
      >
        {/* Drag handle */}
        <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-slate-300 shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3.5 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--lime-base)] text-black font-extrabold shadow-sm">
              <ShoppingBag size={18} />
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-base font-black text-slate-900">
                {currentBusinessSlug && activeStoreItems.length > 0
                  ? activeStoreName
                  : 'My Price List'}
              </h2>
              <p className="text-[11px] font-medium text-slate-500">
                {totalCount} item{totalCount !== 1 ? 's' : ''} noted
                {isMultiStore ? ` across ${storeGroupsList.length} venues` : ''}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors active:scale-95"
            aria-label="Close bottom sheet"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="my-3 space-y-4 overflow-y-auto pr-1">
          {/* Active Store Items Section */}
          {activeStoreItems.length > 0 ? (
            <div className="space-y-3">
              {currentBusinessSlug && (
                <div className="flex items-center justify-between px-1">
                  <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-emerald-800 border border-emerald-200">
                    <Store size={12} className="text-emerald-600" />
                    Current Store Session
                  </span>
                  {activeStoreItems.length > 0 && (
                    <button
                      onClick={() => clearStoreItems(currentBusinessSlug)}
                      className="text-[11px] font-semibold text-rose-600 hover:underline transition-colors"
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
                    className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 transition-colors hover:border-slate-300"
                  >
                    {/* Item Thumbnail / Icon */}
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-white border border-slate-200 flex items-center justify-center">
                      {item.image_url ? (
                        <Image
                          src={item.image_url}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <Sparkles size={18} className="text-slate-400" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-slate-900">
                        {item.name}
                      </p>
                      <p className="mt-0.5 text-xs font-extrabold text-emerald-700">
                        ₦{((item.base_price ?? 0) * item.quantity).toLocaleString()}
                        {item.quantity > 1 && (
                          <span className="ml-1 text-[10px] font-normal text-slate-500">
                            (₦{(item.base_price ?? 0).toLocaleString()} ea)
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Stepper buttons */}
                    <div className="flex items-center gap-1.5 rounded-xl bg-white p-1 border border-slate-200 shrink-0">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors active:scale-95"
                        aria-label="Decrease quantity"
                      >
                        {item.quantity === 1 ? <Trash2 size={13} className="text-rose-600" /> : <Minus size={13} />}
                      </button>
                      <span className="w-5 text-center text-xs font-black text-slate-900">
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
              <p className="text-xs font-semibold text-slate-500">
                No items added from this store yet.
              </p>
            </div>
          )}

          {/* Secondary / Other Stores Accordion */}
          {otherStoreItems.length > 0 && (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden">
              <button
                onClick={() => setShowOtherStores(!showOtherStores)}
                className="flex w-full items-center justify-between p-3 text-left transition-colors hover:bg-slate-100"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="flex h-2 w-2 rounded-full bg-amber-500" />
                  <p className="truncate text-xs font-extrabold text-slate-800">
                    Other Venues Saved ({otherStoreItems.length} items)
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <span className="text-[11px] font-black text-amber-700">
                    ₦
                    {storeGroupsList
                      .filter((g) => g.slug !== currentBusinessSlug)
                      .reduce((sum, g) => sum + g.total, 0)
                      .toLocaleString()}
                  </span>
                  {showOtherStores ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </button>

              {showOtherStores && (
                <div className="space-y-3 border-t border-slate-200 p-3 bg-white">
                  {storeGroupsList
                    .filter((g) => g.slug !== currentBusinessSlug)
                    .map((storeGroup) => (
                      <div key={storeGroup.slug} className="space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-600">
                          <span>{storeGroup.name}</span>
                          <div className="flex items-center gap-2">
                            <span>₦{storeGroup.total.toLocaleString()}</span>
                            <button
                              onClick={() => clearStoreItems(storeGroup.slug)}
                              className="text-rose-600 hover:underline"
                            >
                              Clear
                            </button>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          {storeGroup.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 text-xs border border-slate-200"
                            >
                              <span className="truncate text-slate-800">{item.name} (x{item.quantity})</span>
                              <span className="font-bold text-slate-900">
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

        {/* Multi-Store Breakdown Callout (Physical Checkout Per Venue) */}
        {isMultiStore && (
          <div className="mb-3 rounded-2xl bg-amber-50/80 p-2.5 border border-amber-200 text-xs text-amber-900">
            <p className="text-[10px] font-black uppercase tracking-wider text-amber-800 mb-1">
              Physical Checkout Per Venue:
            </p>
            <p className="text-[11px] font-bold text-amber-950 leading-relaxed">
              {storeGroupsList
                .map((g) => `₦${g.total.toLocaleString()} at ${g.name}`)
                .join(' + ')}
            </p>
          </div>
        )}

        {/* Sticky Footer Summary & Actions */}
        <div className="border-t border-slate-200 pt-3.5 space-y-3 shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {isMultiStore ? 'Total Across All Stores' : 'Store Total'}
              </p>
              <p className="text-lg font-black text-emerald-700">
                ₦{grandTotal.toLocaleString()}
              </p>
            </div>

            <button
              onClick={clearList}
              className="text-xs font-semibold text-slate-500 hover:text-rose-600 transition-colors"
            >
              Clear All Items
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="flex-1 rounded-2xl border border-slate-200 bg-slate-100 py-3 text-xs font-bold text-slate-800 transition-all active:scale-[0.98] hover:bg-slate-200"
            >
              Continue
            </button>
            <button
              onClick={handleNavigateToCart}
              className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-[var(--lime-base)] py-3 text-xs font-black text-black transition-all active:scale-[0.98] hover:bg-[var(--lime-dark)] shadow-lg shadow-[var(--lime-base)]/20"
            >
              View Full List
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
