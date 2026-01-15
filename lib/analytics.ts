import { startOfDay, subDays, getDay } from 'date-fns'
import { ExcuseLog } from '@prisma/client'

export interface AnalyticsResult {
  last30Days: {
    frequencyByCategory: Record<string, number>
    byWeekday: Record<string, number>
    repeatedCategories: string[]
  }
  last7Days: {
    frequencyByCategory: Record<string, number>
    byWeekday: Record<string, number>
    topCategory: string | null
    repeatedCategories: string[]
  }
}

export function analyzeLogs(logs: ExcuseLog[]): AnalyticsResult {
  const today = startOfDay(new Date())
  const last30DaysStart = startOfDay(subDays(today, 30))
  const last7DaysStart = startOfDay(subDays(today, 7))

  const last30DaysLogs = logs.filter(log => log.date >= last30DaysStart)
  const last7DaysLogs = logs.filter(log => log.date >= last7DaysStart)

  // Helper function to calculate frequency by category
  const calculateFrequencyByCategory = (logs: ExcuseLog[]) => {
    const frequency: Record<string, number> = {}
    for (const log of logs) {
      frequency[log.excuseCategory] = (frequency[log.excuseCategory] || 0) + 1
    }
    return frequency
  }

  // Helper function to calculate logs by weekday
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const calculateByWeekday = (logs: ExcuseLog[]) => {
    const weekdayCounts: Record<string, number> = {}
    for (const log of logs) {
      const weekday = weekdays[getDay(log.date)] // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      weekdayCounts[weekday] = (weekdayCounts[weekday] || 0) + 1
    }
    return weekdayCounts
  }

  // Helper function to find repeated categories
  const findRepeatedCategories = (frequency: Record<string, number>) => {
    return Object.entries(frequency)
      .filter(([_, count]) => count > 2)
      .map(([category]) => category)
  }

  // Calculate insights for last 30 days
  const last30DaysFrequency = calculateFrequencyByCategory(last30DaysLogs)
  const last30DaysByWeekday = calculateByWeekday(last30DaysLogs)
  const last30DaysRepeatedCategories = findRepeatedCategories(last30DaysFrequency)

  // Calculate insights for last 7 days
  const last7DaysFrequency = calculateFrequencyByCategory(last7DaysLogs)
  const last7DaysByWeekday = calculateByWeekday(last7DaysLogs)
  const last7DaysRepeatedCategories = findRepeatedCategories(last7DaysFrequency)

  // Find the top category in the last 7 days
  const topThisWeek = Object.entries(last7DaysFrequency).reduce<{ excuseCategory: string; count: number }>(
    (top, [excuseCategory, count]) => (Number(count) > top.count ? { excuseCategory, count: Number(count) } : top),
    { excuseCategory: '', count: 0 }
  ).excuseCategory

  // Return insights for both time periods
  return {
    last30Days: {
      frequencyByCategory: last30DaysFrequency,
      byWeekday: last30DaysByWeekday,
      repeatedCategories: last30DaysRepeatedCategories,
    },
    last7Days: {
      frequencyByCategory: last7DaysFrequency,
      byWeekday: last7DaysByWeekday,
      topCategory: topThisWeek,
      repeatedCategories: last7DaysRepeatedCategories,
    },
  }
}