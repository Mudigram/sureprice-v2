'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Camera,
  CameraOff,
  Loader2,
  Flashlight,
  Keyboard,
  ArrowRight,
  Sparkles,
} from 'lucide-react'

type ScanState = 'idle' | 'requesting' | 'scanning' | 'denied' | 'error'

export function QrScanner() {
  const router = useRouter()
  const regionRef = useRef<HTMLDivElement>(null)
  const scannerRef = useRef<unknown>(null)

  const [state, setScanState] = useState<ScanState>('idle')
  const [torchOn, setTorchOn] = useState(false)
  const [hasTorch, setHasTorch] = useState(false)
  const [manualCode, setManualCode] = useState('')
  const [showManual, setShowManual] = useState(false)

  const navigateToCode = useCallback(
    (code: string) => {
      const trimmed = code.trim()
      if (!trimmed) return

      // If it's a full URL pointing to our app, extract path
      try {
        const url = new URL(trimmed)
        router.push(url.pathname + url.search)
      } catch {
        // Not a full URL — try as a path or QR code identifier
        if (trimmed.startsWith('/')) {
          router.push(trimmed)
        } else if (trimmed.startsWith('q/') || trimmed.startsWith('s/')) {
          router.push('/' + trimmed)
        } else {
          // Treat as shortcode -> /q/[code]
          router.push(`/q/${trimmed}`)
        }
      }
    },
    [router]
  )

  const startScan = useCallback(async () => {
    setScanState('requesting')
    try {
      const { Html5Qrcode } = await import('html5-qrcode')
      const scanner = new Html5Qrcode('qr-reader')
      scannerRef.current = scanner

      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        (decodedText) => {
          // Stop scanner then navigate
          scanner.stop().catch(() => undefined)
          navigateToCode(decodedText)
        },
        () => undefined // ignore per-frame errors
      )

      setScanState('scanning')

      // Check if torch feature is supported
      try {
        const capabilities = scanner.getRunningTrackCapabilities?.()
        if (capabilities && 'torch' in capabilities) {
          setHasTorch(true)
        }
      } catch {
        // Torch capability check not supported on all browsers
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      if (msg.toLowerCase().includes('permission') || msg.toLowerCase().includes('denied')) {
        setScanState('denied')
      } else {
        setScanState('error')
      }
    }
  }, [navigateToCode])

  const toggleTorch = async () => {
    if (!scannerRef.current || !hasTorch) return
    try {
      const scanner = scannerRef.current as {
        applyVideoConstraints: (constraints: unknown) => Promise<void>
      }
      const nextState = !torchOn
      await scanner.applyVideoConstraints({
        advanced: [{ torch: nextState }],
      })
      setTorchOn(nextState)
    } catch {
      // Torch toggle failed
    }
  }

  // Auto-start scanner on mount
  useEffect(() => {
    startScan()
    return () => {
      if (scannerRef.current) {
        const s = scannerRef.current as { stop: () => Promise<void> }
        s.stop().catch(() => undefined)
      }
    }
  }, [startScan])

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigateToCode(manualCode)
  }

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-sm mx-auto">
      {/* Viewfinder container */}
      <div className="relative w-full overflow-hidden rounded-3xl bg-black aspect-square shadow-2xl border border-slate-800">
        {/* html5-qrcode video element */}
        <div id="qr-reader" ref={regionRef} className="h-full w-full" />

        {/* Viewfinder Overlay with Animated Scanning Laser */}
        {state === 'scanning' && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            {/* Dark blur vignette around viewfinder */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

            {/* Viewfinder Frame */}
            <div className="relative h-60 w-60 z-10">
              {/* Corner Brackets */}
              <span className="absolute left-0 top-0 h-9 w-9 rounded-tl-2xl border-l-4 border-t-4 border-[var(--lime-base)] shadow-[0_0_12px_var(--lime-base)]" />
              <span className="absolute right-0 top-0 h-9 w-9 rounded-tr-2xl border-r-4 border-t-4 border-[var(--lime-base)] shadow-[0_0_12px_var(--lime-base)]" />
              <span className="absolute bottom-0 left-0 h-9 w-9 rounded-bl-2xl border-b-4 border-l-4 border-[var(--lime-base)] shadow-[0_0_12px_var(--lime-base)]" />
              <span className="absolute bottom-0 right-0 h-9 w-9 rounded-br-2xl border-b-4 border-r-4 border-[var(--lime-base)] shadow-[0_0_12px_var(--lime-base)]" />

              {/* Animated Lime Laser Beam */}
              <div className="absolute left-1 right-1 top-0 h-1 bg-gradient-to-r from-transparent via-[var(--lime-base)] to-transparent shadow-[0_0_15px_var(--lime-base)] animate-scan-laser" />
            </div>

            {/* Top Torch Button inside camera view */}
            {hasTorch && (
              <button
                type="button"
                onClick={toggleTorch}
                id="toggle-torch-btn"
                className={`pointer-events-auto absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md transition-all ${
                  torchOn
                    ? 'bg-[var(--lime-base)] text-black'
                    : 'bg-black/60 text-white border border-white/20'
                }`}
              >
                <Flashlight size={18} />
              </button>
            )}
          </div>
        )}

        {/* Loading / Requesting State */}
        {(state === 'idle' || state === 'requesting') && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-900 text-white">
            <Loader2 size={36} className="animate-spin text-[var(--lime-base)]" />
            <p className="text-xs font-semibold text-slate-300">Accessing Camera…</p>
          </div>
        )}

        {/* Permission Denied State */}
        {state === 'denied' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950 p-6 text-center text-white">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500/20 text-red-400">
              <CameraOff size={28} />
            </div>
            <p className="font-bold text-sm">Camera Permission Required</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Please allow camera access in your browser settings to scan QR codes on store shelves.
            </p>
            <button
              onClick={startScan}
              className="mt-2 rounded-xl bg-[var(--lime-base)] px-5 py-2.5 text-xs font-bold text-black"
            >
              Retry Camera Access
            </button>
          </div>
        )}

        {/* Error State */}
        {state === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950 p-6 text-center text-white">
            <Camera size={32} className="text-slate-500" />
            <p className="font-bold text-sm">Camera Unavailable</p>
            <p className="text-xs text-slate-400">
              Unable to open camera hardware on this device.
            </p>
            <button
              onClick={startScan}
              className="rounded-xl bg-[var(--lime-base)] px-5 py-2.5 text-xs font-bold text-black"
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* Scanner Instructions & Controls */}
      {state === 'scanning' && (
        <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1.5 dark:bg-zinc-800 text-center">
          <Sparkles size={14} className="text-[var(--lime-dark)]" />
          <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
            Align QR code inside the frame
          </span>
        </div>
      )}

      {/* Manual Entry Toggle */}
      <div className="w-full space-y-3">
        <button
          type="button"
          id="toggle-manual-entry-btn"
          onClick={() => setShowManual((prev) => !prev)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white py-3 text-xs font-bold text-slate-700 transition-colors hover:border-gray-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
        >
          <Keyboard size={16} />
          {showManual ? 'Hide Manual Code Entry' : 'Enter Code or Shortcode Manually'}
        </button>

        {showManual && (
          <form
            onSubmit={handleManualSubmit}
            className="flex gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <input
              type="text"
              placeholder="e.g. ABC123 or paste URL"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              id="manual-qr-input"
              className="flex-1 bg-transparent px-3 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-zinc-100"
            />
            <button
              type="submit"
              id="submit-manual-code-btn"
              disabled={!manualCode.trim()}
              className="flex items-center gap-1 rounded-xl bg-[var(--lime-base)] px-4 py-2 text-xs font-black text-black disabled:opacity-50"
            >
              <span>Go</span>
              <ArrowRight size={14} />
            </button>
          </form>
        )}
      </div>

      <p className="text-center text-[10px] text-slate-400 dark:text-zinc-500">
        Camera is used solely for instant in-store QR decoding. No media is stored.
      </p>
    </div>
  )
}
