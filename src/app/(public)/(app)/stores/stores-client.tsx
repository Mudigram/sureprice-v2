'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Store as StoreIcon, Search } from 'lucide-react'
import { StoreCard } from '@/components/storefront/store-card'
import type { StorefrontBusiness } from '@/features/storefront/types'

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

  const [search, setSearch] = useState('')
  const [selectedType, setSelectedType] = useState<string>(initialType)

  useEffect(() => {
    const param = searchParams.get('type')
    if (param) setSelectedType(param)
  }, [searchParams])

  const filtered = businesses.filter((b) => {
    const matchesSearch =
      !search ||
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.business_type.toLowerCase().includes(search.toLowerCase()) ||
      b.locations?.[0]?.address_text?.toLowerCase().includes(search.toLowerCase())

    const matchesType =
      selectedType === 'all' ||
      b.business_type === selectedType ||
      (selectedType === 'popup_vendor' && (b.business_type === 'popup_vendor' || b.business_type === 'event_vendor'))

    return matchesSearch && matchesType
  })

  const currentLabel = VENUE_FILTERS.find((f) => f.value === selectedType)?.label ?? 'All Businesses'

  return (
    <div className="flex w-full flex-col gap-4">
      {/* Sticky Search + Glassmorphism Filter Bar */}
      <div className="sticky top-14 z-30 -mx-5 space-y-3 bg-background/85 px-5 py-2 backdrop-blur-md">
        {/* Search Input */}
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-green-700 dark:text-green-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by store name, menu item or location…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="store-search-input"
            className="h-12 w-full rounded-2xl border border-green-200/80 bg-green-100/50 pl-11 pr-4 text-xs font-semibold text-slate-800 placeholder:text-green-600/80 focus:outline-none focus:ring-2 focus:ring-[var(--lime-base)] dark:border-green-900/50 dark:bg-green-950/30 dark:text-zinc-100 dark:placeholder:text-green-500"
          />
        </div>

        {/* Glassmorphism Venue Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {VENUE_FILTERS.map((filter) => {
            const isSelected = selectedType === filter.value
            return (
              <button
                key={filter.value}
                id={`filter-${filter.value}`}
                onClick={() => setSelectedType(filter.value)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-extrabold transition-all active:scale-95 ${
                  isSelected
                    ? 'bg-[var(--lime-base)] text-black shadow-md shadow-[var(--lime-base)]/25'
                    : 'border border-gray-200/80 bg-white/75 text-slate-600 backdrop-blur-md hover:border-slate-300 dark:border-zinc-800 dark:bg-zinc-900/75 dark:text-zinc-400'
                }`}
              >
                {filter.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between px-1 pt-1">
        <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-zinc-100">
          {selectedType === 'all' ? 'All Businesses' : currentLabel}
        </h2>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:bg-zinc-800 dark:text-zinc-400">
          {filtered.length} {filtered.length === 1 ? 'Location' : 'Locations'}
        </span>
      </div>

      {/* Store list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 py-16 text-center dark:border-zinc-800">
          <StoreIcon size={36} className="text-slate-400" />
          <p className="mt-3 text-base font-extrabold text-slate-900 dark:text-zinc-100">
            No matching businesses found
          </p>
          <p className="mt-1 text-xs text-slate-400 dark:text-zinc-400">
            Try adjusting your search terms or filter selection
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((biz) => (
            <StoreCard key={biz.id} business={biz} className="w-full max-w-none" />
          ))}
        </div>
      )}
    </div>
  )
}
