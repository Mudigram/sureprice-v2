'use client'

import React from 'react'

export interface AmenityIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number
  className?: string
}

/** 🌿 Halal Certified SVG Icon */
export function HalalSvgIcon({ size = 14, className = '', ...props }: AmenityIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" className="fill-emerald-500/20" stroke="#10b981" />
      <path d="M7 13c3 0 5-2 5-5m0 5c0 3 2 5 5 5" stroke="#10b981" strokeWidth="1.75" />
    </svg>
  )
}

/** 🍹 Cocktail Bar SVG Icon */
export function CocktailSvgIcon({ size = 14, className = '', ...props }: AmenityIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M6 3h12l-6 7-6-7z" className="fill-amber-500/20" stroke="#f59e0b" />
      <line x1="12" y1="10" x2="12" y2="19" stroke="#f59e0b" />
      <line x1="8" y1="19" x2="16" y2="19" stroke="#f59e0b" />
    </svg>
  )
}

/** 📶 Free Wi-Fi SVG Icon */
export function WifiSvgIcon({ size = 14, className = '', ...props }: AmenityIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M5 12.55a11 11 0 0 1 14 0" stroke="#3b82f6" />
      <path d="M8.5 16.05a7 7 0 0 1 7 0" stroke="#3b82f6" />
      <circle cx="12" cy="19" r="1" fill="#3b82f6" stroke="#3b82f6" />
    </svg>
  )
}

/** ❄️ Air Conditioned SVG Icon */
export function AirConSvgIcon({ size = 14, className = '', ...props }: AmenityIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <line x1="12" y1="2" x2="12" y2="22" stroke="#06b6d4" />
      <line x1="2" y1="12" x2="22" y2="12" stroke="#06b6d4" />
      <path d="M20 16l-4-4 4-4" stroke="#06b6d4" />
      <path d="M4 8l4 4-4 4" stroke="#06b6d4" />
    </svg>
  )
}

/** 🌳 Outdoor Seating SVG Icon */
export function OutdoorSvgIcon({ size = 14, className = '', ...props }: AmenityIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M12 19V5" stroke="#22c55e" />
      <path d="M12 5L7 10h10L12 5z" className="fill-emerald-500/20" stroke="#22c55e" />
      <path d="M12 11L5 17h14L12 11z" className="fill-emerald-500/30" stroke="#22c55e" />
    </svg>
  )
}

/** 🚗 Takeout & Delivery SVG Icon */
export function TakeoutSvgIcon({ size = 14, className = '', ...props }: AmenityIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" stroke="var(--lime-base, #84cc16)" />
      <path d="M15 18H9" stroke="var(--lime-base, #84cc16)" />
      <circle cx="7" cy="18" r="2" stroke="var(--lime-base, #84cc16)" />
      <path d="M14 8h5.5a1.5 1.5 0 0 1 1.2.6l2.3 3.4a1.5 1.5 0 0 1 .3.9V18h-2" stroke="var(--lime-base, #84cc16)" />
      <circle cx="18" cy="18" r="2" stroke="var(--lime-base, #84cc16)" />
    </svg>
  )
}

/** 🅿️ On-Site Parking SVG Icon */
export function ParkingSvgIcon({ size = 14, className = '', ...props }: AmenityIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <rect x="4" y="4" width="16" height="16" rx="4" className="fill-blue-500/20" stroke="#3b82f6" />
      <path d="M9 16V8h4a3 3 0 0 1 0 6H9" stroke="#3b82f6" strokeWidth="2.2" />
    </svg>
  )
}

/**
 * Helper to get the amenity icon component based on string key.
 */
export function getAmenitySvgIcon(key: string, props: AmenityIconProps = {}): React.ReactElement | null {
  switch (key.toLowerCase()) {
    case 'halal':
      return <HalalSvgIcon {...props} />
    case 'cocktails':
      return <CocktailSvgIcon {...props} />
    case 'wifi':
      return <WifiSvgIcon {...props} />
    case 'ac':
      return <AirConSvgIcon {...props} />
    case 'outdoor':
      return <OutdoorSvgIcon {...props} />
    case 'takeout':
      return <TakeoutSvgIcon {...props} />
    case 'parking':
      return <ParkingSvgIcon {...props} />
    default:
      return null
  }
}
