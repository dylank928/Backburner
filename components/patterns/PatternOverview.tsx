import { AnalyticsResult } from '@/lib/analytics'
import { PatternCard } from './PatternCard'
import FrequencyChart from './FrequencyChart'

interface PatternOverviewProps {
  data: AnalyticsResult
}

export function PatternOverview({ data }: PatternOverviewProps) {
  const cards = []

  // Most backburned reason (last 7 days)
  if (data.last7Days.topCategory) {
    cards.push({
      label: 'Most backburned reason',
      value: data.last7Days.topCategory,
      description: 'Appears frequently this week',
    })
  }

  // Most deferred day (last 30 days)
  const weekdayEntries = Object.entries(data.last30Days.byWeekday)
  if (weekdayEntries.length > 0) {
    const [topDay] = weekdayEntries.sort((a, b) => b[1] - a[1])
    cards.push({
      label: 'Most deferred day',
      value: topDay[0],
      description: 'Based on recent entries',
    })
  }

  // Repeated excuses
  if (data.last30Days.repeatedCategories.length > 0) {
    cards.push({
      label: 'Recurring pattern',
      value: data.last30Days.repeatedCategories.join(', '),
      description: 'These reasons appear repeatedly',
    })
  }

  const hasEnoughData =
    Object.keys(data.last30Days.frequencyByCategory).length >= 3

  return (
    <section className="space-y-8">
      {/* Frequency Chart */}
      <div>
        <h2 className="text-sm font-medium text-zinc-500 mb-2">
          Frequency (last 30 days)
        </h2>

        <FrequencyChart data={data.last30Days.frequencyByCategory} />
      </div>

      {/* Pattern Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {cards.length > 0 ? (
          cards.map((card, index) => (
            <PatternCard key={index} {...card} />
          ))
        ) : (
          <PatternCard
            label="Patterns"
            value="Not enough data yet"
            description="Patterns emerge over time"
          />
        )}
      </div>
    </section>
  )
}
