import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { getOrCreateUser } from '@/lib/auth'
import { format, startOfDay, endOfDay } from 'date-fns'
import { Card } from '@/components/ui/Card'
import { PrimaryButton } from '@/components/ui/PrimaryButton'
import { StatCard } from '@/components/ui/StatCard'
import { Flame, CalendarDays, Clock } from 'lucide-react'

export default async function DashboardPage() {
  // Auth is handled by middleware - if we reach here, user is authenticated
  
  // Get or create user in database
  const user = await getOrCreateUser()
  
  // Check if today's log exists
  const todayStart = startOfDay(new Date())
  const todayEnd = endOfDay(new Date())

  // Get today's date
  const today = new Date()
  const formattedDate = format(today, 'EEEE, MMMM d')
  
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
    <main className="mx-auto max-w-xl px-4 py-6 space-y-6">
      {/* Greeting */}
      <section>
        <h1 className="text-2xl font-semibold text-zinc-900">
          Welcome back
        </h1>
        <p className="text-sm text-zinc-500 mt-1">
          {formattedDate}
        </p>
      </section>
  
      {/* Today Status */}
      <Card className="space-y-2">
        <p className="text-sm text-zinc-500">
          Today
        </p>
  
        {hasTodayLog ? (
          <>
            <p className="text-lg font-medium text-zinc-900">
              {todayLog?.excuseCategory}
            </p>
            {todayLog?.note && (
              <p className="text-sm text-zinc-500">
                {todayLog.note}
              </p>
            )}
          </>
        ) : (
          <>
            <p className="text-lg font-medium text-zinc-900">
              No excuse logged yet
            </p>
            <p className="text-sm text-zinc-500">
              Logging takes less than 30 seconds.
            </p>
          </>
        )}
      </Card>
  
      {/* Stats */}
      <section className="grid grid-cols-2 gap-4">
        <StatCard
          label="This week"
          value={3}
          icon={<Flame className="h-5 w-5" />}
        />
  
        <StatCard
          label="Streak"
          value="2 days"
          icon={<CalendarDays className="h-5 w-5" />}
        />
      </section>
  
      {/* Primary Action */}
      <PrimaryButton>
        <Link href="/log" aria-label={ctaAriaLabel}>
          {ctaLabel}
        </Link>
      </PrimaryButton>
    </main>
  )
}
