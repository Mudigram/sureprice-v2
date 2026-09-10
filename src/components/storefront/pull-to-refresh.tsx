'use client'

import { useState, useRef, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { RefreshCcw, CheckCircle2 } from 'lucide-react'

interface PullToRefreshProps {
  children: ReactNode
}

const PULL_THRESHOLD = 70

export function PullToRefresh({ children }: PullToRefreshProps) {
  const router = useRouter()
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showSuccessToast, setShowSuccessToast] = useState(false)

  const touchStartY = useRef(0)
  const isPulling = useRef(false)

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      // Only pull if user is at the top of page
      if (window.scrollY <= 2) {
        touchStartY.current = e.touches[0].clientY
        isPulling.current = true
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling.current || isRefreshing) return

      const currentY = e.touches[0].clientY
      const dy = currentY - touchStartY.current

      if (dy > 0 && window.scrollY <= 2) {
        // Apply resistance dampening factor
        const distance = Math.min(dy * 0.45, 110)
        setPullDistance(distance)
      } else {
        setPullDistance(0)
      }
    }

    const handleTouchEnd = () => {
      if (!isPulling.current) return
      isPulling.current = false

      if (pullDistance >= PULL_THRESHOLD && !isRefreshing) {
        triggerRefresh()
      } else {
        setPullDistance(0)
      }
    }

    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchend', handleTouchEnd)

    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [pullDistance, isRefreshing])

  const triggerRefresh = () => {
    setIsRefreshing(true)
    setPullDistance(PULL_THRESHOLD)

    // Trigger router revalidation
    router.refresh()

    // Smoothly finish refresh animation after 800ms
    setTimeout(() => {
      setIsRefreshing(false)
      setPullDistance(0)
      setShowSuccessToast(true)

      setTimeout(() => {
        setShowSuccessToast(false)
      }, 2500)
    }, 850)
  }

  const progress = Math.min(pullDistance / PULL_THRESHOLD, 1)

  return (
    <div className="relative min-h-[100dvh]">
      {/* Pull Indicator Visual Dropdown */}
      <div
        className="pointer-events-none fixed top-14 inset-x-0 z-40 flex items-center justify-center transition-transform duration-200"
        style={{
          transform: `translateY(${isRefreshing ? 16 : pullDistance > 0 ? pullDistance * 0.4 : -40}px)`,
          opacity: pullDistance > 10 || isRefreshing ? 1 : 0,
        }}
      >
        <div className="flex items-center gap-2 rounded-full border border-slate-200/90 bg-white/95 px-4 py-2 text-xs font-black text-slate-800 shadow-xl backdrop-blur-md">
          <RefreshCcw
            size={15}
            className={`text-emerald-600 transition-transform ${
              isRefreshing ? 'animate-spin' : ''
            }`}
            style={{
              transform: isRefreshing ? undefined : `rotate(${progress * 360}deg)`,
            }}
          />
          <span>
            {isRefreshing
              ? 'Updating live prices…'
              : progress >= 1
              ? 'Release to refresh'
              : 'Pull to refresh'}
          </span>
        </div>
      </div>

      {/* Instant Success Toast notification */}
      {showSuccessToast && (
        <div className="fixed top-16 inset-x-0 z-50 flex justify-center px-4 animate-in fade-in slide-in-from-top duration-300 pointer-events-none">
          <div className="flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-xs font-black text-white shadow-xl">
            <CheckCircle2 size={16} />
            <span>Prices updated in real-time</span>
          </div>
        </div>
      )}

      {/* Main Page Body Container */}
      <div
        className="transition-transform duration-200 ease-out"
        style={{
          transform: pullDistance > 0 && !isRefreshing ? `translateY(${pullDistance * 0.3}px)` : 'none',
        }}
      >
        {children}
      </div>
    </div>
  )
}
