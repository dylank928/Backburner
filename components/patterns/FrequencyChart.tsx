'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface FrequencyChartProps {
  data: Record<string, number>
}

export default function FrequencyChart({ data }: FrequencyChartProps) {
  // Transform the data into an array of objects
  const chartData = Object.entries(data).map(([category, count]) => ({
    category,
    count,
  }))

  // Display a message if there are fewer than 3 data points
  if (chartData.length < 3) {
    return (
      <p className="text-sm text-muted-foreground">
        Patterns emerge over time.
      </p>
    )
  }

  // Render the bar chart
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis dataKey="category" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar
            dataKey="count"
            fill="#64748b" // Neutral slate color
            radius={[4, 4, 0, 0]} // Rounded corners for the top of bars
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}