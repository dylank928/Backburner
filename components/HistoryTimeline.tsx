'use client'

import { useState, useMemo } from 'react'
import { ExcuseLog } from '@prisma/client'
import { GroupedLog, groupLogsByDate, getRepeatedCategories } from '@/lib/history'
import { getCategoryColor } from '@/lib/categoryColors'

interface HistoryTimelineProps {
  logs: ExcuseLog[]
  categories: string[]
}

export default function HistoryTimeline({ logs, categories }: HistoryTimelineProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Filter logs by selected category
  const filteredLogs = useMemo(() => {
    if (!selectedCategory) {
      return logs
    }
    return logs.filter((log) => log.excuseCategory === selectedCategory)
  }, [logs, selectedCategory])

  // Group filtered logs by date
  const groupedLogs = useMemo(() => {
    return groupLogsByDate(filteredLogs)
  }, [filteredLogs])

  // Detect repeated categories in visible (filtered) logs
  const repeatedCategories = useMemo(() => {
    return getRepeatedCategories(filteredLogs)
  }, [filteredLogs])

  const hasLogs = logs.length > 0

  // Edge case: No logs at all
  if (!hasLogs) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8 text-center">
        <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300">
          No patterns yet — just observations.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
            Filter:
          </span>
          {/* All Categories Option */}
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === null
                ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            All categories
          </button>
          {/* Category Pills */}
          {categories.map((category) => {
            const categoryColor = getCategoryColor(category)
            const isSelected = selectedCategory === category
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  isSelected
                    ? `${categoryColor.bg} ${categoryColor.text} ring-2 ring-gray-400 dark:ring-gray-500`
                    : `${categoryColor.bg} ${categoryColor.text} opacity-60 hover:opacity-100`
                }`}
              >
                {category}
              </button>
            )
          })}
        </div>
      </div>

      {/* Filtered Results */}
      {groupedLogs.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8 text-center">
          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300">
            No patterns yet — just observations.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {groupedLogs.map((group) => (
            <div
              key={group.date.toISOString()}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              {/* Date Header */}
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {group.dateLabel}
                </h2>
              </div>

              {/* Logs for this date */}
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {group.logs.map((log) => {
                  const categoryColor = getCategoryColor(log.excuseCategory)
                  return (
                    <div key={log.id} className="px-6 py-4">
                      {/* Intended Task */}
                      <div className="mb-3">
                        <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                          {log.intendedTask}
                        </p>
                      </div>

                      {/* Excuse Category Tag */}
                      <div className="mb-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${categoryColor.bg} ${categoryColor.text}`}
                          >
                            {log.excuseCategory}
                          </span>
                          {repeatedCategories.has(log.excuseCategory) && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 italic">
                              You've logged this excuse before.
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Optional Note */}
                      {log.note && (
                        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                            {log.note}
                          </p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
