'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Search, Filter, ChevronDown, Check, RotateCcw } from 'lucide-react'

interface FiltersMatrixProps {
  searchQuery: string
  setSearchQuery: (q: string) => void
  filterSpecialty: string
  setFilterSpecialty: (s: string) => void
  filterDay: string
  setFilterDay: (d: string) => void
  specialties: string[]
}

const DAYS_ARABIC = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']

export default function FiltersMatrix({
  searchQuery,
  setSearchQuery,
  filterSpecialty,
  setFilterSpecialty,
  filterDay,
  setFilterDay,
  specialties,
}: FiltersMatrixProps) {
  const [isSpecialtyOpen, setIsSpecialtyOpen] = useState(false)
  const [isDayOpen, setIsDayOpen] = useState(false)

  const specialtyRef = useRef<HTMLDivElement>(null)
  const dayRef = useRef<HTMLDivElement>(null)

  const hasActiveFilters = searchQuery !== '' || filterSpecialty !== 'ALL' || filterDay !== 'ALL'

  const handleReset = () => {
    setSearchQuery('')
    setFilterSpecialty('ALL')
    setFilterDay('ALL')
    setIsSpecialtyOpen(false)
    setIsDayOpen(false)
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (specialtyRef.current && !specialtyRef.current.contains(event.target as Node)) {
        setIsSpecialtyOpen(false)
      }
      if (dayRef.current && !dayRef.current.contains(event.target as Node)) {
        setIsDayOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Selected label text helpers
  const currentSpecialtyLabel =
    filterSpecialty === 'ALL' ? 'كل التخصصات' : `عيادة ${filterSpecialty}`
  const currentDayLabel =
    filterDay === 'ALL' ? 'كل أيام الأسبوع' : `يوم ${DAYS_ARABIC[parseInt(filterDay, 10)]}`

  return (
    <section className="bg-white border border-border-precision rounded-xl p-5 shadow-[0_2px_12px_rgba(15,23,42,0.04)] flex flex-col md:flex-row items-center gap-4 justify-between" dir="rtl">
      <div className="flex items-center gap-2.5">
        <Filter className="w-5 h-5 text-primary-blue ml-1" />
        <h2 className="text-base font-extrabold text-text-base">مصفوفة الفلترة السريعة</h2>
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
        {/* Search text */}
        <div className="relative flex-1 min-w-[280px] w-full md:max-w-md lg:max-w-lg">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="ابحث باسم الطبيب أو التخصص..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-border-precision rounded-lg pr-10 pl-4 py-2.5 text-sm text-text-base focus:outline-none focus:border-accent-cerulean focus:ring-1 focus:ring-accent-cerulean transition-all placeholder-text-muted/70 text-right shadow-2xs font-bold"
          />
        </div>

        {/* Custom Modern Specialty Dropdown Selector */}
        <div className="relative" ref={specialtyRef}>
          <button
            type="button"
            onClick={() => {
              setIsSpecialtyOpen((prev) => !prev)
              setIsDayOpen(false)
            }}
            className={`flex items-center justify-between gap-3 bg-white border rounded-lg px-4 py-2.5 text-xs font-bold transition-all cursor-pointer min-w-[170px] ${
              isSpecialtyOpen
                ? 'border-sky-500 ring-2 ring-sky-100 shadow-sm'
                : 'border-border-precision hover:border-slate-300 text-text-base shadow-2xs'
            }`}
          >
            <span className="text-slate-800 font-extrabold">{currentSpecialtyLabel}</span>
            <ChevronDown
              className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                isSpecialtyOpen ? 'rotate-180 text-sky-600' : ''
              }`}
            />
          </button>

          {/* Floating Dropdown List */}
          {isSpecialtyOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200/90 rounded-xl shadow-xl p-1.5 z-50 animate-in fade-in-50 zoom-in-95 duration-150">
              <div className="text-[10px] font-extrabold text-slate-400 px-3 py-1.5 uppercase tracking-wider text-right border-b border-slate-100 mb-1">
                اختر التخصص
              </div>

              <div
                onClick={() => {
                  setFilterSpecialty('ALL')
                  setIsSpecialtyOpen(false)
                }}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                  filterSpecialty === 'ALL'
                    ? 'bg-sky-50 text-sky-900 font-extrabold'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span>كل التخصصات</span>
                {filterSpecialty === 'ALL' && <Check className="w-4 h-4 text-sky-600" />}
              </div>

              {specialties
                .filter((s) => s !== 'ALL')
                .map((spec) => {
                  const isSelected = filterSpecialty === spec
                  return (
                    <div
                      key={spec}
                      onClick={() => {
                        setFilterSpecialty(spec)
                        setIsSpecialtyOpen(false)
                      }}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-sky-50 text-sky-900 font-extrabold'
                          : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <span>عيادة {spec}</span>
                      {isSelected && <Check className="w-4 h-4 text-sky-600" />}
                    </div>
                  )
                })}
            </div>
          )}
        </div>

        {/* Custom Modern Day of Week Dropdown Selector */}
        <div className="relative" ref={dayRef}>
          <button
            type="button"
            onClick={() => {
              setIsDayOpen((prev) => !prev)
              setIsSpecialtyOpen(false)
            }}
            className={`flex items-center justify-between gap-3 bg-white border rounded-lg px-4 py-2.5 text-xs font-bold transition-all cursor-pointer min-w-[170px] ${
              isDayOpen
                ? 'border-sky-500 ring-2 ring-sky-100 shadow-sm'
                : 'border-border-precision hover:border-slate-300 text-text-base shadow-2xs'
            }`}
          >
            <span className="text-slate-800 font-extrabold">{currentDayLabel}</span>
            <ChevronDown
              className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                isDayOpen ? 'rotate-180 text-sky-600' : ''
              }`}
            />
          </button>

          {/* Floating Dropdown List */}
          {isDayOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200/90 rounded-xl shadow-xl p-1.5 z-50 animate-in fade-in-50 zoom-in-95 duration-150">
              <div className="text-[10px] font-extrabold text-slate-400 px-3 py-1.5 uppercase tracking-wider text-right border-b border-slate-100 mb-1">
                اختر يوم الأسبوع
              </div>

              <div
                onClick={() => {
                  setFilterDay('ALL')
                  setIsDayOpen(false)
                }}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                  filterDay === 'ALL'
                    ? 'bg-sky-50 text-sky-900 font-extrabold'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span>كل أيام الأسبوع</span>
                {filterDay === 'ALL' && <Check className="w-4 h-4 text-sky-600" />}
              </div>

              {DAYS_ARABIC.map((day, idx) => {
                const dayVal = idx.toString()
                const isSelected = filterDay === dayVal
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setFilterDay(dayVal)
                      setIsDayOpen(false)
                    }}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-sky-50 text-sky-900 font-extrabold'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span>يوم {day}</span>
                    {isSelected && <Check className="w-4 h-4 text-sky-600" />}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Reset Button */}
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-red-600 hover:text-white px-3.5 py-2.5 bg-red-50 hover:bg-red-600 border border-red-200 rounded-lg transition-all font-bold cursor-pointer shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة ضبط الفلاتر</span>
          </button>
        )}
      </div>
    </section>
  )
}
