'use client'

import React, { useState, useEffect } from 'react'
import { Sparkles, Calendar, Plus, Search } from 'lucide-react'
import {
  getClinicDashboardData,
  checkInDoctor,
  checkOutDoctor,
  updateAttendanceStatus,
  createDoctor,
  createSchedule,
  updateDoctor,
  deleteDoctor,
  updateSchedule,
  deleteSchedule,
} from '@/app/actions/clinic'

import StatsCards from '@/components/dashboard/StatsCards'
import FiltersMatrix from '@/components/dashboard/FiltersMatrix'
import ScheduleList from '@/components/dashboard/ScheduleList'
import AttendanceLedger from '@/components/dashboard/AttendanceLedger'
import AddDoctorModal from '@/components/dashboard/AddDoctorModal'
import AddScheduleModal from '@/components/dashboard/AddScheduleModal'
import EditDoctorModal from '@/components/dashboard/EditDoctorModal'
import EditScheduleModal from '@/components/dashboard/EditScheduleModal'
import CommandPalette from '@/components/CommandPalette'
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

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  })

  // Data states
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [timeSheets, setTimeSheets] = useState<any[]>([])
  const [monthlyPresentCounts, setMonthlyPresentCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filtering states
  const [searchQuery, setSearchQuery] = useState('')
  const [filterSpecialty, setFilterSpecialty] = useState<string>('ALL')
  const [filterDay, setFilterDay] = useState<string>('ALL')

  // Modals and Command Palette states
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)
  const [isAddDoctorOpen, setIsAddDoctorOpen] = useState(false)
  const [isAddScheduleOpen, setIsAddScheduleOpen] = useState(false)

  // Edit Doctor & Schedule states
  const [isEditDoctorOpen, setIsEditDoctorOpen] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null)
  const [isEditScheduleOpen, setIsEditScheduleOpen] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null)
  const [editingScheduleDoctorName, setEditingScheduleDoctorName] = useState('')

  // Fetch all dashboard data
  const fetchData = async () => {
    setLoading(true)
    setError(null)
    const result = await getClinicDashboardData(selectedDate)
    if (result.success) {
      setDoctors(result.doctors as any[])
      setTimeSheets(result.timeSheets)
      setMonthlyPresentCounts(result.monthlyPresentCounts)
    } else {
      setError(result.error || 'فشل في تحميل البيانات')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [selectedDate])

  // Global Ctrl+K trigger for Command Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setIsCommandPaletteOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Fast Check-In Handlers
  const handleCheckIn = async (doctorId: string) => {
    const res = await checkInDoctor(doctorId, selectedDate)
    if (res.success) {
      fetchData()
    } else {
      alert('حدث خطأ أثناء تسجيل الدخول: ' + res.error)
    }
  }

  const handleCheckOut = async (doctorId: string) => {
    const res = await checkOutDoctor(doctorId, selectedDate)
    if (res.success) {
      fetchData()
    } else {
      alert('حدث خطأ أثناء تسجيل الخروج: ' + res.error)
    }
  }

  const handleUpdateStatus = async (doctorId: string, status: AttendanceStatus) => {
    const res = await updateAttendanceStatus(doctorId, selectedDate, status)
    if (res.success) {
      fetchData()
    } else {
      alert('حدث خطأ أثناء تحديث الحالة: ' + res.error)
    }
  }

  // Create Doctor
  const handleCreateDoctor = async (name: string, specialty: string, contactDetails: string) => {
    const res = await createDoctor(name, specialty, contactDetails)
    if (res.success) {
      fetchData()
    } else {
      alert('خطأ أثناء إضافة الطبيب: ' + res.error)
    }
  }

  // Create Schedule
  const handleCreateSchedule = async (
    doctorId: string,
    dayOfWeek: number,
    startTime: string,
    endTime: string,
    roomNumber: string,
    maxPatients: number
  ) => {
    const res = await createSchedule(doctorId, dayOfWeek, startTime, endTime, roomNumber, maxPatients)
    if (res.success) {
      fetchData()
    } else {
      alert('خطأ أثناء إضافة الموعد: ' + res.error)
    }
  }

  // Edit Doctor triggers & actions
  const handleTriggerEditDoctor = (doctor: Doctor) => {
    setEditingDoctor(doctor)
    setIsEditDoctorOpen(true)
  }

  const handleUpdateDoctor = async (id: string, name: string, specialty: string, contactDetails: string) => {
    const res = await updateDoctor(id, name, specialty, contactDetails)
    if (res.success) {
      fetchData()
    } else {
      alert('خطأ أثناء تعديل الطبيب: ' + res.error)
    }
  }

  const handleDeleteDoctor = async (id: string) => {
    const res = await deleteDoctor(id)
    if (res.success) {
      fetchData()
    } else {
      alert('خطأ أثناء حذف الطبيب: ' + res.error)
    }
  }

  // Edit Schedule triggers & actions
  const handleTriggerEditSchedule = (schedule: Schedule, doctorName: string) => {
    setEditingSchedule(schedule)
    setEditingScheduleDoctorName(doctorName)
    setIsEditScheduleOpen(true)
  }

  const handleUpdateSchedule = async (
    id: string,
    dayOfWeek: number,
    startTime: string,
    endTime: string,
    roomNumber: string,
    maxPatients: number
  ) => {
    const res = await updateSchedule(id, dayOfWeek, startTime, endTime, roomNumber, maxPatients)
    if (res.success) {
      fetchData()
    } else {
      alert('خطأ أثناء تعديل الموعد: ' + res.error)
    }
  }

  const handleDeleteSchedule = async (id: string) => {
    const res = await deleteSchedule(id)
    if (res.success) {
      fetchData()
    } else {
      alert('خطأ أثناء حذف الموعد: ' + res.error)
    }
  }

  // Get list of unique specialties for filtering
  const specialties = ['ALL', ...Array.from(new Set(doctors.map((d) => d.specialty)))]

  // Filter doctors and schedules
  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesSpecialty = filterSpecialty === 'ALL' || doc.specialty === filterSpecialty

    const matchesDay =
      filterDay === 'ALL' || doc.schedules.some((s) => s.dayOfWeek.toString() === filterDay)

    return matchesSearch && matchesSpecialty && matchesDay
  })

  // Stats calculation
  const totalDoctorsCount = doctors.length
  const checkedInTodayCount = timeSheets.filter(
    (t) => t.status === 'PRESENT' && t.checkInTime !== null
  ).length
  const absentTodayCount = timeSheets.filter((t) => t.status === 'ABSENT').length
  const excusedTodayCount = timeSheets.filter((t) => t.status === 'EXCUSED').length

  // Find day index of selected date (0 = Sunday, 1 = Monday...)
  const selectedDayIndex = new Date(selectedDate).getDay()

  return (
    <div className="flex-1 bg-background-canvas text-text-base min-h-screen font-sans selection:bg-primary-sage/20">
      {/* Top Navigation */}
      <header className="border-b border-border-precision bg-white sticky top-0 z-30 shadow-[0_2px_10px_rgba(15,23,42,0.02)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="text-right">
              <h1 className="text-lg font-extrabold tracking-tight text-text-base">
                منظومة الاستقبال والعيادات
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            {/* Wide Interactive Ctrl+K Search Bar */}
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="flex items-center justify-between gap-3 bg-slate-50 hover:bg-slate-100/80 border border-border-precision hover:border-slate-300 px-4 py-2 rounded-xl text-xs text-text-muted font-bold transition-all cursor-pointer w-full sm:w-72 md:w-[360px] lg:w-[420px] shadow-2xs group"
              dir="rtl"
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-sky-600 group-hover:scale-110 transition-transform" />
                <span className="text-slate-500 font-bold">البحث السريع (الأطباء، المواعيد...)...</span>
              </div>
              <kbd className="px-2 py-0.5 bg-white rounded-md border border-slate-200 text-slate-700 font-mono text-[10px] font-extrabold shadow-2xs">Ctrl+K</kbd>
            </button>

            {/* Date Input */}
            <div className="flex items-center bg-white border border-border-precision rounded-lg px-3.5 py-1.5 focus-within:border-accent-cerulean focus-within:ring-1 focus-within:ring-accent-cerulean transition-all">
              <Calendar className="w-4 h-4 text-primary-blue ml-2" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent border-none outline-none text-xs text-text-base w-32 text-center select-none cursor-pointer font-bold"
              />
            </div>

            <button
              onClick={() => setIsAddDoctorOpen(true)}
              className="bg-white hover:bg-slate-50 text-text-base border border-border-precision transition-all px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4 text-primary-blue" />
              <span>إضافة طبيب</span>
            </button>

            <button
              onClick={() => setIsAddScheduleOpen(true)}
              className="bg-primary-blue hover:bg-primary-blue-hover text-white transition-all shadow-[0_4px_12px_rgba(30,58,138,0.15)] px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              <span>جدولة موعد</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" dir="rtl">
        {/* Stats Grid Component */}
        <StatsCards
          totalDoctors={totalDoctorsCount}
          presentCount={checkedInTodayCount}
          absentCount={absentTodayCount}
          excusedCount={excusedTodayCount}
        />

        {/* Filters Matrix Component */}
        <FiltersMatrix
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterSpecialty={filterSpecialty}
          setFilterSpecialty={setFilterSpecialty}
          filterDay={filterDay}
          setFilterDay={setFilterDay}
          specialties={specialties}
        />

        {/* Loading and Main Panels */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-4 border-border-warm border-t-primary-sage animate-spin" />
            </div>
            <p className="text-sm text-text-muted animate-pulse font-medium">جاري تحميل بيانات العيادة الحالية...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Panel: Schedules */}
            <div className="lg:col-span-7">
              <ScheduleList
                doctors={filteredDoctors}
                selectedDayIndex={selectedDayIndex}
                onEditDoctor={handleTriggerEditDoctor}
                onEditSchedule={handleTriggerEditSchedule}
              />
            </div>

            {/* Right Panel: Attendance Ledger */}
            <div className="lg:col-span-5">
              <AttendanceLedger
                doctors={doctors}
                timeSheets={timeSheets}
                monthlyPresentCounts={monthlyPresentCounts}
                selectedDayIndex={selectedDayIndex}
                selectedDate={selectedDate}
                onCheckIn={handleCheckIn}
                onCheckOut={handleCheckOut}
                onUpdateStatus={handleUpdateStatus}
              />
            </div>
          </div>
        )}
      </main>

      {/* Add Doctor Modal Component */}
      <AddDoctorModal
        isOpen={isAddDoctorOpen}
        onClose={() => setIsAddDoctorOpen(false)}
        onSubmit={handleCreateDoctor}
      />

      {/* Add Schedule Modal Component */}
      <AddScheduleModal
        isOpen={isAddScheduleOpen}
        onClose={() => setIsAddScheduleOpen(false)}
        doctors={doctors}
        onSubmit={handleCreateSchedule}
      />

      {/* Edit Doctor Modal Component */}
      <EditDoctorModal
        isOpen={isEditDoctorOpen}
        onClose={() => {
          setIsEditDoctorOpen(false)
          setEditingDoctor(null)
        }}
        doctor={editingDoctor}
        onSubmit={handleUpdateDoctor}
        onDelete={handleDeleteDoctor}
      />

      {/* Edit Schedule Modal Component */}
      <EditScheduleModal
        isOpen={isEditScheduleOpen}
        onClose={() => {
          setIsEditScheduleOpen(false)
          setEditingSchedule(null)
        }}
        schedule={editingSchedule}
        doctorName={editingScheduleDoctorName}
        onSubmit={handleUpdateSchedule}
        onDelete={handleDeleteSchedule}
      />

      {/* Spotlight Command Palette Component */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        doctors={doctors}
        onCheckIn={handleCheckIn}
      />
    </div>
  )
}
