'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

export interface IllustrationWrapperProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  /** Enable gentle floating idle animation */
  animateFloat?: boolean
  /** Aspect ratio width / height multiplier (default: aspect-[4/3]) */
  aspectRatio?: string
}

export function IllustrationWrapper({
  src,
  alt,
  width = 400,
  height = 300,
  className = '',
  priority = false,
  animateFloat = true,
  aspectRatio = 'aspect-[4/3]',
}: IllustrationWrapperProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`relative overflow-hidden rounded-2xl ${aspectRatio} ${className}`}
    >
      {/* Floating animation wrapper */}
      <motion.div
        animate={
          animateFloat
            ? {
                y: [0, -6, 0],
              }
            : undefined
        }
        transition={
          animateFloat
            ? {
                duration: 4,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: 'easeInOut',
              }
            : undefined
        }
        className="relative w-full h-full"
      >
        {/* SVG Shimmer Skeleton Loading State */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-emerald-500/15 to-emerald-500/5 animate-pulse flex items-center justify-center rounded-2xl border border-emerald-500/10">
            <svg
              className="w-10 h-10 text-emerald-500/30 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
        )}

        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </motion.div>
    </motion.div>
  )
}
