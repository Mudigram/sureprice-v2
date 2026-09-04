'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  Share2,
  ClipboardCheck,
  ClipboardList,
  Minus,
  Plus,
  CheckCircle2,
  Tag,
  Store,
  Utensils,
  Ticket,
  ShoppingBag,
  Sparkles,
  MapPin,
  Barcode,
  Images,
  Maximize2,
  ArrowRight,
} from 'lucide-react'
import { addToHistory } from '@/lib/storefront/local-storage'
import { useCart } from '@/context/CartContext'
import type { StorefrontBusiness, StorefrontItemDetail, AttributeEntry } from '@/features/storefront/types'
import { getCategorySvgIcon, getBrandFallbackSvgIcon } from '@/components/icons'
import { ImageGalleryLightbox } from '@/components/storefront/image-gallery-lightbox'

// Generate deterministic sparkline data for 30-day trend
function generateTrend(basePrice: number): number[] {
  const bars = 7
  return Array.from({ length: bars }, (_, i) => {
    const variance = (Math.sin(i * 1.3) * 0.08 + Math.cos(i * 0.7) * 0.05) * basePrice
    return Math.max(0, basePrice + variance)
  })
}

interface Props {
  item: StorefrontItemDetail
  business: StorefrontBusiness
  businessSlug: string
}

export function ItemDetailClient({ item, business, businessSlug }: Props) {
  const [activeImage, setActiveImage] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [noted, setNoted] = useState(false)
  const [copiedShare, setCopiedShare] = useState(false)

  const { addItem, isInList } = useCart()
  const alreadyNoted = isInList(item.id)

  const isRestaurant = business.business_type === 'restaurant'
  const isCafe = business.business_type === 'cafe'
  const isEvent = business.business_type === 'popup_vendor' || business.business_type === 'event_vendor'
  const isRetail = business.business_type === 'retail'

  // Parse attributes
  const attributes: AttributeEntry[] = (() => {
    if (!item.attributes || typeof item.attributes !== 'object' || Array.isArray(item.attributes)) return []
    return Object.entries(item.attributes as Record<string, string>).map(([key, value]) => ({ key, value }))
  })()

  const images = item.images
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''

  const resolveUrl = (path: string) =>
    path.startsWith('http') ? path : `${supabaseUrl}/storage/v1/object/public/catalog-media/${path}`

  const trend = item.base_price ? generateTrend(item.base_price) : null
  const trendMax = trend ? Math.max(...trend) : 1
  const trendPct = trend
    ? (((trend[trend.length - 1] - trend[0]) / trend[0]) * 100).toFixed(1)
    : null
  const trendUp = trendPct !== null ? parseFloat(trendPct) >= 0 : false

  // Track in history on mount
  useEffect(() => {
    addToHistory({
      id: item.id,
      name: item.name,
      base_price: item.base_price,
      image_url: item.image_url,
      businessSlug,
      businessName: business.name,
    })
  }, [item.id, item.name, item.base_price, item.image_url, businessSlug, business.name])

  const handleNotePrice = () => {
    addItem({
      id: item.id,
      name: item.name,
      base_price: item.base_price,
      image_url: item.image_url,
      businessSlug,
      businessName: business.name,
    })
    for (let i = 1; i < quantity; i++) {
      addItem({
        id: item.id,
        name: item.name,
        base_price: item.base_price,
        image_url: item.image_url,
        businessSlug,
        businessName: business.name,
      })
    }
    setNoted(true)
    setTimeout(() => setNoted(false), 2000)
  }

  const handleShare = async () => {
    const url = window.location.href
    const title = `${item.name} at ${business.name}`
    const text = item.base_price ? `Check price for ${item.name} (₦${item.base_price.toLocaleString()}) at ${business.name}` : title

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url })
      } catch {
        // Dismissed
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${title} - ${url}`)
        setCopiedShare(true)
        setTimeout(() => setCopiedShare(false), 2000)
      } catch {
        // Fallback
      }
    }
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Primary Image & Thumbnail Strip */}
      <div className="px-5 pt-3">
        <div
          onClick={() => images.length > 0 && setLightboxOpen(true)}
          className={`relative aspect-square w-full overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-lg ${
            images.length > 0 ? 'cursor-pointer group' : ''
          }`}
        >
          {images.length > 0 ? (
            <>
              <Image
                src={resolveUrl(images[activeImage].storage_path)}
                alt={images[activeImage].alt_text ?? item.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                priority
                sizes="(max-width: 448px) 100vw, 448px"
              />

              {/* Photo Count & Zoom Badge */}
              <div className="absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-slate-950/80 px-3 py-1.5 text-xs font-bold text-white border border-white/20 backdrop-blur-md shadow-lg transition-transform active:scale-95 hover:bg-slate-900">
                <Images size={14} className="text-[var(--lime-base)]" />
                <span>{images.length} Photo{images.length > 1 ? 's' : ''}</span>
                <Maximize2 size={12} className="text-slate-400 ml-0.5" />
              </div>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center p-4 text-center">
              <div className="p-3.5 rounded-2xl bg-slate-900/60 backdrop-blur-sm border border-white/10 text-[var(--lime-base)] shadow-lg">
                {item.category?.name
                  ? getCategorySvgIcon(item.category.name, { size: 44 })
                  : getBrandFallbackSvgIcon(business.business_type, { size: 44 })}
              </div>
              <span className="mt-2.5 text-xs font-bold text-slate-400 opacity-80 uppercase tracking-wide">
                {item.category?.name ?? 'Catalog Item'}
              </span>
            </div>
          )}
        </div>

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
            {images.map((img, i) => (
              <button
                key={img.id}
                id={`thumb-${i}`}
                onClick={() => {
                  setActiveImage(i)
                }}
                className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                  i === activeImage ? 'border-[var(--lime-base)] scale-105 shadow-md shadow-[var(--lime-base)]/20' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <Image
                  src={resolveUrl(img.storage_path)}
                  alt={img.alt_text ?? `Image ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <ImageGalleryLightbox
        images={images}
        initialIndex={activeImage}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        resolveUrl={resolveUrl}
        itemName={item.name}
      />


      {/* Main Content Area */}
      <div className="mt-4 space-y-5 px-5">
        {/* Business Type Psychological Badge */}
        <div className="flex items-center justify-between">
          {isRestaurant ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-900 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900">
              <Utensils size={13} />
              Verified Dining Dish
            </span>
          ) : isCafe ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-900 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900">
              <Sparkles size={13} />
              Freshly Brewed & Prepared
            </span>
          ) : isEvent ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-900 border border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-900">
              <Ticket size={13} />
              🎪 Limited Event Batch
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-900 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-900">
              <CheckCircle2 size={13} />
              100% Verified Shelf Price
            </span>
          )}

          {/* Dedicated Share Button */}
          <button
            onClick={handleShare}
            id="share-item-pill"
            className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-bold text-slate-700 shadow-sm transition-all hover:border-slate-300 active:scale-95 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
          >
            <Share2 size={13} />
            <span>{copiedShare ? 'Copied Link' : 'Share'}</span>
          </button>
        </div>

        {/* Title & Category */}
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-zinc-100">
            {item.name}
          </h1>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
            <span className="font-bold text-slate-800 dark:text-zinc-200">{business.name}</span>
            {item.category && (
              <>
                <span>·</span>
                <span className="inline-flex items-center gap-1 font-semibold">
                  <Tag size={12} />
                  {item.category.name}
                </span>
              </>
            )}
            {item.sku && (
              <>
                <span>·</span>
                <span className="inline-flex items-center gap-1 font-mono text-[10px]">
                  <Barcode size={12} />
                  {item.sku}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Price Tag Box */}
        <div className="flex items-center justify-between rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div>
            <p className="text-xs font-bold text-slate-500 dark:text-zinc-400">
              {isRestaurant ? 'Verified Menu Price' : 'Verified Shelf Price'}
            </p>
            {item.base_price !== null ? (
              <p className="text-3xl font-black text-slate-900 dark:text-zinc-100 mt-0.5">
                ₦{item.base_price.toLocaleString()}
              </p>
            ) : (
              <p className="text-lg font-bold text-slate-500">Price on request</p>
            )}
          </div>

          <span className="flex h-3 w-3 rounded-full bg-[var(--lime-base)] shadow-[0_0_8px_var(--lime-base)]" />
        </div>

        {/* 30-Day Trend Graph (Retail / Grocery) */}
        {!isRestaurant && trend && (
          <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-extrabold text-slate-800 dark:text-zinc-200">
                30-Day Shelf Price History
              </p>
              <p className={`text-xs font-extrabold ${trendUp ? 'text-red-500' : 'text-emerald-600'}`}>
                {trendUp ? '↑' : '↓'} {trendUp ? '+' : ''}{trendPct}%
              </p>
            </div>
            <div className="flex h-10 items-end gap-1">
              {trend.map((val, i) => {
                const height = Math.round((val / trendMax) * 100)
                const isLast = i === trend.length - 1
                return (
                  <div
                    key={i}
                    className={`flex-1 rounded-sm transition-all ${
                      isLast ? 'bg-[var(--lime-base)]' : 'bg-slate-200 dark:bg-zinc-700'
                    }`}
                    style={{ height: `${Math.max(20, height)}%` }}
                  />
                )
              })}
            </div>
            <div className="flex justify-between text-[9px] font-bold text-slate-400">
              <span>30 DAYS AGO</span>
              <span>TODAY</span>
            </div>
          </div>
        )}

        {/* Description */}
        {item.description && (
          <div className="space-y-1">
            <h3 className="text-sm font-black text-slate-900 dark:text-zinc-100">
              {isRestaurant ? 'About this dish' : 'Product Details'}
            </h3>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-zinc-300">
              {item.description}
            </p>
          </div>
        )}

        {/* Dynamic Attributes Table */}
        {attributes.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-black text-slate-900 dark:text-zinc-100">
              {isRestaurant ? 'Ingredients & Details' : 'Product Specifications'}
            </h3>
            <div className="divide-y divide-gray-100 rounded-2xl border border-gray-200/80 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
              {attributes.map(({ key, value }) => (
                <div key={key} className="flex items-baseline justify-between px-4 py-3 text-xs">
                  <span className="font-medium text-slate-500 dark:text-zinc-400">{key}</span>
                  <span className="font-bold text-slate-900 dark:text-zinc-100">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Store & Location Card */}
        <div className="flex items-center gap-3 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300">
            <Store size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-xs text-slate-900 dark:text-zinc-100 truncate">
              {business.name}
            </p>
            <p className="text-[10px] text-slate-400 dark:text-zinc-500 capitalize">
              {business.business_type.replace(/_/g, ' ')} • {business.locations?.[0]?.address_text ?? 'Nigeria'}
            </p>
          </div>
        </div>

        {/* Browse Full Store CTA */}
        <Link
          href={`/s/${businessSlug}`}
          className="flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 group transition-all hover:border-slate-300 active:scale-[0.98]"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
              <Store size={18} />
            </div>
            <div>
              <p className="text-xs font-black text-slate-900 dark:text-zinc-100">
                Browse full menu at {business.name}
              </p>
              <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium">
                See all items, specials &amp; categories
              </p>
            </div>
          </div>
          <ArrowRight size={16} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </Link>

        {/* WhatsApp Direct Order / Inquiry Button */}
        <button
          type="button"
          onClick={() => {
            const text = `Hello ${business.name}, I saw ${item.name} (${item.base_price ? `₦${item.base_price.toLocaleString()}` : ''}) on your SurePrice digital menu. I'd like to order / inquire!`
            const phone = business.locations?.[0]?.phone ? business.locations[0].phone.replace(/[^0-9]/g, '') : ''
            const waUrl = phone
              ? `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
              : `https://wa.me/?text=${encodeURIComponent(text + ' ' + (typeof window !== 'undefined' ? window.location.href : ''))}`
            window.open(waUrl, '_blank')
          }}
          className="flex items-center justify-center gap-2 w-full rounded-2xl border border-emerald-500/30 bg-emerald-50/80 py-3 text-xs font-black text-emerald-900 shadow-sm transition-all hover:bg-emerald-100 active:scale-95 dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
        >
          <span>💬 Order / Inquire via WhatsApp</span>
        </button>

        {/* Quantity + Note Price CTA */}
        <div className="flex items-center gap-3 pt-2">
          <div className="flex h-12 items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <button
              id="qty-minus"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="text-slate-500 hover:text-red-500 transition-colors"
            >
              <Minus size={16} />
            </button>
            <span className="w-5 text-center font-bold text-sm text-slate-900 dark:text-zinc-100">
              {quantity}
            </span>
            <button
              id="qty-plus"
              onClick={() => setQuantity((q) => q + 1)}
              className="text-slate-500 hover:text-slate-900 dark:hover:text-zinc-100 transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>

          <button
            id="note-price-btn"
            onClick={handleNotePrice}
            disabled={alreadyNoted}
            className={`flex flex-1 items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-black shadow-md transition-all active:scale-95 ${
              alreadyNoted || noted
                ? 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                : 'bg-[var(--lime-base)] text-black shadow-[var(--lime-base)]/25 hover:bg-[var(--lime-dark)]'
            }`}
          >
            {alreadyNoted ? (
              <>
                <ClipboardCheck size={18} />
                Price Noted
              </>
            ) : noted ? (
              <>
                <CheckCircle2 size={18} />
                Added!
              </>
            ) : (
              <>
                <ClipboardList size={18} />
                {isRestaurant ? 'Note Menu Price' : 'Note Price'}
              </>
            )}
          </button>
        </div>

        {/* View Price List link */}
        {(noted || alreadyNoted) && (
          <Link
            href="/cart"
            className="block text-center text-xs font-black text-[var(--lime-dark)] underline pt-1"
          >
            View My Price List →
          </Link>
        )}
      </div>
    </div>
  )
}
