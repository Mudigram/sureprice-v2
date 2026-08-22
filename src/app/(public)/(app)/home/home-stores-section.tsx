'use client'

import { useState } from 'react'
import Link from 'next/link'
import { StoreCard } from '@/components/storefront/store-card'
import type { StorefrontBusiness } from '@/features/storefront/types'

const HOME_STORE_FILTERS = [
  { label: 'All Stores', value: 'all' },
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
    <section className="space-y-3.5">
      {/* Header & View All Link */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-black tracking-tight text-slate-900">
          Partner Stores & Venues
        </h2>
        <Link
          href="/stores"
          className="text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
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
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-extrabold transition-all active:scale-95 ${
                isSelected
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              {filter.label}
            </button>
          )
        })}
      </div>

      {/* Store Horizontal Scroll */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white py-10 text-center">
          <p className="text-xs font-bold text-slate-500">
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
