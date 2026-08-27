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
    <div className="mb-6 space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* Top Header: Store Info & Quick Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3.5 min-w-0">
          {/* Logo Avatar */}
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
            {logoUrl ? (
              <Image src={logoUrl} alt={business.name} fill className="object-cover" sizes="48px" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-500 dark:text-slate-400">
                {getBrandFallbackSvgIcon(business.business_type, { size: 24 })}
              </div>
            )}
          </div>

          {/* Store Name & Type Badge */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-xl font-black tracking-tight text-slate-900 dark:text-white">
                {business.name}
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 shrink-0">
                <TypeIcon size={11} />
                {typeLabel}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 truncate">
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
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-white"
          >
            <span>View Public Storefront</span>
            <ExternalLink size={13} />
          </Link>

          <Link
            href={`/businesses/${business.id}/catalog-items/new`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--lime-base)] px-4 py-2 text-xs font-black text-black shadow-sm hover:bg-[var(--lime-dark)] active:scale-95 transition-all"
          >
            <Plus size={14} strokeWidth={3} />
            <span>New Item</span>
          </Link>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex gap-1 overflow-x-auto no-scrollbar pt-2 border-t border-slate-100 dark:border-slate-800/80">
        {navTabs.map((tab) => {
          const Icon = tab.icon
          return (
            <Link
              key={tab.id}
              href={tab.href}
              id={`admin-nav-${tab.id}`}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-extrabold transition-all active:scale-95 ${
                tab.active
                  ? 'bg-slate-900 text-white shadow-sm dark:bg-slate-100 dark:text-slate-900'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
              }`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
