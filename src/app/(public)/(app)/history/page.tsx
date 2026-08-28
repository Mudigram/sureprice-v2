'use client'

import { useEffect, useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Clock,
  Trash2,
  ScanLine,
  ChevronRight,
  BookmarkPlus,
  RotateCcw,
  Store as StoreIcon,
  CheckCircle2,
  ArrowRight,
  Package,
  Search,
  Plus,
  Check,
  ShoppingBag,
} from 'lucide-react'
import {
  getHistory,
  clearHistory,
  getSavedTrips,
  deleteSavedTrip,
  type HistoryItem,
  type SavedTrip,
} from '@/lib/storefront/local-storage'
import { useCart } from '@/context/CartContext'
import { getCategorySvgIcon } from '@/components/icons'

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export default function HistoryPage() {
  const router = useRouter()
  const { clearList, addItem, removeItem, isInList, getQuantity } = useCart()

  const [activeTab, setActiveTab] = useState<'trips' | 'scans'>('trips')
  const [search, setSearch] = useState('')
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([])
  const [expandedTripId, setExpandedTripId] = useState<string | null>(null)
  const [reloadedTripId, setReloadedTripId] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  const refreshData = () => {
    setHistory(getHistory())
    setSavedTrips(getSavedTrips())
  }

  useEffect(() => {
    refreshData()
    setMounted(true)
  }, [])

  const handleClearHistory = () => {
    clearHistory()
    setHistory([])
  }

  const handleDeleteTrip = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    deleteSavedTrip(id)
    setSavedTrips(getSavedTrips())
  }

  const handleReloadTrip = (trip: SavedTrip, e: React.MouseEvent) => {
    e.stopPropagation()
    clearList()
    for (const item of trip.items) {
      for (let q = 0; q < item.quantity; q++) {
        addItem({
          id: item.id,
          name: item.name,
          base_price: item.base_price,
          image_url: item.image_url,
          businessSlug: item.businessSlug,
          businessName: item.businessName,
        })
      }
    }
    setReloadedTripId(trip.id)
    setTimeout(() => {
      setReloadedTripId(null)
      router.push('/cart')
    }, 1000)
  }

  const handleToggleScannedItemCart = (item: HistoryItem, e: React.MouseEvent) => {
    e.stopPropagation()
    if (isInList(item.id)) {
      removeItem(item.id)
    } else {
      addItem({
        id: item.id,
        name: item.name,
        base_price: item.base_price,
        image_url: item.image_url,
        businessSlug: item.businessSlug,
        businessName: item.businessName,
      })
    }
  }

  // Filtered trips
  const filteredTrips = useMemo(() => {
    if (!search) return savedTrips
    const q = search.toLowerCase()
    return savedTrips.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.items.some((i) => i.name.toLowerCase().includes(q) || i.businessName.toLowerCase().includes(q))
    )
  }, [savedTrips, search])

  // Filtered history scans
  const filteredScans = useMemo(() => {
    if (!search) return history
    const q = search.toLowerCase()
    return history.filter(
      (i) => i.name.toLowerCase().includes(q) || i.businessName.toLowerCase().includes(q)
    )
  }, [history, search])

  if (!mounted) return null

  return (
    <div className="min-h-screen px-5 pt-3 pb-12 space-y-4 bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Shopping History
          </h1>
          <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
            Re-visit your scanned products & saved store shopping lists.
          </p>
        </div>

        {activeTab === 'scans' && history.length > 0 && (
          <button
            id="clear-history-btn"
            onClick={handleClearHistory}
            aria-label="Clear all scanned items history"
            className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-extrabold text-rose-700 hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-400 transition-colors"
          >
            <Trash2 size={13} />
            Clear Scans
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 rounded-2xl border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <button
          type="button"
          id="tab-saved-trips"
          onClick={() => setActiveTab('trips')}
          className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-extrabold transition-all ${
            activeTab === 'trips'
              ? 'bg-slate-900 text-white shadow-sm dark:bg-slate-100 dark:text-slate-900'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <BookmarkPlus size={15} className={activeTab === 'trips' ? 'text-[var(--lime-base)]' : ''} />
          <span>Saved Trips ({savedTrips.length})</span>
        </button>

        <button
          type="button"
          id="tab-scanned-items"
          onClick={() => setActiveTab('scans')}
          className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-extrabold transition-all ${
            activeTab === 'scans'
              ? 'bg-slate-900 text-white shadow-sm dark:bg-slate-100 dark:text-slate-900'
              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <Clock size={15} className={activeTab === 'scans' ? 'text-[var(--lime-base)]' : ''} />
          <span>Scanned Items ({history.length})</span>
        </button>
      </div>

      {/* Search Input Filter */}
      {(savedTrips.length > 0 || history.length > 0) && (
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            size={16}
          />
          <input
            type="text"
            placeholder={
              activeTab === 'trips'
                ? 'Search saved trips by name or store...'
                : 'Search scanned items or stores...'
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="history-search-input"
            className="h-11 w-full rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/90 pl-11 pr-4 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[var(--lime-base)] focus:outline-none focus:ring-1 focus:ring-[var(--lime-base)] shadow-sm transition-all"
          />
        </div>
      )}

      {/* TAB 1: SAVED TRIPS & LISTS */}
      {activeTab === 'trips' && (
        <>
          {filteredTrips.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 mb-3">
                <BookmarkPlus size={28} />
              </div>
              <p className="text-base font-extrabold text-slate-900 dark:text-white">
                {search ? 'No matching saved trips' : 'No saved trips yet'}
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                Save your active Price List on the List screen to reload or re-use it on your next physical store visit.
              </p>
              <Link
                href="/cart"
                className="mt-5 flex items-center gap-2 rounded-2xl bg-[var(--lime-base)] px-6 py-3 text-xs font-extrabold text-black shadow-md shadow-[var(--lime-base)]/20 active:scale-95 transition-transform"
              >
                Go to My Price List <ArrowRight size={15} />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTrips.map((trip) => {
                const isExpanded = expandedTripId === trip.id
                const isReloaded = reloadedTripId === trip.id
                const dateFormatted = new Date(trip.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
                const storeNames = [...new Set(trip.items.map((i) => i.businessName))]

                return (
                  <div
                    key={trip.id}
                    onClick={() => setExpandedTripId(isExpanded ? null : trip.id)}
                    className="cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 space-y-3"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="truncate font-black text-sm text-slate-900 dark:text-white">
                            {trip.title}
                          </h3>
                          <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-extrabold uppercase text-slate-600 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            {trip.items.length} {trip.items.length === 1 ? 'item' : 'items'}
                          </span>
                        </div>
                        <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                          {storeNames.join(' · ')} • {dateFormatted}
                        </p>
                      </div>

                      <p className="text-sm font-black text-emerald-700 dark:text-[var(--lime-base)] shrink-0">
                        ₦{trip.total.toLocaleString()}
                      </p>
                    </div>

                    {/* Actions Row */}
                    <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={(e) => handleReloadTrip(trip, e)}
                        aria-label={`Reload ${trip.title} to active price list`}
                        className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-black transition-all active:scale-95 ${
                          isReloaded
                            ? 'bg-emerald-600 text-white shadow-md'
                            : 'bg-[var(--lime-base)] text-black shadow-md shadow-[var(--lime-base)]/20 hover:bg-[var(--lime-dark)]'
                        }`}
                      >
                        {isReloaded ? (
                          <>
                            <CheckCircle2 size={14} />
                            Loaded to List!
                          </>
                        ) : (
                          <>
                            <RotateCcw size={14} />
                            Reload to Active List
                          </>
                        )}
                      </button>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                          {isExpanded ? 'Hide items ▲' : 'View items ▼'}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteTrip(trip.id, e)}
                          title="Delete saved trip"
                          aria-label={`Delete trip ${trip.title}`}
                          className="text-slate-400 hover:text-rose-600 dark:text-slate-500 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Expandable Items List */}
                    {isExpanded && (
                      <div className="mt-3 divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-950 space-y-2">
                        {trip.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between pt-1.5 text-xs">
                            <div className="min-w-0 flex-1 pr-2">
                              <p className="truncate font-bold text-slate-800 dark:text-slate-200">
                                {item.name} <span className="text-slate-400 font-semibold">(x{item.quantity})</span>
                              </p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{item.businessName}</p>
                            </div>
                            {item.base_price !== null && (
                              <span className="font-black text-slate-900 dark:text-white shrink-0">
                                ₦{(item.base_price * item.quantity).toLocaleString()}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* TAB 2: SCANNED & VIEWED PRODUCTS */}
      {activeTab === 'scans' && (
        <>
          {filteredScans.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 mb-3">
                <Clock size={28} />
              </div>
              <p className="text-base font-extrabold text-slate-900 dark:text-white">
                {search ? 'No matching scanned items' : 'No scan history yet'}
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-xs font-medium">
                Products you view or scan will appear here automatically with 1-tap cart controls.
              </p>
              <Link
                href="/scan"
                className="mt-5 flex items-center gap-2 rounded-2xl bg-[var(--lime-base)] px-6 py-3 text-xs font-extrabold text-black shadow-md shadow-[var(--lime-base)]/20 active:scale-95 transition-transform"
              >
                <ScanLine size={16} />
                Scan Product QR Tag
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredScans.map((item) => {
                const isNoted = isInList(item.id)
                const notedQty = getQuantity(item.id)

                return (
                  <div
                    key={`${item.id}-${item.viewedAt}`}
                    onClick={() => router.push(`/s/${item.businessSlug}/${item.id}`)}
                    className={`group relative flex flex-row items-center gap-3.5 overflow-hidden rounded-2xl border p-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer ${
                      isNoted
                        ? 'border-emerald-300 bg-emerald-50/40 dark:border-emerald-900/50 dark:bg-emerald-950/20'
                        : 'border-slate-200/80 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'
                    }`}
                  >
                    {/* Left Product Photo Thumbnail */}
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-200/60 dark:bg-slate-950 dark:border-slate-800">
                      {item.image_url ? (
                        <Image
                          src={item.image_url}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="80px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-400 dark:text-slate-500">
                          {getCategorySvgIcon(item.name, { size: 28 })}
                        </div>
                      )}
                    </div>

                    {/* Right Info Column */}
                    <div className="flex min-w-0 flex-1 flex-col justify-between self-stretch py-0.5">
                      <div>
                        {/* Title & Store Name */}
                        <div className="flex items-start justify-between gap-1.5">
                          <h3 className="truncate text-xs sm:text-sm font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-[var(--lime-base)] transition-colors">
                            {item.name}
                          </h3>
                          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 shrink-0">
                            {timeAgo(item.viewedAt)}
                          </span>
                        </div>

                        <p className="mt-0.5 truncate text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                          {item.businessName}
                        </p>
                      </div>

                      {/* Price & 1-Tap Cart Button Row */}
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <span className="text-sm font-black text-emerald-700 dark:text-[var(--lime-base)]">
                          {item.base_price !== null ? `₦${item.base_price.toLocaleString()}` : 'Price on request'}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              const text = `Hello, I previously checked the price for ${item.name}${item.base_price ? ` (₦${item.base_price.toLocaleString()})` : ''} at ${item.businessName} on SurePrice. I'd like to inquire!`
                              window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
                            }}
                            className="flex items-center justify-center h-8 w-8 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 transition-all active:scale-95 dark:bg-emerald-950/40 dark:border-emerald-900 dark:text-emerald-400"
                            title="Inquire on WhatsApp"
                          >
                            <span className="text-sm">💬</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => handleToggleScannedItemCart(item, e)}
                            className={`flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-extrabold transition-all active:scale-95 border ${
                              isNoted
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                                : 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:border-slate-700 dark:hover:bg-slate-700'
                            }`}
                          >
                            {isNoted ? (
                              <>
                                <Check size={13} strokeWidth={3} />
                                <span>Noted ({notedQty})</span>
                              </>
                            ) : (
                              <>
                                <Plus size={13} strokeWidth={3} />
                                <span>Note</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      <p className="mt-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500">
                        Prices change daily · Tap to re-check →
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}
