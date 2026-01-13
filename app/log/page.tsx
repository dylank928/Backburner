import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { getOrCreateUser } from '@/lib/auth'
import Header from '@/components/Header'
import ExcuseForm from '@/components/ExcuseForm'

export default async function LogPage() {
  const DEV_BYPASS_AUTH = process.env.DEV_BYPASS_AUTH === 'true'
  
  if (!DEV_BYPASS_AUTH) {
    const { userId } = await auth()
    
    if (!userId) {
      redirect('/sign-in')
    }
  }

  const user = await getOrCreateUser()
  
  // Get default categories
  const categories = await prisma.excuseCategory.findMany({
    orderBy: { name: 'asc' },
  })
  const categoryNames = categories.map((c) => c.name)

  // Check if today's entry exists
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Log entry
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {todayLog
              ? "Update today's deferred task entry."
              : "Record what you intended to do and why it was deferred."}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <ExcuseForm
            defaultCategories={categoryNames}
            existingLog={todayLog ? {
              intendedTask: todayLog.intendedTask,
              excuseCategory: todayLog.excuseCategory,
              note: todayLog.note,
            } : undefined}
          />
        </div>
      </main>
    </div>
  )
}
