'use client'

import React from 'react'
import { IllustrationWrapper, type IllustrationWrapperProps } from './illustration-wrapper'

type CommonProps = Omit<IllustrationWrapperProps, 'src' | 'alt'> & {
  alt?: string
}

// ─── TIER 1 — Public & Scan Flow ──────────────────────────────────────────────

/** Tier 1 #1: Scan Step (Hand holding phone over QR tag) */
export function ScanStepIllustration(props: CommonProps) {
  return (
    <IllustrationWrapper
      src="/images/Illustrations/Hand_scanning_QR_price_tag_202608090211.jpeg"
      alt={props.alt ?? 'Hand holding phone over a shelf QR tag'}
      {...props}
    />
  )
}

/** Tier 1 #2: See Step / First Scan */
export function SeeStepIllustration(props: CommonProps) {
  return (
    <IllustrationWrapper
      src="/images/Illustrations/First Scan.jpeg"
      alt={props.alt ?? 'Instant price reveal on phone screen'}
      {...props}
    />
  )
}

/** Tier 1 #3: Shop Confidently Step */
export function ShopConfidentlyIllustration(props: CommonProps) {
  return (
    <IllustrationWrapper
      src="/images/Illustrations/Shopper_walking_with_price_tag_202608090218.jpeg"
      alt={props.alt ?? 'Shopper walking away satisfied with item'}
      {...props}
    />
  )
}

/** Tier 1 #4: Invalid or Expired QR Code */
export function InvalidQRIllustration(props: CommonProps) {
  return (
    <IllustrationWrapper
      src="/images/Illustrations/Invalid QR Code.jpeg"
      alt={props.alt ?? 'Invalid or expired QR code'}
      animateFloat={false}
      {...props}
    />
  )
}

/** Tier 1 #5: Item Currently Unavailable */
export function ItemUnavailableIllustration(props: CommonProps) {
  return (
    <IllustrationWrapper
      src="/images/Illustrations/Item Currently Unavailable.jpeg"
      alt={props.alt ?? 'Item is currently unavailable or out of stock'}
      animateFloat={false}
      {...props}
    />
  )
}

/** Tier 1 #6: Business Closed / Inactive */
export function BusinessClosedIllustration(props: CommonProps) {
  return (
    <IllustrationWrapper
      src="/images/Illustrations/Business Closed.jpeg"
      alt={props.alt ?? 'Store location is currently closed'}
      animateFloat={false}
      {...props}
    />
  )
}

/** Tier 1 #7: Merchant CTA (Shelf tag setup) */
export function MerchantCTAIllustration(props: CommonProps) {
  return (
    <IllustrationWrapper
      src="/images/Illustrations/Merchant CTA.jpeg"
      alt={props.alt ?? 'Merchant attaching QR price tag to shelf'}
      {...props}
    />
  )
}

// ─── TIER 2 — Merchant Admin Empty States ────────────────────────────────────

/** Tier 2 #8: First Location Empty State */
export function FirstLocationIllustration(props: CommonProps) {
  return (
    <IllustrationWrapper
      src="/images/Illustrations/First Location.jpeg"
      alt={props.alt ?? 'Add your first store location'}
      animateFloat={false}
      {...props}
    />
  )
}

/** Tier 2 #9: First Catalog Item Empty State */
export function FirstCatalogItemIllustration(props: CommonProps) {
  return (
    <IllustrationWrapper
      src="/images/Illustrations/First Catalog Item.jpeg"
      alt={props.alt ?? 'Add items to your catalog'}
      animateFloat={false}
      {...props}
    />
  )
}

/** Tier 2 #10: First QR Batch / Print Studio */
export function FirstQRBatchIllustration(props: CommonProps) {
  return (
    <IllustrationWrapper
      src="/images/Illustrations/First Scan.jpeg"
      alt={props.alt ?? 'Batch generate and print physical QR tags'}
      animateFloat={false}
      {...props}
    />
  )
}

/** Tier 2 #11: Invite a Teammate */
export function InviteTeammateIllustration(props: CommonProps) {
  return (
    <IllustrationWrapper
      src="/images/Illustrations/Invite a teammate.jpeg"
      alt={props.alt ?? 'Invite staff to manage store'}
      animateFloat={false}
      {...props}
    />
  )
}

/** Tier 2 #12: Invite Pending */
export function InvitePendingIllustration(props: CommonProps) {
  return (
    <IllustrationWrapper
      src="/images/Illustrations/Inviyte Pending.jpeg"
      alt={props.alt ?? 'Staff invite pending acceptance'}
      animateFloat={false}
      {...props}
    />
  )
}

/** Tier 2 #13: Analytics Zero State */
export function AnalyticsZeroIllustration(props: CommonProps) {
  return (
    <IllustrationWrapper
      src="/images/Illustrations/Analytics.jpeg"
      alt={props.alt ?? 'Scan analytics warming up'}
      animateFloat={false}
      {...props}
    />
  )
}

/** Tier 2 #14: Media Upload Empty State */
export function MediaUploadEmptyIllustration(props: CommonProps) {
  return (
    <IllustrationWrapper
      src="/images/Illustrations/Media Upload.jpeg"
      alt={props.alt ?? 'Upload photo for catalog item'}
      animateFloat={false}
      {...props}
    />
  )
}

/** Tier 2 #15: Subscription Inactive */
export function SubscriptionInactiveIllustration(props: CommonProps) {
  return (
    <IllustrationWrapper
      src="/images/Illustrations/Subscription Inactive.jpeg"
      alt={props.alt ?? 'Subscription inactive or on hold'}
      animateFloat={false}
      {...props}
    />
  )
}

/** Tier 2 #16: Owner Welcome / Shop Setup */
export function OwnerWelcomeIllustration(props: CommonProps) {
  return (
    <IllustrationWrapper
      src="/images/Illustrations/Shop Set up.jpeg"
      alt={props.alt ?? 'Setting up your business'}
      animateFloat={false}
      {...props}
    />
  )
}

// ─── TIER 3 — System & Error States ───────────────────────────────────────────

/** Tier 3 #17: 404 Page */
export function NotFoundIllustration(props: CommonProps) {
  return (
    <IllustrationWrapper
      src="/images/Illustrations/404 Page.jpeg"
      alt={props.alt ?? 'Page not found'}
      animateFloat={false}
      {...props}
    />
  )
}

/** Tier 3 #18: General Error */
export function GeneralErrorIllustration(props: CommonProps) {
  return (
    <IllustrationWrapper
      src="/images/Illustrations/General Error.jpeg"
      alt={props.alt ?? 'Unexpected error occurred'}
      animateFloat={false}
      {...props}
    />
  )
}

/** Tier 3 #19: Offline / Connection Lost */
export function OfflineIllustration(props: CommonProps) {
  return (
    <IllustrationWrapper
      src="/images/Illustrations/Offline.jpeg"
      alt={props.alt ?? 'Offline or connection lost'}
      animateFloat={false}
      {...props}
    />
  )
}

/** Tier 3 #20: Pop-up / Day Pass Setup */
export function PopUpDayPassIllustration(props: CommonProps) {
  return (
    <IllustrationWrapper
      src="/images/Illustrations/Pop up Day pass.jpeg"
      alt={props.alt ?? 'Pop-up stall & day pass setup'}
      animateFloat={false}
      {...props}
    />
  )
}

export { IllustrationWrapper }
