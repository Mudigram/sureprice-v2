'use client'

import { useState } from 'react'
import Link from 'next/link'
import { StoreCard } from '@/components/storefront/store-card'
import type { StorefrontBusiness } from '@/features/storefront/types'

const HOME_STORE_FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Retail', value: 'retail' },
  { label: 'Restaurants', value: 'restaurant' },
  { label: 'Cafés', value: 'cafe' },
  { label: 'Pop-ups', value: 'popup_vendor' },
] as const

interface HomeStoresSectionProps {
  businesses: StorefrontBusiness[]
}

export function HomeStoresSection({ businesses }: HomeStoresSectionProps) {
  const [selectedFilter, setSelectedFilter] = useState<string>('all')

  const filtered = businesses.filter((b) => {
    if (selectedFilter === 'all') return true
    if (selectedFilter === 'popup_vendor') {
      return b.business_type === 'popup_vendor' || b.business_type === 'event_vendor'
    }
    return b.business_type === selectedFilter
  })

  return (
    <section className="space-y-3">
      {/* Header & Filter Pills */}
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-800 dark:text-zinc-200">
          Partner Stores & Venues
        </h2>
        <Link
          href="/stores"
          className="text-xs font-bold text-[var(--lime-dark)] transition-opacity hover:opacity-70"
        >
          View All ({businesses.length})
        </Link>
      </div>

      {/* Quick Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {HOME_STORE_FILTERS.map((filter) => {
          const isSelected = selectedFilter === filter.value
          return (
            <button
              key={filter.value}
              id={`home-filter-${filter.value}`}
              onClick={() => setSelectedFilter(filter.value)}
              className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-[11px] font-extrabold transition-all active:scale-95 ${
                isSelected
                  ? 'bg-[var(--lime-base)] text-black shadow-sm'
                  : 'border border-gray-200 bg-white text-slate-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400'
              }`}
            >
              {filter.label}
            </button>
          )
        })}
      </div>

      {/* Store Horizontal Scroll */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 py-8 text-center dark:border-zinc-800">
          <p className="text-xs font-bold text-slate-500 dark:text-zinc-400">
            No stores found in this category
          </p>
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-3 no-scrollbar scroll-smooth">
          {filtered.map((biz) => (
            <StoreCard key={biz.id} business={biz} />
          ))}
        </div>
      )}
    </section>
  )
}
