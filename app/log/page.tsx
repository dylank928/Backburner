import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { getOrCreateUser } from '@/lib/auth'
import  ExcuseForm  from '@/components/ExcuseForm'
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
    <main className="mx-auto max-w-md px-4 py-6 space-y-6">
      {/* Header */}
      <section className="space-y-1">
        <h1 className="text-2xl font-semibold text-zinc-900">
          Log an Excuse
        </h1>
        <p className="text-sm text-zinc-500">
          No judgment. Just awareness.
        </p>
      </section>

      {/* Form */}
      <ExcuseForm
        categories={categoryNames}
        existingLog={
          todayLog
            ? {
                intendedTask: todayLog.intendedTask,
                excuseCategory: todayLog.excuseCategory,
                note: todayLog.note ?? '',
              }
            : undefined
      } />
    </main>
  )
}
