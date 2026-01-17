import { AnalyticsResult } from '@/lib/analytics'
import { PatternCard } from './PatternCard'
import FrequencyChart from './FrequencyChart'

interface PatternOverviewProps {
  data: AnalyticsResult
}

export function PatternOverview({ data }: PatternOverviewProps) {
  const cards: {
    label: string
    value: string
    description: string
    tone?: 'warm' | 'neutral' | 'cool'
  }[] = []

  // ─────────────────────────────
  // Most common reason (last 7 days)
  // ─────────────────────────────
  const top7DayCategory = data.last7Days.topCategory

  if (top7DayCategory) {
    const count =
      data.last7Days.frequencyByCategory?.[top7DayCategory]

    cards.push({
      label: 'Most common reason',
      value: top7DayCategory,
      description: count
        ? `Appeared ${count} times`
        : 'Appears frequently this week',
      tone: 'warm',
    })
  }

  // ─────────────────────────────
  // Most deferred day (last 30 days)
  // ─────────────────────────────
  const weekdayEntries = Object.entries(data.last30Days.byWeekday)

  if (weekdayEntries.length > 0) {
    const [topDay] = weekdayEntries.sort((a, b) => b[1] - a[1])

    cards.push({
      label: 'Most deferred day',
      value: topDay[0],
      description: 'Based on recent entries',
      tone: 'neutral',
    })
  }

  // ─────────────────────────────
  // Recurring patterns (30 days)
  // ─────────────────────────────
  if (data.last30Days.repeatedCategories.length > 0) {
    cards.push({
      label: 'Recurring pattern',
      value: data.last30Days.repeatedCategories.join(', '),
      description: 'Noticed in your recent logs',
      tone: 'cool',
    })
  }

  return (
    <section className="space-y-8">
      {/* Insight Cards */}
      <div className="grid gap-4">
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

      {/* Frequency Chart (30 days) */}
      <div>
        <h2 className="text-sm font-medium text-zinc-500 mb-3">
          Last 30 Days
        </h2>

        <FrequencyChart
          data={data.last30Days.frequencyByCategory}
        />
      </div>
    </section>
  )
}
