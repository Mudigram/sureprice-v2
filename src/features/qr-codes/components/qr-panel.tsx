'use client'

import { useState, useEffect, useCallback } from 'react'
import QRCode from 'qrcode'
import { getOrCreateActiveQrCode, regenerateQrCode } from '../actions'
import type { QrCode } from '../types'
import { getScanUrl } from '@/lib/qr/scan-url'
import { RefreshCcw, Download, ExternalLink, ScanLine } from 'lucide-react'
import { RegenerateQrModal } from './regenerate-qr-modal'

interface QrPanelProps {
  itemId: string
  businessId: string
  /** Pre-loaded QR code if it already exists; null if not yet generated */
  initialQrCode: QrCode | null
  baseUrl: string
}

export function QrPanel({ itemId, businessId, initialQrCode }: QrPanelProps) {
  const [qrCode, setQrCode] = useState<QrCode | null>(initialQrCode)
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isRegenModalOpen, setIsRegenModalOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const publicUrl = qrCode ? getScanUrl(qrCode.code) : null

  const renderQr = useCallback(async (url: string) => {
    try {
      const dataUrl = await QRCode.toDataURL(url, {
        width: 280,
        margin: 2,
        color: { dark: '#0f172a', light: '#ffffff' },
      })
      setQrDataUrl(dataUrl)
    } catch {
      setError('Failed to render QR image.')
    }
  }, [])

  useEffect(() => {
    if (publicUrl) renderQr(publicUrl)
  }, [publicUrl, renderQr])

  const handleGenerate = async () => {
    setIsGenerating(true)
    setError(null)
    try {
      const code = await getOrCreateActiveQrCode('catalog_item', itemId)
      setQrCode(code)
    } catch {
      setError('Failed to generate QR code. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleConfirmRegenerate = async () => {
    if (!qrCode) return

    setIsGenerating(true)
    setError(null)
    try {
      const fresh = await regenerateQrCode(qrCode.id)
      setQrCode(fresh)
      setIsRegenModalOpen(false)
    } catch {
      setError('Failed to regenerate QR code. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (!qrDataUrl || !qrCode) return
    const link = document.createElement('a')
    link.href = qrDataUrl
    link.download = `qr-${qrCode.code}.png`
    link.click()
  }

  return (
    <div className="mt-8 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--lime-base)] text-black">
          <ScanLine size={18} />
        </div>
        <h2 className="text-base font-black text-slate-900 dark:text-zinc-100">Item QR Tag</h2>
      </div>

      <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
        Attach this QR code to the physical shelf tag or packaging. Customers scan it with zero app download to view verified prices and product specs.
      </p>

      {!qrCode ? (
        <button
          id="generate-qr-btn"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="flex items-center gap-2 rounded-2xl bg-[var(--lime-base)] px-5 py-3 text-xs font-black text-black shadow-md transition-all active:scale-95 disabled:opacity-60"
        >
          <ScanLine size={16} />
          <span>{isGenerating ? 'Generating Code…' : 'Generate Active QR Code'}</span>
        </button>
      ) : (
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center pt-2">
          {/* QR image */}
          <div className="shrink-0 rounded-2xl border border-gray-200 bg-white p-3 shadow-inner dark:border-zinc-800">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="QR code"
                width={180}
                height={180}
                className="block rounded-xl"
              />
            ) : (
              <div className="flex h-[180px] w-[180px] items-center justify-center text-xs text-slate-400">
                Rendering QR…
              </div>
            )}
          </div>

          {/* Details & Actions */}
          <div className="flex flex-col gap-3 min-w-0 flex-1">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Scan Code
              </p>
              <p className="mt-0.5 font-mono text-sm font-black text-slate-900 dark:text-zinc-100">
                {qrCode.code}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Total In-Store Scans
              </p>
              <p className="mt-0.5 text-sm font-extrabold text-slate-900 dark:text-zinc-100">
                {qrCode.scan_count.toLocaleString()} scans
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                id="download-qr-btn"
                onClick={handleDownload}
                disabled={!qrDataUrl}
                className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300"
              >
                <Download size={14} />
                <span>Download PNG</span>
              </button>

              <button
                id="regen-item-qr-btn"
                type="button"
                onClick={() => setIsRegenModalOpen(true)}
                disabled={isGenerating}
                className="flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-900 transition-colors hover:bg-amber-100 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300"
              >
                <RefreshCcw size={14} className={isGenerating ? 'animate-spin' : ''} />
                <span>Regenerate Tag</span>
              </button>

              <a
                href={publicUrl ?? '#'}
                target="_blank"
                rel="noopener noreferrer"
                id="preview-item-link"
                className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
              >
                <ExternalLink size={14} />
                <span>Test Redirect</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-2 text-xs font-bold text-red-500" role="alert">
          {error}
        </p>
      )}

      {qrCode && (
        <RegenerateQrModal
          isOpen={isRegenModalOpen}
          qrCode={qrCode.code}
          scanCount={qrCode.scan_count}
          isPending={isGenerating}
          onConfirm={handleConfirmRegenerate}
          onClose={() => setIsRegenModalOpen(false)}
        />
      )}
    </div>
  )
}
