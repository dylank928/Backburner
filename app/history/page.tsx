import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { getOrCreateUser } from '@/lib/auth'
import { getRepeatedExcuses } from '@/lib/analytics'
import Header from '@/components/Header'
import ExcuseTag from '@/components/ExcuseTag'
import { format, startOfDay, subDays } from 'date-fns'
import HistoryClient from './HistoryClient'

export default async function HistoryPage() {
  const DEV_BYPASS_AUTH = process.env.DEV_BYPASS_AUTH === 'true'
  
  if (!DEV_BYPASS_AUTH) {
    const { userId } = await auth()
    
    if (!userId) {
      redirect('/sign-in')
    }
  }

  const user = await getOrCreateUser()
  
  // Get last 30 days of logs
  const thirtyDaysAgo = startOfDay(subDays(new Date(), 30))
  
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

  const repeatedExcuses = await getRepeatedExcuses(user.id, 2)
  
  // Group logs by date
  const logsByDate: Record<string, typeof logs> = {}
  logs.forEach((log) => {
    const dateKey = format(log.date, 'yyyy-MM-dd')
    if (!logsByDate[dateKey]) {
      logsByDate[dateKey] = []
    }
    logsByDate[dateKey].push(log)
  })

  // Serialize dates for client component
  const serializedLogsByDate: Record<string, any[]> = {}
  Object.entries(logsByDate).forEach(([dateKey, dateLogs]) => {
    serializedLogsByDate[dateKey] = dateLogs.map((log) => ({
      ...log,
      date: log.date.toISOString(),
      createdAt: log.createdAt.toISOString(),
    }))
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            History
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Timeline of deferred tasks from the last 30 days
          </p>
        </div>

        <HistoryClient 
          logsByDate={serializedLogsByDate}
          repeatedExcuses={repeatedExcuses}
        />
      </main>
    </div>
  )
}
