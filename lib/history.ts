import { format, startOfDay } from 'date-fns'
import { ExcuseLog } from '@prisma/client'

export interface GroupedLog {
  date: Date
  dateLabel: string
  logs: ExcuseLog[]
}

/**
 * Groups ExcuseLog entries by calendar date
 * @param logs Array of ExcuseLog entries (should be sorted by date desc)
 * @returns Array of GroupedLog objects, each containing a date header and logs for that date
 */
export function groupLogsByDate(logs: ExcuseLog[]): GroupedLog[] {
  const groupedMap = new Map<string, ExcuseLog[]>()
  
  // Group logs by date (using normalized date as key)
  for (const log of logs) {
    const normalizedDate = startOfDay(log.date)
    const dateKey = normalizedDate.toISOString()
    
    if (!groupedMap.has(dateKey)) {
      groupedMap.set(dateKey, [])
    }
    groupedMap.get(dateKey)!.push(log)
  }
  
  // Convert map to array and format dates
  const grouped: GroupedLog[] = Array.from(groupedMap.entries()).map(([dateKey, logsForDate]) => {
    const date = new Date(dateKey)
    
    // Format date as "Monday, Jan 15" (e.g., "Monday, Jan 15")
    const dateLabel = format(date, 'EEEE, MMM d')
    
    return {
      date,
      dateLabel,
      logs: logsForDate,
    }
  })
  
  // Sort by date descending (most recent first)
  grouped.sort((a, b) => b.date.getTime() - a.date.getTime())
  
  return grouped
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
