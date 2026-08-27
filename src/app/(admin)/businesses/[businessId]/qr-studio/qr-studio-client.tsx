'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Printer,
  CheckSquare,
  Square,
  ScanLine,
  Utensils,
  Tag,
  Grid,
  Sparkles,
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
  const [selectedIds, setSelectedIds] = useState<string[]>(
    catalogItems.map((i) => i.id)
  )
  const [preset, setPreset] = useState<PrintPreset>('shelf_tag')
  const [isPreparing, setIsPreparing] = useState(false)
  const [printableItems, setPrintableItems] = useState<PrintableItem[]>([])

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

  // Prepares printable items by auto-generating missing QR codes if needed and launching window.print()
  const handleLaunchPrint = async () => {
    if (selectedIds.length === 0) return
    setIsPreparing(true)

    try {
      const prepared: PrintableItem[] = []
      for (const id of selectedIds) {
        const item = catalogItems.find((i) => i.id === id)
        if (!item) continue

        // Auto-create active QR code via getOrCreateActiveQrCode per item if not pre-existing
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

      // Allow DOM update then launch window.print()
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
    <div className="mx-auto max-w-5xl p-4 sm:p-8 space-y-6 text-slate-900 dark:text-white">
      {/* Store Admin Header Navigation Bar */}
      <div className="no-print">
        <BusinessAdminNav business={business} currentSection="qr-studio" />
      </div>

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 no-print">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--lime-base)] text-black shadow-sm">
            <Printer size={22} />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
              QR Print Studio
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Batch generate and print enlarged physical shelf tags, packaging stickers, and table standees for {business.name}.
            </p>
          </div>
        </div>

        <button
          onClick={handleLaunchPrint}
          disabled={isPreparing || selectedIds.length === 0}
          id="launch-batch-print-btn"
          className="flex items-center justify-center gap-2 rounded-2xl bg-[var(--lime-base)] px-6 py-3.5 text-xs font-black text-black shadow-md shadow-[var(--lime-base)]/25 transition-all hover:bg-[var(--lime-dark)] active:scale-95 disabled:opacity-50"
        >
          <Printer size={16} />
          <span>{isPreparing ? 'Preparing Print Sheet…' : `Print Selected Tags (${selectedIds.length})`}</span>
        </button>
      </div>

      {/* Preset Selector */}
      <div className="space-y-2.5 no-print">
        <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
          1. Select Physical Print Layout Preset
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={() => setPreset('shelf_tag')}
            className={`flex flex-col items-start gap-1.5 rounded-2xl border p-4 text-left transition-all ${
              preset === 'shelf_tag'
                ? 'border-emerald-500 bg-emerald-50 text-slate-900 dark:border-[var(--lime-base)] dark:bg-slate-900 dark:text-white shadow-sm'
                : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:border-slate-300'
            }`}
          >
            <Tag size={18} className={preset === 'shelf_tag' ? 'text-emerald-600 dark:text-[var(--lime-base)]' : 'text-slate-400'} />
            <div>
              <p className="font-extrabold text-xs text-slate-900 dark:text-white">Shelf Tag (Large 4.2&quot;)</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Supermarket shelf price tag</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setPreset('sticker')}
            className={`flex flex-col items-start gap-1.5 rounded-2xl border p-4 text-left transition-all ${
              preset === 'sticker'
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 shadow-sm'
                : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:border-slate-300'
            }`}
          >
            <Sparkles size={18} className={preset === 'sticker' ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400'} />
            <div>
              <p className="font-extrabold text-xs text-slate-900 dark:text-white">Packaging Sticker</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">2.2&quot; x 2.4&quot; Stick-on tag</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setPreset('table_standee')}
            className={`flex flex-col items-start gap-1.5 rounded-2xl border p-4 text-left transition-all ${
              preset === 'table_standee'
                ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 shadow-sm'
                : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:border-slate-300'
            }`}
          >
            <Utensils size={18} className={preset === 'table_standee' ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400'} />
            <div>
              <p className="font-extrabold text-xs text-slate-900 dark:text-white">Table Standee (A6 Tent)</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Restaurant & event standee</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setPreset('batch_a4')}
            className={`flex flex-col items-start gap-1.5 rounded-2xl border p-4 text-left transition-all ${
              preset === 'batch_a4'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 shadow-sm'
                : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:border-slate-300'
            }`}
          >
            <Grid size={18} className={preset === 'batch_a4' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'} />
            <div>
              <p className="font-extrabold text-xs text-slate-900 dark:text-white">A4 Batch Grid</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Multi-tag paper sheet</p>
            </div>
          </button>
        </div>
      </div>

      {/* Catalog Multi-Select Grid */}
      <div className="space-y-3 no-print">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
            2. Select Catalog Items to Print ({selectedIds.length} of {catalogItems.length})
          </h2>
          <button
            onClick={toggleSelectAll}
            className="text-xs font-bold text-emerald-700 dark:text-[var(--lime-base)] underline"
          >
            {selectedIds.length === catalogItems.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>

        {catalogItems.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 p-8 text-center bg-white dark:border-slate-800 dark:bg-slate-900 space-y-3 shadow-sm">
            <FirstQRBatchIllustration className="mx-auto w-56 h-36 rounded-2xl" />
            <p className="text-sm font-bold text-slate-900 dark:text-white">No catalog items available for printing</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Add products or menu items to your business catalog first.</p>
            <Link
              href={`/businesses/${business.id}/catalog-items/new`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--lime-base)] px-4 py-2 text-xs font-black text-black"
            >
              + Add First Catalog Item
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
            {catalogItems.map((item) => {
              const isSelected = selectedIds.includes(item.id)
              const existingQr = existingQrCodes.find(
                (q) => q.target_id === item.id && q.status === 'active'
              )

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleSelect(item.id)}
                  className={`flex items-center justify-between rounded-2xl border p-4 text-left transition-all ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50 text-slate-900 dark:border-[var(--lime-base)] dark:bg-slate-900 dark:text-white shadow-sm font-semibold'
                      : 'border-slate-200/80 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400 opacity-75 hover:opacity-100 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {isSelected ? (
                      <CheckSquare size={20} className="text-emerald-600 dark:text-[var(--lime-base)] shrink-0" />
                    ) : (
                      <Square size={20} className="text-slate-400 shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="font-extrabold text-xs text-slate-900 dark:text-white truncate">{item.name}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                        {item.base_price !== null ? `₦${item.base_price.toLocaleString()}` : 'Price on request'}
                      </p>
                    </div>
                  </div>

                  {existingQr && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[9px] font-bold text-slate-600 dark:text-slate-300">
                      <ScanLine size={10} className="text-emerald-600 dark:text-[var(--lime-base)]" />
                      <span>{existingQr.code}</span>
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Live Print Template Preview */}
      <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 no-print">
          3. Print Sheet Layout Preview
        </h2>
        <PrintTemplates
          items={printableItems.length > 0 ? printableItems : catalogItems.filter((i) => selectedIds.includes(i.id)).map((i) => ({
            id: i.id,
            name: i.name,
            price: i.base_price,
            code: existingQrCodes.find((q) => q.target_id === i.id)?.code ?? 'ci_preview',
            businessName: business.name,
            categoryName: (i as unknown as { category?: { name: string } })?.category?.name ?? null,
          }))}
          preset={preset}
        />
      </div>
    </div>
  )
}
