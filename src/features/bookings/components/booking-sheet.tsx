'use client'

import { useState, useEffect, useTransition } from 'react'
import {
  X,
  Clock,
  Calendar,
  Sparkles,
  Phone,
  User,
  Mail,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  ChevronRight,
  ShieldCheck,
  ArrowLeft,
} from 'lucide-react'
import type { Service, ServiceAddon, TimeSlot } from '../types'
import { createAppointment, getAvailableSlotsAction } from '../actions'

interface BookingSheetProps {
  isOpen: boolean
  onClose: () => void
  businessId: string
  businessName: string
  businessSlug: string
  whatsappNumber?: string | null
  services: Service[]
  initialSelectedService?: Service | null
}

export function BookingSheet({
  isOpen,
  onClose,
  businessId,
  businessName,
  whatsappNumber,
  services,
  initialSelectedService,
}: BookingSheetProps) {
  const [selectedService, setSelectedService] = useState<Service | null>(
    initialSelectedService || services[0] || null
  )
  const [selectedAddons, setSelectedAddons] = useState<ServiceAddon[]>([])
  
  // Date selection (default today)
  const [selectedDateStr, setSelectedDateStr] = useState<string>(() => {
    return new Date().toISOString().split('T')[0]
  })
  
  // Slots
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)

  // Client inputs
  const [clientName, setClientName] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [notes, setNotes] = useState('')

  // Form submission state
  const [isPending, startTransition] = useTransition()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successBooking, setSuccessBooking] = useState<{
    id: string
    serviceName: string
    dateStr: string
    timeStr: string
    totalPrice: number
    depositAmount: number
  } | null>(null)

  // Update selected service if prop changes
  useEffect(() => {
    if (initialSelectedService) {
      setSelectedService(initialSelectedService)
      setSelectedAddons([])
    } else if (services.length > 0 && !selectedService) {
      setSelectedService(services[0])
    }
  }, [initialSelectedService, services])

  // Fetch available slots whenever service or date changes
  useEffect(() => {
    if (!isOpen || !selectedService || !selectedDateStr) return

    let isMounted = true
    setLoadingSlots(true)
    setSelectedSlot(null)

    getAvailableSlotsAction(businessId, selectedService.id, selectedDateStr)
      .then((res) => {
        if (isMounted) {
          setSlots(res)
          setLoadingSlots(false)
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Error fetching time slots:', err)
          setSlots([])
          setLoadingSlots(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [isOpen, selectedService, selectedDateStr, businessId])

  if (!isOpen) return null

  // Calculate pricing & duration
  const basePrice = selectedService?.price || 0
  const addonsPrice = selectedAddons.reduce((sum, a) => sum + a.price, 0)
  const totalPrice = basePrice + addonsPrice

  const baseDuration = selectedService?.duration_minutes || 0
  const addonsDuration = selectedAddons.reduce((sum, a) => sum + a.duration_minutes, 0)
  const totalDuration = baseDuration + addonsDuration

  const depositRequired = selectedService?.requires_deposit
    ? selectedService.deposit_amount || 0
    : 0

  // Format currency
  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Toggle addon
  const toggleAddon = (addon: ServiceAddon) => {
    if (selectedAddons.some((a) => a.id === addon.id)) {
      setSelectedAddons(selectedAddons.filter((a) => a.id !== addon.id))
    } else {
      setSelectedAddons([...selectedAddons, addon])
    }
  }

  // Generate date options (next 14 days)
  const dateOptions = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    const iso = d.toISOString().split('T')[0]
    const weekday = d.toLocaleDateString('en-US', { weekday: 'short' })
    const dayNum = d.getDate()
    const month = d.toLocaleDateString('en-US', { month: 'short' })
    return { iso, weekday, dayNum, month, isToday: i === 0 }
  })

  // Format phone for WhatsApp link
  const getWhatsAppBookingLink = () => {
    if (!whatsappNumber || !successBooking) return '#'
    let num = whatsappNumber.replace(/\D/g, '')
    if (num.startsWith('0')) {
      num = '234' + num.slice(1)
    } else if (!num.startsWith('234')) {
      num = '234' + num
    }

    const addonsText = selectedAddons.length > 0
      ? `\n• Add-ons: ${selectedAddons.map((a) => a.name).join(', ')}`
      : ''

    const depositText = successBooking.depositAmount > 0
      ? `\n• Required Deposit: ${formatNaira(successBooking.depositAmount)}`
      : ''

    const message = `Hello ${businessName}! 🌟\n\nI just booked an appointment on your Qarty storefront:\n\n• Service: ${successBooking.serviceName}${addonsText}\n• Date: ${successBooking.dateStr}\n• Time: ${successBooking.timeStr}\n• Client: ${clientName} (${clientPhone})\n• Total Price: ${formatNaira(successBooking.totalPrice)}${depositText}\n\n${notes ? `Note: "${notes}"\n\n` : ''}Please send your account details for deposit confirmation. Thank you!`

    return `https://wa.me/${num}?text=${encodeURIComponent(message)}`
  }

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedService) {
      setErrorMessage('Please choose a service.')
      return
    }
    if (!selectedSlot) {
      setErrorMessage('Please select an available time slot.')
      return
    }
    if (!clientName.trim() || !clientPhone.trim()) {
      setErrorMessage('Please provide your name and phone number.')
      return
    }

    setErrorMessage(null)
    startTransition(async () => {
      try {
        const result = await createAppointment({
          business_id: businessId,
          service_id: selectedService.id,
          client_name: clientName.trim(),
          client_phone: clientPhone.trim(),
          client_email: clientEmail.trim() || undefined,
          start_time: selectedSlot.startTime,
          end_time: selectedSlot.endTime,
          total_price: totalPrice,
          deposit_amount: depositRequired,
          notes: notes.trim() || undefined,
          selected_addons: selectedAddons.map((a) => ({
            id: a.id,
            name: a.name,
            price: a.price,
            duration_minutes: a.duration_minutes,
          })),
        })

        const startObj = new Date(selectedSlot.startTime)
        setSuccessBooking({
          id: result.id,
          serviceName: selectedService.name,
          dateStr: startObj.toLocaleDateString('en-GB', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
          }),
          timeStr: selectedSlot.formattedTime,
          totalPrice,
          depositAmount: depositRequired,
        })
      } catch (err: any) {
        setErrorMessage(err?.message || 'Failed to submit booking. Please try again.')
      }
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 transition-all">
      <div className="w-full max-w-xl max-h-[92vh] sm:max-h-[85vh] flex flex-col bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-white sticky top-0 z-10">
          <div className="min-w-0">
            <h3 className="text-base font-black text-slate-900 truncate">
              {successBooking ? 'Booking Confirmed! 🎉' : `Book with ${businessName}`}
            </h3>
            <p className="text-xs text-slate-500 font-medium truncate">
              {successBooking ? 'Follow the steps below to finalize' : 'Select a service, date & time slot'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 flex items-center justify-center transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {successBooking ? (
            /* Success Screen */
            <div className="space-y-6 text-center py-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 size={36} />
              </div>

              <div className="space-y-1">
                <h4 className="text-xl font-black text-slate-900">Your Appointment is Requested!</h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  We have saved your slot for <span className="font-bold text-slate-900">{successBooking.serviceName}</span> on{' '}
                  <span className="font-bold text-slate-900">{successBooking.dateStr}</span> at{' '}
                  <span className="font-bold text-slate-900">{successBooking.timeStr}</span>.
                </p>
              </div>

              {/* Booking Summary Box */}
              <div className="rounded-2xl bg-slate-50 border border-slate-200/90 p-4 text-left space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Client:</span>
                  <span className="font-bold text-slate-900">{clientName}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Estimated Total:</span>
                  <span className="font-bold text-slate-900">{formatNaira(successBooking.totalPrice)}</span>
                </div>
                {successBooking.depositAmount > 0 && (
                  <div className="flex justify-between text-amber-700 bg-amber-50 p-2 rounded-xl border border-amber-200 font-bold">
                    <span>Required Deposit:</span>
                    <span>{formatNaira(successBooking.depositAmount)}</span>
                  </div>
                )}
              </div>

              {/* WhatsApp Redirection Banner */}
              {whatsappNumber ? (
                <div className="space-y-3 pt-2">
                  <p className="text-xs font-semibold text-slate-700">
                    To guarantee your spot, please share your confirmation with {businessName} on WhatsApp:
                  </p>
                  <a
                    href={getWhatsAppBookingLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-2xl bg-emerald-600 text-white font-bold text-sm shadow-md hover:bg-emerald-700 transition-all"
                  >
                    <MessageSquare size={18} />
                    <span>Open WhatsApp to Confirm Booking</span>
                  </a>
                </div>
              ) : (
                <div className="rounded-xl bg-slate-100 p-3 text-xs text-slate-600">
                  The merchant will review your booking and contact you via phone ({clientPhone}).
                </div>
              )}

              <button
                type="button"
                onClick={onClose}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors pt-2"
              >
                Close and return to store
              </button>
            </div>
          ) : (
            /* Booking Flow Form */
            <form onSubmit={handleSubmitBooking} className="space-y-5">
              {errorMessage && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs font-semibold text-red-700 flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* 1. Service Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  1. Choose Service
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {services.map((s) => {
                    const isSelected = selectedService?.id === s.id
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          setSelectedService(s)
                          setSelectedAddons([])
                        }}
                        className={`text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/60 ring-1 ring-emerald-600'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="font-bold text-sm text-slate-900 truncate">{s.name}</p>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                            <span className="flex items-center gap-1">
                              <Clock size={12} /> {s.duration_minutes} mins
                            </span>
                            {s.requires_deposit && (
                              <span className="text-amber-700 font-medium">
                                • Deposit: {formatNaira(s.deposit_amount || 0)}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="font-black text-sm text-slate-900 shrink-0">
                          {formatNaira(s.price)}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* 2. Optional Service Add-ons */}
              {selectedService?.addons && selectedService.addons.length > 0 && (
                <div className="space-y-2 pt-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Sparkles size={13} className="text-amber-500" />
                    2. Add Extra Options / Add-ons (Optional)
                  </label>
                  <div className="space-y-1.5">
                    {selectedService.addons.map((addon) => {
                      const isChecked = selectedAddons.some((a) => a.id === addon.id)
                      return (
                        <div
                          key={addon.id}
                          onClick={() => toggleAddon(addon)}
                          className={`cursor-pointer p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
                            isChecked
                              ? 'border-emerald-600 bg-emerald-50/40 text-slate-900 font-semibold'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}}
                              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                            />
                            <span>{addon.name}</span>
                            {addon.duration_minutes > 0 && (
                              <span className="text-slate-400 font-normal">
                                (+{addon.duration_minutes}m)
                              </span>
                            )}
                          </div>
                          <span className="font-bold text-slate-900">+{formatNaira(addon.price)}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* 3. Date Selection Rail */}
              <div className="space-y-2 pt-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                  <Calendar size={13} />
                  3. Select Date
                </label>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {dateOptions.map((d) => {
                    const isSelected = selectedDateStr === d.iso
                    return (
                      <button
                        key={d.iso}
                        type="button"
                        onClick={() => setSelectedDateStr(d.iso)}
                        className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border min-w-[62px] transition-all ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-600 text-white font-bold shadow-sm'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">
                          {d.isToday ? 'Today' : d.weekday}
                        </span>
                        <span className="text-base font-black my-0.5">{d.dayNum}</span>
                        <span className="text-[10px] opacity-75">{d.month}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* 4. Available Time Slots */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <Clock size={13} />
                    4. Select Time Slot
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Est. Duration: {totalDuration} mins
                  </span>
                </div>

                {loadingSlots ? (
                  <div className="py-6 text-center text-xs text-slate-500">
                    <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent mb-1"></div>
                    <p>Checking available times...</p>
                  </div>
                ) : slots.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                    No available booking slots on this date. Please pick another date.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {slots.map((slot) => {
                      const isSelected = selectedSlot?.startTime === slot.startTime
                      return (
                        <button
                          key={slot.startTime}
                          type="button"
                          disabled={!slot.isAvailable}
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all border ${
                            !slot.isAvailable
                              ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed line-through'
                              : isSelected
                              ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                              : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          {slot.formattedTime}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* 5. Client Information */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  5. Your Contact Information
                </label>
                <div className="space-y-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Chioma Adebayo"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      WhatsApp Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 08012345678"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. chioma@gmail.com"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Special Requests / Notes (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Gel soak-off needed beforehand, or skin allergies."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Deposit Policy Notice */}
              {depositRequired > 0 && (
                <div className="rounded-2xl bg-amber-50 border border-amber-200/90 p-3.5 flex items-start gap-2.5">
                  <ShieldCheck size={18} className="text-amber-700 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-900 space-y-0.5">
                    <p className="font-bold">Deposit Policy ({formatNaira(depositRequired)})</p>
                    <p className="text-[11px] text-amber-800/90 leading-relaxed">
                      A booking deposit of {formatNaira(depositRequired)} is required to reserve your slot. 
                      You will send your payment receipt directly to the business on WhatsApp after submitting.
                    </p>
                  </div>
                </div>
              )}

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isPending || !selectedSlot}
                  className="w-full py-3.5 px-4 rounded-2xl bg-slate-900 text-white font-black text-sm shadow-md hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {isPending ? (
                    'Securing your booking...'
                  ) : (
                    <>
                      <span>Book Appointment · {formatNaira(totalPrice)}</span>
                      <ChevronRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
