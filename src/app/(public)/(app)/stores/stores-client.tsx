'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Store as StoreIcon, Search, Clock, RotateCcw } from 'lucide-react'
import { StoreCard } from '@/components/storefront/store-card'
import { computeIsOpen, type StorefrontBusiness } from '@/features/storefront/types'

const VENUE_FILTERS = [
  { label: 'All Businesses', value: 'all' },
  { label: 'Retail & Stores', value: 'retail' },
  { label: 'Restaurants', value: 'restaurant' },
  { label: 'Cafés & Bakery', value: 'cafe' },
  { label: 'Pop-ups & Events', value: 'popup_vendor' },
] as const

interface StoresClientProps {
  businesses: StorefrontBusiness[]
}

export function StoresClient({ businesses }: StoresClientProps) {
  const searchParams = useSearchParams()
  const initialType = searchParams.get('type') ?? 'all'
  const initialQuery = searchParams.get('q') ?? searchParams.get('search') ?? ''
  const initialArea = searchParams.get('area') ?? ''

  const [search, setSearch] = useState(initialQuery)
  const [selectedType, setSelectedType] = useState<string>(initialType)
  const [selectedArea, setSelectedArea] = useState<string>(initialArea)
  const [openOnly, setOpenOnly] = useState<boolean>(false)

  useEffect(() => {
    const typeParam = searchParams.get('type')
    if (typeParam) setSelectedType(typeParam)

    const qParam = searchParams.get('q') ?? searchParams.get('search')
    if (qParam !== null) setSearch(qParam)

    const areaParam = searchParams.get('area')
    if (areaParam !== null) setSelectedArea(areaParam)
  }, [searchParams])

  const filtered = businesses.filter((b) => {
    const matchesSearch =
      !search ||
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.business_type.toLowerCase().includes(search.toLowerCase()) ||
      b.locations?.[0]?.address_text?.toLowerCase().includes(search.toLowerCase())

    const matchesArea =
      !selectedArea ||
      selectedArea === 'all' ||
      b.locations?.[0]?.address_text?.toLowerCase().includes(selectedArea.replace(/_/g, ' ').toLowerCase()) ||
      b.locations?.[0]?.name?.toLowerCase().includes(selectedArea.replace(/_/g, ' ').toLowerCase())

    const matchesType =
      selectedType === 'all' ||
      b.business_type === selectedType ||
      (selectedType === 'popup_vendor' && (b.business_type === 'popup_vendor' || b.business_type === 'event_vendor'))

    const primaryLocation = b.locations?.[0]
    const hours = primaryLocation?.location_hours
    const { isOpen } = computeIsOpen(hours)
    const matchesOpen = !openOnly || isOpen

    return matchesSearch && matchesArea && matchesType && matchesOpen
  })

  const currentLabel = VENUE_FILTERS.find((f) => f.value === selectedType)?.label ?? 'All Businesses'

  const handleResetFilters = () => {
    setSearch('')
    setSelectedType('all')
    setSelectedArea('')
    setOpenOnly(false)
  }

  return (
    <div className="flex w-full flex-col gap-3.5">
      {/* Sticky Search + Glassmorphism Filter Bar */}
      <div className="sticky top-14 z-30 -mx-5 space-y-3 bg-slate-50/90 dark:bg-slate-950/85 px-5 py-3 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/60 shadow-sm">
        {/* Search Input */}
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by store name, venue type or location…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="store-search-input"
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/90 pl-11 pr-4 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[var(--lime-base)] focus:outline-none focus:ring-1 focus:ring-[var(--lime-base)] shadow-sm transition-all"
          />
        </div>

        {/* Venue Filter Pills + Open Now Toggle */}
        <div className="relative">
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar pr-6">
            {/* Open Now Toggle Chip */}
            <button
              id="filter-open-now"
              onClick={() => setOpenOnly(!openOnly)}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2 text-xs font-extrabold transition-all active:scale-95 border ${
                openOnly
                  ? 'bg-emerald-500/15 text-emerald-700 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/40 shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${openOnly ? 'bg-emerald-500 dark:bg-emerald-400 animate-pulse' : 'bg-slate-400'}`} />
              Open Now
            </button>

            {/* Category Filter Pills */}
            {VENUE_FILTERS.map((filter) => {
              const isSelected = selectedType === filter.value
              return (
                <button
                  key={filter.value}
                  id={`filter-${filter.value}`}
                  onClick={() => setSelectedType(filter.value)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-extrabold transition-all active:scale-95 border ${
                    isSelected
                      ? 'bg-[var(--lime-base)] text-black border-[var(--lime-base)] shadow-md shadow-[var(--lime-base)]/25'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {filter.label}
                </button>
              )
            })}
          </div>

          {/* Right Scroll Indicator Gradient Mask */}
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-slate-50 dark:from-slate-950 to-transparent" />
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between px-1 pt-1">
        <div>
          <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
            {selectedType === 'all' ? 'All Businesses' : currentLabel}
          </h2>
          {openOnly && (
            <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              Showing open locations only
            </p>
          )}
        </div>
        <span className="rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-[var(--lime-base)] shadow-sm">
          {filtered.length} {filtered.length === 1 ? 'Location' : 'Locations'}
        </span>
      </div>

      {/* Store list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-8 text-center my-4 shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-800 mb-3">
            <StoreIcon size={28} />
          </div>
          <p className="text-base font-extrabold text-slate-900 dark:text-white">
            No matching stores found
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-xs">
            Try adjusting your search terms or turning off the "Open Now" filter.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-4 flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 px-4 py-2 text-xs font-extrabold text-slate-700 dark:text-white transition-all hover:bg-slate-200 dark:hover:bg-slate-800 active:scale-95"
          >
            <RotateCcw size={13} />
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((biz) => (
            <StoreCard key={biz.id} business={biz} className="w-full max-w-none" />
          ))}
        </div>
      )}
    </div>
  )
}


