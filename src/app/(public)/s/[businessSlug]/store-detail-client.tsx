'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useMemo, useEffect } from 'react'
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
  X,
  Info,
  Phone,
  Share2,
  LayoutGrid,
  List,
} from 'lucide-react'
import { SearchInput } from '@/components/storefront/search-input'
import { ProductRow } from '@/components/storefront/product-row'
import { MenuItemSheet } from './menu-item-sheet'
import { computeIsOpen, type StorefrontBusiness, type StorefrontItem, type StorefrontCategory, type StorefrontLocation } from '@/features/storefront/types'
import { useCart } from '@/context/CartContext'
import { ItemUnavailableIllustration } from '@/components/illustrations'
import {
  getCategorySvgIcon,
  getBrandFallbackSvgIcon,
  getAmenitySvgIcon,
  CategoryPlateSvg,
} from '@/components/icons'

const CATEGORY_GRADIENTS: Record<string, string> = {
  beverages: 'from-amber-500/15 via-orange-500/10 to-amber-950/30',
  drinks: 'from-blue-500/15 via-cyan-500/10 to-slate-950/30',
  mains: 'from-emerald-500/15 via-teal-500/10 to-emerald-950/30',
  starters: 'from-lime-500/15 via-emerald-500/10 to-slate-950/30',
  desserts: 'from-rose-500/15 via-pink-500/10 to-rose-950/30',
  grills: 'from-red-500/15 via-orange-500/10 to-stone-950/30',
  breakfast: 'from-yellow-500/15 via-amber-500/10 to-slate-950/30',
}

function getCategoryGradient(name?: string): string {
  if (!name) return 'from-slate-800/40 via-zinc-800/30 to-slate-950/40'
  const key = name.toLowerCase()
  for (const [k, v] of Object.entries(CATEGORY_GRADIENTS)) {
    if (key.includes(k)) return v
  }
  return 'from-emerald-500/15 via-teal-500/10 to-slate-950/30'
}

// ─── Ambient Banner (Non-blocking QR Scan Welcome) ────────────────────────

function RestaurantAmbientBanner({
  businessName,
  onDismiss,
}: {
  businessName: string
  onDismiss: () => void
}) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-emerald-500/15 p-3.5 border border-emerald-500/20 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--lime-base)]/20 text-[var(--lime-base)] border border-[var(--lime-base)]/30">
          <CategoryPlateSvg size={20} />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-white leading-tight">
            Verified Menu Prices
          </p>
          <p className="text-[11px] text-slate-300 truncate">
            All prices in Nigerian Naira (₦)
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onDismiss}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition-all"
        aria-label="Dismiss banner"
      >
        <X size={14} />
      </button>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────

interface Props {
  business: StorefrontBusiness
  items: StorefrontItem[]
  businessSlug: string
}

export function StoreDetailClient({ business, items, businessSlug }: Props) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [showBanner, setShowBanner] = useState(false)
  const [selectedItem, setSelectedItem] = useState<StorefrontItem | null>(null)
  const [copiedLink, setCopiedLink] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const { isInList } = useCart()

  const isRestaurant = business.business_type === 'restaurant' || business.business_type === 'cafe'
  const isEvent = business.business_type === 'popup_vendor' || business.business_type === 'event_vendor'

  // Operating status
  const primaryLocation = business.locations?.[0]
  const statusInfo = computeIsOpen(primaryLocation?.location_hours)
  const addressText = primaryLocation?.address_text ?? primaryLocation?.name ?? 'Nigeria'
  const phoneNumber = primaryLocation?.phone

  // Extract branding configs from storefront table & storefront.theme JSON object
  const storefrontTheme = (business.storefront?.theme && typeof business.storefront.theme === 'object')
    ? (business.storefront.theme as Record<string, unknown>)
    : {}

  const rawLogoUrl =
    (typeof (business.storefront as Record<string, unknown>)?.logo_url === 'string' && (business.storefront as Record<string, unknown>).logo_url as string) ||
    (typeof storefrontTheme.logo_url === 'string' && storefrontTheme.logo_url) ||
    (typeof storefrontTheme.logoUrl === 'string' && storefrontTheme.logoUrl) ||
    null

  const rawCoverUrl =
    (typeof (business.storefront as Record<string, unknown>)?.cover_url === 'string' && (business.storefront as Record<string, unknown>).cover_url as string) ||
    (typeof storefrontTheme.cover_url === 'string' && storefrontTheme.cover_url) ||
    (typeof storefrontTheme.coverUrl === 'string' && storefrontTheme.coverUrl) ||
    (typeof storefrontTheme.banner_url === 'string' && storefrontTheme.banner_url) ||
    (typeof storefrontTheme.bannerUrl === 'string' && storefrontTheme.bannerUrl) ||
    (typeof storefrontTheme.header_url === 'string' && storefrontTheme.header_url) ||
    (typeof storefrontTheme.cover === 'string' && storefrontTheme.cover) ||
    (Array.isArray((business as unknown as { media?: Array<{ target_type?: string; storage_path?: string }> }).media) &&
      (business as unknown as { media?: Array<{ target_type?: string; storage_path?: string }> }).media?.find(
        (m) => (m.target_type === 'business' || m.target_type === 'storefront') && typeof m.storage_path === 'string'
      )?.storage_path) ||
    null

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

  const logoUrl = rawLogoUrl ? resolveUrl(rawLogoUrl) : null
  const coverUrl = rawCoverUrl ? resolveUrl(rawCoverUrl) : null
  const tagline = typeof storefrontTheme.tagline === 'string' ? storefrontTheme.tagline : null
  const highlights = Array.isArray(storefrontTheme.highlights) ? (storefrontTheme.highlights as string[]) : []

  // Show ambient welcome banner on first visit
  useEffect(() => {
    if (!isRestaurant) return
    const key = `sureprice_visited_${businessSlug}`
    if (typeof window !== 'undefined' && !localStorage.getItem(key)) {
      setShowBanner(true)
      localStorage.setItem(key, new Date().toISOString())
    }
  }, [isRestaurant, businessSlug])

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

  const handleSharePage = async () => {
    const url = window.location.href
    const title = `${business.name} — Verified Menu`
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
      } catch {
        // Dismissed
      }
    } else {
      try {
        await navigator.clipboard.writeText(url)
        setCopiedLink(true)
        setTimeout(() => setCopiedLink(false), 2000)
      } catch {
        // Fallback
      }
    }
  }

  const highlightBadgesMap: Record<string, { label: string; iconKey: string }> = {
    halal: { label: 'Halal Certified', iconKey: 'halal' },
    cocktails: { label: 'Cocktail Bar', iconKey: 'cocktails' },
    wifi: { label: 'Free Wi-Fi', iconKey: 'wifi' },
    ac: { label: 'Air Conditioned', iconKey: 'ac' },
    outdoor: { label: 'Outdoor Seating', iconKey: 'outdoor' },
    takeout: { label: 'Takeout & Delivery', iconKey: 'takeout' },
    parking: { label: 'On-Site Parking', iconKey: 'parking' },
  }

  return (
    <>
      {/* Product Quick-View Bottom Sheet */}
      <MenuItemSheet
        item={selectedItem}
        business={business}
        businessSlug={businessSlug}
        open={selectedItem !== null}
        onClose={() => setSelectedItem(null)}
      />

      <div className="min-h-screen pb-12 bg-background">
        {/* ─── DYNAMIC HERO HEADER ────────────────────────────────────────────── */}

        <div className="relative overflow-hidden rounded-b-3xl shadow-xl border-b border-slate-800/60 mb-5 text-white bg-slate-950">
          {/* Header Cover Background Photo */}
          {coverUrl ? (
            <div className="absolute inset-0 z-0">
              <Image
                src={coverUrl}
                alt={business.name}
                fill
                className="object-cover opacity-70 transition-opacity duration-300"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/65 to-slate-950" />
            </div>
          ) : (
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900" />
          )}

          <div className="relative z-10 px-5 pt-5 pb-6">
            {showBanner && isRestaurant && (
              <RestaurantAmbientBanner
                businessName={business.name}
                onDismiss={() => setShowBanner(false)}
              />
            )}

            {/* Status & Badge Row */}
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--lime-base)]/15 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-[var(--lime-base)] border border-[var(--lime-base)]/25">
                {isRestaurant ? (
                  <Utensils size={13} />
                ) : isEvent ? (
                  <Ticket size={13} />
                ) : (
                  <ShoppingBag size={13} />
                )}
                {isRestaurant
                  ? 'Verified Digital Menu'
                  : isEvent
                  ? 'Live Event Vendor'
                  : 'Verified Store Directory'}
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md px-2.5 py-1 text-[11px] font-bold text-slate-200 border border-white/10">
                <span className={`h-2 w-2 rounded-full ${statusInfo.isOpen ? 'bg-[var(--lime-base)] shadow-[0_0_8px_var(--lime-base)]' : 'bg-red-400'}`} />
                {statusInfo.text}
              </span>
            </div>

            {/* Logo + Name Header Row */}
            <div className="mt-4 flex items-start gap-3.5">
              {logoUrl ? (
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border-2 border-white/20 bg-slate-900 shadow-md">
                  <Image
                    src={logoUrl}
                    alt={business.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--lime-base)]/25 to-emerald-500/20 border border-white/15 shadow-md">
                  {getBrandFallbackSvgIcon(business.business_type, { size: 38 })}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-black tracking-tight text-white leading-tight">
                  {business.name}
                </h1>

                {tagline && (
                  <p className="mt-0.5 text-xs text-[var(--lime-base)] font-bold italic line-clamp-1">
                    &ldquo;{tagline}&rdquo;
                  </p>
                )}

                <p className="mt-1 flex items-center gap-1 text-xs text-slate-300">
                  <MapPin size={13} className="shrink-0 text-slate-400" />
                  <span className="truncate">{addressText}</span>
                </p>
              </div>
            </div>

            {/* Amenity Highlight Badges Row */}
            {highlights.length > 0 && (
              <div className="mt-3.5 flex flex-wrap gap-1.5 pt-1">
                {highlights.map((hKey) => {
                  const badge = highlightBadgesMap[hKey]
                  if (!badge) return null
                  return (
                    <span
                      key={hKey}
                      className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold text-slate-200 border border-white/10"
                    >
                      {getAmenitySvgIcon(badge.iconKey, { size: 14 })}
                      <span>{badge.label}</span>
                    </span>
                  )
                })}
              </div>
            )}

            {/* Quick Action Buttons Bar */}
            <div className="mt-4 flex items-center gap-2 pt-1 border-t border-white/10">
              {phoneNumber && (
                <a
                  href={`tel:${phoneNumber}`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-white/10 backdrop-blur-md px-3 py-2 text-xs font-bold text-white border border-white/15 hover:bg-white/20 transition-all active:scale-95"
                >
                  <Phone size={13} className="text-[var(--lime-base)]" />
                  <span>Call Store</span>
                </a>
              )}

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${business.name} ${addressText}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-white/10 backdrop-blur-md px-3 py-2 text-xs font-bold text-white border border-white/15 hover:bg-white/20 transition-all active:scale-95"
              >
                <MapPin size={13} className="text-[var(--lime-base)]" />
                <span>Directions</span>
              </a>

              <button
                type="button"
                onClick={handleSharePage}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[var(--lime-base)] px-3 py-2 text-xs font-black text-black shadow-md shadow-[var(--lime-base)]/20 hover:bg-[var(--lime-dark)] transition-all active:scale-95"
              >
                <Share2 size={13} />
                <span>{copiedLink ? 'Copied!' : isRestaurant ? 'Share Menu' : 'Share Catalog'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-5 px-5">
          {/* Search */}
          <SearchInput
            placeholder={isRestaurant ? "Search dishes or drinks…" : isEvent ? "Search event items…" : "Search products…"}
            value={search}
            onChange={setSearch}
          />

          {/* ─── HORIZONTAL CATEGORY FILTER PILLS ──────────────────────── */}
          {!search && categories.length > 0 && (
            <section>
              <div className="mb-2.5 flex items-center justify-between">
                <h2 className="text-sm font-black text-slate-900 dark:text-zinc-100">
                  {isRestaurant ? 'Menu Categories' : isEvent ? 'Stall Sections' : 'Store Departments'}
                </h2>
                {activeCategory && (
                  <button
                    onClick={() => setActiveCategory(null)}
                    className="text-xs font-bold text-[var(--lime-dark)] hover:underline"
                  >
                    View All
                  </button>
                )}
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {/* "All" pill */}
                <button
                  type="button"
                  onClick={() => setActiveCategory(null)}
                  className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all active:scale-95 ${
                    activeCategory === null
                      ? 'bg-[var(--lime-base)] text-black shadow-md shadow-[var(--lime-base)]/25'
                      : 'bg-white text-slate-800 border border-gray-200 hover:border-gray-300 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700'
                  }`}
                >
                  {getCategorySvgIcon('all', { size: 16, className: activeCategory === null ? 'text-black' : 'text-[var(--lime-dark)]' })}
                  All
                </button>

                {categories.map((cat) => {
                  const isActive = activeCategory === cat.id
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setActiveCategory(isActive ? null : cat.id)}
                      className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all active:scale-95 ${
                        isActive
                          ? 'bg-[var(--lime-base)] text-black shadow-md shadow-[var(--lime-base)]/25'
                          : 'bg-white text-slate-800 border border-gray-200 hover:border-gray-300 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700'
                      }`}
                    >
                      {getCategorySvgIcon(cat.name, { size: 16, className: isActive ? 'text-black' : 'text-[var(--lime-dark)]' })}
                      {cat.name}
                      <span className={`text-[10px] font-bold ${isActive ? 'text-black/60' : 'text-slate-400 dark:text-zinc-500'}`}>
                        {itemsInCategory(cat.id)}
                      </span>
                    </button>
                  )
                })}
              </div>
            </section>
          )}

          {/* ─── CATALOG & PRODUCT CARDS GRID / LIST ───────────────────────── */}
          <section className="space-y-3 pb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-slate-900 dark:text-zinc-100">
                {activeCategory
                  ? `${categories.find((c) => c.id === activeCategory)?.name ?? 'Category'} (${filtered.length})`
                  : isRestaurant
                  ? `Menu (${items.length})`
                  : `Store Catalog (${items.length})`}
              </h2>

              {/* View Mode Toggle for Retail & Grocery */}
              {!isRestaurant && (
                <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold transition-all ${
                      viewMode === 'grid'
                        ? 'bg-white text-slate-900 shadow-sm dark:bg-zinc-700 dark:text-white'
                        : 'text-slate-500 hover:text-slate-800 dark:text-zinc-400'
                    }`}
                    aria-label="Grid View"
                    title="Grid View"
                  >
                    <LayoutGrid size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold transition-all ${
                      viewMode === 'list'
                        ? 'bg-white text-slate-900 shadow-sm dark:bg-zinc-700 dark:text-white'
                        : 'text-slate-500 hover:text-slate-800 dark:text-zinc-400'
                    }`}
                    aria-label="List View"
                    title="List View"
                  >
                    <List size={14} />
                  </button>
                </div>
              )}
            </div>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center py-10 text-center space-y-3">
                <ItemUnavailableIllustration className="w-56 h-40 rounded-2xl" />
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-zinc-100">No items found</p>
                  <p className="mt-1 text-xs text-slate-400">
                    {search ? `No items match "${search}"` : 'This store has no active catalog items listed.'}
                  </p>
                </div>
              </div>
            ) : (isRestaurant || viewMode === 'grid') ? (
              /* ── Image-First Grid View ───────────────────────────────────── */
              <div className="grid grid-cols-2 gap-3">
                {filtered.map((item) => {
                  const notedInList = isInList(item.id)
                  const categoryName = item.category?.name

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedItem(item)}
                      className="flex flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm text-left transition-all active:scale-[0.97] hover:border-gray-300 dark:border-zinc-800 dark:bg-zinc-900"
                    >
                      {/* Image Hero with Ambient Fallback */}
                      <div className={`relative aspect-[4/3] w-full overflow-hidden bg-gradient-to-br ${getCategoryGradient(categoryName)}`}>
                        {item.image_url ? (
                          <Image
                            src={resolveUrl(item.image_url)}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 448px) 50vw, 224px"
                          />
                        ) : (
                          <div className="flex h-full flex-col items-center justify-center p-3 text-center text-slate-300 dark:text-zinc-300">
                            <div className="p-2 rounded-2xl bg-slate-900/40 backdrop-blur-sm border border-white/10 text-[var(--lime-base)]">
                              {getCategorySvgIcon(categoryName ?? item.name, { size: 28 })}
                            </div>
                            <span className="mt-1.5 text-[10px] font-bold text-slate-400 dark:text-zinc-400 uppercase tracking-wide">
                              {categoryName ?? 'Specialty'}
                            </span>
                          </div>
                        )}

                        {/* Noted badge */}
                        {notedInList && (
                          <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900/90 text-white shadow-md">
                            <Check size={13} strokeWidth={3} />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex flex-1 flex-col p-3 space-y-1">
                        <p className="line-clamp-2 text-xs font-bold text-slate-900 dark:text-zinc-100 leading-tight min-h-[2rem]">
                          {item.name}
                        </p>

                        {item.description && (
                          <p className="line-clamp-2 text-[11px] text-slate-500 dark:text-zinc-400 leading-tight">
                            {item.description}
                          </p>
                        )}

                        <div className="mt-auto flex items-center justify-between pt-2">
                          {item.base_price !== null ? (
                            <span className="text-sm font-black text-slate-900 dark:text-zinc-100">
                              ₦{item.base_price.toLocaleString()}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-bold">Price on request</span>
                          )}

                          <span
                            className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
                              notedInList
                                ? 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                                : 'bg-[var(--lime-base)] text-black shadow-sm'
                            }`}
                          >
                            {notedInList ? <Check size={14} strokeWidth={3} /> : <Plus size={14} strokeWidth={3} />}
                          </span>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            ) : (
              /* ── Compact Row List View ────────────────────────────────────── */
              <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
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
        </div>
      </div>
    </>
  )
}
