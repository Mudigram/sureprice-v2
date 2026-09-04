'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  Printer,
  CheckSquare,
  Square,
  ScanLine,
  Utensils,
  Tag,
  Grid,
  Sparkles,
  Search,
} from 'lucide-react'
import { PrintTemplates, type PrintPreset, type PrintableItem } from '@/features/qr-codes/components/print-templates'
import { getOrCreateActiveQrCode } from '@/features/qr-codes/actions'
import type { CatalogItem } from '@/features/catalog-items/types'
import type { QrCode } from '@/features/qr-codes/types'
import type { StorefrontBusiness } from '@/features/storefront/types'
import { FirstQRBatchIllustration } from '@/components/illustrations'
import { BusinessAdminNav } from '@/components/admin/business-admin-nav'

interface QrStudioClientProps {
  business: StorefrontBusiness
  catalogItems: CatalogItem[]
  existingQrCodes: QrCode[]
}

export function QrStudioClient({
  business,
  catalogItems,
  existingQrCodes,
}: QrStudioClientProps) {
  const searchParams = useSearchParams()
  const initialPresetParam = searchParams.get('preset') as PrintPreset | null

  const isDiningOrEvent =
    business.business_type === 'restaurant' ||
    business.business_type === 'cafe' ||
    business.business_type === 'popup_vendor' ||
    business.business_type === 'event_vendor'

  const defaultPreset: PrintPreset =
    initialPresetParam && ['shelf_tag', 'sticker', 'table_standee', 'batch_a4', 'storefront_master'].includes(initialPresetParam)
      ? initialPresetParam
      : isDiningOrEvent
      ? 'storefront_master'
      : 'shelf_tag'

  const [selectedIds, setSelectedIds] = useState<string[]>(
    catalogItems.map((i) => i.id)
  )
  const [preset, setPreset] = useState<PrintPreset>(defaultPreset)
  const [isPreparing, setIsPreparing] = useState(false)
  const [printableItems, setPrintableItems] = useState<PrintableItem[]>([])

  // Item selector state
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 8
  const [wifiSsid, setWifiSsid] = useState(`${business.name}_Guest`)
  const [wifiPassword, setWifiPassword] = useState('sureprice')

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === catalogItems.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(catalogItems.map((i) => i.id))
    }
  }

  // Categories list
  const categories = useMemo(() => {
    const map = new Map<string, { id: string; name: string }>()
    for (const item of catalogItems) {
      const cat = (item as unknown as { category?: { id: string; name: string } })?.category
      if (cat && !map.has(cat.id)) {
        map.set(cat.id, { id: cat.id, name: cat.name })
      }
    }
    return Array.from(map.values())
  }, [catalogItems])

  // Filtered items in QR studio
  const filtered = useMemo(() => {
    return catalogItems.filter((item) => {
      const q = search.toLowerCase()
      const matchesSearch =
        !search ||
        item.name.toLowerCase().includes(q) ||
        (item.search_text && item.search_text.toLowerCase().includes(q))
      const cat = (item as unknown as { category?: { id: string; name: string } })?.category
      const matchesCategory =
        selectedCategory === 'all' || cat?.id === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [catalogItems, search, selectedCategory])

  // Pagination for item selection
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1
  const safePage = Math.min(currentPage, totalPages)
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE
  const paginatedItems = useMemo(() => {
    return filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filtered, startIndex])

  const toggleSelectCurrentPage = () => {
    const pageIds = paginatedItems.map((i) => i.id)
    const allPageSelected = pageIds.every((id) => selectedIds.includes(id))
    if (allPageSelected) {
      setSelectedIds(selectedIds.filter((id) => !pageIds.includes(id)))
    } else {
      const newSelected = new Set([...selectedIds, ...pageIds])
      setSelectedIds(Array.from(newSelected))
    }
  }

  const storeUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/s/${business.slug}`
    : `https://sureprice.ng/s/${business.slug}`

  // Prepares printable items by auto-generating missing QR codes if needed and launching window.print()
  const handleLaunchPrint = async () => {
    setIsPreparing(true)

    if (preset === 'storefront_master' || preset === 'wifi_combo') {
      const themeTagline = (business.storefront?.theme && typeof business.storefront.theme === 'object')
        ? (business.storefront.theme as Record<string, string>).tagline
        : null

      setPrintableItems([
        {
          id: business.id,
          name: 'Full Storefront & Live Menu',
          price: null,
          code: business.slug,
          businessName: business.name,
          customUrl: storeUrl,
          tagline: themeTagline || 'Scan to browse our live prices & menu',
          wifiSsid: wifiSsid,
          wifiPassword: wifiPassword,
        },
      ])

      setTimeout(() => {
        setIsPreparing(false)
        window.print()
      }, 500)
      return
    }

    if (selectedIds.length === 0) {
      setIsPreparing(false)
      return
    }

    try {
      const prepared: PrintableItem[] = []
      for (const id of selectedIds) {
        const item = catalogItems.find((i) => i.id === id)
        if (!item) continue

        const qr = await getOrCreateActiveQrCode('catalog_item', item.id)

        prepared.push({
          id: item.id,
          name: item.name,
          price: item.base_price,
          code: qr.code,
          businessName: business.name,
          categoryName: (item as unknown as { category?: { name: string } })?.category?.name ?? null,
        })
      }

      setPrintableItems(prepared)

      setTimeout(() => {
        setIsPreparing(false)
        window.print()
      }, 500)
    } catch {
      setIsPreparing(false)
      alert('Failed to prepare QR codes for printing.')
    }
  }

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-8 space-y-6 text-slate-900">
      {/* Store Admin Header Navigation Bar */}
      <div className="no-print">
        <BusinessAdminNav business={business} currentSection="qr-studio" />
      </div>

      {/* Top Header & Launch Print Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6 no-print">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
            <Printer size={22} className="text-emerald-400" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-900">
              QR Print Studio
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Generate and batch-print physical shelf tags, packaging stickers, and table standees for {business.name}.
            </p>
          </div>
        </div>

        <button
          onClick={handleLaunchPrint}
          disabled={isPreparing || (preset !== 'storefront_master' && selectedIds.length === 0)}
          id="launch-batch-print-btn"
          className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-xs font-bold text-white shadow-sm hover:bg-slate-800 active:scale-[0.98] disabled:opacity-50 transition-all"
        >
          <Printer size={16} className="text-emerald-400" />
          <span>{isPreparing ? 'Preparing Print Sheet…' : preset === 'storefront_master' ? 'Print Storefront Standee' : `Print Selected Tags (${selectedIds.length})`}</span>
        </button>
      </div>

      {/* Sequential Workbench Sections */}
      <div className="space-y-8 no-print">
        {/* Step 1: Preset Selector */}
        <div className="space-y-3 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
            1. Select Print Layout Preset
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <button
              type="button"
              onClick={() => setPreset('storefront_master')}
              className={`flex flex-col items-start gap-1.5 rounded-xl border p-4 text-left transition-all ${
                preset === 'storefront_master'
                  ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Utensils size={18} className={preset === 'storefront_master' ? 'text-emerald-400' : 'text-slate-500'} />
              <div>
                <p className="font-bold text-xs">Master Storefront</p>
                <p className={`text-[10px] ${preset === 'storefront_master' ? 'text-slate-300' : 'text-slate-500'}`}>A5 table & counter QR</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPreset('shelf_tag')}
              className={`flex flex-col items-start gap-1.5 rounded-xl border p-4 text-left transition-all ${
                preset === 'shelf_tag'
                  ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Tag size={18} className={preset === 'shelf_tag' ? 'text-emerald-400' : 'text-slate-500'} />
              <div>
                <p className="font-bold text-xs">Shelf Tag (4.2&quot;)</p>
                <p className={`text-[10px] ${preset === 'shelf_tag' ? 'text-slate-300' : 'text-slate-500'}`}>Supermarket shelf tag</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPreset('sticker')}
              className={`flex flex-col items-start gap-1.5 rounded-xl border p-4 text-left transition-all ${
                preset === 'sticker'
                  ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Sparkles size={18} className={preset === 'sticker' ? 'text-emerald-400' : 'text-slate-500'} />
              <div>
                <p className="font-bold text-xs">Packaging Sticker</p>
                <p className={`text-[10px] ${preset === 'sticker' ? 'text-slate-300' : 'text-slate-500'}`}>2.2&quot; x 2.4&quot; Stick-on</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPreset('table_standee')}
              className={`flex flex-col items-start gap-1.5 rounded-xl border p-4 text-left transition-all ${
                preset === 'table_standee'
                  ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Utensils size={18} className={preset === 'table_standee' ? 'text-emerald-400' : 'text-slate-500'} />
              <div>
                <p className="font-bold text-xs">Item Standee</p>
                <p className={`text-[10px] ${preset === 'table_standee' ? 'text-slate-300' : 'text-slate-500'}`}>A6 dish tent standee</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPreset('batch_a4')}
              className={`flex flex-col items-start gap-1.5 rounded-xl border p-4 text-left transition-all ${
                preset === 'batch_a4'
                  ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Grid size={18} className={preset === 'batch_a4' ? 'text-emerald-400' : 'text-slate-500'} />
              <div>
                <p className="font-bold text-xs">A4 Batch Grid</p>
                <p className={`text-[10px] ${preset === 'batch_a4' ? 'text-slate-300' : 'text-slate-500'}`}>8 tags per paper sheet</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPreset('wifi_combo')}
              className={`flex flex-col items-start gap-1.5 rounded-xl border p-4 text-left transition-all ${
                preset === 'wifi_combo'
                  ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Utensils size={18} className={preset === 'wifi_combo' ? 'text-emerald-400' : 'text-slate-500'} />
              <div>
                <p className="font-bold text-xs">Wi-Fi + Menu Combo</p>
                <p className={`text-[10px] ${preset === 'wifi_combo' ? 'text-slate-300' : 'text-slate-500'}`}>Guest Wi-Fi & Menu A5</p>
              </div>
            </button>
          </div>
        </div>

        {/* Wi-Fi Credentials Settings Box */}
        {preset === 'wifi_combo' && (
          <div className="space-y-4 rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold">
                📶
              </span>
              <div>
                <h3 className="text-sm font-black text-slate-900">In-Store Wi-Fi Credentials</h3>
                <p className="text-xs text-slate-500 font-medium">
                  Enter the Wi-Fi details printed on your A5 Table Standee so dining guests can connect instantly.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                  Wi-Fi Network Name (SSID)
                </label>
                <input
                  type="text"
                  value={wifiSsid}
                  onChange={(e) => setWifiSsid(e.target.value)}
                  placeholder="e.g. Cafe_Guest_WiFi"
                  className="h-11 w-full rounded-xl border border-emerald-300 bg-white px-3.5 text-xs font-mono font-bold text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                  Wi-Fi Password
                </label>
                <input
                  type="text"
                  value={wifiPassword}
                  onChange={(e) => setWifiPassword(e.target.value)}
                  placeholder="e.g. sureprice2026"
                  className="h-11 w-full rounded-xl border border-emerald-300 bg-white px-3.5 text-xs font-mono font-bold text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none shadow-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Item Selector with Search & Pagination */}
        {preset !== 'storefront_master' && (
          <div className="space-y-4 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
                2. Select Products to Print ({selectedIds.length} of {catalogItems.length} checked)
              </h2>
              <div className="flex items-center gap-4 text-xs font-bold">
                <button
                  type="button"
                  onClick={toggleSelectCurrentPage}
                  className="text-slate-600 hover:text-slate-900 underline"
                >
                  Toggle Current Page
                </button>
                <button
                  type="button"
                  onClick={toggleSelectAll}
                  className="text-emerald-700 underline"
                >
                  {selectedIds.length === catalogItems.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>
            </div>

            {/* Search & Category Filter Bar */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Search products by name or SKU..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:bg-white transition-all"
                />
              </div>

              {categories.length > 0 && (
                <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('all')
                      setCurrentPage(1)
                    }}
                    className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-bold border transition-all ${
                      selectedCategory === 'all'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    All Items ({catalogItems.length})
                  </button>
                  {categories.map((cat) => {
                    const isSelected = selectedCategory === cat.id
                    const count = catalogItems.filter(
                      (i) => (i as unknown as { category?: { id: string } })?.category?.id === cat.id
                    ).length
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(cat.id)
                          setCurrentPage(1)
                        }}
                        className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-bold border transition-all ${
                          isSelected
                            ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {cat.name} ({count})
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Paginated Selection Grid */}
            {filtered.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-xs font-medium text-slate-500">
                No products found matching your search query.
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {paginatedItems.map((item) => {
                    const isSelected = selectedIds.includes(item.id)
                    const existingQr = existingQrCodes.find(
                      (q) => q.target_id === item.id && q.status === 'active'
                    )

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleSelect(item.id)}
                        className={`flex items-center justify-between rounded-xl border p-3.5 text-left transition-all ${
                          isSelected
                            ? 'border-slate-900 bg-slate-900 text-white shadow-xs font-bold'
                            : 'border-slate-200/90 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {isSelected ? (
                            <CheckSquare size={18} className="text-emerald-400 shrink-0" />
                          ) : (
                            <Square size={18} className="text-slate-400 shrink-0" />
                          )}
                          <div className="min-w-0">
                            <p className="font-bold text-xs truncate">{item.name}</p>
                            <p className={`text-[10px] font-mono ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                              {item.base_price !== null ? `₦${item.base_price.toLocaleString()}` : 'Price on request'}
                            </p>
                          </div>
                        </div>

                        {existingQr && (
                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-mono font-bold shrink-0 ${
                            isSelected ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}>
                            <ScanLine size={10} className="text-emerald-500" />
                            <span>{existingQr.code}</span>
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>

                {/* Selection Pagination Footer */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-3 text-xs font-semibold text-slate-500 border-t border-slate-100">
                    <span>
                      Showing {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, filtered.length)} of {filtered.length} products
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={safePage <= 1}
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 font-bold text-slate-700 shadow-2xs hover:bg-slate-50 disabled:opacity-40 transition-all"
                      >
                        Previous
                      </button>

                      <span className="font-bold text-slate-900 px-1">
                        Page {safePage} of {totalPages}
                      </span>

                      <button
                        type="button"
                        disabled={safePage >= totalPages}
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 font-bold text-slate-700 shadow-2xs hover:bg-slate-50 disabled:opacity-40 transition-all"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Full-Width Horizontal Live Print Sheet Preview */}
        <div className="space-y-4 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
                3. Live Print Sheet Preview
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {preset === 'storefront_master'
                  ? 'Preview of Master Storefront Standee layout'
                  : `Live render preview (${Math.min(selectedIds.length, preset === 'shelf_tag' ? 6 : preset === 'sticker' ? 12 : preset === 'table_standee' ? 2 : preset === 'batch_a4' ? 8 : 1)} of ${selectedIds.length} tags shown)`}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live Render</span>
              </span>

              <button
                onClick={handleLaunchPrint}
                disabled={isPreparing || (preset !== 'storefront_master' && selectedIds.length === 0)}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-slate-800 active:scale-[0.98] disabled:opacity-50 transition-all"
              >
                <Printer size={14} className="text-emerald-400" />
                <span>Print All Selected ({preset === 'storefront_master' ? 1 : selectedIds.length})</span>
              </button>
            </div>
          </div>

          {/* Preset Preview Explanatory Banner */}
          {preset !== 'storefront_master' && (
            <div className="rounded-xl border border-blue-200/80 bg-blue-50/70 p-3.5 text-xs text-slate-700 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <Sparkles size={16} className="text-blue-600 shrink-0" />
                <p className="font-medium text-slate-800 leading-snug">
                  {preset === 'shelf_tag' && selectedIds.length > 6 && (
                    <>Showing live preview of the <strong>first 6 items</strong>. The remaining <strong>{selectedIds.length - 6} items</strong> will be included automatically when you print.</>
                  )}
                  {preset === 'shelf_tag' && selectedIds.length <= 6 && (
                    <>Showing live render preview for all <strong>{selectedIds.length} selected shelf tags</strong>.</>
                  )}
                  {preset === 'sticker' && selectedIds.length > 12 && (
                    <>Showing live preview of the <strong>first 12 stickers</strong>. The remaining <strong>{selectedIds.length - 12} stickers</strong> will be printed when you click Print All.</>
                  )}
                  {preset === 'sticker' && selectedIds.length <= 12 && (
                    <>Showing live render preview for all <strong>{selectedIds.length} packaging stickers</strong>.</>
                  )}
                  {preset === 'table_standee' && selectedIds.length > 2 && (
                    <>Showing live preview of the <strong>first 2 standees</strong>. The remaining <strong>{selectedIds.length - 2} item standees</strong> will be printed.</>
                  )}
                  {preset === 'table_standee' && selectedIds.length <= 2 && (
                    <>Showing live render preview for all <strong>{selectedIds.length} item standees</strong>.</>
                  )}
                  {preset === 'batch_a4' && selectedIds.length > 8 && (
                    <>Showing live preview of <strong>Sheet 1 (8 items)</strong>. All <strong>{selectedIds.length} tags</strong> across <strong>{Math.ceil(selectedIds.length / 8)} A4 pages</strong> will be printed.</>
                  )}
                  {preset === 'batch_a4' && selectedIds.length <= 8 && (
                    <>Showing live render preview for <strong>1 A4 Batch Sheet ({selectedIds.length} items)</strong>.</>
                  )}
                </p>
              </div>

              <span className="text-[11px] font-mono font-bold text-blue-900 shrink-0 bg-blue-100/80 px-2.5 py-1 rounded-lg border border-blue-200">
                {selectedIds.length} tags queued
              </span>
            </div>
          )}

          <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-6 overflow-x-auto no-scrollbar">
            <PrintTemplates
              items={
                printableItems.length > 0
                  ? printableItems
                  : catalogItems
                      .filter((i) => selectedIds.includes(i.id))
                      .slice(
                        0,
                        preset === 'shelf_tag'
                          ? 6
                          : preset === 'sticker'
                          ? 12
                          : preset === 'table_standee'
                          ? 2
                          : preset === 'batch_a4'
                          ? 8
                          : 1
                      )
                      .map((i) => ({
                        id: i.id,
                        name: i.name,
                        price: i.base_price,
                        code: existingQrCodes.find((q) => q.target_id === i.id)?.code ?? 'ci_preview',
                        businessName: business.name,
                        categoryName: (i as unknown as { category?: { name: string } })?.category?.name ?? null,
                      }))
              }
              preset={preset}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
