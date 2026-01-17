import { format, startOfDay, isToday, isYesterday } from 'date-fns'
import { ExcuseLog } from '@prisma/client'

export interface GroupedLog {
  date: Date
  dateLabel: string
  logs: ExcuseLog[]
}


function getDayLabel(date: Date) {
  if (isToday(date)) return 'Today'
  if (isYesterday(date)) return 'Yesterday'
  return format(date, 'MMMM d, yyyy')
}

/**
 * Groups ExcuseLog entries by calendar date
 * @param logs Array of ExcuseLog entries (should be sorted by date desc)
 * @returns Array of GroupedLog objects, each containing a date header and logs for that date
 */
export function groupLogsByDate(logs: ExcuseLog[]): GroupedLog[] {
  const groups = new Map<string, GroupedLog>()

  logs.forEach((log) => {
    // ✅ Normalize ONLY for grouping key
    const dayKey = startOfDay(log.date).toISOString()

    if (!groups.has(dayKey)) {
      groups.set(dayKey, {
        date: log.date, // ⬅️ KEEP ORIGINAL DATE
        dateLabel: getDayLabel(log.date),
        logs: [],
      })
    }

    groups.get(dayKey)!.logs.push(log)
  })

  return Array.from(groups.values())
}

/**
 * Detects which excuse categories appear more than once in the given logs
 * @param logs Array of ExcuseLog entries
 * @returns Set of category names that appear more than once
 */
export function getRepeatedCategories(logs: ExcuseLog[]): Set<string> {
  const categoryCounts = new Map<string, number>()
  
  // Count occurrences of each category
  for (const log of logs) {
    const count = categoryCounts.get(log.excuseCategory) || 0
    categoryCounts.set(log.excuseCategory, count + 1)
  }
  
  // Return set of categories that appear more than once
  const repeated = new Set<string>()
  Array.from(categoryCounts.entries()).forEach(([category, count]) => {
    if (count > 1) {
      repeated.add(category)
    }
  })
  
  return repeated
}
