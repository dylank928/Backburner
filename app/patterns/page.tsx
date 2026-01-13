import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { getOrCreateUser } from '@/lib/auth'
import {
  getExcuseFrequency,
  getTopExcusesThisWeek,
  getExcusesByWeekday,
  getRepeatedExcuses,
} from '@/lib/analytics'
import Header from '@/components/Header'
import PatternCard from '@/components/PatternCard'
import PatternsClient from './PatternsClient'

export default async function PatternsPage() {
  const DEV_BYPASS_AUTH = process.env.DEV_BYPASS_AUTH === 'true'
  
  if (!DEV_BYPASS_AUTH) {
    const { userId } = await auth()
    
    if (!userId) {
      redirect('/sign-in')
    }
  }

  const user = await getOrCreateUser()
  
  const [frequency, topThisWeek, weekdayPatterns, repeated] = await Promise.all([
    getExcuseFrequency(user.id),
    getTopExcusesThisWeek(user.id),
    getExcusesByWeekday(user.id),
    getRepeatedExcuses(user.id, 2),
  ])

  const mostCommonExcuse = frequency[0]
  const mostDeferredDay = weekdayPatterns[0]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Patterns
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Behavioral insights from your deferred tasks
          </p>
        </div>

        <div className="space-y-8">
          {/* Pattern Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mostCommonExcuse && (
              <PatternCard
                title="Most backburned reason"
                value={mostCommonExcuse.category}
                description={`Appeared ${mostCommonExcuse.count} time${mostCommonExcuse.count !== 1 ? 's' : ''}`}
              />
            )}
            {mostDeferredDay && (
              <PatternCard
                title="Most deferred day"
                value={mostDeferredDay.weekday}
                description={`${mostDeferredDay.count} task${mostDeferredDay.count !== 1 ? 's' : ''} deferred`}
              />
            )}
          </div>

          {/* Charts */}
          <PatternsClient
            frequency={frequency}
            topThisWeek={topThisWeek}
            weekdayPatterns={weekdayPatterns}
            repeated={repeated}
          />
        </div>
      </main>
    </div>
  )
}
