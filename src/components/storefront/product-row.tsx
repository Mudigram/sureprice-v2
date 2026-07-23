'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Plus, Minus, Trash2, Package } from 'lucide-react'
import type { StorefrontItem } from '@/features/storefront/types'
import { useCart } from '@/context/CartContext'

interface ProductRowProps {
  product: StorefrontItem
  businessSlug: string
  businessName: string
}

export function ProductRow({ product, businessSlug, businessName }: ProductRowProps) {
  const { addItem, removeItem, updateQuantity, isInList, getQuantity } = useCart()

  const inList = isInList(product.id)
  const quantity = getQuantity(product.id)

  const handleToggle = () => {
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
      className={`flex items-center gap-4 border-b border-gray-100 p-4 last:border-0 transition-colors dark:border-zinc-800 ${
        inList
          ? 'bg-green-50/60 dark:bg-green-950/20'
          : 'bg-white hover:bg-slate-50 dark:bg-zinc-900 dark:hover:bg-zinc-800/60'
      }`}
    >
      {/* Left: Checkbox & Quantity */}
      <div className="flex min-w-[36px] flex-col items-center gap-2">
        <input
          type="checkbox"
          checked={inList}
          onChange={handleToggle}
          id={`check-${product.id}`}
          className="h-6 w-6 cursor-pointer rounded-md border-2 border-green-200 accent-[var(--lime-base)] transition-transform active:scale-95"
        />
        {inList && (
          <span className="rounded-full border border-green-100 bg-white px-2 py-0.5 text-[10px] font-black text-[var(--lime-dark)] shadow-sm dark:bg-zinc-800">
            {quantity}
          </span>
        )}
      </div>

      {/* Thumbnail */}
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-slate-50 dark:border-zinc-800 dark:bg-zinc-800">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
            sizes="56px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-400">
            <Package size={20} />
          </div>
        )}
      </div>

      {/* Name, SKU, date — links to detail view */}
      <Link
        href={`/s/${businessSlug}/${product.id}`}
        id={`product-row-link-${product.id}`}
        className="flex min-w-0 flex-1 flex-col gap-1"
      >
        <h3 className="truncate text-sm font-bold leading-tight text-slate-900 dark:text-zinc-100">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          {product.sku && (
            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono text-slate-500 dark:bg-zinc-800 dark:text-zinc-400">
              {product.sku}
            </span>
          )}
          <span className="text-[10px] text-slate-400 dark:text-zinc-500">
            Updated {formattedDate}
          </span>
        </div>
      </Link>

      {/* Right: Quantity controls when in list, or price display */}
      <div className="flex min-w-[85px] shrink-0 flex-col items-end gap-1">
        {inList ? (
          <div className="flex h-8 items-center overflow-hidden rounded-lg border border-green-100 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
            <button
              onClick={() => handleQtyChange(quantity - 1)}
              id={`dec-qty-${product.id}`}
              className="px-2.5 text-slate-400 transition-colors hover:text-red-500"
            >
              {quantity === 1 ? <Trash2 size={13} /> : <Minus size={13} />}
            </button>
            <span className="w-4 text-center text-xs font-bold text-slate-900 dark:text-zinc-100">
              {quantity}
            </span>
            <button
              onClick={() => handleQtyChange(quantity + 1)}
              id={`inc-qty-${product.id}`}
              className="px-2.5 text-slate-400 transition-colors hover:text-[var(--lime-dark)]"
            >
              <Plus size={13} />
            </button>
          </div>
        ) : (
          <div className="text-right">
            <div className="text-base font-black text-slate-900 dark:text-zinc-100">
              {product.base_price !== null ? `₦${product.base_price.toLocaleString()}` : '—'}
            </div>
            <div className="text-[10px] font-black uppercase tracking-tighter text-green-600 dark:text-green-400">
              Verified Price
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
