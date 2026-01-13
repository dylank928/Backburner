import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { getOrCreateUser } from '@/lib/auth'
import Header from '@/components/Header'
import Link from 'next/link'

export default async function DashboardPage() {
  const DEV_BYPASS_AUTH = process.env.DEV_BYPASS_AUTH === 'true'
  
  if (!DEV_BYPASS_AUTH) {
    const { userId } = await auth()
    
    if (!userId) {
      redirect('/sign-in')
    }
  }

  const user = await getOrCreateUser()
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const todayLog = await prisma.excuseLog.findFirst({
    where: {
      userId: user.id,
      date: {
        gte: today,
        lt: tomorrow,
      },
    },
  })

  const totalLogs = await prisma.excuseLog.count({
    where: { userId: user.id },
  })

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

        {totalLogs === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
              Notice what keeps getting pushed back.
            </p>
            <Link
              href="/log"
              className="inline-block px-6 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              Log today
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {todayLog ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Today&apos;s entry</p>
                <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                  {todayLog.intendedTask}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Deferred due to: {todayLog.excuseCategory}
                </p>
                <Link
                  href="/log"
                  className="mt-4 inline-block text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 underline"
                >
                  Update entry
                </Link>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  No entry logged for today
                </p>
                <Link
                  href="/log"
                  className="inline-block px-6 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                >
                  Log today
                </Link>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <Link
                href="/history"
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
              >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  History
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  View your timeline of deferred tasks
                </p>
              </Link>

              <Link
                href="/patterns"
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
              >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Patterns
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Discover behavioral insights
                </p>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
