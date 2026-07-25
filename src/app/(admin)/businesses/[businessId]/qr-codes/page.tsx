import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ScanLine } from 'lucide-react'
import { requireBusinessManage } from '@/lib/auth/require-access'
import { getQrCodesForBusiness } from '@/features/qr-codes/queries'
import { QrCodeList } from '@/features/qr-codes/components/qr-code-list'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'QR Codes Management — SurePrice Admin',
  description: 'Manage, regenerate, and revoke QR codes for your physical business.',
}

export default async function QrCodesPage({
  params,
}: {
  params: Promise<{ businessId: string }>
}) {
  const { businessId } = await params
  await requireBusinessManage(businessId)

  // Fetch all codes including archived (shown greyed out)
  const codes = await getQrCodesForBusiness(businessId, true)

  return (
    <div className="mx-auto max-w-3xl p-6 space-y-6">
      <div>
        <Link
          href={`/businesses/${businessId}`}
          className="mb-2 inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-zinc-400"
        >
          <ArrowLeft size={14} />
          <span>Back to Business Overview</span>
        </Link>

        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--lime-base)] text-black">
            <ScanLine size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-zinc-100">
              QR Code Directory
            </h1>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Active and archived QR codes generated for shelf tags, locations, and catalog items.
            </p>
          </div>
        </div>
      </div>

      <QrCodeList codes={codes} businessId={businessId} />
    </div>
  )
}
