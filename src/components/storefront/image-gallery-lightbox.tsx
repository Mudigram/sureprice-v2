'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'

export interface GalleryImage {
  id: string
  storage_path: string
  alt_text?: string | null
}

interface ImageGalleryLightboxProps {
  images: GalleryImage[]
  initialIndex?: number
  isOpen: boolean
  onClose: () => void
  resolveUrl: (path: string) => string
  itemName?: string
}

export function ImageGalleryLightbox({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
  resolveUrl,
  itemName = 'Item Image',
}: ImageGalleryLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  // Sync index when initialIndex changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex)
    }
  }, [isOpen, initialIndex])

  // Prevent scrolling behind lightbox
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }, [images.length])

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  // Keyboard accessibility (Esc, ArrowLeft, ArrowRight)
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowRight') {
        handleNext()
      } else if (e.key === 'ArrowLeft') {
        handlePrev()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, handleNext, handlePrev])

  if (!isOpen || images.length === 0) return null

  const currentImage = images[currentIndex] || images[0]

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between bg-slate-900/90 backdrop-blur-2xl animate-in fade-in duration-200">
      {/* Top Bar */}
      <div
        className="flex items-center justify-between p-4 z-10"
        style={{ paddingTop: 'calc(1rem + env(safe-area-inset-top))' }}
      >
        <div className="min-w-0 pr-4">
          <p className="truncate text-base font-black text-white">{itemName}</p>
          <p className="text-xs font-extrabold text-slate-300">
            Image {currentIndex + 1} of {images.length}
          </p>
        </div>

        {/* Dominant Circular X Close Button */}
        <button
          onClick={onClose}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-slate-900 shadow-2xl hover:bg-slate-100 active:scale-95 transition-all border border-slate-200"
          aria-label="Close photo gallery"
        >
          <X size={20} strokeWidth={3} />
        </button>
      </div>

      {/* Main Image View */}
      <div
        className="relative flex-1 flex items-center justify-center px-4 my-auto cursor-pointer"
        onClick={onClose}
      >
        <div
          className="relative h-[65vh] w-full max-w-2xl overflow-hidden rounded-3xl shadow-2xl border border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src={resolveUrl(currentImage.storage_path)}
            alt={currentImage.alt_text ?? `${itemName} photo ${currentIndex + 1}`}
            fill
            className="object-contain transition-all duration-300"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>

        {/* Previous Button */}
        {images.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              handlePrev()
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-slate-950/80 text-white border border-white/20 backdrop-blur-md hover:bg-slate-900 transition-transform active:scale-95 shadow-xl"
            aria-label="Previous image"
          >
            <ChevronLeft size={22} />
          </button>
        )}

        {/* Next Button */}
        {images.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleNext()
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-slate-950/80 text-white border border-white/20 backdrop-blur-md hover:bg-slate-900 transition-transform active:scale-95 shadow-xl"
            aria-label="Next image"
          >
            <ChevronRight size={22} />
          </button>
        )}
      </div>

      {/* Bottom Thumbnail Navigation Strip */}
      <div
        className="flex flex-col items-center gap-3 p-4 z-10"
        style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
      >
        {images.length > 1 && (
          <div className="flex gap-2.5 overflow-x-auto max-w-full py-1 px-2 no-scrollbar">
            {images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setCurrentIndex(i)}
                className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                  i === currentIndex
                    ? 'border-[var(--lime-base)] scale-105 shadow-md shadow-[var(--lime-base)]/30'
                    : 'border-white/20 opacity-50 hover:opacity-80'
                }`}
              >
                <Image
                  src={resolveUrl(img.storage_path)}
                  alt={img.alt_text ?? `Thumbnail ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </button>
            ))}
          </div>
        )}

        {/* Bold Bolder Dismiss Hint */}
        <span className="text-[11px] font-black uppercase tracking-wider text-white bg-slate-950/80 border border-white/20 px-4 py-1.5 rounded-full shadow-lg backdrop-blur-md">
          Tap outside or press ESC to exit gallery
        </span>
      </div>
    </div>
  )
}
