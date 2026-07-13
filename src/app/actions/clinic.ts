'use server'

import { prisma } from '@/lib/prisma'
import { AttendanceStatus } from '@prisma/client'
import { revalidatePath } from 'next/cache'

// Helper to parse "YYYY-MM-DD" into a local midnight Date object
function parseDateString(dateStr: string) {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day, 0, 0, 0, 0)
}

/**
 * Fetches all clinic data needed for the dashboard:
 * - Doctors
 * - Schedules (ordered by day of week)
 * - Timesheet records for the selected date
 * - Month-to-date presence counts for each doctor
 */
export async function getClinicDashboardData(dateStr: string) {
  try {
    const targetDate = parseDateString(dateStr)

    // Start of current month, end of current month
    const startOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1, 0, 0, 0, 0)
    const endOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0, 23, 59, 59, 999)

    // 1. Fetch doctors and schedules
    const doctors = await prisma.doctor.findMany({
      include: {
        schedules: {
          orderBy: {
            dayOfWeek: 'asc',
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })

    // 2. Fetch timesheets for target date
    const timeSheets = await prisma.timeSheet.findMany({
      where: {
        date: targetDate,
      },
    })

    // 3. Fetch all PRESENT timesheets in this month for all doctors
    const monthlyPresentSheets = await prisma.timeSheet.findMany({
      where: {
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        status: AttendanceStatus.PRESENT,
        checkInTime: {
          not: null, // Verified presence
        },
      },
      select: {
        doctorId: true,
      },
    })

    // Count present days per doctor
    const monthlyPresentCounts: Record<string, number> = {}
    doctors.forEach((doc) => {
      monthlyPresentCounts[doc.id] = 0
    })
    monthlyPresentSheets.forEach((sheet) => {
      if (monthlyPresentCounts[sheet.doctorId] !== undefined) {
        monthlyPresentCounts[sheet.doctorId]++
      }
    })

    return {
      success: true,
      doctors,
      timeSheets,
      monthlyPresentCounts,
    }
  } catch (error: any) {
    console.error('Error fetching clinic dashboard data:', error)
    return {
      success: false,
      error: error.message || 'Failed to load clinic data',
      doctors: [],
      timeSheets: [],
      monthlyPresentCounts: {},
    }
  }
}

/**
 * Logs a doctor's check-in for the selected date
 */
export async function checkInDoctor(doctorId: string, dateStr: string) {
  try {
    const date = parseDateString(dateStr)
    const now = new Date()

    // Align checkInTime to the target date's actual day but current hour/minute/second
    const checkInTime = new Date(date)
    checkInTime.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds())

    await prisma.timeSheet.upsert({
      where: {
        doctorId_date: {
          doctorId,
          date,
        },
      },
      update: {
        checkInTime,
        status: AttendanceStatus.PRESENT,
      },
      create: {
        doctorId,
        date,
        checkInTime,
        status: AttendanceStatus.PRESENT,
      },
    })

    revalidatePath('/dashboard')
    return { success: true }
  } catch (error: any) {
    console.error('Error in checkInDoctor:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Logs a doctor's check-out for the selected date
 */
export async function checkOutDoctor(doctorId: string, dateStr: string) {
  try {
    const date = parseDateString(dateStr)
    const now = new Date()

    // Align checkOutTime to the target date's actual day but current hour/minute/second
    const checkOutTime = new Date(date)
    checkOutTime.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds())

    await prisma.timeSheet.update({
      where: {
        doctorId_date: {
          doctorId,
          date,
        },
      },
      data: {
        checkOutTime,
      },
    })

    revalidatePath('/dashboard')
    return { success: true }
  } catch (error: any) {
    console.error('Error in checkOutDoctor:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Manually updates the attendance status (PRESENT, ABSENT, EXCUSED)
 */
export async function updateAttendanceStatus(
  doctorId: string,
  dateStr: string,
  status: AttendanceStatus
) {
  try {
    const date = parseDateString(dateStr)

    if (status === AttendanceStatus.PRESENT) {
      // If setting to present, default check-in to current time
      const now = new Date()
      const checkInTime = new Date(date)
      checkInTime.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds())

      await prisma.timeSheet.upsert({
        where: {
          doctorId_date: {
            doctorId,
            date,
          },
        },
        update: {
          status,
          checkInTime,
          checkOutTime: null,
        },
        create: {
          doctorId,
          date,
          status,
          checkInTime,
        },
      })
    } else {
      // If setting to absent/excused, clear times
      await prisma.timeSheet.upsert({
        where: {
          doctorId_date: {
            doctorId,
            date,
          },
        },
        update: {
          status,
          checkInTime: null,
          checkOutTime: null,
        },
        create: {
          doctorId,
          date,
          status,
          checkInTime: null,
          checkOutTime: null,
        },
      })
    }

    revalidatePath('/dashboard')
    return { success: true }
  } catch (error: any) {
    console.error('Error in updateAttendanceStatus:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Creates a new doctor in the clinic database
 */
export async function createDoctor(name: string, specialty: string, contactDetails?: string) {
  try {
    const doctor = await prisma.doctor.create({
      data: {
        name,
        specialty,
        contactDetails: contactDetails || null,
      },
    })

    revalidatePath('/dashboard')
    return { success: true, doctor }
  } catch (error: any) {
    console.error('Error creating doctor:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Creates a new schedule for a doctor
 */
export async function createSchedule(
  doctorId: string,
  dayOfWeek: number,
  startTime: string,
  endTime: string,
  roomNumber?: string,
  maxPatients = 20
) {
  try {
    const schedule = await prisma.schedule.create({
      data: {
        doctorId,
        dayOfWeek,
        startTime,
        endTime,
        roomNumber: roomNumber || null,
        maxPatients,
      },
    })

    revalidatePath('/dashboard')
    return { success: true, schedule }
  } catch (error: any) {
    console.error('Error creating schedule:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Updates a doctor's profile data
 */
export async function updateDoctor(
  id: string,
  name: string,
  specialty: string,
  contactDetails?: string
) {
  try {
    const doctor = await prisma.doctor.update({
      where: { id },
      data: {
        name,
        specialty,
        contactDetails: contactDetails || null,
      },
    })
    revalidatePath('/dashboard')
    return { success: true, doctor }
  } catch (error: any) {
    console.error('Error updating doctor:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Deletes a doctor from the clinic database (cascades schedules/timesheets)
 */
export async function deleteDoctor(id: string) {
  try {
    await prisma.doctor.delete({
      where: { id },
    })
    revalidatePath('/dashboard')
    return { success: true }
  } catch (error: any) {
    console.error('Error deleting doctor:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Updates an existing schedule slot
 */
export async function updateSchedule(
  id: string,
  dayOfWeek: number,
  startTime: string,
  endTime: string,
  roomNumber?: string,
  maxPatients = 20
) {
  try {
    const schedule = await prisma.schedule.update({
      where: { id },
      data: {
        dayOfWeek,
        startTime,
        endTime,
        roomNumber: roomNumber || null,
        maxPatients,
      },
    })
    revalidatePath('/dashboard')
    return { success: true, schedule }
  } catch (error: any) {
    console.error('Error updating schedule:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Deletes an existing schedule slot
 */
export async function deleteSchedule(id: string) {
  try {
    await prisma.schedule.delete({
      where: { id },
    })
    revalidatePath('/dashboard')
    return { success: true }
  } catch (error: any) {
    console.error('Error deleting schedule:', error)
    return { success: false, error: error.message }
  }
}

