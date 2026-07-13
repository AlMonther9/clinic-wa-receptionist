'use client'

import React, { useState, useEffect } from 'react'
import { X, Trash2 } from 'lucide-react'

interface Schedule {
  id: string
  dayOfWeek: number
  startTime: string
  endTime: string
  roomNumber: string | null
  maxPatients: number
}

interface EditScheduleModalProps {
  isOpen: boolean
  onClose: () => void
  schedule: Schedule | null
  doctorName: string
  onSubmit: (
    id: string,
    dayOfWeek: number,
    startTime: string,
    endTime: string,
    roomNumber: string,
    maxPatients: number
  ) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

const DAYS_ARABIC = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']

export default function EditScheduleModal({
  isOpen,
  onClose,
  schedule,
  doctorName,
  onSubmit,
  onDelete,
}: EditScheduleModalProps) {
  const [schDay, setSchDay] = useState(1)
  const [schStartTime, setSchStartTime] = useState('14:00')
  const [schEndTime, setSchEndTime] = useState('18:00')
  const [schRoom, setSchRoom] = useState('')
  const [schMaxPatients, setSchMaxPatients] = useState(20)
  const [submitting, setSubmitting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    if (schedule) {
      setSchDay(schedule.dayOfWeek)
      setSchStartTime(schedule.startTime)
      setSchEndTime(schedule.endTime)
      setSchRoom(schedule.roomNumber || '')
      setSchMaxPatients(schedule.maxPatients)
      setConfirmDelete(false)
    }
  }, [schedule, isOpen])

  if (!isOpen || !schedule) return null

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await onSubmit(
        schedule.id,
        Number(schDay),
        schStartTime,
        schEndTime,
        schRoom,
        Number(schMaxPatients)
      )
      onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteClick = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    setSubmitting(true)
    try {
      await onDelete(schedule.id)
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
          <div className="text-right">
            <h3 className="font-extrabold text-base text-text-base">تعديل موعد العيادة</h3>
            <span className="text-xs text-text-muted font-bold">{doctorName}</span>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-100 text-text-muted transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4">
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

          <div className="flex items-center justify-between border-t border-border-precision pt-4 mt-6">
            <div>
              {confirmDelete ? (
                <button
                  type="button"
                  onClick={handleDeleteClick}
                  disabled={submitting}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>حذف الموعد نهائياً؟</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="px-3.5 py-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded-lg text-xs font-bold flex items-center gap-1 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>حذف الموعد</span>
                </button>
              )}
            </div>

            <div className="flex gap-3">
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
                {submitting ? 'جاري الحفظ...' : 'حفظ التعديل'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
