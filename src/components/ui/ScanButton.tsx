'use client'

import Link from 'next/link'
import { ScanLine } from 'lucide-react'

export default function ScanButton() {
  return (
    <Link
      href="/scan"
      id="scan-fab"
      aria-label="Scan QR code"
      className="absolute left-1/2 -top-6 z-50 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-[var(--lime-base)] text-black border-4 border-slate-100 shadow-lg shadow-[var(--lime-base)]/40 transition-transform active:scale-95 hover:scale-105 hover:bg-[var(--lime-dark)]"
    >
      <ScanLine size={26} strokeWidth={2.5} className="text-black" />
    </Link>
  )
}

