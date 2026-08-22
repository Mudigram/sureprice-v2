import { createClient } from '@/lib/supabase/server'
import type {
  ScanAnalyticsSummary,
  TopScannedItem,
  RecentScanEvent,
  OrgDashboardMetrics,
  DailyScanTrendPoint,
  BusinessOverviewStats,
} from './types'

export async function getScanAnalyticsSummary(businessId: string): Promise<ScanAnalyticsSummary> {
  const supabase = await createClient()

  // Lifetime scans count
  const { count: totalScans, error: totalError } = await supabase
    .from('scan_events')
    .select('*', { count: 'exact', head: true })
    .eq('business_id', businessId)

  if (totalError) throw totalError

  // Today's scans count (>= midnight today)
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)

  const { count: todayScans, error: todayError } = await supabase
    .from('scan_events')
    .select('*', { count: 'exact', head: true })
    .eq('business_id', businessId)
    .gte('scanned_at', startOfToday.toISOString())

  if (todayError) throw todayError

  // Fetch top scanned catalog items using RPC with JS aggregation fallback
  let topItems: TopScannedItem[] = []
  const { data: topItemsRaw, error: topError } = await (supabase as unknown as {
    rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown; error: unknown }>
  }).rpc('get_top_scanned_items', {
    p_business_id: businessId,
    p_limit: 5,
  })

  if (!topError && topItemsRaw && Array.isArray(topItemsRaw)) {
    topItems = (topItemsRaw as Array<{
      catalog_item_id: string
      name: string
      image_url: string | null
      scan_count: number | string
    }>).map((row) => ({
      catalogItemId: row.catalog_item_id,
      name: row.name,
      imageUrl: row.image_url,
      scanCount: Number(row.scan_count),
    }))
  } else {
    // JS aggregation fallback if RPC isn't deployed yet
    const { data: items } = await supabase
      .from('catalog_items')
      .select('id, name, image_url')
      .eq('business_id', businessId)

    const { data: qrs } = await supabase
      .from('qr_codes')
      .select('id, target_id, scan_count')
      .eq('business_id', businessId)
      .eq('target_type', 'catalog_item')
      .order('scan_count', { ascending: false })
      .limit(5)

    if (items && qrs) {
      topItems = qrs
        .map((qr) => {
          const item = items.find((i) => i.id === qr.target_id)
          return item
            ? {
                catalogItemId: item.id,
                name: item.name,
                imageUrl: item.image_url,
                scanCount: qr.scan_count ?? 0,
              }
            : null
        })
        .filter((x): x is TopScannedItem => x !== null && x.scanCount > 0)
    }
  }

  const recentActivity = await getRecentScanActivity(businessId)

  return {
    totalScans: totalScans ?? 0,
    todayScans: todayScans ?? 0,
    topItems,
    recentActivity,
  }
}

/**
 * Fetches recent scan events (limit 15) and resolves human-readable item/storefront labels.
 */
async function getRecentScanActivity(businessId: string): Promise<RecentScanEvent[]> {
  const supabase = await createClient()

  const { data: events, error } = await supabase
    .from('scan_events')
    .select('id, scanned_at, qr_codes(target_type, target_id)')
    .eq('business_id', businessId)
    .order('scanned_at', { ascending: false })
    .limit(15)

  if (error || !events) return []

  const results: RecentScanEvent[] = []

  for (const event of events) {
    const qrCode = event.qr_codes as unknown as { target_type: string; target_id: string } | null
    if (!qrCode) continue

    let label = 'Storefront'

    if (qrCode.target_type === 'catalog_item') {
      const { data } = await supabase
        .from('catalog_items')
        .select('name')
        .eq('id', qrCode.target_id)
        .maybeSingle()
      label = data?.name ?? 'Catalog Item'
    } else if (qrCode.target_type === 'collection') {
      const { data } = await supabase
        .from('collections')
        .select('name')
        .eq('id', qrCode.target_id)
        .maybeSingle()
      label = data?.name ?? 'Collection'
    }

    results.push({
      id: event.id,
      scannedAt: event.scanned_at,
      targetType: qrCode.target_type,
      label,
    })
  }

  return results
}

/**
 * Aggregates organization-level metrics for the merchant dashboard across all businesses.
 */
export async function getOrgDashboardMetrics(businessIds: string[]): Promise<OrgDashboardMetrics> {
  if (!businessIds || businessIds.length === 0) {
    return {
      totalOrgScans: 0,
      scansToday: 0,
      totalLocations: 0,
      totalItems: 0,
      last7DaysTrend: generateEmpty7DaysTrend(),
      businessStatsMap: {},
    }
  }

  const supabase = await createClient()

  // 1. Total Lifetime Scans
  const { count: totalOrgScans } = await supabase
    .from('scan_events')
    .select('*', { count: 'exact', head: true })
    .in('business_id', businessIds)

  // 2. Scans Today
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)
  const { count: scansToday } = await supabase
    .from('scan_events')
    .select('*', { count: 'exact', head: true })
    .in('business_id', businessIds)
    .gte('scanned_at', startOfToday.toISOString())

  // 3. Last 7 Days Scans
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
  sevenDaysAgo.setHours(0, 0, 0, 0)

  const { data: recentScanRows } = await supabase
    .from('scan_events')
    .select('scanned_at')
    .in('business_id', businessIds)
    .gte('scanned_at', sevenDaysAgo.toISOString())

  const last7DaysTrend = processLast7DaysTrend(recentScanRows ?? [])

  // 4. Per-Business Statistics (Locations, Catalog Items, Scan Counts)
  const [{ data: locations }, { data: items }, { data: qrs }] = await Promise.all([
    supabase.from('locations').select('id, business_id').in('business_id', businessIds),
    supabase.from('catalog_items').select('id, business_id').in('business_id', businessIds),
    supabase.from('qr_codes').select('business_id, scan_count').in('business_id', businessIds),
  ])

  const totalLocations = locations?.length ?? 0
  const totalItems = items?.length ?? 0

  const businessStatsMap: Record<string, BusinessOverviewStats> = {}

  for (const bId of businessIds) {
    const locCount = (locations ?? []).filter((l) => l.business_id === bId).length
    const itemCount = (items ?? []).filter((i) => i.business_id === bId).length
    const bScans = (qrs ?? [])
      .filter((q) => q.business_id === bId)
      .reduce((acc, q) => acc + (q.scan_count ?? 0), 0)

    businessStatsMap[bId] = {
      businessId: bId,
      locationCount: locCount,
      itemCount: itemCount,
      scanCount: bScans,
    }
  }

  return {
    totalOrgScans: totalOrgScans ?? 0,
    scansToday: scansToday ?? 0,
    totalLocations,
    totalItems,
    last7DaysTrend,
    businessStatsMap,
  }
}

function processLast7DaysTrend(rows: Array<{ scanned_at: string }>): DailyScanTrendPoint[] {
  const days: DailyScanTrendPoint[] = []
  const today = new Date()

  // Generate 7 days ending today
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const dayLabel = i === 0 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' })

    days.push({
      date: dateStr,
      dayLabel,
      scanCount: 0,
    })
  }

  // Aggregate counts
  for (const row of rows) {
    const rowDate = row.scanned_at.split('T')[0]
    const match = days.find((day) => day.date === rowDate)
    if (match) {
      match.scanCount++
    }
  }

  return days
}

function generateEmpty7DaysTrend(): DailyScanTrendPoint[] {
  const days: DailyScanTrendPoint[] = []
  const today = new Date()
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const dayLabel = i === 0 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' })
    days.push({ date: dateStr, dayLabel, scanCount: 0 })
  }
  return days
}
