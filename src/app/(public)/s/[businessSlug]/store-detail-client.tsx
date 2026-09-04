'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useMemo, useEffect } from 'react'
import { DishCard } from '@/components/storefront/dish-card'
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
  ShoppingBag,
  Info,
  Phone,
  Share2,
  ClipboardList,
} from 'lucide-react'
import { SearchInput } from '@/components/storefront/search-input'
import { ProductRow } from '@/components/storefront/product-row'
import { MenuItemSheet } from './menu-item-sheet'
import {
  computeIsOpen,
  type StorefrontBusiness,
  type StorefrontItem,
  type StorefrontCategory,
  type StorefrontLocation,
  type WeeklyOperatingHours,
  type StatusOverride,
} from '@/features/storefront/types'
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

// ─── Main Component ───────────────────────────────────────────────────────


interface Props {
  business: StorefrontBusiness
  items: StorefrontItem[]
  businessSlug: string
}

export function StoreDetailClient({ business, items, businessSlug }: Props) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'menu' | 'about'>('menu')
  const [selectedItem, setSelectedItem] = useState<StorefrontItem | null>(null)
  const [copiedLink, setCopiedLink] = useState(false)
  const [hoursExpanded, setHoursExpanded] = useState(false)
  const { isInList, totalCount } = useCart()

  const isRestaurant = business.business_type === 'restaurant' || business.business_type === 'cafe'
  const isEvent = business.business_type === 'popup_vendor' || business.business_type === 'event_vendor'

  // Extract branding configs from storefront table & storefront.theme JSON object
  const storefrontTheme = (business.storefront?.theme && typeof business.storefront.theme === 'object')
    ? (business.storefront.theme as Record<string, unknown>)
    : {}

  // Operating status from theme operating_hours or fallback location_hours
  const primaryLocation = business.locations?.[0]
  const themeHours = storefrontTheme.operating_hours as WeeklyOperatingHours | undefined
  const themeStatusOverride = storefrontTheme.status_override as StatusOverride | undefined
  const statusInfo = computeIsOpen(themeHours || primaryLocation?.location_hours, themeStatusOverride)
  const addressText = primaryLocation?.address_text ?? primaryLocation?.name ?? 'Nigeria'
  
  // Ordering WhatsApp phone: theme override first, then location phone
  const orderingConfig = storefrontTheme.ordering as { whatsapp_phone?: string } | undefined
  const phoneNumber = orderingConfig?.whatsapp_phone || primaryLocation?.phone

  const rawLogoUrl =
    (typeof (business.storefront as Record<string, unknown>)?.logo_url === 'string' && (business.storefront as Record<string, unknown>).logo_url as string) ||
    (typeof storefrontTheme.logo_url === 'string' && storefrontTheme.logo_url) ||
    (typeof storefrontTheme.logoUrl === 'string' && storefrontTheme.logoUrl) ||
    (Array.isArray((business as unknown as { media?: Array<{ target_type?: string; storage_path?: string }> }).media) &&
      (business as unknown as { media?: Array<{ target_type?: string; storage_path?: string }> }).media?.find(
        (m) => (m.target_type === 'business_logo' || m.target_type === 'logo') && typeof m.storage_path === 'string'
      )?.storage_path) ||
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
  
  // Announcement from theme object or string
  const announcement = (() => {
    if (typeof storefrontTheme.announcement === 'string') return storefrontTheme.announcement
    if (storefrontTheme.announcement && typeof storefrontTheme.announcement === 'object') {
      const a = storefrontTheme.announcement as { enabled?: boolean; text?: string }
      return a.enabled && a.text ? a.text : null
    }
    return null
  })()
  
  const highlights = Array.isArray(storefrontTheme.highlights) ? (storefrontTheme.highlights as string[]) : []

  // Special & featured items
  const specialItems = useMemo(() => {
    return items.filter((item) => {
      const attrs = item.attributes && typeof item.attributes === 'object' && !Array.isArray(item.attributes)
        ? (item.attributes as Record<string, string>)
        : {}
      return (
        attrs.special === 'true' ||
        attrs.Special === 'true' ||
        attrs.bestseller === 'true' ||
        attrs.Bestseller === 'true' ||
        attrs.featured === 'true' ||
        attrs.limited === 'true'
      )
    })
  }, [items])

  // Adaptive discovery threshold: only show search + specials carousel for larger menus
  const LARGE_MENU_THRESHOLD = 12

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

      <div className="min-h-screen pb-12 bg-slate-50">
        {/* ─── DYNAMIC HERO HEADER ────────────────────────────────────────────── */}

        <div className="px-5 pt-3">
          {/* Rounded Hero Cover Container */}
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-900 shadow-lg">
            {coverUrl ? (
              <Image
                src={coverUrl}
                alt={business.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 640px) 100vw, 640px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-rose-950 via-slate-900 to-amber-950 text-amber-400">
                {getBrandFallbackSvgIcon(business.business_type, { size: 56 })}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

            {/* Top-Left: Verified by SurePrice */}
            <div className="absolute left-3 top-3 z-10">
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-950/75 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-white border border-white/20 shadow-md">
                <CheckCircle2 size={10} className="text-[var(--lime-base)]" />
                Verified by SurePrice
              </span>
            </div>

            {/* Top-Right: Open/Closed Status */}
            <div className="absolute right-3 top-3 z-10">
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-950/80 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-white border border-white/20 shadow-md">
                <span className={`h-1.5 w-1.5 rounded-full ${statusInfo.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                {statusInfo.text}
              </span>
            </div>

            {/* Store Brand Logo (Bottom-Left on Hero Banner) */}
            <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2">
              <div className="relative h-13 w-13 sm:h-15 sm:w-15 shrink-0 overflow-hidden rounded-2xl border-2 border-white bg-white shadow-xl p-0.5 backdrop-blur-md">
                {logoUrl ? (
                  <Image
                    src={logoUrl}
                    alt={`${business.name} logo`}
                    fill
                    className="object-cover rounded-xl"
                    sizes="60px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 text-slate-800 shadow-inner">
                    {getBrandFallbackSvgIcon(business.business_type, { size: 24 })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Identity Block: Name + WhatsApp Chat */}
          <div className="mt-3.5 space-y-1.5">
            <div className="flex items-start justify-between gap-2">
              <h1 className="text-2xl font-black tracking-tight text-slate-900 leading-tight">
                {business.name}
              </h1>
              {phoneNumber && (
                <a
                  href={`https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${business.name}, I found you on SurePrice!`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-black text-white shadow-md shadow-emerald-500/25 active:scale-95 transition-all"
                >
                  <span>💬</span>
                  <span>Chat</span>
                </a>
              )}
            </div>

            {/* Address Row */}
            <p className="flex items-center gap-1 text-xs font-medium text-slate-500">
              <MapPin size={13} className="shrink-0 text-slate-400" />
              <span className="truncate">{addressText}</span>
            </p>

            {/* Merchant Custom Announcement (conditional — merchant-authored only) */}
            {announcement && (
              <div className="mt-2.5 flex items-center gap-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 px-3.5 py-2.5 text-xs font-bold text-amber-900 backdrop-blur-md">
                <span className="text-sm">📢</span>
                <p className="min-w-0 flex-1 truncate">{announcement}</p>
              </div>
            )}
          </div>

          {/* Segmented Tab Selector [ Menu | About ] */}
          {isRestaurant && (
            <div className="mt-4 flex rounded-2xl bg-slate-200/80 p-1 border border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab('menu')}
                className={`flex-1 rounded-xl py-2.5 text-xs font-black transition-all ${
                  activeTab === 'menu'
                    ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Menu
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('about')}
                className={`flex-1 rounded-xl py-2.5 text-xs font-black transition-all ${
                  activeTab === 'about'
                    ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                About
              </button>
            </div>
          )}
        </div>

        <div className="mt-4 space-y-5 px-5">
          {/* ─── ABOUT TAB VIEW ─────────────────────────────────────────── */}
          {isRestaurant && activeTab === 'about' ? (
            <div className="space-y-4 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm">
              {tagline && (
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Tagline</h3>
                  <p className="mt-0.5 text-sm font-bold text-slate-800 italic">
                    &ldquo;{tagline}&rdquo;
                  </p>
                </div>
              )}

              {/* Weekly Hours Accordion (from theme operating_hours or fallback location_hours) */}
              {(themeHours || (primaryLocation?.location_hours && primaryLocation.location_hours.length > 0)) && (
                <div>
                  <button
                    type="button"
                    onClick={() => setHoursExpanded((p) => !p)}
                    className="flex w-full items-center justify-between text-xs font-black uppercase tracking-wider text-slate-700"
                  >
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} className="text-slate-400" />
                      Store Hours
                    </span>
                    <span className={`transition-transform text-slate-400 ${hoursExpanded ? 'rotate-180' : ''}`}>▾</span>
                  </button>
                  {hoursExpanded && (
                    <div className="mt-2 divide-y divide-slate-100 rounded-xl border border-slate-100 bg-slate-50 text-xs">
                      {[
                        { key: 'monday', label: 'Monday', dow: 1 },
                        { key: 'tuesday', label: 'Tuesday', dow: 2 },
                        { key: 'wednesday', label: 'Wednesday', dow: 3 },
                        { key: 'thursday', label: 'Thursday', dow: 4 },
                        { key: 'friday', label: 'Friday', dow: 5 },
                        { key: 'saturday', label: 'Saturday', dow: 6 },
                        { key: 'sunday', label: 'Sunday', dow: 0 },
                      ].map(({ key, label, dow }) => {
                        const dayData = themeHours
                          ? themeHours[key as keyof WeeklyOperatingHours]
                          : null
                        const legacyData = primaryLocation?.location_hours
                          ? primaryLocation.location_hours.find((x) => x.day_of_week === dow)
                          : null

                        const isClosed = dayData ? dayData.closed : (legacyData ? legacyData.is_closed : false)
                        const openTime = dayData ? dayData.open : legacyData?.open_time
                        const closeTime = dayData ? dayData.close : legacyData?.close_time

                        return (
                          <div key={key} className="flex items-center justify-between px-3 py-2">
                            <span className="font-bold text-slate-700">{label}</span>
                            {!isClosed && openTime && closeTime ? (
                              <span className="font-medium text-slate-600">{openTime} – {closeTime}</span>
                            ) : (
                              <span className="font-medium text-rose-500">Closed</span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Amenity Badges */}
              {highlights.length > 0 && (
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Features &amp; Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {highlights.map((hKey) => {
                      const badge = highlightBadgesMap[hKey]
                      if (!badge) return null
                      return (
                        <span
                          key={hKey}
                          className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 border border-slate-200"
                        >
                          {getAmenitySvgIcon(badge.iconKey, { size: 14 })}
                          <span>{badge.label}</span>
                        </span>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="flex items-center gap-2.5 pt-2 border-t border-slate-100">
                {phoneNumber && (
                  <a
                    href={`https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${business.name}, I found you on SurePrice and would like to inquire!`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-50 py-3 text-xs font-extrabold text-emerald-900 border border-emerald-200 active:scale-95 transition-all"
                  >
                    <span>💬</span>
                    <span>WhatsApp</span>
                  </a>
                )}
                {phoneNumber && (
                  <a
                    href={`tel:${phoneNumber}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 py-3 text-xs font-extrabold text-slate-800 border border-slate-200 active:scale-95 transition-all"
                  >
                    <Phone size={14} className="text-rose-500" />
                    <span>Call Store</span>
                  </a>
                )}

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${business.name} ${addressText}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 py-3 text-xs font-extrabold text-slate-800 border border-slate-200 active:scale-95 transition-all"
                >
                  <MapPin size={14} className="text-rose-500" />
                  <span>Directions</span>
                </a>

                <button
                  type="button"
                  onClick={handleSharePage}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 py-3 text-xs font-black text-white shadow-md active:scale-95 transition-all"
                >
                  <Share2 size={14} />
                  <span>{copiedLink ? 'Copied!' : 'Share'}</span>
                </button>

              </div>
            </div>
          ) : (
            /* ─── MENU TAB VIEW ─────────────────────────────────────────── */
            <>
              {/* Search Bar — only shown for larger menus (>= 12 items) */}
              {items.length >= LARGE_MENU_THRESHOLD && (
                <SearchInput
                  placeholder={isRestaurant ? "Search dishes or drinks…" : isEvent ? "Search event items…" : "Search products…"}
                  value={search}
                  onChange={setSearch}
                />
              )}

              {/* ─── TODAY'S SPECIALS & CHEF PICKS SHOWCASE — only for larger menus ─── */}
              {items.length >= LARGE_MENU_THRESHOLD && !search && !activeCategory && specialItems.length > 0 && (
                <section className="mb-1">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                      <h2 className="text-sm font-black text-slate-900">
                        {isRestaurant
                          ? "🔥 Chef's Specials & Highlights"
                          : business.business_type === 'cafe'
                          ? "☕ Fresh Brews & Daily Specials"
                          : isEvent
                          ? "🎪 Limited Event Drops"
                          : "⭐ Featured Weekly Deals"}
                      </h2>
                    </div>
                    <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-black text-rose-600">
                      {specialItems.length} featured
                    </span>
                  </div>

                  <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 pt-0.5 -mx-5 px-5">
                    {specialItems.map((item) => (
                      <div key={`special-${item.id}`} className="w-[270px] sm:w-[300px] shrink-0">
                        <DishCard
                          product={item}
                          businessSlug={businessSlug}
                          businessName={business.name}
                          onOpenSheet={() => setSelectedItem(item)}
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* ─── HORIZONTAL CATEGORY FILTER PILLS ──────────────────────── */}
              {!search && categories.length > 0 && (
                <section>

                  <div className="mb-2.5 flex items-center justify-between">
                    <h2 className="text-sm font-black text-slate-900">
                      {isRestaurant ? 'Menu Categories' : isEvent ? 'Stall Sections' : 'Store Departments'}
                    </h2>
                    {activeCategory && (
                      <button
                        onClick={() => setActiveCategory(null)}
                        className="text-xs font-bold text-rose-500 hover:underline"
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
                      className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all active:scale-95 border ${
                        activeCategory === null
                          ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white border-transparent shadow-md'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      {getCategorySvgIcon('all', { size: 16, className: activeCategory === null ? 'text-white' : 'text-rose-500' })}
                      All
                    </button>

                    {categories.map((cat) => {
                      const isActive = activeCategory === cat.id
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setActiveCategory(isActive ? null : cat.id)}
                          className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all active:scale-95 border ${
                            isActive
                              ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white border-transparent shadow-md'
                              : 'bg-white text-slate-700 border-slate-200'
                          }`}
                        >
                          {getCategorySvgIcon(cat.name, { size: 16, className: isActive ? 'text-white' : 'text-rose-500' })}
                          {cat.name}
                          <span className={`text-[10px] font-bold ${isActive ? 'text-white/80' : 'text-slate-400'}`}>
                            {itemsInCategory(cat.id)}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </section>
              )}

              {/* ─── CATALOG & DISH CARDS GRID / LIST ───────────────────────── */}
              <section className="space-y-3 pb-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-black text-slate-900">
                    {activeCategory
                      ? `${categories.find((c) => c.id === activeCategory)?.name ?? 'Category'} (${filtered.length})`
                      : isRestaurant
                      ? `Menu Items (${items.length})`
                      : `Store Catalog (${items.length})`}
                  </h2>
                </div>

                {filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white py-12 text-center shadow-sm">
                    <ItemUnavailableIllustration className="w-36 h-28 opacity-80" />
                    <p className="mt-3 text-sm font-extrabold text-slate-900">
                      No items found
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Try searching with different terms or selecting another category
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {filtered.map((item) => (
                      isRestaurant || isEvent || business.business_type === 'cafe' ? (
                        <DishCard
                          key={item.id}
                          product={item}
                          businessSlug={businessSlug}
                          businessName={business.name}
                          onOpenSheet={() => setSelectedItem(item)}
                        />
                      ) : (
                        <ProductRow
                          key={item.id}
                          product={item}
                          businessSlug={businessSlug}
                          businessName={business.name}
                        />
                      )
                    ))}
                  </div>
                )}
              </section>

            </>
          )}
        </div>
      </div>
    </>
  )
}
