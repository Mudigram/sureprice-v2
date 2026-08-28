'use client'

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
} from 'lucide-react'
import type { StorefrontBusiness } from '@/features/storefront/types'
import { getBrandFallbackSvgIcon } from '@/components/icons'

interface BusinessAdminNavProps {
  business: StorefrontBusiness
  currentSection?: 'overview' | 'catalog' | 'categories' | 'qr-studio' | 'analytics' | 'team' | 'edit'
}

export function BusinessAdminNav({ business, currentSection }: BusinessAdminNavProps) {
  const pathname = usePathname()

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

  const isRestaurant = business.business_type === 'restaurant' || business.business_type === 'cafe'
  const isEvent = business.business_type === 'popup_vendor' || business.business_type === 'event_vendor'

  const typeLabel =
    business.business_type === 'restaurant'
      ? 'Restaurant & Dining'
      : business.business_type === 'cafe'
      ? 'Café & Bakery'
      : isEvent
      ? 'Pop-up & Event Stall'
      : 'Retail & Supermarket'

  const TypeIcon =
    business.business_type === 'restaurant'
      ? Utensils
      : business.business_type === 'cafe'
      ? Coffee
      : isEvent
      ? Ticket
      : ShoppingBag

  const navTabs = [
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

  return (
    <div className="sticky top-0 z-30 mb-6 space-y-3.5 rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-md p-4 sm:p-5 shadow-md transition-all">
      {/* Breadcrumb Trail & Quick Back Navigation */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-xs">
        <div className="flex items-center gap-1.5 font-medium text-slate-500">
          <Link href="/dashboard" className="hover:text-slate-900 transition-colors">
            Dashboard
          </Link>
          <span className="text-slate-300">/</span>
          <Link href="/dashboard" className="hover:text-slate-900 transition-colors">
            Stores
          </Link>
          <span className="text-slate-300">/</span>
          <span className="font-bold text-slate-900 truncate max-w-[140px] sm:max-w-none">
            {business.name}
          </span>
          {currentSection && (
            <>
              <span className="text-slate-300">/</span>
              <span className="capitalize font-bold text-emerald-700">{currentSection.replace('-', ' ')}</span>
            </>
          )}
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 font-bold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={13} />
          <span>All Stores</span>
        </Link>
      </div>

      {/* Top Header: Store Info & Quick Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3.5 min-w-0">
          {/* Logo Avatar */}
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
            {logoUrl ? (
              <Image src={logoUrl} alt={business.name} fill className="object-cover" sizes="48px" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-500">
                {getBrandFallbackSvgIcon(business.business_type, { size: 24 })}
              </div>
            )}
          </div>

          {/* Store Name & Type Badge */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-xl font-black tracking-tight text-slate-900">
                {business.name}
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700 border border-slate-200 shrink-0">
                <TypeIcon size={11} />
                {typeLabel}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-slate-500 truncate font-medium">
              Store ID: <span className="font-mono">{business.id.slice(0, 8)}...</span> • Slug: <span className="font-mono">{business.slug}</span>
            </p>
          </div>
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href={`/s/${business.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all"
          >
            <span>View Public Storefront</span>
            <ExternalLink size={13} />
          </Link>

          <Link
            href={`/businesses/${business.id}/catalog-items/new`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-slate-800 active:scale-[0.98] transition-all"
          >
            <Plus size={14} strokeWidth={3} className="text-[var(--lime-base)]" />
            <span>New Item</span>
          </Link>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex gap-1 overflow-x-auto no-scrollbar pt-2 border-t border-slate-100">
        {navTabs.map((tab) => {
          const Icon = tab.icon
          return (
            <Link
              key={tab.id}
              href={tab.href}
              id={`admin-nav-${tab.id}`}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                tab.active
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon size={15} className={tab.active ? 'text-[var(--lime-base)]' : 'text-slate-500'} />
              <span>{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}


