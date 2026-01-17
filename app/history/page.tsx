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
    <main className="mx-auto max-w-xl px-4 py-6 space-y-6">
      {/* Page header */}
      <section>
        <h1 className="text-2xl font-semibold text-zinc-900">
          History
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          Your reflection timeline
        </p>
      </section>
  
      {/* Timeline */}
      <HistoryTimeline
        logs={logs}
        categories={categoryNames}
      />
    </main>
  )
}
