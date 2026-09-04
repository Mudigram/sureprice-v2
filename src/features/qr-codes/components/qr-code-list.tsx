'use client'

import { useState, useTransition } from 'react'
import { RefreshCcw, ShieldOff, ScanLine } from 'lucide-react'
import { regenerateQrCode, revokeQrCode } from '../actions'
import type { QrCode } from '../types'
import { getScanUrl } from '@/lib/qr/scan-url'
import { RegenerateQrModal } from './regenerate-qr-modal'
import { RevokeQrModal } from './revoke-qr-modal'

interface QrCodeListProps {
  codes: QrCode[]
  businessId: string
}

export function QrCodeList({ codes }: QrCodeListProps) {
  const [isPending, startTransition] = useTransition()
  const [activeRegenQr, setActiveRegenQr] = useState<QrCode | null>(null)
  const [activeRevokeQr, setActiveRevokeQr] = useState<QrCode | null>(null)

  const handleConfirmRegenerate = () => {
    if (!activeRegenQr) return
    startTransition(async () => {
      await regenerateQrCode(activeRegenQr.id)
      setActiveRegenQr(null)
    })
  }

  const handleConfirmRevoke = () => {
    if (!activeRevokeQr) return
    startTransition(async () => {
      await revokeQrCode(activeRevokeQr.id)
      setActiveRevokeQr(null)
    })
  }

  if (codes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 py-12 text-center dark:border-zinc-800">
        <ScanLine size={36} className="text-slate-400" />
        <p className="mt-3 text-base font-extrabold text-slate-900 dark:text-zinc-100">No QR codes generated yet</p>
        <p className="mt-1 text-xs text-slate-400 dark:text-zinc-400">
          QR codes are generated automatically when viewing or printing catalog items.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {codes.map((qr) => {
        const isArchived = qr.status === 'archived'
        const scanUrl = getScanUrl(qr.code)

        return (
          <div
            key={qr.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={`font-mono text-sm font-black ${
                    isArchived
                      ? 'text-slate-400 line-through'
                      : 'text-slate-900 dark:text-zinc-100'
                  }`}
                >
                  {qr.code}
                </span>

                <span
                  className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide ${
                    isArchived
                      ? 'bg-slate-100 text-slate-500 dark:bg-zinc-800 dark:text-zinc-400'
                      : 'bg-green-100 text-green-900 dark:bg-green-950/60 dark:text-green-300'
                  }`}
                >
                  {qr.status}
                </span>
              </div>

              <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400 truncate">
                Target: <span className="font-bold capitalize text-slate-700 dark:text-zinc-300">{qr.target_type.replace(/_/g, ' ')}</span> · Scans: <span className="font-bold text-slate-700 dark:text-zinc-300">{qr.scan_count}</span>
              </p>

              <p className="text-[10px] text-slate-400 dark:text-zinc-500 truncate font-mono mt-0.5">
                {scanUrl}
              </p>
            </div>

            {!isArchived && (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveRegenQr(qr)}
                  disabled={isPending}
                  id={`regen-qr-${qr.id}`}
                  className="flex items-center gap-1 rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-100 transition-colors disabled:opacity-50 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300"
                >
                  <RefreshCcw size={13} className={isPending && activeRegenQr?.id === qr.id ? 'animate-spin' : ''} />
                  <span>Regenerate</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveRevokeQr(qr)}
                  disabled={isPending}
                  id={`revoke-qr-${qr.id}`}
                  className="flex items-center gap-1 rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-900 hover:bg-red-100 transition-colors disabled:opacity-50 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
                >
                  <ShieldOff size={13} className={isPending && activeRevokeQr?.id === qr.id ? 'animate-spin' : ''} />
                  <span>Revoke</span>
                </button>
              </div>
            )}
          </div>
        )
      })}

      {/* Regenerate Confirmation Modal */}
      {activeRegenQr && (
        <RegenerateQrModal
          isOpen={activeRegenQr !== null}
          qrCode={activeRegenQr.code}
          scanCount={activeRegenQr.scan_count}
          isPending={isPending}
          onConfirm={handleConfirmRegenerate}
          onClose={() => setActiveRegenQr(null)}
        />
      )}

      {/* Revoke Confirmation Modal */}
      {activeRevokeQr && (
        <RevokeQrModal
          isOpen={activeRevokeQr !== null}
          qrCode={activeRevokeQr.code}
          isPending={isPending}
          onConfirm={handleConfirmRevoke}
          onClose={() => setActiveRevokeQr(null)}
        />
      )}
    </div>
  )
}
