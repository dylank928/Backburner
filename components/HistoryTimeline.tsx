'use client'

import { useState, useMemo } from 'react'
import { ExcuseLog } from '@prisma/client'
import { GroupedLog, groupLogsByDate, getRepeatedCategories } from '@/lib/history'
import { getCategoryColorClasses } from '@/lib/categoryColors'
import { HistoryItem } from '@/components/history/HistoryItem'

interface HistoryTimelineProps {
  logs: ExcuseLog[]
  categories: string[]
}

export default function HistoryTimeline({ logs, categories }: HistoryTimelineProps) {
  
  const hasLogs = logs.length > 0

  const groupedLogs = useMemo(() => {
    return groupLogsByDate(logs)
  }, [logs])

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
      
      {/* Filtered Results */}
      {groupedLogs.length === 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300">
            No patterns yet — just observations.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
  {groupedLogs.map((group) => (
    <section key={group.date.toISOString()} className="space-y-3">
      {/* Date Label */}
        <p className="text-xs text-zinc-400 uppercase tracking-wide">
          {group.dateLabel}
        </p>

          {/* Entries */}
          <div className="space-y-3">
            {group.logs.map((log) => (
              <HistoryItem
                key={log.id}
                category={log.excuseCategory}
                task={log.intendedTask}
                note={log.note}
                date={log.date}
              />
            ))}
             </div>
          </section>
        ))}
      </div>
      )}
    </div>
  )
}
