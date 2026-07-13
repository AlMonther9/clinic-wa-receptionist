'use client'

import React from 'react'
import { Calendar, User, Clock, Phone, Edit, Settings } from 'lucide-react'

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

interface ScheduleListProps {
  doctors: Doctor[]
  selectedDayIndex: number
  onEditDoctor: (doctor: Doctor) => void
  onEditSchedule: (schedule: Schedule, doctorName: string) => void
}

const DAYS_ARABIC = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']

export default function ScheduleList({
  doctors,
  selectedDayIndex,
  onEditDoctor,
  onEditSchedule,
}: ScheduleListProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between" dir="rtl">
        <h3 className="text-base font-extrabold text-text-base flex items-center gap-2">
          جدول مواعيد الأطباء
          <span className="text-xs font-bold text-text-muted">
            ({doctors.length} طبيب متاح)
          </span>
        </h3>
      </div>

      {doctors.length === 0 ? (
        <div className="bg-white border border-border-precision rounded-lg p-12 text-center text-text-muted animate-in fade-in duration-200" dir="rtl">
          <User className="w-10 h-10 mx-auto mb-3 text-border-precision" />
          <p className="text-sm font-bold text-text-base">لا يوجد أطباء أو مواعيد مطابقة لخيارات الفلترة الحالية.</p>
          <p className="text-xs text-text-muted mt-1">تأكد من كتابة الاسم بشكل صحيح أو تغيير يوم الفلترة.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4" dir="rtl">
          {doctors.map((doc) => {
            const todaySchedule = doc.schedules.filter((s) => s.dayOfWeek === selectedDayIndex)

            return (
              <div
                key={doc.id}
                className="bg-white border border-border-precision rounded-lg p-5 shadow-[0_2px_10px_rgba(15,23,42,0.04)] hover:border-primary-blue/40 transition-all duration-150"
              >
                {/* Doctor Header */}
                <div className="flex items-start justify-between border-b border-border-precision pb-3.5 mb-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-lg bg-background-canvas border border-border-precision flex items-center justify-center font-bold text-primary-blue text-lg shadow-inner">
                      {doc.name.replace('دكتور ', '').replace('دكتورة ', '').charAt(0)}
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-text-base text-sm tracking-tight">{doc.name}</h4>
                        <button
                          onClick={() => onEditDoctor(doc)}
                          className="p-1 rounded hover:bg-slate-100 text-text-muted hover:text-primary-blue transition-all"
                          title="تعديل ملف الطبيب"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="inline-block text-[11px] font-bold text-primary-blue bg-primary-blue/10 border border-primary-blue/20 px-2 py-0.5 rounded mt-1.5">
                        عيادة {doc.specialty}
                      </span>
                    </div>
                  </div>

                  {doc.contactDetails && (
                    <div className="flex items-center gap-1 text-xs text-text-muted font-mono hover:text-primary-blue">
                      <Phone className="w-3.5 h-3.5 text-text-muted" />
                      <span>{doc.contactDetails}</span>
                    </div>
                  )}
                </div>

                {/* Schedules list */}
                <div className="space-y-2.5">
                  <div className="text-xs text-text-muted font-bold mb-2">المواعيد الأسبوعية المجدولة:</div>
                  {doc.schedules.length === 0 ? (
                    <p className="text-xs text-text-muted italic">لا توجد مواعيد مسجلة لهذا الطبيب حالياً.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {doc.schedules.map((sch) => {
                        const isToday = sch.dayOfWeek === selectedDayIndex
                        return (
                          <div
                            key={sch.id}
                            className={`flex items-center justify-between p-2.5 rounded border text-xs group transition-all ${
                              isToday
                                ? 'bg-accent-cerulean/10 border-accent-cerulean/30 text-text-base'
                                : 'bg-background-canvas/50 border-border-precision text-text-muted'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isToday ? 'bg-accent-cerulean text-white' : 'bg-background-canvas text-text-muted border border-border-precision'}`}>
                                {DAYS_ARABIC[sch.dayOfWeek]}
                              </span>
                              <span className="font-mono font-bold">
                                {sch.startTime} - {sch.endTime}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-text-muted text-[10px]">
                              {sch.roomNumber && <span className="font-bold">غرفة {sch.roomNumber}</span>}
                              <span>({sch.maxPatients} كشف)</span>
                              <button
                                type="button"
                                onClick={() => onEditSchedule(sch, doc.name)}
                                className="p-1 rounded hover:bg-slate-100 text-text-muted hover:text-accent-cerulean opacity-0 group-hover:opacity-100 transition-all ml-1"
                                title="تعديل الموعد"
                              >
                                <Settings className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* Highlight today schedule */}
                  {todaySchedule.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-border-precision flex items-center justify-between text-xs">
                      <span className="text-primary-blue font-bold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-primary-blue" />
                        يتواجد الطبيب اليوم في العيادة
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
