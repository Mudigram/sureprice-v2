'use client'

import React from 'react'

export interface BrandFallbackProps extends React.SVGProps<SVGSVGElement> {
  size?: number
  className?: string
}

/** 🍽️ Restaurant & Dining Brand Fallback Vector Logo */
export function RestaurantBrandFallbackSvg({ size = 40, className = '', ...props }: BrandFallbackProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <defs>
        <linearGradient id="restGlow" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--lime-base, #c026d3)" stopOpacity="0.3" />
          <stop offset="1" stopColor="#10b981" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      {/* Background Rounded Shield */}
      <rect width="48" height="48" rx="14" fill="url(#restGlow)" stroke="var(--lime-base, #84cc16)" strokeOpacity="0.3" strokeWidth="1.5" />
      
      {/* Gourmet Cloche / Cover */}
      <path d="M12 28C12 21.3726 17.3726 16 24 16C30.6274 16 36 21.3726 36 28H12Z" fill="var(--lime-base, #84cc16)" fillOpacity="0.25" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="24" cy="14" r="2.5" fill="currentColor" />
      {/* Platter Base */}
      <rect x="10" y="30" width="28" height="3" rx="1.5" fill="currentColor" />
      {/* Steam lines */}
      <path d="M18 11C18 9.5 19 9 19 8" stroke="var(--lime-base, #84cc16)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M29 11C29 9.5 30 9 30 8" stroke="var(--lime-base, #84cc16)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

/** ☕ Café & Bakery Brand Fallback Vector Logo */
export function CafeBrandFallbackSvg({ size = 40, className = '', ...props }: BrandFallbackProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <defs>
        <linearGradient id="cafeGlow" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f59e0b" stopOpacity="0.3" />
          <stop offset="1" stopColor="#d97706" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="14" fill="url(#cafeGlow)" stroke="#f59e0b" strokeOpacity="0.3" strokeWidth="1.5" />
      
      {/* Artisanal Coffee Cup */}
      <path d="M12 18H31V28C31 31.866 27.866 35 24 35H19C15.134 35 12 31.866 12 28V18Z" fill="#f59e0b" fillOpacity="0.25" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M31 20H33.5C35.433 20 37 21.567 37 23.5V24.5C37 26.433 35.433 28 33.5 28H31" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="10" y1="38" x2="33" y2="38" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {/* Steam */}
      <path d="M18 14C18 12.5 19 12 19 10.5" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M25 14C25 12.5 26 12 26 10.5" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

/** 🛍️ Retail & Store Brand Fallback Vector Logo */
export function RetailBrandFallbackSvg({ size = 40, className = '', ...props }: BrandFallbackProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <defs>
        <linearGradient id="retailGlow" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3b82f6" stopOpacity="0.3" />
          <stop offset="1" stopColor="var(--lime-base, #84cc16)" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="14" fill="url(#retailGlow)" stroke="#3b82f6" strokeOpacity="0.3" strokeWidth="1.5" />
      
      {/* Shopping Tote Bag */}
      <path d="M12 16H36L34 36H14L12 16Z" fill="#3b82f6" fillOpacity="0.2" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M18 16V13C18 10.2386 20.2386 8 23 8H25C27.7614 8 30 10.2386 30 13V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {/* Price tag emblem on bag */}
      <circle cx="24" cy="26" r="4" fill="var(--lime-base, #84cc16)" />
      <path d="M24 24V28M22.5 26H25.5" stroke="#000" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

/** 🎪 Pop-Up & Event Stall Brand Fallback Vector Logo */
export function EventBrandFallbackSvg({ size = 40, className = '', ...props }: BrandFallbackProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <defs>
        <linearGradient id="eventGlow" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a855f7" stopOpacity="0.3" />
          <stop offset="1" stopColor="#ec4899" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="14" fill="url(#eventGlow)" stroke="#a855f7" strokeOpacity="0.3" strokeWidth="1.5" />
      
      {/* Event Canopy / Stall Roof */}
      <path d="M10 20L24 10L38 20V23H10V20Z" fill="#a855f7" fillOpacity="0.3" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M14 23V36H34V23" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      {/* Flag */}
      <path d="M24 10V6L29 8L24 10Z" fill="#ec4899" />
      <line x1="10" y1="28" x2="38" y2="28" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="2 2" />
    </svg>
  )
}

/**
 * Returns the matching brand fallback vector logo based on business type.
 */
export function getBrandFallbackSvgIcon(
  businessType?: string,
  props: BrandFallbackProps = {}
): React.ReactElement {
  if (businessType === 'restaurant') {
    return <RestaurantBrandFallbackSvg {...props} />
  }
  if (businessType === 'cafe') {
    return <CafeBrandFallbackSvg {...props} />
  }
  if (businessType === 'popup_vendor' || businessType === 'event_vendor') {
    return <EventBrandFallbackSvg {...props} />
  }
  return <RetailBrandFallbackSvg {...props} />
}
