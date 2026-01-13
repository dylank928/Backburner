import { prisma } from './prisma'
import { startOfDay, endOfDay, startOfWeek, endOfWeek, format, parseISO } from 'date-fns'

export interface ExcuseFrequency {
  category: string
  count: number
}

export interface WeekdayPattern {
  weekday: string
  count: number
}

export async function getExcuseFrequency(userId: string): Promise<ExcuseFrequency[]> {
  const logs = await prisma.excuseLog.findMany({
    where: { userId },
    select: { excuseCategory: true },
  })

  const frequency: Record<string, number> = {}
  
  logs.forEach((log) => {
    frequency[log.excuseCategory] = (frequency[log.excuseCategory] || 0) + 1
  })

  return Object.entries(frequency)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
}

export async function getTopExcusesThisWeek(userId: string): Promise<ExcuseFrequency[]> {
  const now = new Date()
  const weekStart = startOfWeek(now, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 })

  const logs = await prisma.excuseLog.findMany({
    where: {
      userId,
      date: {
        gte: weekStart,
        lte: weekEnd,
      },
    },
    select: { excuseCategory: true },
  })

  const frequency: Record<string, number> = {}
  
  logs.forEach((log) => {
    frequency[log.excuseCategory] = (frequency[log.excuseCategory] || 0) + 1
  })

  return Object.entries(frequency)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
}

export async function getExcusesByWeekday(userId: string): Promise<WeekdayPattern[]> {
  const logs = await prisma.excuseLog.findMany({
    where: { userId },
    select: { date: true },
  })

  const weekdayCounts: Record<string, number> = {
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
    Saturday: 0,
    Sunday: 0,
  }

  logs.forEach((log) => {
    const weekday = format(log.date, 'EEEE')
    weekdayCounts[weekday] = (weekdayCounts[weekday] || 0) + 1
  })

  return Object.entries(weekdayCounts)
    .map(([weekday, count]) => ({ weekday, count }))
    .sort((a, b) => b.count - a.count)
}

export async function getRepeatedExcuses(userId: string, minCount: number = 2): Promise<string[]> {
  const frequency = await getExcuseFrequency(userId)
  return frequency.filter((item) => item.count >= minCount).map((item) => item.category)
}
