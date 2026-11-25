import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { requireBusinessManage } from '@/lib/auth/require-access'
import { getBusinessByIdForAdmin } from '@/features/businesses/queries'
import { getAppointments } from '@/features/bookings/queries'
import { AppointmentCalendar } from '@/features/bookings/components/appointment-calendar'
import { BusinessAdminNav } from '@/components/admin/business-admin-nav'

export const metadata: Metadata = {
  title: 'Bookings & Appointments | Qarty Admin',
  description: 'Manage incoming client bookings, deposits, and appointments schedule.',
}

export default async function BookingsPage({
  params,
}: {
  params: Promise<{ businessId: string }>
}) {
  const { businessId } = await params
  await requireBusinessManage(businessId)

  const business = await getBusinessByIdForAdmin(businessId)
  if (!business) notFound()

  const appointments = await getAppointments(businessId)

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-8 space-y-6 text-slate-900 dark:text-white">
      {/* Unified Business Admin Navigation Bar */}
      <BusinessAdminNav business={business} currentSection="bookings" />

      {/* Main Container */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-6">
        <div className="border-b border-slate-100 pb-4 dark:border-slate-800">
          <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
            Appointment Bookings ({appointments.length})
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            View upcoming client sessions, verify bank transfer deposits, and send WhatsApp confirmations for {business.name}.
          </p>
        </div>

        <AppointmentCalendar
          businessId={businessId}
          businessName={business.name}
          appointments={appointments}
        />
      </div>
    </div>
  )
}
