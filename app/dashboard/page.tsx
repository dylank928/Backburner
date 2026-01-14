import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getOrCreateUser } from '@/lib/auth'
import Header from '@/components/Header'
import { startOfDay, endOfDay } from 'date-fns'

export default async function DashboardPage() {
  // Auth is handled by middleware - if we reach here, user is authenticated
  
  // Get or create user in database
  const user = await getOrCreateUser()
  
  // Check if today's log exists
  const todayStart = startOfDay(new Date())
  const todayEnd = endOfDay(new Date())
  
  const todayLog = await prisma.excuseLog.findFirst({
    where: {
      userId: user.id,
      date: {
        gte: todayStart,
        lte: todayEnd,
      },
    },
  })
  
  const hasTodayLog = !!todayLog
  const ctaLabel = hasTodayLog ? "Edit today's entry" : "Log today"
  const ctaAriaLabel = hasTodayLog ? "Edit today's entry" : "Log today"

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track what gets deferred and notice patterns over time.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8 text-center">
          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-6">
            Notice what keeps getting pushed back.
          </p>
          <Link
            href="/log"
            className="inline-block px-6 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            aria-label={ctaAriaLabel}
          >
            {ctaLabel}
          </Link>
        </div>
      </main>
    </div>
  )
}
