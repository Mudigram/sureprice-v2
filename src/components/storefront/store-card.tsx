'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  Store as StoreIcon,
  Utensils,
  Ticket,
  ShoppingBag,
  MapPin,
  ChevronRight,
  Clock,
  CheckCircle2,
} from 'lucide-react'
import { computeIsOpen, type StorefrontBusiness } from '@/features/storefront/types'

interface StoreCardProps {
  business: StorefrontBusiness
  className?: string
}

export function StoreCard({ business, className }: StoreCardProps) {
  const logoUrl = business.storefront?.logo_url
  const primaryLocation = business.locations?.[0]
  const addressText = primaryLocation?.address_text ?? primaryLocation?.name ?? 'Nigeria'

  const hours = primaryLocation?.location_hours
  const { isOpen, text: statusText } = computeIsOpen(hours)

  const isRestaurant = business.business_type === 'restaurant' || business.business_type === 'cafe'
  const isEvent = business.business_type === 'popup_vendor' || business.business_type === 'event_vendor'

  // Dynamic visual themes per business type
  const theme = isRestaurant
    ? {
        borderTop: 'border-t-amber-500',
        badgeBg: 'bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900',
        typeLabel: isRestaurant && business.business_type === 'cafe' ? 'Café & Bakery' : 'Restaurant & Dining',
        icon: Utensils,
        tagline: 'Digital Menu & Table QR',
        cta: 'View Menu',
        ctaColor: 'text-amber-700 dark:text-amber-400',
      }
    : isEvent
    ? {
        borderTop: 'border-t-purple-500',
        badgeBg: 'bg-purple-100 text-purple-900 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-900',
        typeLabel: 'Live Event Stall',
        icon: Ticket,
        tagline: 'Event Vendor Stand',
        cta: 'View Stall',
        ctaColor: 'text-purple-700 dark:text-purple-400',
      }
    : {
        borderTop: 'border-t-[var(--lime-base)]',
        badgeBg: 'bg-green-100 text-green-900 border-green-200 dark:bg-green-950/60 dark:text-green-300 dark:border-green-900',
        typeLabel: 'Supermarket & Retail',
        icon: ShoppingBag,
        tagline: 'Shelf Tag Directory',
        cta: 'Browse Shelf Tags',
        ctaColor: 'text-[var(--lime-dark)]',
      }

  const TypeIcon = theme.icon

  return (
    <Link
      href={`/s/${business.slug}`}
      id={`store-card-${business.id}`}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-gray-100 border-t-4 ${theme.borderTop} bg-white p-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] dark:border-zinc-800 dark:bg-zinc-900 ${
        className || 'min-w-[260px] max-w-[260px]'
      }`}
    >
      <div>
        {/* Top Header: Logo + Type Badge */}
        <div className="mb-3 flex items-start justify-between gap-2">
          {/* Store Logo */}
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl border border-gray-100 bg-slate-50 shadow-inner dark:border-zinc-800 dark:bg-zinc-800">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={business.name}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="48px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-400">
                <TypeIcon size={20} />
              </div>
            )}
          </div>

          {/* Badges */}
          <div className="flex flex-col items-end gap-1 shrink-0">
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide ${theme.badgeBg}`}
            >
              <TypeIcon size={10} />
              {theme.typeLabel}
            </span>

            <span
              className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                isOpen
                  ? 'bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-400'
                  : 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400'
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${isOpen ? 'bg-green-500' : 'bg-red-500'}`} />
              {statusText}
            </span>
          </div>
        </div>

        {/* Business Name */}
        <h3 className="mb-1 truncate text-sm font-black text-slate-900 dark:text-zinc-100 group-hover:text-[var(--lime-dark)] transition-colors">
          {business.name}
        </h3>

        {/* Address */}
        <p className="flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-zinc-400 line-clamp-1">
          <MapPin size={12} className="shrink-0 text-slate-400" />
          <span className="truncate">{addressText}</span>
        </p>
      </div>

      {/* Footer CTA & Tagline */}
      <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-2.5 dark:border-zinc-800/60">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
          {theme.tagline}
        </span>

        <span className={`flex items-center gap-0.5 text-xs font-black ${theme.ctaColor}`}>
          <span>{theme.cta}</span>
          <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  )
}
