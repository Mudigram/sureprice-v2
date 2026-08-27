'use client'

import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { getScanUrl } from '@/lib/qr/scan-url'
import { ScanLine, Utensils, Tag, ShieldCheck, Camera, Sparkles } from 'lucide-react'

export type PrintPreset = 'shelf_tag' | 'sticker' | 'table_standee' | 'batch_a4'

export interface PrintableItem {
  id: string
  name: string
  price: number | null
  code: string
  businessName: string
  categoryName?: string | null
  sku?: string | null
  locationName?: string | null
}

interface PrintTemplateProps {
  items: PrintableItem[]
  preset: PrintPreset
  showSurePriceBadge?: boolean
  showScanInstructions?: boolean
}

export function PrintTemplates({
  items,
  preset,
  showSurePriceBadge = true,
  showScanInstructions = true,
}: PrintTemplateProps) {
  const [dataUrls, setDataUrls] = useState<Record<string, string>>({})

  useEffect(() => {
    async function generateAll() {
      const map: Record<string, string> = {}
      for (const item of items) {
        const url = getScanUrl(item.code)
        try {
          map[item.id] = await QRCode.toDataURL(url, {
            width: 400,
            margin: 1,
            color: { dark: '#0f172a', light: '#ffffff' },
          })
        } catch {
          // ignore error
        }
      }
      setDataUrls(map)
    }
    if (items.length > 0) generateAll()
  }, [items])

  if (items.length === 0) return null

  return (
    <div className="print-container">
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          header, footer, nav, button, .no-print {
            display: none !important;
          }
          .print-container {
            display: block !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .page-break {
            page-break-after: always;
          }
        }
      `}</style>

      {/* ── PRESET 1: ENLARGED SHELF TAG (4.2" x 2.6" / 105mm x 65mm) ── */}
      {preset === 'shelf_tag' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 print:grid-cols-2 print:gap-5">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-3xl border-2 border-slate-900 bg-white p-5 shadow-sm text-slate-900 w-full max-w-[420px] mx-auto print:border-black relative overflow-hidden"
            >
              {/* Main Info */}
              <div className="min-w-0 flex-1 pr-3 space-y-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                    {item.businessName}
                  </span>
                  {item.categoryName && (
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      {item.categoryName}
                    </span>
                  )}
                </div>

                <p className="font-black text-base text-slate-900 line-clamp-2 leading-snug">
                  {item.name}
                </p>

                {item.price !== null && (
                  <p className="font-black text-2xl text-slate-900 tracking-tight">
                    ₦{item.price.toLocaleString()}
                  </p>
                )}

                {/* SurePrice Branding & Instruction Footer */}
                <div className="pt-1 flex items-center gap-1 text-[9px] font-extrabold text-slate-600">
                  <ShieldCheck size={11} className="text-emerald-600 shrink-0" />
                  <span className="truncate">Verified by SurePrice.ng</span>
                </div>
              </div>

              {/* QR Code & Frame */}
              <div className="shrink-0 text-center flex flex-col items-center justify-center pl-2 border-l border-slate-200">
                {dataUrls[item.id] ? (
                  <img src={dataUrls[item.id]} alt="QR" className="h-28 w-28 block border border-slate-900 rounded-xl shadow-xs" />
                ) : (
                  <div className="h-28 w-28 bg-slate-100 rounded-xl flex items-center justify-center text-xs font-bold">QR</div>
                )}
                <span className="text-[9px] font-mono font-black text-slate-600 block mt-1 tracking-wider">{item.code}</span>
                <span className="text-[8px] font-bold text-slate-400 block mt-0.5">Point Camera To Scan</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── PRESET 2: ENLARGED PACKAGING STICKER (2.2" x 2.4" / 55mm x 60mm) ── */}
      {preset === 'sticker' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 print:grid-cols-4 print:gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center justify-between rounded-3xl border-2 border-slate-900 bg-white p-3.5 text-center text-slate-900 w-44 h-52 mx-auto print:border-black relative"
            >
              {/* Store Header */}
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 truncate w-full">
                {item.businessName}
              </p>

              {/* QR Image */}
              <div className="my-1">
                {dataUrls[item.id] ? (
                  <img src={dataUrls[item.id]} alt="QR" className="h-24 w-24 block rounded-xl border border-slate-900" />
                ) : (
                  <div className="h-24 w-24 bg-slate-100 rounded-xl flex items-center justify-center text-xs font-bold">QR</div>
                )}
              </div>

              {/* Product Info */}
              <div className="w-full">
                <p className="font-black text-xs text-slate-900 truncate w-full">
                  {item.name}
                </p>
                {item.price !== null && (
                  <p className="font-black text-sm text-slate-900 mt-0.5">
                    ₦{item.price.toLocaleString()}
                  </p>
                )}
              </div>

              {/* SurePrice Tagline Footer */}
              <div className="w-full pt-1 border-t border-slate-100 flex items-center justify-center gap-1 text-[8px] font-black text-slate-500">
                <ScanLine size={9} className="text-emerald-600" />
                <span>SurePrice • Instant Scan</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── PRESET 3: ENLARGED RESTAURANT & EVENT TABLE STANDEE (A6 / 4.5" x 6.5") ── */}
      {preset === 'table_standee' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 print:grid-cols-2 print:gap-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center justify-between rounded-[36px] border-4 border-slate-900 bg-white p-8 text-center text-slate-900 w-full max-w-sm mx-auto print:border-black shadow-lg relative"
            >
              {/* Top Header Badge */}
              <div className="space-y-1.5 w-full">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-white">
                  <Utensils size={14} className="text-[var(--lime-base)]" />
                  <span>Digital Dining & Price Tag</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 pt-1 tracking-tight">{item.businessName}</h3>
                <p className="text-xs text-slate-500 font-bold">Official Verified Merchant</p>
              </div>

              {/* Central Enlarged QR Code Frame */}
              <div className="my-5 p-4 border-4 border-slate-900 rounded-3xl bg-white shadow-sm flex flex-col items-center">
                {dataUrls[item.id] ? (
                  <img src={dataUrls[item.id]} alt="QR" className="h-48 w-48 block rounded-xl" />
                ) : (
                  <div className="h-48 w-48 bg-slate-100 flex items-center justify-center text-sm font-bold">QR</div>
                )}
                <span className="mt-2 text-xs font-mono font-black text-slate-800 tracking-wider">
                  TAG #{item.code}
                </span>
              </div>

              {/* Item Info & Instructions */}
              <div className="space-y-1 w-full">
                <p className="font-black text-lg text-slate-900">{item.name}</p>
                {item.price !== null && (
                  <p className="font-black text-2xl text-slate-900">₦{item.price.toLocaleString()}</p>
                )}
                <div className="mt-2 flex items-center justify-center gap-1.5 text-xs font-black text-slate-700 bg-slate-100 py-2 px-4 rounded-xl">
                  <Camera size={14} className="text-emerald-600" />
                  <span>Open Phone Camera to Scan & View Full Details</span>
                </div>
              </div>

              {/* SurePrice Brand Footer */}
              <div className="mt-4 pt-3 border-t border-slate-200 w-full flex items-center justify-between text-[10px] font-black text-slate-500">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={12} className="text-emerald-600" />
                  <span>Verified Price Network</span>
                </span>
                <span>Powered by SurePrice.ng</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── PRESET 4: ENLARGED A4 BATCH GRID (8 TAGS PER A4 SHEET WITH CUT LINES) ── */}
      {preset === 'batch_a4' && (
        <div className="grid grid-cols-2 gap-5 p-5 border-2 border-dashed border-slate-300 rounded-3xl bg-white print:border-none print:p-0">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-2xl border-2 border-slate-900 bg-white p-4 text-slate-900 print:border-black relative"
            >
              <div className="min-w-0 flex-1 pr-3 space-y-0.5">
                <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider">{item.businessName}</p>
                <p className="font-black text-sm text-slate-900 truncate">{item.name}</p>
                {item.price !== null && (
                  <p className="font-black text-xl text-slate-900 mt-0.5">₦{item.price.toLocaleString()}</p>
                )}
                <div className="flex items-center gap-1 text-[8px] font-bold text-slate-500 pt-0.5">
                  <ShieldCheck size={10} className="text-emerald-600" />
                  <span>SurePrice.ng Verified</span>
                </div>
              </div>
              <div className="shrink-0 text-center pl-2 border-l border-slate-200">
                {dataUrls[item.id] ? (
                  <img src={dataUrls[item.id]} alt="QR" className="h-20 w-20 block border border-slate-900 rounded-lg" />
                ) : (
                  <div className="h-20 w-20 bg-slate-100 rounded-lg flex items-center justify-center text-xs font-bold">QR</div>
                )}
                <span className="text-[9px] font-mono font-bold block text-slate-500 mt-0.5">{item.code}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
