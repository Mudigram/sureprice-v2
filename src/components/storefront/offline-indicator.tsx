'use client'

import { useState, useEffect } from 'react'
import { WifiOff, Wifi } from 'lucide-react'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'

export function OfflineIndicator() {
  const isOnline = useOnlineStatus()
  const [showBackOnline, setShowBackOnline] = useState(false)
  // Track whether we've ever gone offline so we don't flash "Back online" on first mount
  const [wasOffline, setWasOffline] = useState(false)

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true)
      setShowBackOnline(false)
    } else if (wasOffline) {
      // Only show "Back online" if we were previously offline
      setShowBackOnline(true)
      const timer = setTimeout(() => setShowBackOnline(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [isOnline, wasOffline])

  if (!isOnline) {
    return (
      <div className="fixed left-1/2 top-4 z-[70] -translate-x-1/2 animate-in slide-in-from-top-4 duration-300">
        <div className="flex items-center gap-2.5 rounded-full border border-red-400 bg-red-500 px-5 py-2 shadow-2xl">
          <WifiOff size={15} className="animate-pulse text-white" />
          <span className="text-xs font-black uppercase tracking-widest text-white">
            You are offline
          </span>
        </div>
      </div>
    )
  }

  if (showBackOnline) {
    return (
      <div className="fixed left-1/2 top-4 z-[70] -translate-x-1/2 animate-in slide-in-from-top-4 duration-300">
        <div className="flex items-center gap-2.5 rounded-full border border-green-400 bg-[var(--lime-base)] px-5 py-2 shadow-2xl">
          <Wifi size={15} className="text-black" />
          <span className="text-xs font-black uppercase tracking-widest text-black">
            Back online
          </span>
        </div>
      </div>
    )
  }

  return null
}
