'use client'

import Link from 'next/link'
import { ScanLine } from 'lucide-react'

export function ScanFab() {
  return (
    <Link
      href="/scan"
      id="scan-fab"
      aria-label="Scan QR code"
      className="fixed bottom-[4.5rem] left-1/2 z-50 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-[var(--lime-base)] shadow-lg shadow-[var(--lime-base)]/40 transition-transform active:scale-95 hover:scale-105"
    >
      <ScanLine size={26} strokeWidth={2.5} className="text-black" />
    </Link>
  )
}
