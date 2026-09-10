'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface LiveSyncContextType {
  isRefreshing: boolean
  lastSyncedAt: Date | null
  triggerManualRefresh: () => void
}

const LiveSyncContext = createContext<LiveSyncContextType>({
  isRefreshing: false,
  lastSyncedAt: null,
  triggerManualRefresh: () => {},
})

const AUTO_SYNC_INTERVAL_MS = 30000 // 30 seconds background sync

export function LivePriceSyncProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(new Date())

  // Trigger page revalidation and update sync timestamp
  const performSync = () => {
    setIsRefreshing(true)
    router.refresh()

    setTimeout(() => {
      setIsRefreshing(false)
      setLastSyncedAt(new Date())
    }, 600)
  }

  const triggerManualRefresh = () => {
    performSync()
  }

  // 1. Timely Background Polling (30s interval for essential price freshness)
  useEffect(() => {
    // Only auto-poll on public customer routes (storefronts, scan resolution, stores directory, cart)
    const isPublicCustomerRoute =
      pathname.startsWith('/s/') ||
      pathname.startsWith('/scan') ||
      pathname.startsWith('/stores') ||
      pathname === '/cart' ||
      pathname === '/home' ||
      pathname === '/'

    if (!isPublicCustomerRoute) return

    const interval = setInterval(() => {
      performSync()
    }, AUTO_SYNC_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [pathname])

  // 2. Revalidate on Tab Focus / Screen Unlock (visibilitychange)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        performSync()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleVisibilityChange)
    }
  }, [])

  return (
    <LiveSyncContext.Provider
      value={{
        isRefreshing,
        lastSyncedAt,
        triggerManualRefresh,
      }}
    >
      {children}
    </LiveSyncContext.Provider>
  )
}

export function useLivePriceSync() {
  return useContext(LiveSyncContext)
}
