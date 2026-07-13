'use client'

import React from 'react'
import { Users, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'

interface StatsCardsProps {
  totalDoctors: number
  presentCount: number
  absentCount: number
  excusedCount: number
}

export default function StatsCards({
  totalDoctors,
  presentCount,
  absentCount,
  excusedCount,
}: StatsCardsProps) {
  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* 1. Total Doctors */}
      <div className="bg-white border border-border-precision rounded-lg p-5 shadow-[0_2px_10px_rgba(15,23,42,0.04)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary-blue/5 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-muted font-bold">أطباء العيادة</span>
          <div className="p-2 bg-primary-blue/10 rounded text-primary-blue">
            <Users className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-text-base">{totalDoctors}</span>
          <span className="text-xs text-text-muted font-semibold">مسجلين</span>
        </div>
      </div>

      {/* 2. Present Today */}
      <div className="bg-white border border-border-precision rounded-lg p-5 shadow-[0_2px_10px_rgba(15,23,42,0.04)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-600/5 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-muted font-bold">حاضرين اليوم</span>
          <div className="p-2 bg-emerald-600/10 rounded text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-emerald-600">{presentCount}</span>
          <span className="text-xs text-text-muted font-semibold">أطباء</span>
        </div>
      </div>

      {/* 3. Absent Today */}
      <div className="bg-white border border-border-precision rounded-lg p-5 shadow-[0_2px_10px_rgba(15,23,42,0.04)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-muted font-bold">غائبين اليوم</span>
          <div className="p-2 bg-red-500/10 rounded text-red-600">
            <XCircle className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-red-600">{absentCount}</span>
          <span className="text-xs text-text-muted font-semibold">أطباء</span>
        </div>
      </div>

      {/* 4. Excused Today */}
      <div className="bg-white border border-border-precision rounded-lg p-5 shadow-[0_2px_10px_rgba(15,23,42,0.04)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-accent-cerulean/5 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-muted font-bold">معتذرين اليوم</span>
          <div className="p-2 bg-amber-500/10 rounded text-amber-600">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-amber-600">{excusedCount}</span>
          <span className="text-xs text-text-muted font-semibold">أطباء</span>
        </div>
      </div>
    </section>
  )
}
