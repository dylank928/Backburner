import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { getOrCreateUser } from '@/lib/auth'
import Header from '@/components/Header'
import ExcuseForm from '@/components/ExcuseForm'
import { startOfDay, endOfDay } from 'date-fns'

export default async function LogPage() {
  // Auth is handled by middleware - if we reach here, user is authenticated
  const DEV_BYPASS_AUTH = process.env.DEV_BYPASS_AUTH === 'true'
  
  if (!DEV_BYPASS_AUTH) {
    const { userId } = await auth()
    
    if (!userId) {
      redirect('/sign-in')
    }
  }

  // Get or create user in database
  const user = await getOrCreateUser()

  // Fetch excuse categories from database
  const categories = await prisma.excuseCategory.findMany({
    orderBy: { name: 'asc' },
  })
  
  // Handle empty state - should not happen if seed was run, but graceful fallback
  if (categories.length === 0) {
    console.warn('No excuse categories found in database. Run: npm run db:seed')
  }
  
  const categoryNames = categories.map((c) => c.name)

  // Check if today's entry exists
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Log entry
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Record what you intended to do and why it was deferred.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
          <ExcuseForm 
            categories={categoryNames}
            existingLog={todayLog ? {
              intendedTask: todayLog.intendedTask,
              excuseCategory: todayLog.excuseCategory,
              note: todayLog.note || '',
            } : undefined}
          />
        </div>
      </main>
    </div>
  )
}
