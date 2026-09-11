'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Building2, Users, ScanLine, LogOut } from 'lucide-react'

interface AdminMobileNavProps {
  userEmail?: string
}

export function AdminMobileNav({ userEmail }: AdminMobileNavProps) {
  const pathname = usePathname()

  // On individual business routes (/businesses/[id]/...), the BusinessAdminNav component
  // already provides its own specialized mobile bottom dock. We hide this layout-level dock
  // to eliminate visual overlap and collision.
  if (pathname.startsWith('/businesses/')) {
    return null
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/90 bg-white/95 backdrop-blur-md md:hidden shadow-lg">
      <div className="flex items-center justify-around py-2.5 px-4 max-w-md mx-auto">
        <Link
          href="/dashboard"
          id="mobile-admin-dashboard"
          className={`flex flex-col items-center gap-1 transition-colors ${
            pathname === '/dashboard' ? 'text-emerald-700 font-black' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Building2 size={18} />
          <span className="text-[10px] font-bold">Dashboard</span>
        </Link>

        <Link
          href="/scan"
          target="_blank"
          id="mobile-admin-scanner"
          className="flex flex-col items-center gap-1 transition-colors text-slate-500 hover:text-slate-900"
        >
          <ScanLine size={18} className="text-emerald-600" />
          <span className="text-[10px] font-bold">Scanner</span>
        </Link>

        <Link
          href="/dashboard/team"
          id="mobile-admin-team"
          className={`flex flex-col items-center gap-1 transition-colors ${
            pathname.startsWith('/dashboard/team') ? 'text-emerald-700 font-black' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Users size={18} />
          <span className="text-[10px] font-bold">Team</span>
        </Link>
      </div>
    </nav>
  )
}


