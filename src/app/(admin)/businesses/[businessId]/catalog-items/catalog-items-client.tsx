'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Package,
  Plus,
  Search,
  ScanLine,
  Edit,
  RotateCcw,
  CheckCircle2,
  Tag,
  ArrowRight,
  Filter,
} from 'lucide-react'
import { BusinessAdminNav } from '@/components/admin/business-admin-nav'
import type { StorefrontBusiness, StorefrontItem } from '@/features/storefront/types'
import { getCategorySvgIcon } from '@/components/icons'

interface CatalogItemsClientProps {
  business: StorefrontBusiness
  items: StorefrontItem[]
}

export function CatalogItemsClient({ business, items }: CatalogItemsClientProps) {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

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

  // Categories list
  const categories = useMemo(() => {
    const map = new Map<string, { id: string; name: string }>()
    for (const item of items) {
      if (item.category && !map.has(item.category.id)) {
        map.set(item.category.id, { id: item.category.id, name: item.category.name })
      }
    }
    return Array.from(map.values())
  }, [items])

  // Filtered items
  const filtered = useMemo(() => {
    return items.filter((item) => {
      const q = search.toLowerCase()
      const matchesSearch =
        !search ||
        item.name.toLowerCase().includes(q) ||
        (item.sku && item.sku.toLowerCase().includes(q))
      const matchesCategory =
        selectedCategory === 'all' || item.category?.id === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [items, search, selectedCategory])

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-8 space-y-6 text-slate-900 dark:text-white">
      {/* Store Admin Header Navigation Bar */}
      <BusinessAdminNav business={business} currentSection="catalog" />

      {/* Catalog Control Bar: Title & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Catalog Items ({items.length})</span>
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Digitized product shelf tags and dining dishes for {business.name}.
          </p>
        </div>

        <Link
          href={`/businesses/${business.id}/catalog-items/new`}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--lime-base)] px-5 py-3 text-xs font-black text-black shadow-md shadow-[var(--lime-base)]/20 hover:bg-[var(--lime-dark)] active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus size={16} strokeWidth={3} />
          <span>Add New Product Item</span>
        </Link>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="space-y-3">
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            size={18}
          />
          <input
            type="text"
            placeholder="Search items by product title, SKU code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="catalog-search-input"
            className="h-12 w-full rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 pl-11 pr-4 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-[var(--lime-base)] focus:outline-none focus:ring-1 focus:ring-[var(--lime-base)] shadow-sm transition-all"
          />
        </div>

        {/* Category Pills */}
        {categories.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-extrabold transition-all active:scale-95 border ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white border-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:border-white shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800'
              }`}
            >
              All Items ({items.length})
            </button>

            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id
              const count = items.filter((i) => i.category?.id === cat.id).length
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-extrabold transition-all active:scale-95 border ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:border-white shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Catalog Product Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 mb-3">
            <Package size={28} />
          </div>
          <p className="text-base font-extrabold text-slate-900 dark:text-white">
            {search ? 'No matching catalog items found' : 'No catalog items created yet'}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
            Create catalog items for your store to automatically generate physical product QR tags.
          </p>
          <Link
            href={`/businesses/${business.id}/catalog-items/new`}
            className="mt-4 inline-flex items-center gap-1.5 rounded-2xl bg-[var(--lime-base)] px-5 py-3 text-xs font-black text-black shadow-md shadow-[var(--lime-base)]/20 active:scale-95 transition-transform"
          >
            <Plus size={15} strokeWidth={3} />
            <span>Add Catalog Item</span>
          </Link>
        </div>
      ) : (
        <div className="grid gap-3.5 sm:grid-cols-2">
          {filtered.map((item) => {
            const imageUrl = item.image_url ? resolveUrl(item.image_url) : null

            return (
              <div
                key={item.id}
                className="group relative flex flex-row items-center gap-3.5 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900"
              >
                {/* Product Photo Thumbnail */}
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-200/60 dark:bg-slate-950 dark:border-slate-800">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="80px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-400 dark:text-slate-500">
                      {getCategorySvgIcon(item.name, { size: 28 })}
                    </div>
                  )}
                </div>

                {/* Right Product Detail Column */}
                <div className="flex min-w-0 flex-1 flex-col justify-between self-stretch py-0.5">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="truncate text-sm font-black text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-[var(--lime-base)] transition-colors">
                        {item.name}
                      </h3>

                      {item.category && (
                        <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
                          {item.category.name}
                        </span>
                      )}
                    </div>

                    {item.sku && (
                      <p className="mt-0.5 font-mono text-[10px] text-slate-400 dark:text-slate-500">
                        SKU: {item.sku}
                      </p>
                    )}
                  </div>

                  {/* Price & Action Row */}
                  <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2 dark:border-slate-800">
                    <span className="text-sm font-black text-emerald-700 dark:text-[var(--lime-base)]">
                      {item.base_price !== null ? `₦${item.base_price.toLocaleString()}` : 'Price on request'}
                    </span>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/businesses/${business.id}/catalog-items/${item.id}`}
                        className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-extrabold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                      >
                        <Edit size={12} />
                        <span>Edit</span>
                      </Link>

                      <Link
                        href={`/businesses/${business.id}/qr-studio`}
                        className="inline-flex items-center gap-1 rounded-xl bg-slate-900 px-2.5 py-1 text-[11px] font-black text-white dark:bg-slate-100 dark:text-slate-900 hover:opacity-90 transition-opacity"
                      >
                        <ScanLine size={12} />
                        <span>QR Tag</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
