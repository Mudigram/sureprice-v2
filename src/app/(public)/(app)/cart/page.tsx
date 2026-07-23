'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useMemo } from 'react'
import {
  X,
  ClipboardList,
  Minus,
  Plus,
  Info,
  ArrowRight,
  Share2,
  Store as StoreIcon,
  Trash2,
  CheckSquare,
  Square,
  CheckCircle2,
  BookmarkPlus,
  Check,
} from 'lucide-react'
import { useCart, type ListItem } from '@/context/CartContext'
import { saveTrip } from '@/lib/storefront/local-storage'

export default function CartPage() {
  const {
    items,
    totalCount,
    removeItem,
    updateQuantity,
    toggleCollected,
    clearList,
    clearStoreItems,
  } = useCart()

  const [copiedStoreSlug, setCopiedStoreSlug] = useState<string | null>(null)
  const [savedStoreSlug, setSavedStoreSlug] = useState<string | null>(null)

  // Group items by Business / Store
  const storeGroups = useMemo(() => {
    const groups = new Map<string, { name: string; slug: string; items: ListItem[] }>()
    for (const item of items) {
      const existing = groups.get(item.businessSlug)
      if (existing) {
        existing.items.push(item)
      } else {
        groups.set(item.businessSlug, {
          name: item.businessName,
          slug: item.businessSlug,
          items: [item],
        })
      }
    }
    return Array.from(groups.values())
  }, [items])

  // Combined overall total
  const grandTotal = items.reduce((sum, item) => sum + (item.base_price ?? 0) * item.quantity, 0)
  const totalCollectedCount = items.filter((i) => i.collected).length

  // Individualized Store Share
  const handleShareStore = async (group: { name: string; slug: string; items: ListItem[] }) => {
    const storeTotal = group.items.reduce(
      (sum, i) => sum + (i.base_price ?? 0) * i.quantity,
      0
    )

    let text = `📍 ${group.name} — My Price List:\n\n`
    for (const i of group.items) {
      const status = i.collected ? '✓ ' : '• '
      const priceStr = i.base_price ? ` — ₦${(i.base_price * i.quantity).toLocaleString()}` : ''
      text += `${status}${i.name} (x${i.quantity})${priceStr}\n`
    }
    text += `\nEstimated Store Total: ₦${storeTotal.toLocaleString()}\n`
    text += `Verified via SurePrice`

    if (navigator.share) {
      try {
        await navigator.share({ title: `${group.name} List`, text })
      } catch {
        // Dismissed
      }
    } else {
      try {
        await navigator.clipboard.writeText(text)
        setCopiedStoreSlug(group.slug)
        setTimeout(() => setCopiedStoreSlug(null), 2500)
      } catch {
        // Clipboard write failed
      }
    }
  }

  // Individualized Store Save Trip
  const handleSaveStoreTrip = (group: { name: string; slug: string; items: ListItem[] }) => {
    const title = `${group.name} Trip`
    saveTrip(title, group.items)
    setSavedStoreSlug(group.slug)
    setTimeout(() => setSavedStoreSlug(null), 2500)
  }

  return (
    <div className="min-h-screen px-5 pt-3 pb-8 space-y-5">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-zinc-400">
            In-Store Reference
          </p>
          <h1 className="mt-0.5 text-2xl font-black tracking-tight text-slate-900 dark:text-zinc-100">
            My Price List
          </h1>
          {items.length > 0 && (
            <p className="mt-0.5 text-xs text-slate-500 dark:text-zinc-400">
              {totalCount} item{totalCount !== 1 ? 's' : ''} across {storeGroups.length} vendor
              {storeGroups.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {items.length > 0 && (
          <button
            id="clear-all-list-btn"
            onClick={clearList}
            className="text-xs font-extrabold text-destructive transition-opacity hover:opacity-70"
          >
            Clear All
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-900 dark:bg-zinc-800 dark:text-zinc-300">
            <ClipboardList size={36} />
          </div>
          <p className="mt-4 font-extrabold text-slate-900 dark:text-zinc-100 text-base">
            Your price list is empty
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400 max-w-xs leading-relaxed">
            Scan product QR codes on shelf tags or menus to note prices while browsing.
          </p>
          <Link
            href="/stores"
            className="mt-6 flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-xs font-extrabold text-white shadow-lg shadow-black/20 dark:bg-zinc-100 dark:text-zinc-900 transition-transform active:scale-95"
          >
            Browse Stores & Menus <ArrowRight size={15} />
          </Link>
        </div>
      ) : (
        <>
          {/* Info Banner */}
          <div className="flex items-start gap-3 rounded-2xl bg-blue-50/70 p-3.5 border border-blue-200/80 dark:bg-blue-950/30 dark:border-blue-900/50">
            <Info size={16} className="mt-0.5 shrink-0 text-blue-800 dark:text-blue-400" />
            <p className="text-xs leading-relaxed text-blue-950 dark:text-blue-200">
              Items are organized by store. Check off items as you pick them up. Payment happens physically at checkout.
            </p>
          </div>

          {/* INDIVIDUALIZED STORE BLOCKS */}
          <div className="space-y-6">
            {storeGroups.map((group) => {
              const storeSubtotal = group.items.reduce(
                (sum, i) => sum + (i.base_price ?? 0) * i.quantity,
                0
              )
              const collectedInStore = group.items.filter((i) => i.collected).length
              const storeProgressPct = Math.round((collectedInStore / group.items.length) * 100)
              const isStoreSaved = savedStoreSlug === group.slug
              const isStoreCopied = copiedStoreSlug === group.slug

              return (
                <div
                  key={group.slug}
                  className="rounded-3xl border border-gray-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden"
                >
                  {/* Store Header in Deep Navy / Slate */}
                  <div className="bg-slate-900 px-4 py-3 text-white dark:bg-zinc-950 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--lime-base)] text-black">
                        <StoreIcon size={16} />
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/s/${group.slug}`}
                          className="truncate text-sm font-black text-white hover:underline block"
                        >
                          {group.name}
                        </Link>
                        <p className="text-[10px] text-slate-300">
                          {group.items.length} item{group.items.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-sm font-black text-[var(--lime-base)]">
                        ₦{storeSubtotal.toLocaleString()}
                      </span>
                      <button
                        onClick={() => clearStoreItems(group.slug)}
                        title="Clear store items"
                        className="text-slate-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Individualized Store Controls Bar */}
                  <div className="border-b border-gray-100 bg-slate-50 px-4 py-2.5 dark:border-zinc-800 dark:bg-zinc-800/40 flex flex-wrap items-center justify-between gap-2">
                    {/* Per-Store In-Store Pick-Up Progress */}
                    <div className="flex items-center gap-2 flex-1 min-w-[180px]">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-zinc-700">
                        <div
                          className="h-full bg-[var(--lime-base)] transition-all duration-300"
                          style={{ width: `${storeProgressPct}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-extrabold text-slate-700 dark:text-zinc-300 shrink-0">
                        {collectedInStore}/{group.items.length} Picked ({storeProgressPct}%)
                      </span>
                    </div>

                    {/* Per-Store Action Buttons */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Save Store Trip */}
                      <button
                        type="button"
                        onClick={() => handleSaveStoreTrip(group)}
                        id={`save-store-btn-${group.slug}`}
                        className="flex items-center gap-1 rounded-xl border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-extrabold text-blue-900 transition-all active:scale-95 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-300"
                      >
                        {isStoreSaved ? (
                          <>
                            <Check size={12} className="text-blue-900 dark:text-blue-300" />
                            <span>Saved</span>
                          </>
                        ) : (
                          <>
                            <BookmarkPlus size={12} />
                            <span>Save Trip</span>
                          </>
                        )}
                      </button>

                      {/* Share Store List */}
                      <button
                        type="button"
                        onClick={() => handleShareStore(group)}
                        id={`share-store-btn-${group.slug}`}
                        className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-extrabold text-slate-700 transition-all hover:border-gray-300 active:scale-95 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                      >
                        {isStoreCopied ? (
                          <>
                            <CheckCircle2 size={12} className="text-green-600" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Share2 size={12} />
                            <span>Share</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Store Items List */}
                  <div className="divide-y divide-gray-50 dark:divide-zinc-800/60">
                    {group.items.map((item) => {
                      const isCollected = !!item.collected

                      return (
                        <div
                          key={item.id}
                          className={`flex items-center gap-3 p-3.5 transition-colors ${
                            isCollected
                              ? 'bg-slate-50/70 dark:bg-zinc-800/30 opacity-60'
                              : 'bg-white dark:bg-zinc-900'
                          }`}
                        >
                          {/* Checklist Checkbox */}
                          <button
                            type="button"
                            onClick={() => toggleCollected(item.id)}
                            id={`toggle-collect-${item.id}`}
                            className="shrink-0 transition-transform active:scale-90"
                            title={isCollected ? 'Mark uncollected' : 'Mark collected'}
                          >
                            {isCollected ? (
                              <CheckSquare size={22} className="text-[var(--lime-dark)]" />
                            ) : (
                              <Square size={22} className="text-slate-300 dark:text-zinc-600" />
                            )}
                          </button>

                          {/* Thumbnail */}
                          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-800">
                            {item.image_url ? (
                              <Image
                                src={item.image_url}
                                alt={item.name}
                                fill
                                className="object-cover"
                                sizes="56px"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-lg">📦</div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-1">
                              <Link
                                href={`/s/${item.businessSlug}/${item.id}`}
                                className={`line-clamp-1 text-xs font-extrabold ${
                                  isCollected
                                    ? 'line-through text-slate-400 dark:text-zinc-500'
                                    : 'text-slate-900 dark:text-zinc-100 hover:underline'
                                }`}
                              >
                                {item.name}
                              </Link>
                              <button
                                id={`remove-item-${item.id}`}
                                onClick={() => removeItem(item.id)}
                                aria-label="Remove item"
                                className="shrink-0 text-slate-300 hover:text-destructive dark:text-zinc-600"
                              >
                                <X size={15} />
                              </button>
                            </div>

                            {item.base_price !== null && (
                              <p className="mt-0.5 text-[11px] font-medium text-slate-500 dark:text-zinc-400">
                                ₦{item.base_price.toLocaleString()} / unit
                              </p>
                            )}

                            {/* Quantity & Subtotal */}
                            <div className="mt-2 flex items-center justify-between">
                              <div className="flex h-7 items-center overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
                                <button
                                  id={`qty-dec-${item.id}`}
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="px-2 text-slate-400 hover:text-red-500"
                                >
                                  <Minus size={12} />
                                </button>
                                <span className="w-4 text-center text-xs font-extrabold text-slate-900 dark:text-zinc-100">
                                  {item.quantity}
                                </span>
                                <button
                                  id={`qty-inc-${item.id}`}
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="px-2 text-slate-400 hover:text-slate-900 dark:hover:text-zinc-100"
                                >
                                  <Plus size={12} />
                                </button>
                              </div>

                              {item.base_price !== null && (
                                <p
                                  className={`text-xs font-black ${
                                    isCollected
                                      ? 'line-through text-slate-400 dark:text-zinc-500'
                                      : 'text-slate-900 dark:text-zinc-100'
                                  }`}
                                >
                                  ₦{(item.base_price * item.quantity).toLocaleString()}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Price Reference Grand Total Summary Card */}
          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-3">
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-widest text-slate-400 dark:text-zinc-500">
                  Combined Trip Total
                </p>
                <p className="text-2xl font-black text-slate-900 dark:text-zinc-100 mt-0.5">
                  ₦{grandTotal.toLocaleString()}
                </p>
              </div>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-extrabold text-slate-600 dark:bg-zinc-800 dark:text-zinc-400">
                Reference · Not a bill
              </span>
            </div>

            <div className="rounded-2xl bg-blue-50/70 p-3 text-center border border-blue-200/80 dark:bg-blue-950/30 dark:border-blue-900/50">
              <p className="text-xs font-extrabold text-blue-950 dark:text-blue-200">
                Show these store reference lists at physical checkout or use them to guide your shopping trip.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
