'use client'

import React from 'react'
import { Check, Clock, Phone, DoorOpen, LogOut } from 'lucide-react'
import { AttendanceStatus } from '@prisma/client'

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

interface TimeSheet {
  id: string
  doctorId: string
  date: Date | string
  checkInTime: Date | string | null
  checkOutTime: Date | string | null
  status: AttendanceStatus
}

interface AttendanceLedgerProps {
  doctors: Doctor[]
  timeSheets: TimeSheet[]
  monthlyPresentCounts: Record<string, number>
  selectedDayIndex: number
  selectedDate: string
  onCheckIn: (doctorId: string) => void
  onCheckOut: (doctorId: string) => void
  onUpdateStatus: (doctorId: string, status: AttendanceStatus) => void
}

const ATTENDANCE_STATUS_LABELS: Record<AttendanceStatus, string> = {
  PRESENT: 'حاضر',
  ABSENT: 'غائب',
  EXCUSED: 'معتذر',
}

export default function AttendanceLedger({
  doctors,
  timeSheets,
  monthlyPresentCounts,
  selectedDayIndex,
  selectedDate,
  onCheckIn,
  onCheckOut,
  onUpdateStatus,
}: AttendanceLedgerProps) {

  // Helper to format timestamps nicely
  const formatTime = (dateObj: Date | string | null | undefined) => {
    if (!dateObj) return '--:--'
    const date = new Date(dateObj)
    return date.toLocaleTimeString('ar-EG', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between" dir="rtl">
        <h3 className="text-base font-extrabold text-text-base flex items-center gap-2">
          دفتر الحضور اليومي
          <span className="text-xs bg-white border border-border-precision px-2.5 py-1 rounded font-mono text-text-base font-bold">
            {selectedDate}
          </span>
        </h3>
      </div>

      <div className="bg-white border border-border-precision rounded-lg overflow-hidden shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
        
        {/* Ledger Header */}
        <div className="bg-slate-50 px-4 py-3 border-b border-border-precision flex justify-between items-center text-xs text-text-muted font-bold" dir="rtl">
          <div className="w-2/5 text-right">اسم الطبيب وتخصصه</div>
          <div className="w-2/5 text-center">أوقات الدخول والخروج</div>
          <div className="w-1/5 text-left">الإجراء والحضور الشهري</div>
        </div>

        {/* Ledger Body */}
        <div className="divide-y divide-border-precision" dir="rtl">
          {doctors.map((doc) => {
            const sheet = timeSheets.find((t) => t.doctorId === doc.id)
            const status = sheet?.status || 'NOT_LOGGED'
            const checkIn = sheet?.checkInTime
            const checkOut = sheet?.checkOutTime

            const hasScheduleToday = doc.schedules.some((s) => s.dayOfWeek === selectedDayIndex)
            const monthlyPresent = monthlyPresentCounts[doc.id] || 0

            return (
              <div
                key={doc.id}
                className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm transition-all duration-150 ${
                  hasScheduleToday && status === 'NOT_LOGGED'
                    ? 'bg-accent-cerulean/[0.03] hover:bg-accent-cerulean/[0.06]'
                    : 'hover:bg-slate-50/50'
                }`}
              >
                {/* Col 1: Doctor info */}
                <div className="sm:w-2/5 space-y-1 text-right">
                  <div className="font-extrabold text-text-base flex items-center gap-1.5 justify-start">
                    {doc.name}
                    {hasScheduleToday && (
                      <span className="inline-block w-2.5 h-2.5 rounded-full bg-accent-cerulean shadow-sm shadow-accent-cerulean/30 animate-pulse" title="مجدول اليوم" />
                    )}
                  </div>
                  <div className="text-xs text-text-muted flex items-center gap-1.5 justify-start font-bold">
                    <span>{doc.specialty}</span>
                    <span>•</span>
                    <span className="text-text-muted">حضور الشهر: {monthlyPresent} يوم</span>
                  </div>
                </div>

                {/* Col 2: Times */}
                <div className="sm:w-2/5 flex flex-col justify-center items-center gap-1.5 bg-slate-50 p-2 rounded-lg border border-border-precision">
                  {status === 'PRESENT' ? (
                    <>
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="text-text-muted font-bold">دخول:</span>
                        <span className="font-mono text-primary-blue font-bold">{formatTime(checkIn)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="text-text-muted font-bold">خروج:</span>
                        <span className="font-mono text-accent-cerulean font-bold">{formatTime(checkOut)}</span>
                      </div>
                    </>
                  ) : (
                    <span className={`text-xs px-2.5 py-0.5 rounded font-bold ${
                      status === 'ABSENT'
                        ? 'bg-red-50 text-red-700 border border-red-100'
                        : status === 'EXCUSED'
                        ? 'bg-amber-50 text-amber-700 border border-amber-100'
                        : 'bg-slate-50 text-text-muted border border-border-precision'
                    }`}>
                      {status === 'NOT_LOGGED' ? 'غير مسجل حضور' : ATTENDANCE_STATUS_LABELS[status as AttendanceStatus]}
                    </span>
                  )}
                </div>

                {/* Col 3: Actions */}
                <div className="sm:w-1/5 flex sm:flex-col items-stretch justify-center gap-1.5">
                  {/* Quick Check-in/out button */}
                  {status !== 'PRESENT' ? (
                    <button
                      onClick={() => onCheckIn(doc.id)}
                      className="bg-primary-blue hover:bg-primary-blue-hover text-white transition-all text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center justify-center gap-1 hover:-translate-y-0.5 shadow-[0_4px_12px_rgba(30,58,138,0.15)]"
                    >
                      <DoorOpen className="w-3.5 h-3.5" />
                      <span>تسجيل دخول</span>
                    </button>
                  ) : !checkOut ? (
                    <button
                      onClick={() => onCheckOut(doc.id)}
                      className="bg-white hover:bg-slate-50 text-text-base border border-border-precision transition-all text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center justify-center gap-1 hover:-translate-y-0.5 shadow-sm"
                    >
                      <LogOut className="w-3.5 h-3.5 text-primary-blue" />
                      <span>تسجيل خروج</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-primary-blue font-bold text-center flex items-center justify-center gap-1 border border-primary-blue/20 bg-primary-blue/5 px-2 py-1 rounded">
                      <Check className="w-3 h-3 text-primary-blue" />
                      منصرف
                    </span>
                  )}

                  {/* Manual Quick Status dropdown */}
                  <div className="flex justify-between gap-1 mt-1">
                    <button
                      onClick={() => onUpdateStatus(doc.id, 'ABSENT')}
                      className={`text-[10px] flex-1 py-1 rounded border text-center transition-all font-bold ${
                        status === 'ABSENT'
                          ? 'bg-red-50 border-red-200 text-red-700 font-bold'
                          : 'bg-white border-border-precision text-text-muted hover:text-red-600 hover:border-red-200'
                      }`}
                    >
                      غياب
                    </button>
                    <button
                      onClick={() => onUpdateStatus(doc.id, 'EXCUSED')}
                      className={`text-[10px] flex-1 py-1 rounded border text-center transition-all font-bold ${
                        status === 'EXCUSED'
                          ? 'bg-amber-50 border-amber-200 text-amber-700 font-bold'
                          : 'bg-white border-border-precision text-text-muted hover:text-amber-600 hover:border-amber-200'
                      }`}
                    >
                      اعتذار
                    </button>
                  </div>
                </div>

              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
