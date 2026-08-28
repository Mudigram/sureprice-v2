'use client'

import { useState, useEffect } from 'react'

export function useScrollDirection() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    let lastScrollY = window.scrollY

    const updateScrollDirection = () => {
      const currentScrollY = window.scrollY
      const diff = currentScrollY - lastScrollY

      // Always show bars near top of page
      if (currentScrollY < 40) {
        setIsVisible(true)
        lastScrollY = currentScrollY
        return
      }

      // Scrolling DOWN past threshold -> Hide bars
      if (diff > 8) {
        setIsVisible(false)
      }
      // Scrolling UP past threshold -> Show bars
      else if (diff < -8) {
        setIsVisible(true)
      }

      lastScrollY = currentScrollY
    }

    window.addEventListener('scroll', updateScrollDirection, { passive: true })

    return () => {
      window.removeEventListener('scroll', updateScrollDirection)
    }
  }, [])

  return isVisible
}
