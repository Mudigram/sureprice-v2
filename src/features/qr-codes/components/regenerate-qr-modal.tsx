'use client'

import { useEffect, useRef } from 'react'
import { AlertTriangle, RefreshCcw, X, ShieldAlert, CheckCircle2 } from 'lucide-react'

interface RegenerateQrModalProps {
  isOpen: boolean
  qrCode: string
  scanCount: number
  isPending: boolean
  onConfirm: () => void
  onClose: () => void
}

export function RegenerateQrModal({
  isOpen,
  qrCode,
  scanCount,
  isPending,
  onConfirm,
  onClose,
}: RegenerateQrModalProps) {
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
        aria-labelledby="regenerate-modal-title"
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

        {/* Warning Icon Banner */}
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-500/30">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h3 id="regenerate-modal-title" className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
              Regenerate QR Price Tag?
            </h3>
            <p className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
              Code: {qrCode}
            </p>
          </div>
        </div>

        {/* Warning Details Body */}
        <div className="mt-5 space-y-3 rounded-2xl border border-amber-200/80 bg-amber-50/60 p-4 text-xs dark:border-amber-900/50 dark:bg-amber-950/20">
          <div className="flex items-start gap-2 text-amber-950 dark:text-amber-200">
            <ShieldAlert size={16} className="shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div className="space-y-1">
              <p className="font-extrabold">Previously printed tags will stop scanning</p>
              <p className="text-[11px] leading-relaxed text-amber-900/80 dark:text-amber-300/80">
                Any physical shelf stickers or packaging using code <strong className="font-mono">{qrCode}</strong> will immediately deactivate and no longer open this item.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 border-t border-amber-200/60 pt-2 text-[11px] font-bold text-slate-700 dark:border-amber-900/40 dark:text-slate-300">
            <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
            <span>Scan history ({scanCount.toLocaleString()} scans) will remain intact.</span>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-2.5">
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            id="confirm-regenerate-btn"
            className="flex flex-1 w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-3.5 text-xs font-black text-slate-950 shadow-md shadow-amber-500/20 hover:bg-amber-400 active:scale-[0.98] disabled:opacity-50 transition-all"
          >
            <RefreshCcw size={15} className={isPending ? 'animate-spin' : ''} />
            <span>{isPending ? 'Regenerating Tag…' : 'Yes, Regenerate QR Tag'}</span>
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
