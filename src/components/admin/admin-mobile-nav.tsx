'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Building2, Users, ScanLine, LogOut } from 'lucide-react'

interface AdminMobileNavProps {
  userEmail?: string
}

export function AdminMobileNav({ userEmail }: AdminMobileNavProps) {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200/90 bg-white/95 backdrop-blur-md sm:hidden shadow-lg">
      <div className="flex items-center justify-around py-2.5 px-2">
        <Link
          href="/dashboard"
          id="mobile-admin-dashboard"
          className={`flex flex-col items-center gap-1 transition-colors ${
            pathname === '/dashboard' ? 'text-emerald-700 font-black' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Building2 size={18} />
          <span className="text-[10px]">Dashboard</span>
        </Link>

        <Link
          href="/dashboard/team"
          id="mobile-admin-team"
          className={`flex flex-col items-center gap-1 transition-colors ${
            pathname.startsWith('/dashboard/team') ? 'text-emerald-700 font-black' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Users size={18} />
          <span className="text-[10px]">Team</span>
        </Link>
      </div>
    </nav>
  )
}

