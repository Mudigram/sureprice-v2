'use client'

import Image from 'next/image'
import {
  Plus,
  Minus,
  Trash2,
  Utensils,
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

  // Parse attributes
  const attributes = product.attributes && typeof product.attributes === 'object' && !Array.isArray(product.attributes)
    ? (product.attributes as Record<string, string>)
    : {}

  const spicyTag = !!(attributes.spicy || attributes.Spicy || attributes.spice)
  const vegTag = !!(attributes.vegetarian || attributes.veg || attributes.Dietary === 'Vegetarian')
  const halalTag = !!(attributes.halal || attributes.Halal)
  const bestsellerTag = !!(attributes.bestseller || attributes.popular || attributes.favorite || attributes.recommended)
  const limitedTag = !!(attributes.limited || attributes.batch || attributes.event_exclusive)
  const specialTag = !!(attributes.special || attributes.Special || attributes.featured)

  // Priority badge for image overlay — max 1 (Bestseller > Special/Featured > Limited)
  const primaryBadge = bestsellerTag
    ? { label: '⭐ Bestseller', className: 'bg-amber-500/95 text-black border-amber-300/40' }
    : specialTag
    ? { label: '🔥 Special', className: 'bg-rose-600/90 text-white border-rose-400/30' }
    : limitedTag
    ? { label: '🎪 Limited', className: 'bg-purple-600/90 text-white border-purple-400/30' }
    : null

  // Dietary tags shown as inline text below dish name (not on image)
  const dietaryTags = [
    spicyTag && '🌶️ Spicy',
    vegTag && '🌱 Veg',
    halalTag && 'Halal',
  ].filter(Boolean) as string[]

  return (
    <div
      onClick={onOpenSheet}
      className={`group relative flex flex-row items-center gap-3.5 overflow-hidden rounded-2xl border p-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer active:scale-[0.98] ${
        inList
          ? 'border-emerald-400/60 bg-emerald-50 shadow-emerald-100'
          : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
    >
      {/* Left Food Image */}
      <div className="relative h-28 w-28 sm:w-32 shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 112px, 128px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-50 to-slate-100 text-amber-600">
            {getCategorySvgIcon(product.category?.name ?? product.name, { size: 36 })}
          </div>
        )}

        {/* Single Priority Badge (max 1) */}
        {primaryBadge && (
          <div className="absolute left-1.5 top-1.5 z-10">
            <span className={`rounded-full px-1.5 py-0.5 text-[8px] font-black backdrop-blur-md shadow-sm border ${primaryBadge.className}`}>
              {primaryBadge.label}
            </span>
          </div>
        )}
      </div>

      {/* Right Content Column */}
      <div className="flex min-w-0 flex-1 flex-col justify-between self-stretch py-0.5">
        <div>
          {/* Dish Title */}
          <p className="truncate text-sm font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
            {product.name}
          </p>

          {/* Dietary Badges as inline text (not overlaid on image) */}
          {dietaryTags.length > 0 && (
            <p className="mt-0.5 text-[10px] font-bold text-slate-500">
              {dietaryTags.join(' · ')}
            </p>
          )}

          {/* Description Snippet */}
          {product.description ? (
            <p className="mt-0.5 text-[11px] font-medium text-slate-500 line-clamp-2 leading-tight">
              {product.description}
            </p>
          ) : (
            <div className="mt-0.5 flex items-center gap-1 text-[11px] font-medium text-slate-400">
              <Utensils size={11} />
              <span>{product.category?.name ?? 'Freshly prepared dish'}</span>
            </div>
          )}
        </div>

        {/* Price + Action Row */}
        <div className="mt-2.5 flex items-center justify-between gap-2">
          {inList ? (
            /* Stepper Controls (min 44px height) */
            <div className="flex h-11 items-center overflow-hidden rounded-xl border border-emerald-400/60 bg-emerald-50 shadow-sm">
              <button
                type="button"
                onClick={(e) => handleQtyChange(e, quantity - 1)}
                className="flex h-11 w-11 items-center justify-center text-emerald-700 hover:text-rose-600 transition-colors"
                aria-label="Decrease quantity"
              >
                {quantity === 1 ? <Trash2 size={13} className="text-rose-500" /> : <Minus size={13} />}
              </button>
              <span className="w-5 text-center text-xs font-black text-emerald-900">
                {quantity}
              </span>
              <button
                type="button"
                onClick={(e) => handleQtyChange(e, quantity + 1)}
                className="flex h-11 w-11 items-center justify-center text-emerald-700 hover:text-emerald-900 transition-colors"
                aria-label="Increase quantity"
              >
                <Plus size={13} />
              </button>
            </div>
          ) : (
            /* Lime Add Button */
            <button
              type="button"
              onClick={handleToggleCart}
              className="flex items-center overflow-hidden rounded-xl bg-[var(--lime-base)] text-black shadow-sm transition-all hover:bg-[var(--lime-dark)] active:scale-[0.97]"
            >
              {/* Left Price Half */}
              <span className="px-2.5 py-2 text-xs font-black bg-black/8">
                {product.base_price !== null ? `₦${product.base_price.toLocaleString()}` : 'Ask Price'}
              </span>
              {/* Right CTA Half */}
              <span className="flex h-9 min-w-[44px] items-center justify-center gap-1 px-2.5 text-[11px] font-black uppercase tracking-wider border-l border-black/10">
                <Plus size={12} strokeWidth={3} />
                <span>Add</span>
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
