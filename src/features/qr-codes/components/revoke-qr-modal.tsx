'use client'

import { useEffect, useRef } from 'react'
import { AlertCircle, ShieldOff, X } from 'lucide-react'

interface RevokeQrModalProps {
  isOpen: boolean
  qrCode: string
  isPending: boolean
  onConfirm: () => void
  onClose: () => void
}

export function RevokeQrModal({
  isOpen,
  qrCode,
  isPending,
  onConfirm,
  onClose,
}: RevokeQrModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isPending) {
        onClose()
      }
    }

    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, isPending, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={() => {
          if (!isPending) onClose()
        }}
      />

      {/* Modal Card */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="revoke-modal-title"
        className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-2xl dark:border-slate-800 dark:bg-slate-900 text-slate-900 dark:text-white animate-in zoom-in-95 duration-200"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={isPending}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 disabled:opacity-50 transition-all"
        >
          <X size={18} />
        </button>

        {/* Danger Icon Banner */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 border border-rose-500/30">
            <ShieldOff size={24} />
          </div>
          <div>
            <h3 id="revoke-modal-title" className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
              Revoke QR Tag Access?
            </h3>
            <p className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
              Code: {qrCode}
            </p>
          </div>
        </div>

        {/* Warning Details Body */}
        <div className="mt-5 space-y-2 rounded-2xl border border-rose-200/80 bg-rose-50/60 p-4 text-xs dark:border-rose-900/50 dark:bg-rose-950/20 text-rose-950 dark:text-rose-200">
          <div className="flex items-start gap-2">
            <AlertCircle size={16} className="shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
            <div className="space-y-1">
              <p className="font-extrabold">Permanent Tag Deactivation</p>
              <p className="text-[11px] leading-relaxed text-rose-900/80 dark:text-rose-300/80">
                This QR code will be permanently marked as archived. Customers scanning this tag will receive an inactive notice.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-2.5">
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            id="confirm-revoke-btn"
            className="flex flex-1 w-full items-center justify-center gap-2 rounded-xl bg-rose-600 py-3.5 text-xs font-black text-white shadow-md shadow-rose-600/20 hover:bg-rose-500 active:scale-[0.98] disabled:opacity-50 transition-all"
          >
            <ShieldOff size={15} />
            <span>{isPending ? 'Revoking Tag…' : 'Yes, Revoke QR Tag'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="flex w-full sm:w-auto items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-5 py-3.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
