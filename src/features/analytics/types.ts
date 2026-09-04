export interface ScanAnalyticsSummary {
  totalScans: number
  todayScans: number
  topItems: TopScannedItem[]
  recentActivity: RecentScanEvent[]
  hourlyScanDistribution: HourlyScanPoint[]
  whatsappEstimate: WhatsAppConversionEstimate
}

export interface HourlyScanPoint {
  hour: number          // 0-23
  scanCount: number
}

export interface WhatsAppConversionEstimate {
  estimatedInquiries: number   // totalScans * assumed inquiry rate
  estimatedPriceNotes: number  // totalScans * assumed price-noted rate
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
