'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw, LayoutDashboard, ArrowLeft } from 'lucide-react'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log exception for telemetry
    console.error('Admin Console Exception:', error)
  }, [error])

  return (
    <div className="mx-auto max-w-xl p-4 sm:p-8 pt-16 text-center space-y-6">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-200">
        <AlertTriangle size={32} />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-black tracking-tight text-slate-900">
          Admin Console Notice
        </h1>
        <p className="text-xs text-slate-600 font-medium leading-relaxed max-w-md mx-auto">
          We encountered an issue loading your business workspace data. This may be due to a temporary network blip or session expiration.
        </p>
      </div>

      {error.message && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-4 text-left font-mono text-xs text-rose-800 break-words max-h-32 overflow-y-auto">
          <p className="font-bold text-[10px] uppercase tracking-wider text-rose-600 mb-1">
            Diagnostic Reference:
          </p>
          {error.message}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => reset()}
          className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition-all active:scale-[0.98]"
        >
          <RefreshCw size={15} />
          <span>Retry Workspace Load</span>
        </button>

        <Link
          href="/dashboard"
          className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all"
        >
          <LayoutDashboard size={15} />
          <span>Return to Dashboard</span>
        </Link>
      </div>

      <p className="text-[11px] text-slate-400 font-medium pt-4">
        Need assistance? Contact <span className="font-bold text-slate-700">support@sureprice.ng</span>
      </p>
    </div>
  )
}
