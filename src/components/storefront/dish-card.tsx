'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  Plus,
  Minus,
  Trash2,
  Utensils,
  Star,
  Clock,
  ClipboardList,
  CheckCircle2,
} from 'lucide-react'
import type { StorefrontItem } from '@/features/storefront/types'
import { useCart } from '@/context/CartContext'
import { getCategorySvgIcon } from '@/components/icons'

interface DishCardProps {
  product: StorefrontItem
  businessSlug: string
  businessName: string
  onOpenSheet?: () => void
}

export function DishCard({
  product,
  businessSlug,
  businessName,
  onOpenSheet,
}: DishCardProps) {
  const { addItem, removeItem, updateQuantity, isInList, getQuantity } = useCart()

  const inList = isInList(product.id)
  const quantity = getQuantity(product.id)

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const resolveUrl = (path: string | null | undefined): string => {
    if (!path) return ''
    if (path.startsWith('http://') || path.startsWith('https://')) return path
    const cleanPath = path.startsWith('/') ? path.slice(1) : path
    if (cleanPath.startsWith('storage/v1/object/public/')) {
      return `${supabaseUrl}/${cleanPath}`
    }
    return `${supabaseUrl}/storage/v1/object/public/catalog-media/${cleanPath}`
  }

  const imageUrl = product.image_url ? resolveUrl(product.image_url) : null

  const handleToggleCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (inList) {
      removeItem(product.id)
    } else {
      addItem({
        id: product.id,
        name: product.name,
        base_price: product.base_price,
        image_url: product.image_url,
        businessSlug,
        businessName,
      })
    }
  }

  const handleQtyChange = (e: React.MouseEvent, newQty: number) => {
    e.stopPropagation()
    if (newQty <= 0) {
      removeItem(product.id)
    } else {
      updateQuantity(product.id, newQty)
    }
  }

  // Parse attributes for dietary, bestseller, prep time, freshness, or scarcity tags
  const attributes = product.attributes && typeof product.attributes === 'object' && !Array.isArray(product.attributes)
    ? (product.attributes as Record<string, string>)
    : {}

  const spicyTag = attributes.spicy || attributes.Spicy || attributes.spice
  const vegTag = attributes.vegetarian || attributes.veg || attributes.Dietary === 'Vegetarian'
  const halalTag = attributes.halal || attributes.Halal
  const bestsellerTag = attributes.bestseller || attributes.popular || attributes.favorite || attributes.recommended
  const prepTimeTag = attributes.prep_time || attributes.time || attributes.wait_time
  const limitedTag = attributes.limited || attributes.batch || attributes.event_exclusive

  return (
    <div
      onClick={onOpenSheet}
      className={`group relative flex flex-row items-center gap-3.5 overflow-hidden rounded-2xl border p-3 shadow-md backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl cursor-pointer active:scale-[0.98] ${
        inList
          ? 'border-emerald-500/50 bg-emerald-950/30 dark:border-emerald-500/40 dark:bg-emerald-950/40 shadow-emerald-500/5'
          : 'border-slate-200/90 bg-white/95 hover:border-slate-300 dark:border-slate-800/90 dark:bg-slate-900/90 dark:hover:border-slate-700/90'
      }`}
    >
      {/* Left Food Image Container */}
      <div className="relative h-28 w-28 sm:w-36 shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-200/80 dark:bg-slate-950 dark:border-slate-800">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 112px, 144px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-500/15 via-slate-900/40 to-slate-950 text-amber-500 dark:text-amber-400">
            {getCategorySvgIcon(product.category?.name ?? product.name, { size: 36 })}
          </div>
        )}

        {/* Psychological Badges (Dietary, Bestseller, Urgency, Prep Time) over image */}
        <div className="absolute left-1.5 top-1.5 z-10 flex flex-wrap gap-1">
          {bestsellerTag && (
            <span className="rounded-full bg-amber-500/95 px-1.5 py-0.5 text-[8px] font-black text-black backdrop-blur-md shadow-sm border border-amber-300/40">
              ⭐ Bestseller
            </span>
          )}
          {limitedTag && (
            <span className="rounded-full bg-purple-600/90 px-1.5 py-0.5 text-[8px] font-black text-white backdrop-blur-md shadow-sm border border-purple-400/30">
              🎪 Limited
            </span>
          )}
          {prepTimeTag && (
            <span className="rounded-full bg-slate-950/80 px-1.5 py-0.5 text-[8px] font-black text-white backdrop-blur-md shadow-sm border border-white/20">
              ⏱️ {prepTimeTag}
            </span>
          )}
          {spicyTag && (
            <span className="rounded-full bg-rose-500/90 px-1.5 py-0.5 text-[8px] font-black text-white backdrop-blur-md shadow-sm border border-rose-400/30">
              🌶️ Spicy
            </span>
          )}
          {vegTag && (
            <span className="rounded-full bg-emerald-500/90 px-1.5 py-0.5 text-[8px] font-black text-white backdrop-blur-md shadow-sm border border-emerald-400/30">
              🌱 Veg
            </span>
          )}
          {halalTag && (
            <span className="rounded-full bg-amber-500/90 px-1.5 py-0.5 text-[8px] font-black text-white backdrop-blur-md shadow-sm border border-amber-400/30">
              Halal
            </span>
          )}
        </div>
      </div>

      {/* Right Content Column */}
      <div className="flex min-w-0 flex-1 flex-col justify-between self-stretch py-0.5">
        <div>
          {/* Dish Title */}
          <Link
            href={`/s/${businessSlug}/${product.id}`}
            onClick={(e) => e.stopPropagation()}
            className="truncate text-sm sm:text-base font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-[var(--lime-base)] transition-colors block"
          >
            {product.name}
          </Link>

          {/* Description Snippet */}
          {product.description ? (
            <p className="mt-0.5 text-[11px] font-medium text-slate-500 dark:text-slate-400 line-clamp-2 leading-tight">
              {product.description}
            </p>
          ) : (
            <div className="mt-0.5 flex items-center gap-1 text-[11px] font-medium text-slate-400 dark:text-slate-500">
              <Utensils size={11} />
              <span>{product.category?.name ?? 'Freshly prepared dish'}</span>
            </div>
          )}
        </div>

        {/* Dual-Section Price + Action Pill */}
        <div className="mt-2.5 flex items-center justify-between gap-2">
          {inList ? (
            /* Stepper Controls when item is added */
            <div className="flex h-8 items-center overflow-hidden rounded-xl border border-emerald-500/40 bg-emerald-50 shadow-sm dark:border-emerald-800 dark:bg-emerald-950/80">
              <button
                type="button"
                onClick={(e) => handleQtyChange(e, quantity - 1)}
                className="px-2.5 text-emerald-700 hover:text-rose-600 dark:text-emerald-300 transition-colors"
                aria-label="Decrease quantity"
              >
                {quantity === 1 ? <Trash2 size={13} className="text-rose-500" /> : <Minus size={13} />}
              </button>
              <span className="w-5 text-center text-xs font-black text-emerald-900 dark:text-emerald-100">
                {quantity}
              </span>
              <button
                type="button"
                onClick={(e) => handleQtyChange(e, quantity + 1)}
                className="px-2.5 text-emerald-700 hover:text-emerald-900 dark:text-emerald-300 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus size={13} />
              </button>
            </div>
          ) : (
            /* Glassmorphic Lime Action Pill */
            <button
              type="button"
              onClick={handleToggleCart}
              className="flex items-center overflow-hidden rounded-xl bg-[var(--lime-base)] text-black shadow-md shadow-[var(--lime-base)]/20 transition-all hover:bg-[var(--lime-dark)] active:scale-[0.97]"
            >
              {/* Left Price Half */}
              <span className="px-2.5 py-1.5 text-xs font-black bg-black/10">
                {product.base_price !== null ? `₦${product.base_price.toLocaleString()}` : 'Ask Price'}
              </span>

              {/* Right CTA Action Half */}
              <span className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-black uppercase tracking-wider border-l border-black/15">
                <Plus size={12} strokeWidth={3} />
                <span>Add</span>
              </span>
            </button>
          )}

          {/* Detailed view indicator link */}
          <Link
            href={`/s/${businessSlug}/${product.id}`}
            onClick={(e) => e.stopPropagation()}
            className="text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
          >
            Details →
          </Link>
        </div>
      </div>
    </div>
  )
}

