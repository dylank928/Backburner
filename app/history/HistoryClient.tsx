'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import ExcuseTag from '@/components/ExcuseTag'
interface LogEntry {
  id: string
  userId: string
  date: string
  intendedTask: string
  excuseCategory: string
  note: string | null
  createdAt: string
}

interface HistoryClientProps {
  logsByDate: Record<string, LogEntry[]>
  repeatedExcuses: string[]
}

export default function HistoryClient({ logsByDate, repeatedExcuses }: HistoryClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  
  // Get all unique categories for filter
  const allCategories = new Set<string>()
  Object.values(logsByDate).forEach((logs) => {
    logs.forEach((log) => allCategories.add(log.excuseCategory))
  })

  // Filter logs
  const filteredLogsByDate = Object.entries(logsByDate).reduce((acc, [date, logs]) => {
    const filtered = selectedCategory === 'all' 
      ? logs 
      : logs.filter((log) => log.excuseCategory === selectedCategory)
    
    if (filtered.length > 0) {
      acc[date] = filtered
    }
    return acc
  }, {} as Record<string, LogEntry[]>)

  const sortedDates = Object.keys(filteredLogsByDate).sort((a, b) => b.localeCompare(a))

  if (sortedDates.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          No entries found for the selected filter.
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Filter */}
      <div className="mb-6">
        <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Filter by excuse category
        </label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
        >
          <option value="all">All categories</option>
          {Array.from(allCategories).sort().map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Timeline */}
      <div className="space-y-6">
        {sortedDates.map((dateKey) => {
          const logs = filteredLogsByDate[dateKey]
          const date = new Date(dateKey + 'T00:00:00')
          
          return (
            <div
              key={dateKey}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {format(date, 'EEEE, MMMM d, yyyy')}
              </h3>
              
              <div className="space-y-4">
                {logs.map((log) => {
                  const isRepeated = repeatedExcuses.includes(log.excuseCategory)
                  
                  return (
                    <div key={log.id} className="border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                      <p className="text-base font-medium text-gray-900 dark:text-gray-100 mb-1">
                        {log.intendedTask}
                      </p>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Deferred due to:
                        </span>
                        <ExcuseTag 
                          category={log.excuseCategory}
                          showRepeated={isRepeated}
                        />
                      </div>
                      {log.note && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 italic mt-2">
                          {log.note}
                        </p>
                      )}
                      {isRepeated && (
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 italic">
                          You&apos;ve logged this before.
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
