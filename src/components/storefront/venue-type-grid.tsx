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
    <section className="w-full space-y-2.5">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
          Browse Venue Categories
        </h2>
        <Link href="/stores" className="text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
          All Directories →
        </Link>
      </div>

      <div className="flex gap-2.5 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
        {VENUE_TYPES.map((venue) => {
          const Icon = venue.icon
          return (
            <Link
              key={venue.slug}
              href={`/stores?type=${venue.slug}`}
              id={`venue-card-${venue.slug}`}
              className="flex shrink-0 items-center gap-2.5 rounded-2xl border border-slate-200/80 bg-white px-3.5 py-2.5 shadow-sm transition-all hover:border-slate-300 hover:shadow-md active:scale-95 dark:border-slate-800 dark:bg-slate-900"
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${venue.color}`}
              >
                <Icon size={16} />
              </div>
              <div className="min-w-0">
                <p className="whitespace-nowrap text-xs font-black text-slate-900 dark:text-white">
                  {venue.name}
                </p>
                <p className="whitespace-nowrap text-[10px] font-medium text-slate-400 dark:text-slate-500">
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
