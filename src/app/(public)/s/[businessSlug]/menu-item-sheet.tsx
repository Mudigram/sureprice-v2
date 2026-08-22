'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import {
  Utensils,
  Minus,
  Plus,
  ClipboardList,
  ClipboardCheck,
  CheckCircle2,
  Share2,
  Tag,
  ExternalLink,
  Ticket,
  ShoppingBag,
} from 'lucide-react'
import { BottomSheet } from '@/components/ui/bottom-sheet'
import { useCart } from '@/context/CartContext'
import type { StorefrontItem, StorefrontBusiness } from '@/features/storefront/types'
import { getCategorySvgIcon } from '@/components/icons'

interface Props {
  item: StorefrontItem | null
  business: StorefrontBusiness
  businessSlug: string
  open: boolean
  onClose: () => void
}

export function MenuItemSheet({ item, business, businessSlug, open, onClose }: Props) {
  const [quantity, setQuantity] = useState(1)
  const [noted, setNoted] = useState(false)
  const { addItem, isInList } = useCart()

  if (!item) return null

  const alreadyNoted = isInList(item.id)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''

  const resolveUrl = (path: string) =>
    path.startsWith('http') ? path : `${supabaseUrl}/storage/v1/object/public/catalog-media/${path}`

  // Parse attributes
  const attributes: { key: string; value: string }[] = (() => {
    if (!item.attributes || typeof item.attributes !== 'object' || Array.isArray(item.attributes)) return []
    return Object.entries(item.attributes as Record<string, string>).map(([key, value]) => ({ key, value }))
  })()

  const handleNotePrice = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: item.id,
        name: item.name,
        base_price: item.base_price,
        image_url: item.image_url,
        businessSlug,
        businessName: business.name,
      })
    }
    setNoted(true)
    setTimeout(() => {
      setNoted(false)
      onClose()
    }, 1200)
  }

  const handleShare = async () => {
    const url = `${window.location.origin}/s/${businessSlug}/${item.id}`
    const title = `${item.name} at ${business.name}`
    const text = item.base_price
      ? `Check price for ${item.name} (₦${item.base_price.toLocaleString()}) at ${business.name}`
      : title

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url })
      } catch {
        // Dismissed
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${title} - ${url}`)
      } catch {
        // Fallback
      }
    }
  }

  const isRestaurant = business.business_type === 'restaurant' || business.business_type === 'cafe'
  const isEvent = business.business_type === 'popup_vendor' || business.business_type === 'event_vendor'

  const itemTypeLabel = isRestaurant ? 'Digital Menu Item' : isEvent ? 'Event Stall Item' : 'Verified Shelf Item'
  const ItemTypeIcon = isRestaurant ? Utensils : isEvent ? Ticket : ShoppingBag
  const priceLabel = isRestaurant ? 'Verified Menu Price' : 'Verified In-Store Price'

  return (
    <BottomSheet open={open} onClose={onClose}>
      <div className="space-y-4 pb-2">
        {/* Hero Image / Ambient Fallback */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-slate-950/30 border border-gray-200 dark:border-zinc-800">
          {item.image_url ? (
            <Image
              src={resolveUrl(item.image_url)}
              alt={item.name}
              fill
              className="object-cover"
              sizes="(max-width: 448px) 100vw, 448px"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center p-4 text-center">
              <div className="p-3 rounded-2xl bg-slate-900/40 backdrop-blur-sm border border-white/10 text-[var(--lime-base)] shadow-md">
                {getCategorySvgIcon(item.category?.name ?? item.name, { size: 40 })}
              </div>
              <span className="mt-2 text-xs font-bold text-slate-400 dark:text-zinc-400 opacity-80 uppercase tracking-wide">
                {item.category?.name ?? 'Catalog Item'}
              </span>
            </div>
          )}
        </div>

        {/* Badge + Share Row */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-900 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900">
            <ItemTypeIcon size={13} />
            {itemTypeLabel}
          </span>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-bold text-slate-700 shadow-sm transition-all hover:border-gray-300 active:scale-95 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
          >
            <Share2 size={13} />
            <span>Share</span>
          </button>
        </div>

        {/* Title & Category */}
        <div>
          <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-zinc-100">
            {item.name}
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
            <span className="font-bold text-slate-800 dark:text-zinc-200">{business.name}</span>
            {item.category && (
              <>
                <span>·</span>
                <span className="inline-flex items-center gap-1 font-semibold">
                  <Tag size={12} />
                  {item.category.name}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Price Box */}
        <div className="flex items-center justify-between rounded-2xl border border-gray-200/80 bg-slate-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div>
            <p className="text-xs font-bold text-slate-500 dark:text-zinc-400">
              {priceLabel}
            </p>
            {item.base_price !== null ? (
              <p className="text-3xl font-black text-slate-900 dark:text-zinc-100 mt-0.5">
                ₦{item.base_price.toLocaleString()}
              </p>
            ) : (
              <p className="text-lg font-bold text-slate-500">Price on request</p>
            )}
          </div>
          <span className="flex h-3 w-3 rounded-full bg-[var(--lime-base)] shadow-[0_0_8px_var(--lime-base)]" />
        </div>

        {/* Description */}
        {item.description && (
          <div className="space-y-1">
            <h4 className="text-sm font-black text-slate-900 dark:text-zinc-100">
              About this dish
            </h4>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-zinc-300">
              {item.description}
            </p>
          </div>
        )}

        {/* Attributes / Ingredients */}
        {attributes.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-black text-slate-900 dark:text-zinc-100">
              Ingredients & Details
            </h4>
            <div className="divide-y divide-gray-100 rounded-2xl border border-gray-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
              {attributes.map(({ key, value }) => (
                <div key={key} className="flex items-baseline justify-between px-4 py-3 text-xs">
                  <span className="font-medium text-slate-500 dark:text-zinc-400">{key}</span>
                  <span className="font-bold text-slate-900 dark:text-zinc-100">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* See Full Details Link */}
        <Link
          href={`/s/${businessSlug}/${item.id}`}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-700 transition-all hover:border-gray-300 active:scale-[0.98] dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
          onClick={onClose}
        >
          <ExternalLink size={13} />
          See Full Details & Photo Gallery
        </Link>

        {/* Quantity + Note CTA */}
        <div className="flex items-center gap-3 pt-1">
          <div className="flex h-14 items-center gap-4 rounded-2xl border border-gray-200 bg-white px-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="text-slate-500 hover:text-red-500 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus size={18} />
            </button>
            <span className="w-5 text-center font-black text-lg text-slate-900 dark:text-zinc-100">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="text-slate-500 hover:text-slate-900 dark:hover:text-zinc-100 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus size={18} />
            </button>
          </div>

          <button
            type="button"
            onClick={handleNotePrice}
            disabled={alreadyNoted}
            className={`flex flex-1 items-center justify-center gap-2 rounded-2xl py-4 text-sm font-black shadow-md transition-all active:scale-95 ${
              alreadyNoted || noted
                ? 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                : 'bg-[var(--lime-base)] text-black shadow-[var(--lime-base)]/25 hover:bg-[var(--lime-dark)]'
            }`}
          >
            {alreadyNoted ? (
              <>
                <ClipboardCheck size={18} />
                Price Noted
              </>
            ) : noted ? (
              <>
                <CheckCircle2 size={18} />
                Added!
              </>
            ) : (
              <>
                <ClipboardList size={18} />
                Note Menu Price
              </>
            )}
          </button>
        </div>
      </div>
    </BottomSheet>
  )
}
