export interface ScanAnalyticsSummary {
  totalScans: number
  todayScans: number
  topItems: TopScannedItem[]
  recentActivity: RecentScanEvent[]
}

export interface TopScannedItem {
  catalogItemId: string
  name: string
  imageUrl: string | null
  scanCount: number
}

export interface RecentScanEvent {
  id: string
  scannedAt: string
  targetType: string
  label: string
}

export interface DailyScanTrendPoint {
  date: string
  dayLabel: string
  scanCount: number
}

export interface BusinessOverviewStats {
  businessId: string
  locationCount: number
  itemCount: number
  scanCount: number
}

export interface OrgDashboardMetrics {
  totalOrgScans: number
  scansToday: number
  totalLocations: number
  totalItems: number
  last7DaysTrend: DailyScanTrendPoint[]
  businessStatsMap: Record<string, BusinessOverviewStats>
}
