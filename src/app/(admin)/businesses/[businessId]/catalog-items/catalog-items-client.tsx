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
  Star,
  Sparkles,
  Camera,
} from 'lucide-react'
import { BusinessAdminNav } from '@/components/admin/business-admin-nav'
import { ConciergeOnboardingCard } from '@/components/admin/concierge-onboarding-card'
import { WhatsAppStoryModal } from '@/features/marketing/components/whatsapp-story-modal'
import type { StorefrontBusiness, StorefrontItem } from '@/features/storefront/types'
import { getCategorySvgIcon } from '@/components/icons'
import { quickUpdateCatalogItem } from '@/features/catalog-items/actions'

interface CatalogItemsClientProps {
  business: StorefrontBusiness
  items: StorefrontItem[]
}

export function CatalogItemsClient({ business, items }: CatalogItemsClientProps) {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false)
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const [editPriceInput, setEditPriceInput] = useState<string>('')
  const [isSaving, setIsSaving] = useState(false)

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

  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 10

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
      const q = search.toLowerCase().trim()
      if (!q) {
        return selectedCategory === 'all' || item.category?.id === selectedCategory
      }
      const matchesName = item.name.toLowerCase().includes(q)
      const matchesSku = (item as unknown as { sku?: string }).sku?.toLowerCase().includes(q)
      const matchesDesc = item.description?.toLowerCase().includes(q)
      const matchesPrice = item.base_price !== null && item.base_price.toString().includes(q)
      const matchesCategory =
        selectedCategory === 'all' || item.category?.id === selectedCategory

      return (matchesName || matchesSku || matchesDesc || matchesPrice) && matchesCategory
    })
  }, [items, search, selectedCategory])

  // Pagination calculation
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1
  const safePage = Math.min(currentPage, totalPages)
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE
  const paginatedItems = useMemo(() => {
    return filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filtered, startIndex])

  const handleSearchChange = (val: string) => {
    setSearch(val)
    setCurrentPage(1)
  }

  const handleCategorySelect = (catId: string) => {
    setSelectedCategory(catId)
    setCurrentPage(1)
  }

  return (
    <>
      <WhatsAppStoryModal
        business={business}
        items={items}
        isOpen={isStoryModalOpen}
        onClose={() => setIsStoryModalOpen(false)}
      />

      <div className="mx-auto max-w-5xl p-4 sm:p-8 space-y-6 text-slate-900">
        {/* Store Admin Header Navigation Bar */}
        <BusinessAdminNav business={business} currentSection="catalog" />

        {/* Concierge Onboarding Banner */}
        <ConciergeOnboardingCard business={business} />

        {/* Catalog Control Bar: Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-2">
              <span>Catalog Items ({items.length})</span>
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 font-medium">
              Digitized product shelf tags and dining dishes for {business.name}.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {items.length > 0 && (
              <button
                type="button"
                onClick={() => setIsStoryModalOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-900 shadow-sm hover:bg-emerald-100 active:scale-95 transition-all"
              >
                <Camera size={15} className="text-emerald-700" />
                <span>WhatsApp Story</span>
              </button>
            )}

            <Link
              href={`/businesses/${business.id}/catalog-items/new`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-slate-800 active:scale-[0.98] transition-all"
            >
              <Plus size={16} strokeWidth={3} className="text-emerald-400" />
              <span>Add Product Item</span>
            </Link>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="space-y-3">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search items by product title, SKU code..."
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              id="catalog-search-input"
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 shadow-sm transition-all"
            />
          </div>

          {/* Category Pills */}
          {categories.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-1.5 touch-pan-x scrollbar-thin scrollbar-thumb-slate-200 hover:scrollbar-thumb-slate-300">
              <button
                type="button"
                onClick={() => handleCategorySelect('all')}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-extrabold transition-all active:scale-95 border ${
                  selectedCategory === 'all'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
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
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-extrabold transition-all active:scale-95 border ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {cat.name} ({count})
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Catalog Product Grid & Pagination */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 border border-slate-200 mb-3">
              <Package size={28} />
            </div>
            <p className="text-base font-extrabold text-slate-900">
              {search ? 'No matching catalog items found' : 'No catalog items created yet'}
            </p>
            <p className="mt-1 text-xs text-slate-500 max-w-xs leading-relaxed font-medium">
              Create catalog items for your store to automatically generate physical product QR tags.
            </p>
            <Link
              href={`/businesses/${business.id}/catalog-items/new`}
              className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-5 py-3 text-xs font-bold text-white shadow-sm hover:bg-slate-800 active:scale-95 transition-all"
            >
              <Plus size={15} strokeWidth={3} className="text-emerald-400" />
              <span>Add Catalog Item</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="grid gap-3.5 sm:grid-cols-2">
              {paginatedItems.map((item) => {
                const imageUrl = item.image_url ? resolveUrl(item.image_url) : null

                return (
                  <div
                    key={item.id}
                    className="group relative flex flex-row items-center gap-3.5 overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-slate-300"
                  >
                    {/* Product Photo Thumbnail */}
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-200/60">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="80px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-400">
                          {getCategorySvgIcon(item.name, { size: 28 })}
                        </div>
                      )}
                    </div>

                    {/* Right Product Detail Column */}
                    <div className="flex min-w-0 flex-1 flex-col justify-between self-stretch py-0.5">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h3 className="truncate text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                                {item.name}
                              </h3>
                              {Boolean((item.attributes as Record<string, unknown> | null)?.is_featured) && (
                                <span className="inline-flex items-center gap-0.5 rounded-md bg-amber-50 px-1.5 py-0.5 text-[9px] font-black text-amber-800 border border-amber-200">
                                  <Star size={10} className="fill-amber-500 text-amber-500" />
                                  <span>Featured</span>
                                </span>
                              )}
                              {(item.attributes as Record<string, unknown> | null)?.in_stock === false && (
                                <span className="inline-flex items-center rounded-md bg-rose-50 px-1.5 py-0.5 text-[9px] font-extrabold text-rose-700 border border-rose-200">
                                  Sold Out
                                </span>
                              )}
                            </div>
                            {item.sku && (
                              <p className="mt-0.5 font-mono text-[10px] text-slate-400">
                                SKU: {item.sku}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={async () => {
                                const attrs = (item.attributes && typeof item.attributes === 'object') ? { ...(item.attributes as Record<string, unknown>) } : {}
                                attrs.is_featured = !Boolean(attrs.is_featured)
                                await quickUpdateCatalogItem(item.id, business.id, { attributes: attrs })
                              }}
                              className={`p-1.5 rounded-lg border transition-all ${
                                (item.attributes as Record<string, unknown> | null)?.is_featured
                                  ? 'bg-amber-50 border-amber-300 text-amber-600'
                                  : 'bg-white border-slate-200 text-slate-400 hover:text-amber-500 hover:border-amber-300'
                              }`}
                              title={(item.attributes as Record<string, unknown> | null)?.is_featured ? 'Unpin from Bestsellers' : 'Pin to Bestsellers'}
                            >
                              <Star size={13} className={(item.attributes as Record<string, unknown> | null)?.is_featured ? 'fill-amber-500' : ''} />
                            </button>

                            {item.category && (
                              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-slate-600 border border-slate-200">
                                {item.category.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Price, Stock & Action Row */}
                      <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2 flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          {editingItemId === item.id ? (
                            <div className="flex items-center gap-1">
                              <span className="text-xs font-bold text-slate-500">₦</span>
                              <input
                                type="number"
                                value={editPriceInput}
                                onChange={(e) => setEditPriceInput(e.target.value)}
                                className="h-8 w-24 rounded-lg border border-emerald-400 bg-white px-2 text-xs font-extrabold text-slate-900 focus:outline-none"
                                autoFocus
                              />
                              <button
                                type="button"
                                onClick={async () => {
                                  setIsSaving(true)
                                  const p = editPriceInput.trim() ? parseFloat(editPriceInput) : null
                                  await quickUpdateCatalogItem(item.id, business.id, { base_price: p })
                                  setIsSaving(false)
                                  setEditingItemId(null)
                                }}
                                disabled={isSaving}
                                className="rounded-lg bg-emerald-600 px-2 py-1 text-[10px] font-bold text-white hover:bg-emerald-700"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingItemId(null)}
                                className="rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600 hover:bg-slate-200"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setEditingItemId(item.id)
                                setEditPriceInput(item.base_price !== null ? String(item.base_price) : '')
                              }}
                              className="group/price inline-flex items-center gap-1 rounded-lg hover:bg-emerald-50 px-1.5 py-0.5 -ml-1 transition-all"
                              title="Click to quick-edit price"
                            >
                              <span className="text-sm font-black text-emerald-700">
                                {item.base_price !== null ? `₦${item.base_price.toLocaleString()}` : 'Price on request'}
                              </span>
                              <Edit size={10} className="text-emerald-500 opacity-0 group-hover/price:opacity-100 transition-opacity" />
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            type="button"
                            onClick={async () => {
                              const attrs = (item.attributes && typeof item.attributes === 'object') ? { ...(item.attributes as Record<string, unknown>) } : {}
                              const currentlyInStock = attrs.in_stock !== false
                              attrs.in_stock = !currentlyInStock
                              await quickUpdateCatalogItem(item.id, business.id, { attributes: attrs })
                            }}
                            className={`rounded-lg px-2 py-1 text-[10px] font-bold border transition-colors ${
                              (item.attributes as Record<string, unknown> | null)?.in_stock === false
                                ? 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
                                : 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                            }`}
                            title="Toggle Stock Availability"
                          >
                            {(item.attributes as Record<string, unknown> | null)?.in_stock === false ? 'Mark In Stock' : 'In Stock'}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const cleanName = encodeURIComponent(item.name)
                              const priceStr = item.base_price ? ` (₦${item.base_price.toLocaleString()})` : ''
                              const text = encodeURIComponent(`Hi, I would like to inquire/order ${item.name}${priceStr} seen on ${business.name}.`)
                              const waUrl = `https://wa.me/?text=${text}`
                              navigator.clipboard.writeText(waUrl)
                              alert(`WhatsApp pre-filled order link copied to clipboard!\n\n${waUrl}`)
                            }}
                            className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-800 hover:bg-emerald-100 transition-colors"
                            title="Copy Pre-filled WhatsApp Order Link"
                          >
                            <Camera size={11} className="text-emerald-700" />
                            <span>WhatsApp Link</span>
                          </button>

                          <Link
                            href={`/businesses/${business.id}/catalog-items/${item.id}`}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                          >
                            <Edit size={11} />
                            <span>Edit</span>
                          </Link>

                          <Link
                            href={`/businesses/${business.id}/qr-studio`}
                            className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-slate-800 transition-colors"
                          >
                            <ScanLine size={11} className="text-emerald-400" />
                            <span>QR Tag</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-200/80 pt-4 text-xs font-semibold text-slate-600">
                <span>
                  Showing {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filtered.length)} of {filtered.length} items
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={safePage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 font-bold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-40 transition-all"
                  >
                    Previous
                  </button>

                  <span className="font-bold text-slate-900 px-1">
                    Page {safePage} of {totalPages}
                  </span>

                  <button
                    type="button"
                    disabled={safePage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 font-bold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-40 transition-all"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
