'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ScanLine, X, Sparkles, ArrowRight } from 'lucide-react'

export function FloatingScanPrompt() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isDismissed) setIsVisible(true)
    }, 1500)
    return () => clearTimeout(timer)
  }, [isDismissed])

  if (isDismissed) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 80, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 80, opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="fixed bottom-5 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 pointer-events-auto"
        >
          <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-slate-950/90 backdrop-blur-xl p-3.5 shadow-2xl shadow-emerald-500/20 text-white flex items-center justify-between gap-3">
            {/* Ambient background glow */}
            <div className="absolute -left-6 -top-6 h-20 w-20 rounded-full bg-[var(--lime-base)]/20 blur-2xl pointer-events-none" />

            {/* Left Icon & Text */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--lime-base)] text-black font-black shadow-md shadow-[var(--lime-base)]/30">
                <ScanLine size={20} strokeWidth={2.5} />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--lime-dark)]"></span>
                </span>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[var(--lime-base)]">
                    Live Demo Tag
                  </span>
                </div>
                <p className="text-xs font-bold text-white truncate">
                  Test Camera Price Scan
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  No app download required
                </p>
              </div>
            </div>

            {/* Right Action Button & Close */}
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/scan"
                id="floating-prompt-scan-btn"
                className="flex items-center gap-1.5 rounded-xl bg-[var(--lime-base)] px-3.5 py-2 text-xs font-black text-black shadow-md shadow-[var(--lime-base)]/25 hover:bg-[var(--lime-dark)] active:scale-95 transition-all"
              >
                <span>Try Now</span>
                <ArrowRight size={13} strokeWidth={3} />
              </Link>

              <button
                type="button"
                onClick={() => setIsDismissed(true)}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
                title="Dismiss"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
