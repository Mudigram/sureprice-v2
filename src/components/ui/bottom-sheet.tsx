'use client'

import { useEffect, useState, useCallback, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

/**
 * Reusable animated slide-up bottom sheet.
 * - Renders via portal to document.body
 * - Tap backdrop or dominant circular X button to dismiss
 * - CSS-driven slide-up / slide-down animation
 * - Max height 88vh with internal scroll
 */
export function BottomSheet({ open, onClose, title, children }: BottomSheetProps) {
  const [mounted, setMounted] = useState(false)
  const [closing, setClosing] = useState(false)

  // Mount portal target
  useEffect(() => {
    setMounted(true)
  }, [])

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      setClosing(false)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const handleClose = useCallback(() => {
    setClosing(true)
    setTimeout(() => {
      setClosing(false)
      onClose()
    }, 250)
  }, [onClose])

  // Close on Escape key
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, handleClose])

  if (!mounted || !open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-slate-950/70 backdrop-blur-sm ${
          closing ? 'animate-overlay-out' : 'animate-overlay-in'
        }`}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Sheet Container */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title ?? 'Product Details'}
        className={`relative z-10 flex max-h-[88vh] sm:max-h-[85vh] w-full max-w-xl mx-auto flex-col rounded-t-[32px] bg-white shadow-2xl dark:bg-zinc-900 border-t border-slate-200/80 dark:border-zinc-800 ${
          closing ? 'animate-sheet-down' : 'animate-sheet-up'
        }`}
      >
        {/* Sheet Top Header Bar: Drag Pill + Dominant Circular Close Button */}
        <div className="flex items-center justify-between px-5 pt-3 pb-2 border-b border-slate-100 dark:border-zinc-800/80">
          <div className="flex flex-col gap-0.5 min-w-0">
            {title ? (
              <h2 className="text-base font-black text-slate-900 dark:text-zinc-100 truncate">
                {title}
              </h2>
            ) : (
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                Tap outside or press ESC to close
              </span>
            )}
          </div>

          {/* Centered Drag Pill indicator on larger viewports */}
          <div className="hidden sm:block absolute left-1/2 -translate-x-1/2 top-3">
            <div className="h-1.5 w-10 rounded-full bg-slate-300 dark:bg-zinc-700" />
          </div>

          {/* Dominant Circular X Close Button */}
          <button
            type="button"
            onClick={handleClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white dark:bg-zinc-800 dark:text-white shadow-lg hover:bg-slate-800 dark:hover:bg-zinc-700 active:scale-95 transition-all border border-slate-700/50"
            aria-label="Close product details"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4 space-y-4">
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}
