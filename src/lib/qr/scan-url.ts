/**
 * Returns the full scan URL for a QR code.
 * Uses process.env.NEXT_PUBLIC_SCAN_BASE_URL or falls back to standard /scan path.
 */
export function getScanUrl(code: string): string {
  const base = process.env.NEXT_PUBLIC_SCAN_BASE_URL ?? 'http://localhost:3000/scan'
  return `${base.replace(/\/$/, '')}/${code}`
}
