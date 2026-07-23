'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useMemo } from 'react'
import {
  Package,
  Utensils,
  Ticket,
  CheckCircle2,
  Clock,
  MapPin,
  Plus,
  Check,
  Tag,
  Search,
  Sparkles,
  ShoppingBag,
} from 'lucide-react'
import { SearchInput } from '@/components/storefront/search-input'
import { ProductRow } from '@/components/storefront/product-row'
import { computeIsOpen, type StorefrontBusiness, type StorefrontItem, type StorefrontCategory } from '@/features/storefront/types'
import { useCart } from '@/context/CartContext'

const CATEGORY_ICONS: Record<string, string> = {
  beverages: '☕', drinks: '🥤', snacks: '🍪', bakery: '🍞',
  dairy: '🥛', meat: '🥩', produce: '🥬', household: '🏠',
  starters: '🥗', mains: '🍝', desserts: '🍰', specials: '⭐',
}

function getCategoryIcon(name: string): string {
  const key = name.toLowerCase()
  for (const [k, v] of Object.entries(CATEGORY_ICONS)) {
    if (key.includes(k)) return v
  }
  return '🛍️'
}

interface Props {
  business: StorefrontBusiness
  items: StorefrontItem[]
  businessSlug: string
}

export function StoreDetailClient({ business, items, businessSlug }: Props) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const { addItem, isInList } = useCart()

  const isRestaurant = business.business_type === 'restaurant' || business.business_type === 'cafe'
  const isEvent = business.business_type === 'popup_vendor' || business.business_type === 'event_vendor'

  // Operating status
  const primaryLocation = business.locations?.[0]
  const statusInfo = computeIsOpen(primaryLocation?.location_hours)
  const addressText = primaryLocation?.address_text ?? primaryLocation?.name ?? 'Nigeria'

  // Derive categories
  const categories = useMemo(() => {
    const seen = new Map<string, StorefrontCategory>()
    for (const item of items) {
      if (item.category && !seen.has(item.category.id)) {
        seen.set(item.category.id, item.category)
      }
    }
    return Array.from(seen.values()).sort((a, b) => a.sort_order - b.sort_order)
  }, [items])

  // Filtered items
  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        !search ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        (item.sku && item.sku.toLowerCase().includes(search.toLowerCase()))
      const matchesCategory = !activeCategory || item.category?.id === activeCategory
      return matchesSearch && matchesCategory
    })
  }, [items, search, activeCategory])

  const itemsInCategory = (catId: string) => items.filter((i) => i.category?.id === catId).length

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* ─── DYNAMIC HERO HEADER ────────────────────────────────────────────── */}
      <div className="px-5 pt-3 pb-2 space-y-3">
        {/* Venue Type & Status Pill */}
        <div className="flex flex-wrap items-center gap-2">
          {isRestaurant ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-amber-900 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900">
              <Utensils size={12} />
              Digital Menu & Table QR
            </span>
          ) : isEvent ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-purple-900 border border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-900">
              <Ticket size={12} />
              Live Event Vendor
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-green-900 border border-green-200 dark:bg-green-950/60 dark:text-green-300 dark:border-green-900">
              <CheckCircle2 size={12} />
              Verified Store Catalog
            </span>
          )}

          {/* Operating hours status */}
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-700 dark:bg-zinc-800 dark:text-zinc-300">
            <span className={`h-1.5 w-1.5 rounded-full ${statusInfo.isOpen ? 'bg-green-500' : 'bg-red-500'}`} />
            {statusInfo.text}
          </span>
        </div>

        {/* Business Title & Location */}
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-zinc-100">
            {business.name}
          </h1>
          <p className="mt-1 flex items-center gap-1 text-xs text-slate-500 dark:text-zinc-400">
            <MapPin size={13} className="shrink-0 text-slate-400" />
            <span className="truncate">{addressText}</span>
          </p>
        </div>
      </div>

      <div className="space-y-5 px-5 mt-2">
        {/* Search */}
        <SearchInput
          placeholder={isRestaurant ? "Search menu dishes or drinks…" : isEvent ? "Search event catalog items…" : "Search by product or SKU…"}
          value={search}
          onChange={setSearch}
        />

        {/* Categories Navigation */}
        {!search && categories.length > 0 && (
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-800 dark:text-zinc-200">
                {isRestaurant ? 'Menu Categories' : isEvent ? 'Stall Sections' : 'Departments'}
              </h2>
              {activeCategory && (
                <button
                  onClick={() => setActiveCategory(null)}
                  className="text-xs font-bold text-[var(--lime-dark)]"
                >
                  View All
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    id={`dept-${cat.id}`}
                    onClick={() => setActiveCategory(isActive ? null : cat.id)}
                    className={`flex items-start gap-3 rounded-2xl border p-3.5 text-left transition-all ${
                      isActive
                        ? 'border-[var(--lime-base)] bg-[var(--lime-base)]/15 shadow-sm'
                        : 'border-gray-100 bg-white hover:border-gray-200 dark:border-zinc-800 dark:bg-zinc-900'
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl ${
                        isActive ? 'bg-[var(--lime-base)]/25' : 'bg-slate-100 dark:bg-zinc-800'
                      }`}
                    >
                      {getCategoryIcon(cat.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-extrabold text-slate-900 dark:text-zinc-100">
                        {cat.name}
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-zinc-500">
                        {itemsInCategory(cat.id)} items
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </section>
        )}

        {/* ─── RESTAURANT / CAFÉ DYNAMIC MENU SELECTION UI ──────────────────── */}
        {isRestaurant ? (
          <section className="space-y-3">
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-800 dark:text-zinc-200">
              {activeCategory
                ? `${categories.find((c) => c.id === activeCategory)?.name ?? 'Category'} Menu (${filtered.length})`
                : `Full Restaurant Menu (${items.length})`}
            </h2>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-center">
                <Utensils size={32} className="text-slate-400" />
                <p className="mt-3 text-sm font-bold text-slate-900 dark:text-zinc-100">No menu items found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((item) => {
                  const notedInList = isInList(item.id)

                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-3.5 rounded-3xl border border-gray-100 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                    >
                      {/* Image */}
                      <Link
                        href={`/s/${businessSlug}/${item.id}`}
                        className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-slate-100 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-800"
                      >
                        {item.image_url ? (
                          <Image src={item.image_url} alt={item.name} fill className="object-cover" sizes="64px" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xl">🍽️</div>
                        )}
                      </Link>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/s/${businessSlug}/${item.id}`}
                          className="line-clamp-1 text-sm font-black text-slate-900 dark:text-zinc-100 hover:underline"
                        >
                          {item.name}
                        </Link>

                        {item.description && (
                          <p className="line-clamp-1 mt-0.5 text-[11px] text-slate-500 dark:text-zinc-400">
                            {item.description}
                          </p>
                        )}

                        <div className="mt-2 flex items-center justify-between">
                          {item.base_price !== null ? (
                            <span className="text-sm font-black text-slate-900 dark:text-zinc-100">
                              ₦{item.base_price.toLocaleString()}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">Price on request</span>
                          )}

                          {/* Add to Menu Reference Button */}
                          <button
                            type="button"
                            onClick={() =>
                              addItem({
                                id: item.id,
                                name: item.name,
                                base_price: item.base_price,
                                image_url: item.image_url,
                                businessSlug,
                                businessName: business.name,
                              })
                            }
                            id={`add-menu-btn-${item.id}`}
                            className={`flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-extrabold transition-all active:scale-95 ${
                              notedInList
                                ? 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                                : 'bg-[var(--lime-base)] text-black shadow-sm'
                            }`}
                          >
                            {notedInList ? (
                              <>
                                <Check size={13} />
                                Noted
                              </>
                            ) : (
                              <>
                                <Plus size={13} />
                                Note Item
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        ) : (
          /* ─── RETAIL / EVENT POPUP PRODUCT ROW GRID ──────────────────────── */
          <section className="pb-6">
            <h2 className="mb-3 text-xs font-extrabold uppercase tracking-widest text-slate-800 dark:text-zinc-200">
              {activeCategory
                ? `${categories.find((c) => c.id === activeCategory)?.name ?? ''} (${filtered.length})`
                : `Catalog (${filtered.length})`}
            </h2>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-center">
                <Package size={32} className="text-slate-400" />
                <p className="mt-3 text-sm font-bold text-slate-900 dark:text-zinc-100">No items found</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                {filtered.map((item) => (
                  <ProductRow
                    key={item.id}
                    product={item}
                    businessSlug={businessSlug}
                    businessName={business.name}
                  />
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  )
}
