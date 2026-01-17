'use client'

import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  Tooltip,
  Cell,
} from 'recharts'

import { getCategoryColorClasses } from '@/lib/categoryColors'
import { getCategoryColorHex } from '@/lib/categoryColors'

interface FrequencyChartProps {
  data: Record<string, number>
}

export default function FrequencyChart({ data }: FrequencyChartProps) {
  const chartData = Object.entries(data).map(([label, count]) => ({
    label,
    count,
  }))

  if (chartData.length === 0) {
    return (
      <p className="text-sm text-zinc-500">
        Not enough data yet.
      </p>
    )
  }

  return (
    <div className="h-52 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 px-4 py-3">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          {/* Category labels underneath */}
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />

          {/* Tooltip (simple) */}
          <Tooltip
            cursor={{ fill: 'transparent' }}
            contentStyle={{
              borderRadius: 8,
              borderColor: '#e5e7eb',
              fontSize: 12,
            }}
          />

          {/* Bars */}
          <Bar dataKey="count" radius={[8, 8, 0, 0]}>
            {chartData.map((entry) => (
              <Cell
                key={entry.label}
                fill={getCategoryColorHex(entry.label)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
