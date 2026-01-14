import { prisma } from '@/lib/prisma'
import { getOrCreateUser } from '@/lib/auth'
import Header from '@/components/Header'
import { subDays, startOfDay } from 'date-fns'
import HistoryTimeline from '@/components/HistoryTimeline'

export default async function HistoryPage() {
  // Auth is handled by middleware - if we reach here, user is authenticated
  
  // Get or create user in database
  const user = await getOrCreateUser()
  
  // Calculate date range: last 30 days
  const thirtyDaysAgo = startOfDay(subDays(new Date(), 30))
  
  // Fetch logs from the last 30 days, sorted by date (most recent first)
  const logs = await prisma.excuseLog.findMany({
    where: {
      userId: user.id,
      date: {
        gte: thirtyDaysAgo,
      },
    },
    orderBy: {
      date: 'desc',
    },
  })
  
  // Fetch excuse categories from database (same as Log page)
  const categories = await prisma.excuseCategory.findMany({
    orderBy: { name: 'asc' },
  })
  
  const categoryNames = categories.map((c) => c.name)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            History
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View your logged entries in chronological order.
          </p>
        </div>

        <HistoryTimeline logs={logs} categories={categoryNames} />
      </main>
    </div>
  )
}
