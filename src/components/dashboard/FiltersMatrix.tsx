'use client'

import React from 'react'
import { Search, Filter, ChevronDown } from 'lucide-react'

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
  const hasActiveFilters = searchQuery !== '' || filterSpecialty !== 'ALL' || filterDay !== 'ALL'

  const handleReset = () => {
    setSearchQuery('')
    setFilterSpecialty('ALL')
    setFilterDay('ALL')
  }

  return (
    <section className="bg-white border border-border-precision rounded-lg p-5 shadow-[0_2px_10px_rgba(15,23,42,0.04)] flex flex-col md:flex-row items-center gap-4 justify-between">
      <div className="flex items-center gap-2">
        <Filter className="w-5 h-5 text-primary-blue ml-1" />
        <h2 className="text-base font-extrabold text-text-base">مصفوفة الفلترة السريعة</h2>
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
        {/* Search text */}
        <div className="relative flex-1 md:w-64 min-w-[200px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="ابحث باسم الطبيب أو التخصص..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-border-precision rounded-lg pr-9 pl-4 py-2 text-sm text-text-base focus:outline-none focus:border-accent-cerulean focus:ring-1 focus:ring-accent-cerulean transition-all placeholder-text-muted/70 text-right"
          />
        </div>

        {/* Specialty Selector */}
        <div className="relative">
          <select
            value={filterSpecialty}
            onChange={(e) => setFilterSpecialty(e.target.value)}
            className="appearance-none bg-white border border-border-precision rounded-lg pr-4 pl-9 py-2 text-sm text-text-base focus:outline-none focus:border-accent-cerulean focus:ring-1 focus:ring-accent-cerulean transition-all text-right cursor-pointer"
          >
            <option value="ALL">كل التخصصات</option>
            {specialties
              .filter((s) => s !== 'ALL')
              .map((spec) => (
                <option key={spec} value={spec}>
                  عيادة {spec}
                </option>
              ))}
          </select>
          <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
        </div>

        {/* Day of Week Selector */}
        <div className="relative">
          <select
            value={filterDay}
            onChange={(e) => setFilterDay(e.target.value)}
            className="appearance-none bg-white border border-border-precision rounded-lg pr-4 pl-9 py-2 text-sm text-text-base focus:outline-none focus:border-accent-cerulean focus:ring-1 focus:ring-accent-cerulean transition-all text-right cursor-pointer"
          >
            <option value="ALL">كل أيام الأسبوع</option>
            {DAYS_ARABIC.map((day, idx) => (
              <option key={idx} value={idx.toString()}>
                يوم {day}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
        </div>

        {/* Reset Button */}
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="text-xs text-red-600 hover:text-white px-3.5 py-2 bg-red-50 hover:bg-red-600 border border-red-200 rounded-lg transition-all font-bold"
          >
            إعادة ضبط الفلاتر
          </button>
        )}
      </div>
    </section>
  )
}
