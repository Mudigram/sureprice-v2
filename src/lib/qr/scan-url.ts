/**
 * Returns the full scan URL for a QR code.
 * Uses process.env.NEXT_PUBLIC_SCAN_BASE_URL, NEXT_PUBLIC_APP_URL,
 * window.location.origin, or falls back to the live Vercel deployment URL.
 */
export function getScanUrl(code: string): string {
  const envBase =
    process.env.NEXT_PUBLIC_SCAN_BASE_URL ||
    (process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/scan` : null)

  if (envBase) {
    return `${envBase.replace(/\/$/, '')}/${code}`
  }

  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}/scan/${code}`
  }

  return `https://sureprice.vercel.app/scan/${code}`
}
