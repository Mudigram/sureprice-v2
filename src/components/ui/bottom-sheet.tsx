'use client'

import { useEffect, useState, useCallback, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

/**
 * Reusable animated slide-up bottom sheet.
 * - Renders via portal to document.body
 * - Tap backdrop or drag handle to dismiss
 * - CSS-driven slide-up / slide-down animation
 * - Max height 90vh with internal scroll
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
    // Wait for exit animation to finish
    setTimeout(() => {
      setClosing(false)
      onClose()
    }, 280)
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
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm ${
          closing ? 'animate-overlay-out' : 'animate-overlay-in'
        }`}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Sheet Container */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title ?? 'Bottom sheet'}
        className={`relative z-10 flex max-h-[90vh] flex-col rounded-t-3xl bg-white shadow-2xl dark:bg-zinc-900 ${
          closing ? 'animate-sheet-down' : 'animate-sheet-up'
        }`}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <button
            type="button"
            onClick={handleClose}
            className="h-1.5 w-10 rounded-full bg-slate-300 dark:bg-zinc-600 hover:bg-slate-400 transition-colors"
            aria-label="Close sheet"
          />
        </div>

        {/* Optional Title */}
        {title && (
          <div className="px-5 pb-3 pt-1">
            <h2 className="text-base font-black text-slate-900 dark:text-zinc-100">
              {title}
            </h2>
          </div>
        )}

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-5 pb-8">
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}
