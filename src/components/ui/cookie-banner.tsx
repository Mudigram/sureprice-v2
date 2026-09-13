'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Cookie, X } from 'lucide-react'

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      const consent = localStorage.getItem('qarty_cookie_consent')
      if (!consent) {
        // Small delay to prevent layout jump on load
        const timer = setTimeout(() => setVisible(true), 1200)
        return () => clearTimeout(timer)
      }
    } catch {
      // Storage unavailable
    }
  }, [])

  const accept = () => {
    try {
      localStorage.setItem('qarty_cookie_consent', 'true')
    } catch {
      // Ignore
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <aside
      aria-label="Cookie consent banner"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="rounded-2xl border border-slate-200/90 bg-white/95 p-4 text-slate-900 shadow-xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 dark:text-white">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            <Cookie size={18} />
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <p className="text-xs font-black text-slate-900 dark:text-white">
              We respect your in-store privacy
            </p>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
              Qarty uses essential local storage to remember your noted prices and scan history on your device.
              Zero ad tracking.{' '}
              <Link
                href="/privacy"
                className="font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
              >
                Privacy Policy
              </Link>
            </p>
          </div>

          <button
            onClick={accept}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            aria-label="Close banner"
          >
            <X size={14} />
          </button>
        </div>

        <div className="mt-3 flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={accept}
            className="rounded-xl bg-slate-900 px-4 py-1.5 text-xs font-bold text-white transition-all hover:bg-slate-800 active:scale-95 dark:bg-emerald-500 dark:text-black dark:hover:bg-emerald-400"
          >
            Got It
          </button>
        </div>
      </div>
    </aside>
  )
}
