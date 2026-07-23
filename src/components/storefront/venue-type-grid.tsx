'use client'

import Link from 'next/link'
import { ShoppingBag, Utensils, Coffee, Ticket } from 'lucide-react'

const VENUE_TYPES = [
  {
    name: 'Retail & Stores',
    slug: 'retail',
    subtitle: 'Shelf tags & prices',
    icon: ShoppingBag,
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400',
  },
  {
    name: 'Restaurants',
    slug: 'restaurant',
    subtitle: 'Digital menus',
    icon: Utensils,
    color: 'bg-orange-100 text-orange-600 dark:bg-orange-950/60 dark:text-orange-400',
  },
  {
    name: 'Cafés & Bakery',
    slug: 'cafe',
    subtitle: 'Counter items & drinks',
    icon: Coffee,
    color: 'bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
  },
  {
    name: 'Pop-ups & Events',
    slug: 'popup_vendor',
    subtitle: 'Event vendor pricing',
    icon: Ticket,
    color: 'bg-purple-100 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400',
  },
]

export function VenueTypeGrid() {
  return (
    <section className="w-full space-y-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-800 dark:text-zinc-200">
          Browse by Venue Type
        </h2>
        <span className="text-[11px] font-bold text-muted-foreground">Multi-Business</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {VENUE_TYPES.map((venue) => {
          const Icon = venue.icon
          return (
            <Link
              key={venue.slug}
              href={`/stores?type=${venue.slug}`}
              id={`venue-card-${venue.slug}`}
              className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3.5 shadow-sm transition-all hover:border-[var(--lime-base)]/50 active:scale-95 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${venue.color}`}
              >
                <Icon size={22} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-extrabold text-slate-900 dark:text-zinc-100">
                  {venue.name}
                </p>
                <p className="truncate text-[10px] font-medium text-slate-400 dark:text-zinc-500">
                  {venue.subtitle}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
