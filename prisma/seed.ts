import { PrismaClient, AttendanceStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seeding...')

  // Clear existing data
  await prisma.timeSheet.deleteMany({})
  await prisma.schedule.deleteMany({})
  await prisma.doctor.deleteMany({})

  console.log('Cleared existing data.')

  // Seed Doctors
  const doctor1 = await prisma.doctor.create({
    data: {
      name: 'دكتور أحمد سليمان',
      specialty: 'عظام',
      contactDetails: '01012345678',
    },
  })

  const doctor2 = await prisma.doctor.create({
    data: {
      name: 'دكتورة سارة ممدوح',
      specialty: 'باطنة',
      contactDetails: '01198765432',
    },
  })

  const doctor3 = await prisma.doctor.create({
    data: {
      name: 'دكتور محمد علي',
      specialty: 'أطفال',
      contactDetails: '01234567890',
    },
  })

  const doctor4 = await prisma.doctor.create({
    data: {
      name: 'دكتورة رانيا الشافعي',
      specialty: 'جلدية',
      contactDetails: '01555667788',
    },
  })

  console.log('Seeded doctors.')

  // Seed Schedules
  // 0 = Sunday, 1 = Monday, 2 = Tuesday, 3 = Wednesday, 4 = Thursday, 5 = Friday, 6 = Saturday
  await prisma.schedule.createMany({
    data: [
      // Dr. Ahmed (Orthopedics) - Monday & Wednesday 14:00 to 18:00
      {
        doctorId: doctor1.id,
        dayOfWeek: 1,
        startTime: '14:00',
        endTime: '18:00',
        roomNumber: '101',
        maxPatients: 15,
      },
      {
        doctorId: doctor1.id,
        dayOfWeek: 3,
        startTime: '14:00',
        endTime: '18:00',
        roomNumber: '101',
        maxPatients: 15,
      },
      // Dr. Sarah (Internal Medicine) - Sunday & Tuesday 10:00 to 14:00
      {
        doctorId: doctor2.id,
        dayOfWeek: 0,
        startTime: '10:00',
        endTime: '14:00',
        roomNumber: '202',
        maxPatients: 20,
      },
      {
        doctorId: doctor2.id,
        dayOfWeek: 2,
        startTime: '10:00',
        endTime: '14:00',
        roomNumber: '202',
        maxPatients: 20,
      },
      // Dr. Mohamed (Pediatrics) - Saturday & Thursday 16:00 to 20:00
      {
        doctorId: doctor3.id,
        dayOfWeek: 6,
        startTime: '16:00',
        endTime: '20:00',
        roomNumber: '105',
        maxPatients: 25,
      },
      {
        doctorId: doctor3.id,
        dayOfWeek: 4,
        startTime: '16:00',
        endTime: '20:00',
        roomNumber: '105',
        maxPatients: 25,
      },
      // Dr. Rania (Dermatology) - Tuesday & Thursday 12:00 to 16:00
      {
        doctorId: doctor4.id,
        dayOfWeek: 2,
        startTime: '12:00',
        endTime: '16:00',
        roomNumber: '301',
        maxPatients: 12,
      },
      {
        doctorId: doctor4.id,
        dayOfWeek: 4,
        startTime: '12:00',
        endTime: '16:00',
        roomNumber: '301',
        maxPatients: 12,
      },
    ],
  })

  console.log('Seeded schedules.')

  // Seed Timesheets for current week
  const today = new Date()
  const formatDate = (daysOffset: number) => {
    const d = new Date()
    d.setDate(today.getDate() - daysOffset)
    d.setHours(0, 0, 0, 0)
    return d
  }

  // Dr. Ahmed - Present yesterday and today check-in
  await prisma.timeSheet.create({
    data: {
      doctorId: doctor1.id,
      date: formatDate(1),
      checkInTime: new Date(formatDate(1).getTime() + 14 * 60 * 60 * 1000 + 5 * 60 * 1000), // 14:05
      checkOutTime: new Date(formatDate(1).getTime() + 18 * 60 * 60 * 1000 - 10 * 60 * 1000), // 17:50
      status: AttendanceStatus.PRESENT,
    },
  })

  await prisma.timeSheet.create({
    data: {
      doctorId: doctor1.id,
      date: formatDate(0),
      checkInTime: new Date(formatDate(0).getTime() + 13 * 60 * 60 * 1000 + 55 * 60 * 1000), // 13:55 (checked in early)
      status: AttendanceStatus.PRESENT,
    },
  })

  // Dr. Sarah - Absent 2 days ago, Present today (fully checked out)
  await prisma.timeSheet.create({
    data: {
      doctorId: doctor2.id,
      date: formatDate(2),
      status: AttendanceStatus.ABSENT,
    },
  })

  await prisma.timeSheet.create({
    data: {
      doctorId: doctor2.id,
      date: formatDate(0),
      checkInTime: new Date(formatDate(0).getTime() + 9 * 60 * 60 * 1000 + 58 * 60 * 1000), // 09:58
      checkOutTime: new Date(formatDate(0).getTime() + 14 * 60 * 60 * 1000 + 15 * 60 * 1000), // 14:15
      status: AttendanceStatus.PRESENT,
    },
  })

  // Dr. Mohamed - Excused yesterday
  await prisma.timeSheet.create({
    data: {
      doctorId: doctor3.id,
      date: formatDate(1),
      status: AttendanceStatus.EXCUSED,
    },
  })

  console.log('Seeded timesheets.')
  console.log('Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
