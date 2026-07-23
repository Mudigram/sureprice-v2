'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Store as StoreIcon } from 'lucide-react'
import { computeIsOpen, type StorefrontBusiness } from '@/features/storefront/types'

const TYPE_LABELS: Record<string, string> = {
  retail: 'Supermarket',
  restaurant: 'Restaurant',
  cafe: 'Café',
  popup_vendor: 'Pop-up Vendor',
  event_vendor: 'Event Vendor',
}

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

  return (
    <Link
      href={`/s/${business.slug}`}
      id={`store-card-${business.id}`}
      className={`flex flex-col rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-transform active:scale-95 dark:border-zinc-800 dark:bg-zinc-900 ${
        className || 'min-w-[260px] max-w-[260px]'
      }`}
    >
      <div className="mb-3 flex items-start justify-between">
        {/* Store Logo */}
        <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-gray-50 bg-slate-50 dark:border-zinc-800 dark:bg-zinc-800">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={business.name}
              fill
              className="object-cover"
              sizes="48px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-400">
              <StoreIcon size={20} />
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="flex flex-col items-end gap-1.5">
          <span className="rounded-md bg-blue-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
            {TYPE_LABELS[business.business_type] ?? business.business_type.replace(/_/g, ' ')}
          </span>
          <span
            className={`rounded border px-1.5 py-0.5 text-[9px] font-black uppercase tracking-tighter ${
              isOpen
                ? 'border-green-100 bg-green-50 text-green-600 dark:border-green-900/50 dark:bg-green-950/50 dark:text-green-400'
                : 'border-red-100 bg-red-50 text-red-600 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-400'
            }`}
          >
            {statusText}
          </span>
        </div>
      </div>

      <h3 className="mb-1 truncate font-bold text-slate-800 dark:text-zinc-100">
        {business.name}
      </h3>

      <p className="line-clamp-1 text-xs text-slate-500 dark:text-zinc-400">
        {addressText}
      </p>
    </Link>
  )
}
