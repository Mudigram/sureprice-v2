import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | SurePrice',
    default: 'SurePrice',
  },
  description: 'Scan to see prices and product details — no app required.',
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
