import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Merchant Access & Onboarding — Qarty',
  description:
    'Merchant login and field self-onboarding portal for physical stores, dining venues, and pop-up vendors in Ibadan, Nigeria.',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
