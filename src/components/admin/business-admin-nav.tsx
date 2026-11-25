'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Printer,
  BarChart2,
  Users,
  Settings,
  ExternalLink,
  Plus,
  ShoppingBag,
  Utensils,
  Coffee,
  Ticket,
  Store,
  ArrowLeft,
  ChevronDown,
  Scissors,
  CalendarCheck,
  Sparkles,
  Menu,
  X,
} from 'lucide-react'
import type { StorefrontBusiness } from '@/features/storefront/types'
import { getBrandFallbackSvgIcon } from '@/components/icons'

interface BusinessAdminNavProps {
  business: StorefrontBusiness
  currentSection?:
    | 'overview'
    | 'catalog'
    | 'categories'
    | 'services'
    | 'bookings'
    | 'storefront'
    | 'qr-studio'
    | 'analytics'
    | 'team'
    | 'edit'
}

export function BusinessAdminNav({ business, currentSection }: BusinessAdminNavProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Close mobile menu sheet on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const resolveUrl = (path: string | null | undefined): string => {
    if (!path) return ''
    if (path.startsWith('http://') || path.startsWith('https://')) return path
    const cleanPath = path.startsWith('/') ? path.slice(1) : path
    if (cleanPath.startsWith('storage/v1/object/public/')) {
      return `${supabaseUrl}/${cleanPath}`
    }
    return `${supabaseUrl}/storage/v1/object/public/catalog-media/${cleanPath}`
  }

  const storefrontTheme =
    business.storefront?.theme && typeof business.storefront.theme === 'object'
      ? (business.storefront.theme as Record<string, unknown>)
      : {}

  const rawLogoUrl =
    (typeof (business.storefront as Record<string, unknown>)?.logo_url === 'string' &&
      ((business.storefront as Record<string, unknown>).logo_url as string)) ||
    (typeof storefrontTheme.logo_url === 'string' && storefrontTheme.logo_url) ||
    (typeof storefrontTheme.logoUrl === 'string' && storefrontTheme.logoUrl) ||
    null

  const logoUrl = rawLogoUrl ? resolveUrl(rawLogoUrl) : null

  const bType = String(business.business_type)
  const isEvent = bType === 'popup_vendor' || bType === 'event_vendor'
  const isServiceBusiness = bType === 'services' || bType === 'beauty_wellness'

  const typeLabel =
    bType === 'restaurant'
      ? 'Restaurant & Dining'
      : bType === 'cafe'
      ? 'Café & Bakery'
      : bType === 'beauty_wellness'
      ? 'Beauty & Wellness'
      : bType === 'services'
      ? 'Services & Bookings'
      : isEvent
      ? 'Pop-up & Event Stall'
      : 'Retail & Supermarket'

  const TypeIcon =
    bType === 'restaurant'
      ? Utensils
      : bType === 'cafe'
      ? Coffee
      : bType === 'beauty_wellness'
      ? Sparkles
      : bType === 'services'
      ? Scissors
      : isEvent
      ? Ticket
      : ShoppingBag

  const allSections = [
    {
      id: 'overview',
      label: 'Overview',
      href: `/businesses/${business.id}`,
      icon: LayoutDashboard,
      active: pathname === `/businesses/${business.id}`,
    },
    {
      id: 'catalog',
      label: 'Catalog Items',
      href: `/businesses/${business.id}/catalog-items`,
      icon: Package,
      active: pathname.includes('/catalog-items'),
    },
    {
      id: 'categories',
      label: 'Categories',
      href: `/businesses/${business.id}/categories`,
      icon: FolderTree,
      active: pathname.includes('/categories'),
    },
    {
      id: 'services',
      label: 'Services',
      href: `/businesses/${business.id}/services`,
      icon: Scissors,
      active: pathname.includes('/services'),
    },
    {
      id: 'bookings',
      label: 'Bookings',
      href: `/businesses/${business.id}/bookings`,
      icon: CalendarCheck,
      active: pathname.includes('/bookings'),
    },
    {
      id: 'storefront',
      label: 'Storefront Studio',
      href: `/businesses/${business.id}/storefront`,
      icon: Store,
      active: pathname.includes('/storefront'),
    },
    {
      id: 'qr-studio',
      label: 'QR Studio',
      href: `/businesses/${business.id}/qr-studio`,
      icon: Printer,
      active: pathname.includes('/qr-studio'),
    },
    {
      id: 'analytics',
      label: 'Scan Analytics',
      href: `/businesses/${business.id}/analytics`,
      icon: BarChart2,
      active: pathname.includes('/analytics'),
    },
    {
      id: 'team',
      label: 'Store Team',
      href: `/businesses/${business.id}/team`,
      icon: Users,
      active: pathname.includes('/team'),
    },
    {
      id: 'edit',
      label: 'Settings',
      href: `/businesses/${business.id}/edit`,
      icon: Settings,
      active: pathname.includes('/edit'),
    },
  ]

  // Primary 4 mobile dock items (5th slot is always "More" sheet)
  const mobileDockItems = isServiceBusiness
    ? [
        { id: 'overview', label: 'Home', href: `/businesses/${business.id}`, icon: LayoutDashboard },
        { id: 'bookings', label: 'Bookings', href: `/businesses/${business.id}/bookings`, icon: CalendarCheck },
        { id: 'services', label: 'Services', href: `/businesses/${business.id}/services`, icon: Scissors },
        { id: 'qr-studio', label: 'QR', href: `/businesses/${business.id}/qr-studio`, icon: Printer },
      ]
    : [
        { id: 'overview', label: 'Home', href: `/businesses/${business.id}`, icon: LayoutDashboard },
        { id: 'catalog', label: 'Items', href: `/businesses/${business.id}/catalog-items`, icon: Package },
        { id: 'bookings', label: 'Bookings', href: `/businesses/${business.id}/bookings`, icon: CalendarCheck },
        { id: 'qr-studio', label: 'QR', href: `/businesses/${business.id}/qr-studio`, icon: Printer },
      ]

  const isMoreActive =
    !mobileDockItems.some((d) => d.id === (currentSection || 'overview'))

  return (
    <>
      <div className="mb-6 space-y-3.5 rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-md p-4 sm:p-5 shadow-sm transition-all">
        {/* Breadcrumb Trail & Quick Back Navigation */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-xs">
          <div className="flex items-center gap-1.5 font-medium text-slate-500 min-w-0">
            <Link href="/dashboard" className="hover:text-slate-900 transition-colors shrink-0">
              Dashboard
            </Link>
            <span className="text-slate-300 shrink-0">/</span>
            <span className="font-bold text-slate-900 truncate max-w-[120px] sm:max-w-none">
              {business.name}
            </span>
            {currentSection && (
              <>
                <span className="text-slate-300 shrink-0">/</span>
                <span className="capitalize font-bold text-emerald-700 truncate">
                  {currentSection.replace('-', ' ')}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <Menu size={13} />
              <span>Menu</span>
            </button>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1 font-bold text-slate-600 hover:text-slate-900 transition-colors text-xs"
            >
              <ArrowLeft size={13} />
              <span className="hidden sm:inline">All Stores</span>
              <span className="sm:hidden">Stores</span>
            </Link>
          </div>
        </div>

        {/* Top Header: Store Info & Quick Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 min-w-0">
            {/* Logo Avatar */}
            <div className="relative h-11 w-11 sm:h-12 sm:w-12 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              {logoUrl ? (
                <Image src={logoUrl} alt={business.name} fill className="object-cover" sizes="48px" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-slate-500">
                  {getBrandFallbackSvgIcon(business.business_type, { size: 22 })}
                </div>
              )}
            </div>

            {/* Store Name & Type Badge with Quick Store Switcher */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  href="/dashboard"
                  className="group inline-flex items-center gap-1 rounded-xl hover:bg-slate-100 p-0.5 -m-0.5 transition-all"
                  title="Switch Business Store"
                >
                  <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 truncate">
                    {business.name}
                  </h1>
                  <span className="inline-flex items-center gap-0.5 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-800 transition-colors">
                    <span>Switch</span>
                    <ChevronDown size={11} />
                  </span>
                </Link>

                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700 border border-slate-200 shrink-0">
                  <TypeIcon size={11} />
                  {typeLabel}
                </span>
              </div>
              <p className="mt-0.5 text-[11px] sm:text-xs text-slate-500 truncate font-medium">
                Slug: <span className="font-mono text-slate-700 font-bold">{business.slug}</span>
              </p>
            </div>
          </div>

          {/* Right CTA Actions */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <Link
              href={`/businesses/${business.id}/qr-studio?preset=storefront_master`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition-all min-h-[38px]"
              title="Print Master Storefront QR Standee"
            >
              <Printer size={13} className="text-emerald-700" />
              <span>QR Code</span>
            </Link>

            <Link
              href={`/s/${business.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all min-h-[38px]"
            >
              <span>View Storefront</span>
              <ExternalLink size={13} />
            </Link>

            <Link
              href={
                currentSection === 'services' || isServiceBusiness
                  ? `/businesses/${business.id}/services/new`
                  : `/businesses/${business.id}/catalog-items/new`
              }
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-slate-800 active:scale-[0.98] transition-all min-h-[38px]"
            >
              <Plus size={14} strokeWidth={3} className="text-emerald-400" />
              <span>
                {currentSection === 'services' || isServiceBusiness ? 'New Service' : 'New Item'}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* ─── MOBILE BOTTOM STICKY ADMIN DOCK (5 Tabs, Zero Swiping) ──────── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur-md md:hidden shadow-2xl px-2 py-1.5">
        <div className="flex items-center justify-around">
          {mobileDockItems.map((item) => {
            const Icon = item.icon
            const isActive =
              currentSection === item.id || (item.id === 'overview' && !currentSection)
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all ${
                  isActive
                    ? 'text-emerald-600 font-black scale-105'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Icon size={18} />
                <span className="text-[10px] font-bold">{item.label}</span>
              </Link>
            )
          })}

          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all ${
              isMoreActive || mobileMenuOpen
                ? 'text-emerald-600 font-black scale-105'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Menu size={18} />
            <span className="text-[10px] font-bold">More</span>
          </button>
        </div>
      </nav>

      {/* ─── MOBILE "MORE" NAVIGATION BOTTOM SHEET ──────────────────────── */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 md:hidden flex items-end bg-black/50 backdrop-blur-xs"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-full rounded-t-3xl bg-white p-5 pb-8 shadow-2xl space-y-4 animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <p className="text-sm font-black text-slate-900">{business.name}</p>
                <p className="text-[11px] font-medium text-slate-500">All Store Sections</p>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
                aria-label="Close menu"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {allSections.map((sec) => {
                const Icon = sec.icon
                return (
                  <Link
                    key={sec.id}
                    href={sec.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 rounded-2xl border p-3 text-xs font-bold transition-all ${
                      sec.active
                        ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Icon
                      size={16}
                      className={sec.active ? 'text-emerald-400 shrink-0' : 'text-slate-500 shrink-0'}
                    />
                    <span className="truncate">{sec.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
