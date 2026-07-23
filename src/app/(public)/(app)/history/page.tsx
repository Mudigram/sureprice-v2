'use client'

import { useEffect, useState } from 'react'
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
  const { clearList, addItem } = useCart()

  const [activeTab, setActiveTab] = useState<'trips' | 'scans'>('trips')
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
      // Add each item with its saved quantity
      addItem({
        id: item.id,
        name: item.name,
        base_price: item.base_price,
        image_url: item.image_url,
        businessSlug: item.businessSlug,
        businessName: item.businessName,
      })
      if (item.quantity > 1) {
        for (let q = 1; q < item.quantity; q++) {
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
    }
    setReloadedTripId(trip.id)
    setTimeout(() => {
      setReloadedTripId(null)
      router.push('/cart')
    }, 1200)
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen px-5 pt-3 pb-8 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--lime-dark)]">
            Activity & Memory
          </p>
          <h1 className="mt-0.5 text-2xl font-black tracking-tight text-foreground">
            Shopping History
          </h1>
        </div>

        {activeTab === 'scans' && history.length > 0 && (
          <button
            id="clear-history-btn"
            onClick={handleClearHistory}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 transition-colors hover:text-destructive"
          >
            <Trash2 size={14} />
            Clear Scans
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 rounded-2xl border border-gray-100 bg-slate-100/70 p-1 dark:border-zinc-800 dark:bg-zinc-900">
        <button
          type="button"
          id="tab-saved-trips"
          onClick={() => setActiveTab('trips')}
          className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-extrabold transition-all ${
            activeTab === 'trips'
              ? 'bg-white text-slate-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100'
              : 'text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200'
          }`}
        >
          <BookmarkPlus size={15} className={activeTab === 'trips' ? 'text-[var(--lime-dark)]' : ''} />
          <span>Saved Trips ({savedTrips.length})</span>
        </button>

        <button
          type="button"
          id="tab-scanned-items"
          onClick={() => setActiveTab('scans')}
          className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-extrabold transition-all ${
            activeTab === 'scans'
              ? 'bg-white text-slate-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100'
              : 'text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200'
          }`}
        >
          <Clock size={15} className={activeTab === 'scans' ? 'text-[var(--lime-dark)]' : ''} />
          <span>Scanned Items ({history.length})</span>
        </button>
      </div>

      {/* TAB 1: SAVED TRIPS & LISTS */}
      {activeTab === 'trips' && (
        <>
          {savedTrips.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-zinc-800 text-slate-400">
                <BookmarkPlus size={32} />
              </div>
              <p className="mt-4 font-extrabold text-foreground text-base">No saved trips yet</p>
              <p className="mt-1 text-xs text-muted-foreground max-w-xs leading-relaxed">
                Save your active Price List on the List screen to reload or re-use it on your next store visit.
              </p>
              <Link
                href="/cart"
                className="mt-5 flex items-center gap-2 rounded-2xl bg-[var(--lime-base)] px-6 py-3 text-xs font-extrabold text-black shadow-md shadow-[var(--lime-base)]/25"
              >
                Go to My Price List <ArrowRight size={15} />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {savedTrips.map((trip) => {
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
                    className="cursor-pointer rounded-3xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:border-gray-200 dark:border-zinc-800 dark:bg-zinc-900 space-y-3"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="truncate font-extrabold text-sm text-slate-900 dark:text-zinc-100">
                            {trip.title}
                          </h3>
                          <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-extrabold uppercase text-slate-500 dark:bg-zinc-800 dark:text-zinc-400">
                            {trip.items.length} items
                          </span>
                        </div>
                        <p className="mt-1 text-[11px] text-slate-400 dark:text-zinc-500">
                          {storeNames.join(' · ')} · {dateFormatted}
                        </p>
                      </div>

                      <p className="text-sm font-black text-[var(--lime-dark)] shrink-0">
                        ₦{trip.total.toLocaleString()}
                      </p>
                    </div>

                    {/* Actions Row */}
                    <div className="flex items-center justify-between border-t border-gray-50 pt-3 dark:border-zinc-800/60">
                      <button
                        type="button"
                        onClick={(e) => handleReloadTrip(trip, e)}
                        className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-black transition-all active:scale-95 ${
                          isReloaded
                            ? 'bg-[var(--lime-dark)] text-black'
                            : 'bg-[var(--lime-base)] text-black shadow-sm'
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
                        <span className="text-[10px] font-bold text-slate-400">
                          {isExpanded ? 'Hide items ▲' : 'View items ▼'}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteTrip(trip.id, e)}
                          title="Delete saved trip"
                          className="text-slate-300 hover:text-destructive dark:text-zinc-600 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Expandable Items List */}
                    {isExpanded && (
                      <div className="mt-3 divide-y divide-gray-50 rounded-2xl border border-gray-100 bg-slate-50 p-3 dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-800/50 space-y-2">
                        {trip.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between pt-1.5 text-xs">
                            <div className="min-w-0 flex-1 pr-2">
                              <p className="truncate font-bold text-slate-800 dark:text-zinc-200">
                                {item.name} <span className="text-slate-400">(x{item.quantity})</span>
                              </p>
                              <p className="text-[10px] text-slate-400">{item.businessName}</p>
                            </div>
                            {item.base_price !== null && (
                              <span className="font-extrabold text-slate-700 dark:text-zinc-300 shrink-0">
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
          {history.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <Clock size={44} className="text-muted-foreground" />
              <p className="mt-4 font-extrabold text-foreground text-base">No scan history yet</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Products you view or scan will appear here automatically
              </p>
              <Link
                href="/scan"
                className="mt-5 flex items-center gap-2 rounded-2xl bg-[var(--lime-base)] px-6 py-3 text-xs font-extrabold text-black shadow-md shadow-[var(--lime-base)]/25"
              >
                <ScanLine size={16} />
                Scan Product QR
              </Link>
            </div>
          ) : (
            <div className="space-y-2.5">
              {history.map((item) => (
                <Link
                  key={`${item.id}-${item.viewedAt}`}
                  href={`/s/${item.businessSlug}/${item.id}`}
                  id={`history-${item.id}`}
                  className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm transition-all hover:border-[var(--lime-base)]/50 active:scale-[0.99] dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-50 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-800">
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-400">
                        <Package size={20} />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-extrabold text-slate-900 dark:text-zinc-100">
                      {item.name}
                    </p>
                    <p className="mt-0.5 truncate text-[11px] font-medium text-slate-400 dark:text-zinc-500">
                      {item.businessName}
                    </p>
                    <div className="mt-1 flex items-center justify-between">
                      {item.base_price !== null ? (
                        <p className="text-xs font-black text-[var(--lime-dark)]">
                          ₦{item.base_price.toLocaleString()}
                        </p>
                      ) : (
                        <p className="text-[10px] text-muted-foreground">Price on request</p>
                      )}
                      <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500">
                        {timeAgo(item.viewedAt)}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="shrink-0 text-slate-300 dark:text-zinc-600" />
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
