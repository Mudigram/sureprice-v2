'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ScanLine,
  Building2,
  Users,
  LogOut,
  Shield,
  ExternalLink,
  Store,
  Sparkles,
} from 'lucide-react'

interface AdminSidebarProps {
  userEmail?: string
  signOutAction: () => Promise<void>
}

export function AdminSidebar({ userEmail, signOutAction }: AdminSidebarProps) {
  const pathname = usePathname()

  const navItems = [
    {
      label: 'Your Businesses',
      href: '/dashboard',
      icon: Building2,
      active: pathname === '/dashboard' || pathname.startsWith('/businesses'),
    },
    {
      label: 'Team & Roles',
      href: '/dashboard/team',
      icon: Users,
      active: pathname.startsWith('/dashboard/team'),
    },
  ]

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col justify-between border-r border-slate-200/90 bg-white p-5 min-h-screen sticky top-0 h-screen overflow-y-auto no-scrollbar shadow-sm">
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="space-y-2">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--lime-base)] text-black shadow-md shadow-[var(--lime-base)]/20">
              <ScanLine size={20} strokeWidth={2.5} />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900 block">
                <span className="text-emerald-700">Sure</span>Price
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Enterprise Admin
              </span>
            </div>
          </Link>

          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-800">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Pilot Partner Access</span>
          </div>
        </div>

        {/* Primary Navigation Menu */}
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-3 pb-1">
            Management
          </p>

          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                id={`sidebar-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-xs font-bold transition-all ${
                  item.active
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon size={18} className={item.active ? 'text-[var(--lime-base)]' : 'text-slate-500'} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>

        {/* Quick Tools Section */}
        <div className="space-y-1 pt-3 border-t border-slate-100">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-3 pb-1">
            Storefront Shortcuts
          </p>

          <Link
            href="/scan"
            target="_blank"
            className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ScanLine size={16} className="text-emerald-600" />
              <span>Test Scanner</span>
            </span>
            <ExternalLink size={13} className="text-slate-400" />
          </Link>

          <Link
            href="/stores"
            target="_blank"
            className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Store size={16} className="text-slate-700" />
              <span>Browse Stores</span>
            </span>
            <ExternalLink size={13} className="text-slate-400" />
          </Link>
        </div>
      </div>

      {/* Bottom Profile & Sign Out Box */}
      <div className="space-y-3 pt-4 border-t border-slate-200/80">
        {userEmail && (
          <div className="flex items-center gap-2.5 rounded-2xl bg-slate-50 p-3 border border-slate-200/80">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white font-bold text-xs">
              <Shield size={16} className="text-[var(--lime-base)]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-black text-slate-900">{userEmail}</p>
              <p className="text-[10px] text-slate-500 font-medium">Authenticated Merchant</p>
            </div>
          </div>
        )}

        <form action={signOutAction}>
          <button
            type="submit"
            id="sidebar-logout-btn"
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all active:scale-[0.98]"
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </form>
      </div>
    </aside>
  )
}

