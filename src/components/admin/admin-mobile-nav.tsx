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
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-800 bg-slate-950/90 backdrop-blur-xl sm:hidden">
      <div className="flex items-center justify-around py-2.5 px-2">
        <Link
          href="/dashboard"
          id="mobile-admin-dashboard"
          className={`flex flex-col items-center gap-1 transition-colors ${
            pathname === '/dashboard' ? 'text-[var(--lime-base)] font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building2 size={18} />
          <span className="text-[10px]">Dashboard</span>
        </Link>

        <Link
          href="/dashboard/team"
          id="mobile-admin-team"
          className={`flex flex-col items-center gap-1 transition-colors ${
            pathname.startsWith('/dashboard/team') ? 'text-[var(--lime-base)] font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users size={18} />
          <span className="text-[10px]">Team</span>
        </Link>
      </div>
    </nav>
  )
}
