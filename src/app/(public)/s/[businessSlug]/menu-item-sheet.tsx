'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  Utensils,
  Minus,
  Plus,
  ClipboardList,
  ClipboardCheck,
  CheckCircle2,
  Share2,
  Tag,
  Ticket,
  ShoppingBag,
  Images,
  Maximize2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { BottomSheet } from '@/components/ui/bottom-sheet'
import { useCart } from '@/context/CartContext'
import type { StorefrontItem, StorefrontBusiness } from '@/features/storefront/types'
import { getCategorySvgIcon } from '@/components/icons'
import { ImageGalleryLightbox, type GalleryImage } from '@/components/storefront/image-gallery-lightbox'

interface Props {
  item: (StorefrontItem & { images?: GalleryImage[] }) | null
  business: StorefrontBusiness
  businessSlug: string
  open: boolean
  onClose: () => void
}

export function MenuItemSheet({ item, business, businessSlug, open, onClose }: Props) {
  const [quantity, setQuantity] = useState<number>(1)
  const [noted, setNoted] = useState<boolean>(false)
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false)
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0)

  // Touch swipe tracking state
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const { addItem, isInList } = useCart()

  if (!item) return null

  const alreadyNoted = isInList(item.id)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''

  const resolveUrl = (path: string) =>
    path.startsWith('http') ? path : `${supabaseUrl}/storage/v1/object/public/catalog-media/${path}`

  // Prepare images list (either attached images or fallback to image_url)
  const itemImages: GalleryImage[] = item.images && item.images.length > 0
    ? item.images
    : item.image_url
    ? [{ id: 'primary', storage_path: item.image_url }]
    : []

  const currentImage = itemImages[activeImageIndex] || itemImages[0]

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd || itemImages.length <= 1) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 40
    const isRightSwipe = distance < -40

    if (isLeftSwipe) {
      setActiveImageIndex((prev: number) => (prev + 1) % itemImages.length)
    } else if (isRightSwipe) {
      setActiveImageIndex((prev: number) => (prev - 1 + itemImages.length) % itemImages.length)
    }
    setTouchStart(null)
    setTouchEnd(null)
  }

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setActiveImageIndex((prev: number) => (prev - 1 + itemImages.length) % itemImages.length)
  }

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setActiveImageIndex((prev: number) => (prev + 1) % itemImages.length)
  }


  // Parse attributes
  const attributes: { key: string; value: string }[] = (() => {
    if (!item.attributes || typeof item.attributes !== 'object' || Array.isArray(item.attributes)) return []
    return Object.entries(item.attributes as Record<string, string>).map(([key, value]) => ({ key, value }))
  })()

  const handleNotePrice = () => {
    for (let i = 0; i < quantity; i++) {
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
    setTimeout(() => {
      setNoted(false)
      onClose()
    }, 1200)
  }

  const handleShare = async () => {
    const url = `${window.location.origin}/s/${businessSlug}/${item.id}`
    const title = `${item.name} at ${business.name}`
    const text = item.base_price
      ? `Check price for ${item.name} (₦${item.base_price.toLocaleString()}) at ${business.name}`
      : title

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url })
      } catch {
        // Dismissed
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${title} - ${url}`)
      } catch {
        // Fallback
      }
    }
  }

  const isRestaurant = business.business_type === 'restaurant' || business.business_type === 'cafe'
  const isEvent = business.business_type === 'popup_vendor' || business.business_type === 'event_vendor'

  const itemTypeLabel = isRestaurant ? 'Digital Menu Item' : isEvent ? 'Event Stall Item' : 'Verified Shelf Item'
  const ItemTypeIcon = isRestaurant ? Utensils : isEvent ? Ticket : ShoppingBag
  const priceLabel = isRestaurant ? 'Verified Menu Price' : 'Verified In-Store Price'

  return (
    <BottomSheet open={open} onClose={onClose}>
      <div className="space-y-4 pb-2">
        {/* Touch-Swipeable Hero Carousel Container */}
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={() => itemImages.length > 0 && setLightboxOpen(true)}
          className={`relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-slate-950/30 border border-gray-200 select-none ${
            itemImages.length > 0 ? 'cursor-pointer group' : ''
          }`}
        >
          {currentImage ? (
            <>
              <Image
                src={resolveUrl(currentImage.storage_path)}
                alt={currentImage.alt_text ?? item.name}
                fill
                className="object-cover transition-all duration-300 group-hover:scale-105"
                sizes="(max-width: 448px) 100vw, 448px"
              />

              {/* Photo Count & Lightbox Trigger Badge */}
              <div className="absolute right-2.5 top-2.5 z-10 flex items-center gap-1.5 rounded-full bg-slate-950/80 px-2.5 py-1 text-[11px] font-bold text-white border border-white/20 backdrop-blur-md shadow-md">
                <Images size={13} className="text-[var(--lime-base)]" />
                <span>
                  {itemImages.length > 1
                    ? `${activeImageIndex + 1}/${itemImages.length} Photos`
                    : 'View Photo'}
                </span>
                <Maximize2 size={11} className="text-slate-400" />
              </div>

              {/* Desktop Left/Right Navigation Arrows */}
              {itemImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/70 text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity active:scale-95 shadow-lg"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/70 text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity active:scale-95 shadow-lg"
                    aria-label="Next photo"
                  >
                    <ChevronRight size={16} />
                  </button>
                </>
              )}

              {/* Pagination Dot Indicators (•••) */}
              {itemImages.length > 1 && (
                <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 rounded-full bg-slate-950/75 px-2.5 py-1.5 backdrop-blur-md border border-white/10 shadow-lg">
                  {itemImages.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setActiveImageIndex(i)
                      }}
                      className={`transition-all rounded-full ${
                        i === activeImageIndex
                          ? 'w-4 h-1.5 bg-[var(--lime-base)] shadow-[0_0_6px_var(--lime-base)]'
                          : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center p-4 text-center">
              <div className="p-3 rounded-2xl bg-slate-900/40 backdrop-blur-sm border border-white/10 text-[var(--lime-base)] shadow-md">
                {getCategorySvgIcon(item.category?.name ?? item.name, { size: 40 })}
              </div>
              <span className="mt-2 text-xs font-bold text-slate-400 opacity-80 uppercase tracking-wide">
                {item.category?.name ?? 'Catalog Item'}
              </span>
            </div>
          )}
        </div>

        <ImageGalleryLightbox
          images={itemImages}
          initialIndex={activeImageIndex}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          resolveUrl={resolveUrl}
          itemName={item.name}
        />

        {/* Badge + Share Row */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-900 border border-emerald-200">
            <ItemTypeIcon size={13} />
            {itemTypeLabel}
          </span>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-bold text-slate-700 shadow-sm transition-all hover:border-gray-300 active:scale-95"
          >
            <Share2 size={13} />
            <span>Share</span>
          </button>
        </div>

        {/* Title & Category */}
        <div>
          <h3 className="text-xl font-black tracking-tight text-slate-900">
            {item.name}
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="font-bold text-slate-800">{business.name}</span>
            {item.category && (
              <>
                <span>·</span>
                <span className="inline-flex items-center gap-1 font-semibold">
                  <Tag size={12} />
                  {item.category.name}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Price Box */}
        <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-slate-50 p-4">
          <div>
            <p className="text-xs font-bold text-slate-500">
              {priceLabel}
            </p>
            {item.base_price !== null ? (
              <p className="text-3xl font-black text-slate-900 mt-0.5">
                ₦{item.base_price.toLocaleString()}
              </p>
            ) : (
              <p className="text-lg font-bold text-slate-500">Price on request</p>
            )}
          </div>
          <span className="flex h-3 w-3 rounded-full bg-[var(--lime-base)] shadow-[0_0_8px_var(--lime-base)]" />
        </div>

        {/* Description */}
        {item.description && (
          <div className="space-y-1">
            <h4 className="text-sm font-black text-slate-900">
              About this dish
            </h4>
            <p className="text-xs leading-relaxed text-slate-600">
              {item.description}
            </p>
          </div>
        )}

        {/* Attributes / Ingredients */}
        {attributes.filter(({ value }) => value && String(value).trim() !== '').length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-black text-slate-900">
              Ingredients & Details
            </h4>
            <div className="divide-y divide-gray-100 rounded-2xl border border-gray-200 bg-white">
              {attributes
                .filter(({ value }) => value && String(value).trim() !== '')
                .map(({ key, value }) => (
                  <div key={key} className="flex items-baseline justify-between px-4 py-3 text-xs">
                    <span className="font-medium text-slate-500">{key}</span>
                    <span className="font-bold text-slate-900">{value}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* WhatsApp Quick Order Button */}
        <button
          type="button"
          onClick={() => {
            const tableNum = typeof window !== 'undefined'
              ? new URLSearchParams(window.location.search).get('table')
              : null
            const tablePrefix = tableNum ? `Order for Table ${tableNum}: ` : ''
            const text = `Hello ${business.name}, ${tablePrefix}I saw ${item.name}${item.base_price ? ` (₦${item.base_price.toLocaleString()})` : ''} on your SurePrice menu. I'd like to order or inquire!`
            const phone = business.locations?.[0]?.phone ? business.locations[0].phone.replace(/[^0-9]/g, '') : ''
            const url = `${window.location.origin}/s/${businessSlug}/${item.id}`
            const waUrl = phone
              ? `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
              : `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`
            window.open(waUrl, '_blank')
          }}
          className="flex items-center justify-center gap-2 w-full rounded-2xl border border-emerald-400/40 bg-emerald-50 py-3.5 text-sm font-black text-emerald-900 shadow-sm transition-all hover:bg-emerald-100 active:scale-95"
        >
          <span>💬 Order / Inquire via WhatsApp</span>
        </button>

        {/* Quantity + Note CTA */}
        <div className="flex items-center gap-3 pt-1">
          <div className="flex h-14 items-center gap-4 rounded-2xl border border-gray-200 bg-white px-5 shadow-sm">
            <button
              type="button"
              onClick={() => setQuantity((q: number) => Math.max(1, q - 1))}
              className="flex h-11 w-11 items-center justify-center text-slate-500 hover:text-red-500 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus size={18} />
            </button>
            <span className="w-5 text-center font-black text-lg text-slate-900">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q: number) => q + 1)}
              className="flex h-11 w-11 items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus size={18} />
            </button>
          </div>

          <button
            type="button"
            onClick={handleNotePrice}
            disabled={alreadyNoted}
            className={`flex flex-1 items-center justify-center gap-2 rounded-2xl py-4 text-sm font-black shadow-md transition-all active:scale-95 ${
              alreadyNoted || noted
                ? 'bg-slate-900 text-white'
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
                + Add to My List
              </>
            )}
          </button>
        </div>
      </div>
    </BottomSheet>
  )
}
