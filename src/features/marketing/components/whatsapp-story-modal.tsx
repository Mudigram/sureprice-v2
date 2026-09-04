'use client'

import { useEffect, useRef, useState } from 'react'
import { X, Download, Share2, Sparkles, Check, Image as ImageIcon } from 'lucide-react'
import QRCode from 'qrcode'
import type { CatalogItem } from '@/features/catalog-items/types'
import type { StorefrontBusiness } from '@/features/storefront/types'

interface WhatsAppStoryModalProps {
  business: StorefrontBusiness
  items: CatalogItem[]
  isOpen: boolean
  onClose: () => void
}

export function WhatsAppStoryModal({
  business,
  items,
  isOpen,
  onClose,
}: WhatsAppStoryModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  // Default to first 3 items or specials/bestsellers
  useEffect(() => {
    if (items.length > 0) {
      const specialIds = items
        .filter((item) => {
          const attrs = item.attributes as Record<string, string> | undefined
          return attrs?.special === 'true' || attrs?.bestseller === 'true'
        })
        .map((i) => i.id)

      if (specialIds.length > 0) {
        setSelectedItemIds(specialIds.slice(0, 3))
      } else {
        setSelectedItemIds(items.slice(0, 3).map((i) => i.id))
      }
    }
  }, [items, isOpen])

  const storeUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/s/${business.slug}`
    : `https://sureprice.ng/s/${business.slug}`

  // Draw 9:16 canvas (1080x1920)
  useEffect(() => {
    if (!isOpen) return

    async function drawStory() {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.width = 1080
      canvas.height = 1920

      // 1. Premium Deep Slate Editorial Background
      const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1920)
      bgGrad.addColorStop(0, '#0f172a')
      bgGrad.addColorStop(0.6, '#1e293b')
      bgGrad.addColorStop(1, '#0f172a')
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, 1080, 1920)

      // Ambient emerald radial accent
      const glowGrad = ctx.createRadialGradient(540, 240, 50, 540, 240, 450)
      glowGrad.addColorStop(0, 'rgba(5, 150, 105, 0.12)')
      glowGrad.addColorStop(1, 'rgba(5, 150, 105, 0)')
      ctx.fillStyle = glowGrad
      ctx.beginPath()
      ctx.arc(540, 240, 450, 0, Math.PI * 2)
      ctx.fill()

      // 2. Top Header Pill ("TODAY'S SPECIALS")
      ctx.fillStyle = '#059669'
      ctx.beginPath()
      ctx.roundRect(340, 95, 400, 68, 34)
      ctx.fill()

      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 28px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText("TODAY'S FEATURED MENU", 540, 140)

      // 3. Business Name & Location
      ctx.fillStyle = '#ffffff'
      ctx.font = '900 64px sans-serif'
      ctx.textAlign = 'center'
      const cleanBizName = business.name.length > 24 ? business.name.slice(0, 22) + '…' : business.name
      ctx.fillText(cleanBizName, 540, 235)

      ctx.fillStyle = '#94a3b8'
      ctx.font = '600 30px sans-serif'
      const locText = business.locations?.[0]?.address_text ?? 'Verified Store'
      const cleanLoc = locText.length > 36 ? locText.slice(0, 34) + '…' : locText
      ctx.fillText(`📍 ${cleanLoc}`, 540, 288)

      // 4. Render Selected Featured Items (Up to 3 cards)
      const selectedItems = items.filter((i) => selectedItemIds.includes(i.id)).slice(0, 3)
      let startY = 360
      const cardHeight = 330
      const cardGap = 36

      for (let idx = 0; idx < selectedItems.length; idx++) {
        const item = selectedItems[idx]
        const y = startY + idx * (cardHeight + cardGap)

        // White Card Surface
        ctx.fillStyle = '#ffffff'
        ctx.strokeStyle = '#e2e8f0'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.roundRect(80, y, 920, cardHeight, 32)
        ctx.fill()
        ctx.stroke()

        // Card Left Number Pill
        ctx.fillStyle = '#047857'
        ctx.beginPath()
        ctx.roundRect(120, y + 45, 65, 65, 18)
        ctx.fill()

        ctx.fillStyle = '#ffffff'
        ctx.font = '900 34px sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(`${idx + 1}`, 152, y + 89)

        // Item Title
        ctx.fillStyle = '#0f172a'
        ctx.font = '900 42px sans-serif'
        ctx.textAlign = 'left'
        const cleanName = item.name.length > 26 ? item.name.slice(0, 24) + '…' : item.name
        ctx.fillText(cleanName, 210, y + 90)

        // Item Description / Subtitle
        ctx.fillStyle = '#64748b'
        ctx.font = '500 28px sans-serif'
        const desc = item.description || (business.business_type === 'restaurant' ? 'Freshly prepared daily' : 'Verified in-store stock')
        const cleanDesc = desc.length > 45 ? desc.slice(0, 43) + '…' : desc
        ctx.fillText(cleanDesc, 210, y + 145)

        // Emerald Price Badge
        ctx.fillStyle = '#ecfdf5'
        ctx.strokeStyle = '#a7f3d0'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.roundRect(210, y + 185, 340, 85, 20)
        ctx.fill()
        ctx.stroke()

        ctx.fillStyle = '#047857'
        ctx.font = '900 40px sans-serif'
        ctx.textAlign = 'center'
        const priceStr = item.base_price !== null ? `₦${item.base_price.toLocaleString()}` : 'Ask for Price'
        ctx.fillText(priceStr, 380, y + 242)
      }

      // 5. Bottom QR Code & Call to Action Box
      const footerY = 1460
      ctx.fillStyle = '#ffffff'
      ctx.strokeStyle = '#e2e8f0'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.roundRect(80, footerY, 920, 360, 36)
      ctx.fill()
      ctx.stroke()

      // Generate QR Code data URL for canvas
      try {
        const qrDataUrl = await QRCode.toDataURL(storeUrl, {
          width: 280,
          margin: 1,
          color: { dark: '#0f172a', light: '#ffffff' },
        })
        const qrImg = new Image()
        qrImg.src = qrDataUrl
        await new Promise((resolve) => {
          qrImg.onload = resolve
        })

        // Draw QR Container
        ctx.fillStyle = '#f8fafc'
        ctx.strokeStyle = '#cbd5e1'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.roundRect(120, footerY + 40, 280, 280, 24)
        ctx.fill()
        ctx.stroke()
        ctx.drawImage(qrImg, 120, footerY + 40, 280, 280)
      } catch {
        // Fallback
      }

      // Footer Text Column
      ctx.fillStyle = '#0f172a'
      ctx.font = '900 42px sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText('Scan for Full Digital Menu', 440, footerY + 115)

      ctx.fillStyle = '#64748b'
      ctx.font = '500 28px sans-serif'
      ctx.fillText('Open phone camera to view live prices', 440, footerY + 165)

      ctx.fillStyle = '#047857'
      ctx.font = 'bold 30px sans-serif'
      ctx.fillText(storeUrl.replace(/^https?:\/\//, ''), 440, footerY + 225)

      // Verified Brand Stamp Footer
      ctx.fillStyle = '#94a3b8'
      ctx.font = 'bold 22px sans-serif'
      ctx.fillText('Official Verified Store Catalog • SurePrice.ng', 440, footerY + 280)
    }

    drawStory()
  }, [isOpen, selectedItemIds, business, items, storeUrl])

  if (!isOpen) return null

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `${business.slug}-whatsapp-status.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const handleWhatsAppShare = () => {
    const text = `🔥 Today's Specials at ${business.name}!\n\nView our full verified menu & prices:\n👉 ${storeUrl}`
    const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(waUrl, '_blank')
  }

  const toggleItemSelection = (id: string) => {
    if (selectedItemIds.includes(id)) {
      if (selectedItemIds.length > 1) {
        setSelectedItemIds(selectedItemIds.filter((x) => x !== id))
      }
    } else {
      if (selectedItemIds.length < 3) {
        setSelectedItemIds([...selectedItemIds, id])
      } else {
        setSelectedItemIds([...selectedItemIds.slice(1), id])
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 p-4 backdrop-blur-md animate-in fade-in">
      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col md:flex-row overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl text-slate-900">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-all"
        >
          <X size={18} />
        </button>

        {/* Left: 9:16 Canvas Preview Frame */}
        <div className="flex flex-1 items-center justify-center bg-slate-900 p-6">
          <div className="relative h-[460px] w-[260px] overflow-hidden rounded-2xl border-2 border-slate-700 shadow-2xl">
            <canvas ref={canvasRef} className="h-full w-full object-contain" />
          </div>
        </div>

        {/* Right: Controls & Actions */}
        <div className="flex flex-1 flex-col justify-between p-6 md:p-8 space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 border border-emerald-200">
              <Sparkles size={13} className="text-emerald-600" />
              <span>WhatsApp Status & Story Generator</span>
            </div>
            <h2 className="mt-2 text-xl font-black tracking-tight text-slate-900">
              Daily WhatsApp Story Card
            </h2>
            <p className="mt-1 text-xs text-slate-500 font-medium leading-relaxed">
              Download this 9:16 card to post directly on your WhatsApp Status, Instagram Story, or customer broadcast lists.
            </p>

            {/* Choose 3 Items Selector */}
            <div className="mt-4 space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Featured Items (Select up to 3)
              </label>
              <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto no-scrollbar pt-1">
                {items.map((item) => {
                  const isSelected = selectedItemIds.includes(item.id)
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleItemSelection(item.id)}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all border ${
                        isSelected
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {isSelected && <Check size={13} strokeWidth={3} className="text-emerald-400" />}
                      <span className="truncate max-w-[140px]">{item.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <button
              onClick={handleDownload}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-3.5 text-xs font-bold text-white shadow-md hover:bg-slate-800 active:scale-95 transition-all"
            >
              <Download size={16} />
              <span>Download 9:16 Story Image</span>
            </button>

            <button
              onClick={handleWhatsAppShare}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-300 bg-emerald-50 py-3 text-xs font-bold text-emerald-900 hover:bg-emerald-100 active:scale-95 transition-all"
            >
              <Share2 size={16} className="text-emerald-700" />
              <span>Share Store Link on WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
