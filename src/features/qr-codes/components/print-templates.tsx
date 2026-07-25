'use client'

import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { getScanUrl } from '@/lib/qr/scan-url'
import { ScanLine, Utensils, Tag } from 'lucide-react'

export type PrintPreset = 'shelf_tag' | 'sticker' | 'table_standee' | 'batch_a4'

export interface PrintableItem {
  id: string
  name: string
  price: number | null
  code: string
  businessName: string
  categoryName?: string | null
}

interface PrintTemplateProps {
  items: PrintableItem[]
  preset: PrintPreset
}

export function PrintTemplates({ items, preset }: PrintTemplateProps) {
  const [dataUrls, setDataUrls] = useState<Record<string, string>>({})

  useEffect(() => {
    async function generateAll() {
      const map: Record<string, string> = {}
      for (const item of items) {
        const url = getScanUrl(item.code)
        try {
          map[item.id] = await QRCode.toDataURL(url, {
            width: 300,
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

      {/* Preset 1: Standard Shelf Tag (3.5" x 2" / 90mm x 50mm) */}
      {preset === 'shelf_tag' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:grid-cols-2 print:gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-2xl border-2 border-slate-900 bg-white p-3.5 shadow-sm text-slate-900 w-full max-w-[360px] mx-auto print:border-black"
            >
              <div className="min-w-0 flex-1 pr-2">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                  {item.businessName}
                </p>
                <p className="font-black text-sm text-slate-900 line-clamp-1 mt-0.5">
                  {item.name}
                </p>
                {item.price !== null && (
                  <p className="font-black text-xl text-slate-900 mt-1">
                    ₦{item.price.toLocaleString()}
                  </p>
                )}
                <p className="text-[9px] font-bold text-slate-500 mt-1 flex items-center gap-1">
                  <ScanLine size={10} />
                  <span>Scan for verified details</span>
                </p>
              </div>

              <div className="shrink-0 text-center">
                {dataUrls[item.id] ? (
                  <img src={dataUrls[item.id]} alt="QR" className="h-20 w-20 block border border-slate-200 rounded-lg" />
                ) : (
                  <div className="h-20 w-20 bg-slate-100 rounded-lg flex items-center justify-center text-[10px]">QR</div>
                )}
                <span className="text-[8px] font-mono font-bold text-slate-400 block mt-0.5">{item.code}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preset 2: Compact Packaging Sticker (1.5" x 1.5" / 40mm x 40mm) */}
      {preset === 'sticker' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 print:grid-cols-4 print:gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center justify-center rounded-2xl border border-slate-900 bg-white p-2.5 text-center text-slate-900 w-36 h-36 mx-auto print:border-black"
            >
              {dataUrls[item.id] ? (
                <img src={dataUrls[item.id]} alt="QR" className="h-16 w-16 block rounded" />
              ) : (
                <div className="h-16 w-16 bg-slate-100 rounded flex items-center justify-center text-[10px]">QR</div>
              )}
              <p className="font-extrabold text-[11px] text-slate-900 truncate w-full mt-1">
                {item.name}
              </p>
              {item.price !== null && (
                <p className="font-black text-xs text-slate-900">
                  ₦{item.price.toLocaleString()}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Preset 3: Restaurant / Café Table Standee (4" x 6" / A6 Tent Card) */}
      {preset === 'table_standee' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 print:grid-cols-2 print:gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center justify-between rounded-3xl border-4 border-slate-900 bg-white p-6 text-center text-slate-900 w-full max-w-xs mx-auto print:border-black"
            >
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-slate-800">
                  <Utensils size={12} />
                  Table Digital Menu
                </span>
                <h3 className="text-xl font-black text-slate-900 pt-1">{item.businessName}</h3>
              </div>

              <div className="my-4 p-3 border-2 border-slate-900 rounded-2xl bg-white">
                {dataUrls[item.id] ? (
                  <img src={dataUrls[item.id]} alt="QR" className="h-36 w-36 block" />
                ) : (
                  <div className="h-36 w-36 bg-slate-100 flex items-center justify-center text-xs">QR</div>
                )}
              </div>

              <div>
                <p className="font-black text-sm text-slate-900">{item.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">Scan to view full menu & prices</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preset 4: Batch A4 Sheet (Grid of 8 Shelf Tags with Cut Lines) */}
      {preset === 'batch_a4' && (
        <div className="grid grid-cols-2 gap-4 p-4 border-2 border-dashed border-slate-300 rounded-3xl bg-white print:border-none print:p-0">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-xl border border-slate-800 bg-white p-3 text-slate-900 print:border-black"
            >
              <div className="min-w-0 flex-1 pr-2">
                <p className="text-[9px] font-extrabold uppercase text-slate-400">{item.businessName}</p>
                <p className="font-black text-xs text-slate-900 truncate">{item.name}</p>
                {item.price !== null && (
                  <p className="font-black text-base text-slate-900">₦{item.price.toLocaleString()}</p>
                )}
              </div>
              <div className="shrink-0 text-center">
                {dataUrls[item.id] && (
                  <img src={dataUrls[item.id]} alt="QR" className="h-14 w-14 block" />
                )}
                <span className="text-[8px] font-mono block text-slate-400">{item.code}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
