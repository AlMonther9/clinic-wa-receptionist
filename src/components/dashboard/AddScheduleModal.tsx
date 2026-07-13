'use client'

import React, { useState } from 'react'
import { X } from 'lucide-react'

interface Schedule {
  id: string
  dayOfWeek: number
  startTime: string
  endTime: string
  roomNumber: string | null
  maxPatients: number
}

interface Doctor {
  id: string
  name: string
  specialty: string
  contactDetails: string | null
  schedules: Schedule[]
}

interface AddScheduleModalProps {
  isOpen: boolean
  onClose: () => void
  doctors: Doctor[]
  onSubmit: (
    doctorId: string,
    dayOfWeek: number,
    startTime: string,
    endTime: string,
    roomNumber: string,
    maxPatients: number
  ) => Promise<void>
}

const DAYS_ARABIC = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']

export default function AddScheduleModal({
  isOpen,
  onClose,
  doctors,
  onSubmit,
}: AddScheduleModalProps) {
  const [schDoctorId, setSchDoctorId] = useState('')
  const [schDay, setSchDay] = useState(1) // Monday default
  const [schStartTime, setSchStartTime] = useState('14:00')
  const [schEndTime, setSchEndTime] = useState('18:00')
  const [schRoom, setSchRoom] = useState('')
  const [schMaxPatients, setSchMaxPatients] = useState(20)
  const [submitting, setSubmitting] = useState(false)

  if (!isOpen) return null

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!schDoctorId) {
      alert('الرجاء اختيار الطبيب.')
      return
    }
    setSubmitting(true)
    try {
      await onSubmit(
        schDoctorId,
        Number(schDay),
        schStartTime,
        schEndTime,
        schRoom,
        Number(schMaxPatients)
      )
      setSchRoom('')
      onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

      {/* Content */}
      <div className="relative bg-white border border-border-precision rounded-lg max-w-md w-full overflow-hidden shadow-xl p-6 text-right animate-in fade-in zoom-in-95 duration-150" dir="rtl">
        <div className="flex items-center justify-between border-b border-border-precision pb-3 mb-4">
          <h3 className="font-extrabold text-base text-text-base">إضافة موعد لعيادة طبيب</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-100 text-text-muted transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-text-muted mb-1.5">اختر الطبيب</label>
            <select
              value={schDoctorId}
              onChange={(e) => setSchDoctorId(e.target.value)}
              className="w-full bg-white border border-border-precision rounded-lg px-4 py-2 text-sm text-text-base focus:outline-none focus:border-accent-cerulean focus:ring-1 focus:ring-accent-cerulean transition-all text-right cursor-pointer"
              required
            >
              <option value="">-- اختر طبيب من القائمة --</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.specialty})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-text-muted mb-1.5">اليوم</label>
            <select
              value={schDay}
              onChange={(e) => setSchDay(Number(e.target.value))}
              className="w-full bg-white border border-border-precision rounded-lg px-4 py-2 text-sm text-text-base focus:outline-none focus:border-accent-cerulean focus:ring-1 focus:ring-accent-cerulean transition-all text-right cursor-pointer"
              required
            >
              {DAYS_ARABIC.map((day, idx) => (
                <option key={idx} value={idx}>
                  يوم {day}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-muted mb-1.5">توقيت البدء</label>
              <input
                type="text"
                required
                placeholder="مثال: 14:00"
                value={schStartTime}
                onChange={(e) => setSchStartTime(e.target.value)}
                className="w-full bg-white border border-border-precision rounded-lg px-4 py-2 text-sm text-text-base focus:outline-none focus:border-accent-cerulean focus:ring-1 focus:ring-accent-cerulean transition-all text-center font-mono placeholder-text-muted/65"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted mb-1.5">توقيت الانتهاء</label>
              <input
                type="text"
                required
                placeholder="مثال: 18:00"
                value={schEndTime}
                onChange={(e) => setSchEndTime(e.target.value)}
                className="w-full bg-white border border-border-precision rounded-lg px-4 py-2 text-sm text-text-base focus:outline-none focus:border-accent-cerulean focus:ring-1 focus:ring-accent-cerulean transition-all text-center font-mono placeholder-text-muted/65"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-muted mb-1.5">رقم الغرفة / العيادة</label>
              <input
                type="text"
                placeholder="مثال: 101"
                value={schRoom}
                onChange={(e) => setSchRoom(e.target.value)}
                className="w-full bg-white border border-border-precision rounded-lg px-4 py-2 text-sm text-text-base focus:outline-none focus:border-accent-cerulean focus:ring-1 focus:ring-accent-cerulean transition-all text-center placeholder-text-muted/65"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted mb-1.5">أقصى عدد كشوفات</label>
              <input
                type="number"
                min="1"
                value={schMaxPatients}
                onChange={(e) => setSchMaxPatients(Number(e.target.value))}
                className="w-full bg-white border border-border-precision rounded-lg px-4 py-2 text-sm text-text-base focus:outline-none focus:border-accent-cerulean focus:ring-1 focus:ring-accent-cerulean transition-all text-center placeholder-text-muted/65"
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 border border-border-precision hover:bg-slate-50 rounded-lg text-sm font-bold text-text-muted transition-all"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-primary-blue hover:bg-primary-blue-hover text-white rounded-lg text-sm font-bold disabled:opacity-55 hover:-translate-y-0.5 transition-all shadow-[0_4px_12px_rgba(30,58,138,0.15)]"
            >
              {submitting ? 'جاري الإضافة...' : 'إضافة الموعد'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
