/**
 * Returns the full scan URL for a QR code.
 * Uses process.env.NEXT_PUBLIC_SCAN_BASE_URL or falls back to standard /q path.
 */
export function getScanUrl(code: string): string {
  const base = process.env.NEXT_PUBLIC_SCAN_BASE_URL ?? 'http://localhost:3000/q'
  return `${base.replace(/\/$/, '')}/${code}`
}
