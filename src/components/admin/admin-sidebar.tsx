'use client'

import { useEffect, useState } from 'react'
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
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'

interface AdminSidebarProps {
  userEmail?: string
  signOutAction: () => Promise<void>
}

export function AdminSidebar({ userEmail, signOutAction }: AdminSidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sureprice_sidebar_collapsed')
      if (stored === 'true') {
        setIsCollapsed(true)
      }
    }
  }, [])

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev
      if (typeof window !== 'undefined') {
        localStorage.setItem('sureprice_sidebar_collapsed', String(next))
      }
      return next
    })
  }

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
    <aside
      className={`hidden md:flex shrink-0 flex-col justify-between border-r border-slate-200/90 bg-white p-4 min-h-screen sticky top-0 h-screen overflow-y-auto no-scrollbar shadow-sm transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="space-y-6">
        {/* Brand Header & Collapse Toggle */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <Link href="/dashboard" className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
              <ScanLine size={20} strokeWidth={2.5} className="text-emerald-400" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <span className="text-lg font-black tracking-tight text-slate-900 block truncate">
                  <span className="text-emerald-700">Sure</span>Price
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block truncate">
                  Merchant Console
                </span>
              </div>
            )}
          </Link>

          <button
            type="button"
            onClick={toggleCollapse}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            id="sidebar-toggle-btn"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-all"
          >
            {isCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          </button>
        </div>

        {/* Primary Navigation Menu */}
        <div className="space-y-1">
          {!isCollapsed && (
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 px-3 pb-1">
              Management
            </p>
          )}

          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                title={isCollapsed ? item.label : undefined}
                id={`sidebar-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                className={`flex items-center gap-3 rounded-xl py-2.5 text-xs font-bold transition-all ${
                  isCollapsed ? 'justify-center px-0' : 'px-3.5'
                } ${
                  item.active
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon size={18} className={item.active ? 'text-emerald-400' : 'text-slate-500'} />
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </div>

        {/* Quick Tools Section */}
        <div className="space-y-1 pt-3 border-t border-slate-100">
          {!isCollapsed && (
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 px-3 pb-1">
              Storefront Shortcuts
            </p>
          )}

          <Link
            href="/scan"
            target="_blank"
            title={isCollapsed ? 'Test Scanner' : undefined}
            className={`flex items-center rounded-xl py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors ${
              isCollapsed ? 'justify-center px-0' : 'justify-between px-3.5'
            }`}
          >
            <span className="flex items-center gap-2">
              <ScanLine size={16} className="text-emerald-600" />
              {!isCollapsed && <span>Test Scanner</span>}
            </span>
            {!isCollapsed && <ExternalLink size={13} className="text-slate-400" />}
          </Link>

          <Link
            href="/stores"
            target="_blank"
            title={isCollapsed ? 'Browse Stores' : undefined}
            className={`flex items-center rounded-xl py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors ${
              isCollapsed ? 'justify-center px-0' : 'justify-between px-3.5'
            }`}
          >
            <span className="flex items-center gap-2">
              <Store size={16} className="text-slate-700" />
              {!isCollapsed && <span>Browse Stores</span>}
            </span>
            {!isCollapsed && <ExternalLink size={13} className="text-slate-400" />}
          </Link>
        </div>
      </div>

      {/* Bottom Profile & Sign Out Box */}
      <div className="space-y-3 pt-4 border-t border-slate-200/80">
        {userEmail && !isCollapsed && (
          <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 p-2.5 border border-slate-200/80">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white font-bold text-xs">
              <Shield size={14} className="text-emerald-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-slate-900">{userEmail}</p>
              <p className="text-[10px] text-slate-500 font-medium">Merchant Account</p>
            </div>
          </div>
        )}

        <form action={signOutAction}>
          <button
            type="submit"
            id="sidebar-logout-btn"
            title={isCollapsed ? 'Sign Out' : undefined}
            className={`flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all active:scale-[0.98] ${
              isCollapsed ? 'px-0' : 'px-3'
            }`}
          >
            <LogOut size={15} />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </form>
      </div>
    </aside>
  )
}

