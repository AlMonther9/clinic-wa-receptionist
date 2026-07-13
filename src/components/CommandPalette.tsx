'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Search, Calendar, User, Clock, Check, X, ShieldAlert } from 'lucide-react'

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

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  doctors: Doctor[]
  onCheckIn: (doctorId: string) => void
}

const DAYS_ARABIC = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']

export default function CommandPalette({ isOpen, onClose, doctors, onCheckIn }: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Flatten doctors and their schedules for uniform searching
  const searchableItems: Array<{
    type: 'schedule' | 'doctor'
    title: string
    subtitle: string
    details: string
    doctorId: string
    scheduleId?: string
    actionText: string
  }> = []

  doctors.forEach((doc) => {
    // Add doctor profile search option
    searchableItems.push({
      type: 'doctor',
      title: doc.name,
      subtitle: `تخصص: ${doc.specialty}`,
      details: doc.contactDetails ? `هاتف: ${doc.contactDetails}` : 'لا يوجد تفاصيل اتصال',
      doctorId: doc.id,
      actionText: 'تسجيل حضور',
    })

    // Add schedules as individual options
    doc.schedules.forEach((sch) => {
      const dayName = DAYS_ARABIC[sch.dayOfWeek]
      searchableItems.push({
        type: 'schedule',
        title: `مواعيد عيادة ال${doc.specialty} (${doc.name})`,
        subtitle: `يوم ${dayName} من ${sch.startTime} إلى ${sch.endTime}`,
        details: `غرفة ${sch.roomNumber || 'غير محددة'} • أقصى عدد مرضى: ${sch.maxPatients}`,
        doctorId: doc.id,
        scheduleId: sch.id,
        actionText: 'تسجيل حضور',
      })
    })
  })

  // Filter items based on query
  const filteredItems = searchableItems.filter((item) => {
    if (!query) return true
    const normalizedQuery = query.toLowerCase()
    return (
      item.title.toLowerCase().includes(normalizedQuery) ||
      item.subtitle.toLowerCase().includes(normalizedQuery) ||
      item.details.toLowerCase().includes(normalizedQuery)
    )
  })

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (filteredItems[selectedIndex]) {
          handleAction(filteredItems[selectedIndex].doctorId)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, filteredItems, selectedIndex])

  const handleAction = (doctorId: string) => {
    onCheckIn(doctorId)
    onClose()
  }

  // Scroll selected item into view
  useEffect(() => {
    const selectedEl = listRef.current?.children[selectedIndex] as HTMLElement
    if (selectedEl) {
      selectedEl.scrollIntoView({ block: 'nearest' })
    }
  }, [selectedIndex])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Palette Container */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-lg border border-border-precision bg-white shadow-xl transition-all duration-300 flex flex-col max-h-[60vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Search Input Wrapper */}
        <div className="flex items-center px-4 py-4 border-b border-border-precision">
          <Search className="w-5 h-5 text-text-muted ml-3" />
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-transparent text-text-base placeholder-text-muted/60 text-lg border-none outline-none text-right font-extrabold"
            placeholder="ابحث بالاسم، التخصص، أو اليوم... (اضغط Enter للاختيار)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            dir="rtl"
          />
          <button 
            onClick={onClose}
            className="p-1 rounded hover:bg-slate-100 text-text-muted hover:text-text-base transition-colors mr-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div 
          ref={listRef} 
          className="flex-1 overflow-y-auto py-2 px-2"
          dir="rtl"
        >
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-text-muted">
              <ShieldAlert className="w-10 h-10 mb-3 text-accent-cerulean" />
              <p className="text-base font-bold">لم نجد أي نتائج مطابقة لبحثك</p>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex
              return (
                <div
                  key={idx}
                  onClick={() => handleAction(item.doctorId)}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-150 ${
                    isSelected 
                      ? 'bg-primary-blue/5 border border-primary-blue/20 text-text-base' 
                      : 'border border-transparent hover:bg-slate-50 text-text-base'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded mt-0.5 ${isSelected ? 'bg-primary-blue/10 text-primary-blue' : 'bg-slate-50 text-text-muted border border-border-precision'}`}>
                      {item.type === 'doctor' ? (
                        <User className="w-5 h-5" />
                      ) : (
                        <Calendar className="w-5 h-5" />
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-extrabold text-base flex items-center gap-2">
                        {item.title}
                        {item.type === 'doctor' && (
                          <span className="text-[10px] bg-slate-50 px-2 py-0.5 rounded border border-border-precision text-text-muted font-bold">
                            ملف الطبيب
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-text-muted mt-0.5 font-bold">{item.subtitle}</div>
                      <div className="text-xs text-text-muted/80 mt-1 font-mono">{item.details}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-3 py-1 rounded font-bold transition-all ${
                      isSelected 
                        ? 'bg-primary-blue text-white shadow-sm' 
                        : 'bg-slate-50 text-text-muted border border-border-precision'
                    }`}>
                      {item.actionText}
                    </span>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer Hints */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-border-precision flex justify-between items-center text-xs text-text-muted font-bold">
          <div>
            <span>اضغط </span>
            <kbd className="px-1.5 py-0.5 bg-white rounded border border-border-precision text-text-base font-mono text-[10px]">Esc</kbd>
            <span> للإغلاق</span>
          </div>
          <div className="flex gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white rounded border border-border-precision text-text-base font-mono text-[10px]">↑↓</kbd>
              <span>للتنقل</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white rounded border border-border-precision text-text-base font-mono text-[10px]">Enter</kbd>
              <span>للاختيار والتسجيل</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
