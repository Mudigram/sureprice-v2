'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Plus, Minus, Trash2, Package } from 'lucide-react'
import type { StorefrontItem } from '@/features/storefront/types'
import { useCart } from '@/context/CartContext'
import { getCategorySvgIcon } from '@/components/icons'
import { isItemSoldOut } from '@/lib/catalog/availability'

interface ProductRowProps {
  product: StorefrontItem
  businessSlug: string
  businessName: string
}

export function ProductRow({ product, businessSlug, businessName }: ProductRowProps) {
  const { addItem, removeItem, updateQuantity, isInList, getQuantity } = useCart()

  const soldOut = isItemSoldOut(product.attributes)
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

  const handleToggle = () => {
    if (soldOut) return
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

  const handleQtyChange = (newQty: number) => {
    if (newQty <= 0) {
      removeItem(product.id)
    } else {
      updateQuantity(product.id, newQty)
    }
  }

  const formattedDate = new Date(product.updated_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })

  return (
    <div
      className={`flex items-center gap-4 border-b p-4 last:border-0 transition-colors backdrop-blur-xl ${
        soldOut
          ? 'border-slate-200/60 bg-slate-50/70 opacity-85 dark:border-slate-800/60 dark:bg-slate-900/60'
          : inList
          ? 'border-emerald-500/30 bg-emerald-950/20 dark:border-emerald-900/40 dark:bg-emerald-950/30'
          : 'border-slate-200/80 bg-white hover:bg-slate-50/80 dark:border-slate-800/80 dark:bg-slate-900/90 dark:hover:bg-slate-850'
      }`}
    >
      {/* Left: Checkbox & Quantity */}
      <div className="flex min-w-[36px] flex-col items-center gap-2">
        <input
          type="checkbox"
          checked={inList}
          disabled={soldOut}
          onChange={handleToggle}
          id={`check-${product.id}`}
          className={`h-6 w-6 rounded-lg border-2 border-slate-300 dark:border-slate-700 accent-[var(--lime-base)] transition-transform ${
            soldOut ? 'cursor-not-allowed opacity-30' : 'cursor-pointer active:scale-95'
          }`}
        />
        {inList && !soldOut && (
          <span className="rounded-full border border-emerald-500/30 bg-emerald-950/80 px-2 py-0.5 text-[10px] font-black text-[var(--lime-base)] shadow-sm">
            {quantity}
          </span>
        )}
      </div>

      {/* Thumbnail */}
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-200/80 bg-slate-100 dark:border-slate-800 dark:bg-slate-950">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="56px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[var(--lime-base)]">
            {getCategorySvgIcon(product.category?.name ?? product.name, { size: 24 })}
          </div>
        )}
        {soldOut && (
          <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
            <span className="bg-rose-600/90 text-white text-[8px] font-black px-1 py-0.5 rounded shadow">
              OUT
            </span>
          </div>
        )}
      </div>

      {/* Name, SKU, date — links to detail view */}
      <Link
        href={`/s/${businessSlug}/${product.id}`}
        id={`product-row-link-${product.id}`}
        className="flex min-w-0 flex-1 flex-col gap-1"
      >
        <div className="flex items-center gap-1.5 flex-wrap">
          <h3 className="truncate text-sm font-black leading-tight text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-[var(--lime-base)] transition-colors">
            {product.name}
          </h3>
          {soldOut && (
            <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[9px] font-black text-rose-800 border border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-900">
              Sold Out
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {product.sku && (
            <span className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-600 dark:text-slate-400">
              {product.sku}
            </span>
          )}
          <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
            Updated {formattedDate}
          </span>
        </div>
      </Link>

      {/* Right: Quantity controls when in list, or price display */}
      <div className="flex min-w-[85px] shrink-0 flex-col items-end gap-1">
        {!soldOut && inList ? (
          <div className="flex h-8 items-center overflow-hidden rounded-xl border border-emerald-500/40 bg-emerald-50 shadow-sm dark:border-emerald-800 dark:bg-emerald-950/80">
            <button
              onClick={() => handleQtyChange(quantity - 1)}
              id={`dec-qty-${product.id}`}
              className="px-2.5 text-emerald-700 transition-colors hover:text-rose-500 dark:text-emerald-300"
            >
              {quantity === 1 ? <Trash2 size={13} className="text-rose-500" /> : <Minus size={13} />}
            </button>
            <span className="w-4 text-center text-xs font-black text-emerald-900 dark:text-emerald-100">
              {quantity}
            </span>
            <button
              onClick={() => handleQtyChange(quantity + 1)}
              id={`inc-qty-${product.id}`}
              className="px-2.5 text-emerald-700 transition-colors hover:text-emerald-900 dark:text-emerald-300"
            >
              <Plus size={13} />
            </button>
          </div>
        ) : (
          <div className="text-right">
            <div className={`text-base font-black ${
              soldOut ? 'text-slate-400 line-through dark:text-slate-500' : 'text-slate-900 dark:text-white'
            }`}>
              {product.base_price !== null ? `₦${product.base_price.toLocaleString()}` : '—'}
            </div>
            <div className={`text-[10px] font-black uppercase tracking-wider ${
              soldOut ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-[var(--lime-base)]'
            }`}>
              {soldOut ? 'Sold Out' : 'Verified Price'}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

