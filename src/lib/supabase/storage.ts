export const CATALOG_MEDIA_BUCKET = 'catalog-media'

// Pure string construction — no network call needed, works identically
// server-side and client-side since NEXT_PUBLIC_ vars are inlined at build time.
export function getCatalogMediaPublicUrl(storagePath: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL!
  return `${base}/storage/v1/object/public/${CATALOG_MEDIA_BUCKET}/${storagePath}`
}