import { BottomNav } from '@/components/storefront/bottom-nav'

export default function AppShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-background">
      <div className="mx-auto max-w-md pb-28">
        {children}
      </div>
      <BottomNav />
    </div>
  )
}
