'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import QRCode from 'qrcode'
import { generateQrCodeForItem } from '../actions'
import type { QrCode } from '../types'

interface QrPanelProps {
  itemId: string
  businessId: string
  /** Pre-loaded QR code if it already exists; null if not yet generated */
  initialQrCode: QrCode | null
  /** The public base URL, e.g. https://yourapp.com */
  baseUrl: string
}

export function QrPanel({ itemId, businessId, initialQrCode, baseUrl }: QrPanelProps) {
  const [qrCode, setQrCode] = useState<QrCode | null>(initialQrCode)
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const publicUrl = qrCode ? `${baseUrl}/q/${qrCode.code}` : null

  const renderQr = useCallback(async (url: string) => {
    try {
      const dataUrl = await QRCode.toDataURL(url, {
        width: 240,
        margin: 2,
        color: { dark: '#000000', light: '#ffffff' },
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
      const code = await generateQrCodeForItem(itemId, businessId)
      setQrCode(code)
    } catch {
      setError('Failed to generate QR code. Please try again.')
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
    <div className="mt-8 rounded-xl border border-border bg-card p-6">
      <h2 className="mb-1 text-base font-semibold text-foreground">QR Code</h2>
      <p className="mb-5 text-sm text-muted-foreground">
        Print this code and attach it to the physical product. Customers scan it to view
        item details instantly — no app required.
      </p>

      {!qrCode ? (
        <button
          id="generate-qr-btn"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity disabled:opacity-60"
        >
          {isGenerating ? 'Generating…' : 'Generate QR Code'}
        </button>
      ) : (
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          {/* QR image */}
          <div className="shrink-0 rounded-lg border border-border bg-white p-3">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="QR code"
                width={180}
                height={180}
                className="block"
              />
            ) : (
              <div className="flex h-[180px] w-[180px] items-center justify-center text-xs text-muted-foreground">
                Rendering…
              </div>
            )}
          </div>

          {/* Details + actions */}
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Short URL
              </p>
              <p className="mt-0.5 break-all text-sm text-foreground">{publicUrl}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Scan count
              </p>
              <p className="mt-0.5 text-sm text-foreground">
                {qrCode.scan_count.toLocaleString()} scans
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                id="download-qr-btn"
                onClick={handleDownload}
                disabled={!qrDataUrl}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-50"
              >
                Download PNG
              </button>
              <a
                href={publicUrl ?? '#'}
                target="_blank"
                rel="noopener noreferrer"
                id="preview-item-link"
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                Preview item ↗
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Hidden canvas for potential future high-res export */}
      <canvas ref={canvasRef} className="hidden" />

      {error && (
        <p className="mt-3 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
