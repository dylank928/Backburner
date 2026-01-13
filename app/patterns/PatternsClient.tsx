'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import ExcuseTag from '@/components/ExcuseTag'

interface Frequency {
  category: string
  count: number
}

interface WeekdayPattern {
  weekday: string
  count: number
}

interface PatternsClientProps {
  frequency: Frequency[]
  topThisWeek: Frequency[]
  weekdayPatterns: WeekdayPattern[]
  repeated: string[]
}

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444', '#6366f1', '#14b8a6']

export default function PatternsClient({
  frequency,
  topThisWeek,
  weekdayPatterns,
  repeated,
}: PatternsClientProps) {
  return (
    <div className="space-y-8">
      {/* Excuse Frequency Chart */}
      {frequency.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Excuse frequency
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={frequency}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="category"
                angle={-45}
                textAnchor="end"
                height={100}
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Top 3 This Week */}
      {topThisWeek.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Top 3 excuses this week
          </h2>
          <div className="flex flex-wrap gap-2">
            {topThisWeek.map((item, index) => (
              <div key={item.category} className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  #{index + 1}
                </span>
                <ExcuseTag category={item.category} count={item.count} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weekday Patterns */}
      {weekdayPatterns.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Excuses by weekday
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weekdayPatterns}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="weekday"
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Repeated Excuses */}
      {repeated.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Repeated excuses (2+ times)
          </h2>
          <div className="flex flex-wrap gap-2">
            {repeated.map((category) => {
              const freq = frequency.find((f) => f.category === category)
              return (
                <ExcuseTag
                  key={category}
                  category={category}
                  count={freq?.count}
                  showRepeated
                />
              )
            })}
          </div>
        </div>
      )}

      {frequency.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Not enough data to show patterns yet. Log a few entries to see insights.
          </p>
        </div>
      )}
    </div>
  )
}
