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

  // Parse attributes for dietary / spicy tags if present
  const attributes = product.attributes && typeof product.attributes === 'object' && !Array.isArray(product.attributes)
    ? (product.attributes as Record<string, string>)
    : {}

  const spicyTag = attributes.spicy || attributes.Spicy || attributes.spice
  const vegTag = attributes.vegetarian || attributes.veg || attributes.Dietary === 'Vegetarian'
  const halalTag = attributes.halal || attributes.Halal

  return (
    <div
      onClick={onOpenSheet}
      className={`group relative flex flex-row items-center gap-3.5 overflow-hidden rounded-2xl border p-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer ${
        inList
          ? 'border-emerald-300 bg-emerald-50/40 dark:border-emerald-900/50 dark:bg-emerald-950/20'
          : 'border-slate-200/80 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900'
      }`}
    >
      {/* Left Food Image Container */}
      <div className="relative h-28 w-28 sm:w-36 shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-200/60 dark:bg-slate-950 dark:border-slate-800">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 112px, 144px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-500/15 via-rose-500/10 to-slate-950/30 text-amber-600 dark:text-amber-400">
            {getCategorySvgIcon(product.category?.name ?? product.name, { size: 36 })}
          </div>
        )}

        {/* Dietary / Spicy micro-badge over image */}
        {(spicyTag || vegTag || halalTag) && (
          <div className="absolute left-1.5 top-1.5 z-10 flex flex-wrap gap-1">
            {spicyTag && (
              <span className="rounded-full bg-rose-500/90 px-1.5 py-0.5 text-[8px] font-black text-white backdrop-blur-md shadow-sm">
                🌶️ Spicy
              </span>
            )}
            {vegTag && (
              <span className="rounded-full bg-emerald-500/90 px-1.5 py-0.5 text-[8px] font-black text-white backdrop-blur-md shadow-sm">
                🌱 Veg
              </span>
            )}
            {halalTag && (
              <span className="rounded-full bg-amber-500/90 px-1.5 py-0.5 text-[8px] font-black text-white backdrop-blur-md shadow-sm">
                 Halal
              </span>
            )}
          </div>
        )}
      </div>

      {/* Right Content Column */}
      <div className="flex min-w-0 flex-1 flex-col justify-between self-stretch py-0.5">
        <div>
          {/* Dish Title */}
          <Link
            href={`/s/${businessSlug}/${product.id}`}
            onClick={(e) => e.stopPropagation()}
            className="truncate text-sm sm:text-base font-black text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-amber-400 transition-colors block"
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

        {/* Dual-Section Price + Action Pill (Reference Design Match) */}
        <div className="mt-2.5 flex items-center justify-between gap-2">
          {inList ? (
            /* Stepper Controls when item is added */
            <div className="flex h-8 items-center overflow-hidden rounded-xl border border-emerald-300 bg-emerald-50 shadow-sm dark:border-emerald-900 dark:bg-emerald-950/60">
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
            /* Dual-Section Price + Add Button Pill (Reference Match) */
            <button
              type="button"
              onClick={handleToggleCart}
              className="flex items-center overflow-hidden rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md shadow-rose-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {/* Left Price Half */}
              <span className="px-2.5 py-1.5 text-xs font-black bg-black/15">
                {product.base_price !== null ? `₦${product.base_price.toLocaleString()}` : 'Ask Price'}
              </span>

              {/* Right CTA Action Half */}
              <span className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-extrabold border-l border-white/20">
                <Plus size={12} />
                <span>Note</span>
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
