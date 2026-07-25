'use client'

import { useTransition } from 'react'
import { RefreshCcw, ShieldOff, ScanLine } from 'lucide-react'
import { regenerateQrCode, revokeQrCode } from '../actions'
import type { QrCode } from '../types'
import { getScanUrl } from '@/lib/qr/scan-url'

interface QrCodeListProps {
  codes: QrCode[]
  businessId: string
}

export function QrCodeList({ codes }: QrCodeListProps) {
  const [isPending, startTransition] = useTransition()

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
                  onClick={() =>
                    startTransition(async () => {
                      await regenerateQrCode(qr.id)
                    })
                  }
                  disabled={isPending}
                  id={`regen-qr-${qr.id}`}
                  className="flex items-center gap-1 rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-900 hover:bg-blue-100 transition-colors disabled:opacity-50 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-300"
                >
                  <RefreshCcw size={13} />
                  <span>Regenerate</span>
                </button>

                <button
                  onClick={() =>
                    startTransition(async () => {
                      await revokeQrCode(qr.id)
                    })
                  }
                  disabled={isPending}
                  id={`revoke-qr-${qr.id}`}
                  className="flex items-center gap-1 rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-900 hover:bg-red-100 transition-colors disabled:opacity-50 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
                >
                  <ShieldOff size={13} />
                  <span>Revoke</span>
                </button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
