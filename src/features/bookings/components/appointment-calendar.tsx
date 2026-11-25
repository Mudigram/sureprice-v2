'use client'

import { useState, useTransition } from 'react'
import {
  Calendar,
  Clock,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Filter,
  User,
  Sparkles,
} from 'lucide-react'
import type { Appointment, AppointmentStatus } from '../types'
import { updateAppointmentStatus } from '../actions'

interface AppointmentCalendarProps {
  businessId: string
  businessName: string
  appointments: Appointment[]
}

export function AppointmentCalendar({
  businessId,
  businessName,
  appointments,
}: AppointmentCalendarProps) {
  const [statusFilter, setStatusFilter] = useState<'all' | AppointmentStatus>('all')
  const [dateFilter, setDateFilter] = useState<'today' | 'tomorrow' | 'upcoming' | 'all'>('all')
  const [isPending, startTransition] = useTransition()
  const [actionError, setActionError] = useState<string | null>(null)
  const [cancellingId, setCancellingId] = useState<string | null>(null)
  const [cancelReason, setCancelReason] = useState('')

  // Date filtering logic
  const now = new Date()
  const todayStr = now.toISOString().split('T')[0]
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toISOString().split('T')[0]

  const filteredAppointments = appointments.filter((app) => {
    // Status filter
    if (statusFilter !== 'all' && app.status !== statusFilter) {
      return false
    }

    const appDateStr = app.start_time.split('T')[0]

    // Date filter
    if (dateFilter === 'today') {
      return appDateStr === todayStr
    }
    if (dateFilter === 'tomorrow') {
      return appDateStr === tomorrowStr
    }
    if (dateFilter === 'upcoming') {
      return new Date(app.start_time) >= now
    }
    return true
  })

  // Format currency
  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Format date & time
  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString)
    return {
      date: date.toLocaleDateString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }),
    }
  }

  // Status handler
  const handleStatusChange = (
    appointmentId: string,
    newStatus: AppointmentStatus,
    depositPaid?: boolean,
    reason?: string
  ) => {
    setActionError(null)
    startTransition(async () => {
      try {
        await updateAppointmentStatus(businessId, {
          appointment_id: appointmentId,
          status: newStatus,
          deposit_paid: depositPaid,
          cancellation_reason: reason,
        })
        if (cancellingId === appointmentId) {
          setCancellingId(null)
          setCancelReason('')
        }
      } catch (err: unknown) {
        const error = err as Error
        setActionError(error.message || 'Failed to update appointment.')
      }
    })
  }

  // Generate WhatsApp message link for Nigerian clients
  const getWhatsAppLink = (app: Appointment, type: 'confirm' | 'deposit' | 'reminder') => {
    // Sanitize phone number to international format (234...)
    let phone = app.client_phone.replace(/\D/g, '')
    if (phone.startsWith('0')) {
      phone = '234' + phone.slice(1)
    } else if (!phone.startsWith('234')) {
      phone = '234' + phone
    }

    const startTimeFormatted = formatDateTime(app.start_time)
    let message = ''

    if (type === 'deposit') {
      message = `Hello ${app.client_name}! Thank you for booking ${app.service?.name || 'a session'} at ${businessName}.\n\nTo lock in your appointment on *${startTimeFormatted.date} at ${startTimeFormatted.time}*, a deposit of *${formatNaira(app.deposit_amount)}* is required.\n\nPlease reply with your payment confirmation screenshot. Thank you!`
    } else if (type === 'confirm') {
      message = `Hello ${app.client_name}! ✨ Your booking for *${app.service?.name || 'your session'}* at ${businessName} on *${startTimeFormatted.date} at ${startTimeFormatted.time}* is CONFIRMED!\n\nWe look forward to seeing you. Let us know if you need any directions or adjustments.`
    } else {
      message = `Hi ${app.client_name}! 👋 Friendly reminder about your appointment for *${app.service?.name || 'your session'}* with ${businessName} scheduled for *${startTimeFormatted.date} at ${startTimeFormatted.time}*. See you soon!`
    }

    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
  }

  // Quick stats
  const pendingCount = appointments.filter((a) => a.status === 'pending').length
  const confirmedCount = appointments.filter((a) => a.status === 'confirmed').length
  const todayCount = appointments.filter((a) => a.start_time.split('T')[0] === todayStr).length

  return (
    <div className="space-y-6">
      {/* Top Stats Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Bookings</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{appointments.length}</p>
        </div>
        <div className="bg-amber-50 rounded-2xl border border-amber-200/80 p-4 shadow-sm">
          <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Pending Action</p>
          <p className="text-2xl font-black text-amber-900 mt-1">{pendingCount}</p>
        </div>
        <div className="bg-emerald-50 rounded-2xl border border-emerald-200/80 p-4 shadow-sm">
          <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Confirmed</p>
          <p className="text-2xl font-black text-emerald-900 mt-1">{confirmedCount}</p>
        </div>
        <div className="bg-indigo-50 rounded-2xl border border-indigo-200/80 p-4 shadow-sm">
          <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">Today&apos;s Clients</p>
          <p className="text-2xl font-black text-indigo-900 mt-1">{todayCount}</p>
        </div>
      </div>

      {actionError && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-3.5 text-xs font-medium text-red-700 flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm space-y-3">
        {/* Date Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
            <Calendar size={13} /> Date:
          </span>
          {(['all', 'today', 'tomorrow', 'upcoming'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setDateFilter(filter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all capitalize shrink-0 ${
                dateFilter === filter
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
            <Filter size={13} /> Status:
          </span>
          {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all capitalize shrink-0 ${
                statusFilter === status
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-3">
            <Calendar size={28} />
          </div>
          <h3 className="text-base font-bold text-slate-800">No appointments found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {statusFilter !== 'all' || dateFilter !== 'all'
              ? 'Try adjusting your filters above to view other appointments.'
              : 'When clients book appointments on your storefront, they will appear right here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((app) => {
            const start = formatDateTime(app.start_time)
            const end = formatDateTime(app.end_time)

            return (
              <div
                key={app.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:border-slate-300 transition-all space-y-4"
              >
                {/* Header: Service Name, Status Badge & Schedule */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-base font-black text-slate-900">
                        {app.service?.name || 'Booked Service'}
                      </h4>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wide ${
                          app.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : app.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : app.status === 'completed'
                            ? 'bg-blue-100 text-blue-800'
                            : app.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="font-semibold text-slate-700 flex items-center gap-1">
                        <Calendar size={13} className="text-slate-400" />
                        {start.date}
                      </span>
                      <span>•</span>
                      <span className="font-semibold text-slate-700 flex items-center gap-1">
                        <Clock size={13} className="text-slate-400" />
                        {start.time} – {end.time}
                      </span>
                    </div>
                  </div>

                  {/* Financial Overview */}
                  <div className="text-left sm:text-right">
                    <p className="text-lg font-black text-slate-900">{formatNaira(app.total_price)}</p>
                    <div className="flex items-center sm:justify-end gap-1.5 mt-0.5">
                      {app.deposit_amount > 0 ? (
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md ${
                            app.deposit_paid
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {app.deposit_paid ? (
                            <>
                              <CheckCircle2 size={11} /> Deposit Paid ({formatNaira(app.deposit_amount)})
                            </>
                          ) : (
                            <>
                              <AlertCircle size={11} /> Deposit Due ({formatNaira(app.deposit_amount)})
                            </>
                          )}
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">No deposit required</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Client Info & Selected Add-ons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Client Details */}
                  <div className="space-y-1.5 bg-slate-50/80 rounded-xl p-3 border border-slate-100">
                    <p className="font-bold text-slate-900 flex items-center gap-1.5">
                      <User size={13} className="text-slate-500" />
                      {app.client_name}
                    </p>
                    <p className="text-slate-600 flex items-center gap-1.5 font-mono">
                      <Phone size={13} className="text-slate-400" />
                      {app.client_phone}
                    </p>
                    {app.client_email && (
                      <p className="text-slate-500 flex items-center gap-1.5">
                        <Mail size={13} className="text-slate-400" />
                        {app.client_email}
                      </p>
                    )}
                    {app.notes && (
                      <p className="text-slate-600 italic mt-1.5 pt-1.5 border-t border-slate-200/60">
                        &quot;{app.notes}&quot;
                      </p>
                    )}
                  </div>

                  {/* Add-ons & Extra Services */}
                  <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100">
                    <p className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                      <Sparkles size={13} className="text-slate-500" />
                      Add-ons & Options
                    </p>
                    {app.selected_addons && app.selected_addons.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {app.selected_addons.map((addon) => (
                          <span
                            key={addon.id}
                            className="bg-white border border-slate-200 px-2 py-1 rounded-lg text-[11px] font-semibold text-slate-700"
                          >
                            +{addon.name} ({formatNaira(addon.price)})
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 italic">No add-ons selected.</p>
                    )}

                    {/* Cancellation reason if cancelled */}
                    {app.status === 'cancelled' && app.cancellation_reason && (
                      <div className="mt-2 text-red-600 font-medium">
                        Cancellation reason: {app.cancellation_reason}
                      </div>
                    )}
                  </div>
                </div>

                {/* Cancel Prompt Modal/Inline form */}
                {cancellingId === app.id && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl space-y-2">
                    <p className="text-xs font-bold text-red-900">Cancel Appointment for {app.client_name}</p>
                    <input
                      type="text"
                      placeholder="Reason for cancellation (e.g. Client requested, Unforeseen delay)"
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-red-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-400 bg-white"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setCancellingId(null)}
                        className="px-3 py-1 text-xs text-slate-600 hover:text-slate-900 font-semibold"
                      >
                        Keep Booking
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(app.id, 'cancelled', undefined, cancelReason)}
                        disabled={isPending}
                        className="px-3 py-1 text-xs bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 disabled:opacity-50"
                      >
                        Confirm Cancellation
                      </button>
                    </div>
                  </div>
                )}

                {/* Actions & WhatsApp Contact Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                  {/* WhatsApp Quick Actions for Merchant */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <a
                      href={getWhatsAppLink(app, app.deposit_paid ? 'confirm' : 'deposit')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/80 transition-colors"
                    >
                      <MessageSquare size={13} />
                      WhatsApp: {app.deposit_paid ? 'Send Confirmation' : 'Request Deposit'}
                    </a>
                    <a
                      href={getWhatsAppLink(app, 'reminder')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                      Send Reminder
                    </a>
                  </div>

                  {/* Booking Management Controls */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* Deposit Toggle */}
                    {app.deposit_amount > 0 && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(app.id, app.status, !app.deposit_paid)}
                        disabled={isPending}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                          app.deposit_paid
                            ? 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                            : 'bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700 shadow-sm'
                        }`}
                      >
                        {app.deposit_paid ? 'Mark Deposit Unpaid' : 'Mark Deposit Paid'}
                      </button>
                    )}

                    {/* Status Transitions */}
                    {app.status === 'pending' && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(app.id, 'confirmed')}
                        disabled={isPending}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 shadow-sm transition-all"
                      >
                        Confirm Booking
                      </button>
                    )}

                    {app.status === 'confirmed' && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(app.id, 'completed')}
                        disabled={isPending}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all"
                      >
                        Mark Completed
                      </button>
                    )}

                    {app.status !== 'cancelled' && (
                      <button
                        type="button"
                        onClick={() => setCancellingId(app.id)}
                        disabled={isPending}
                        className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
