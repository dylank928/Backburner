import { prisma } from '@/lib/prisma'
import { getOrCreateUser } from '@/lib/auth'
import Header from '@/components/Header'
import { analyzeLogs } from '@/lib/analytics'
import { PatternOverview } from '@/components/patterns/PatternOverview'



export default async function PatternsPage() {


    const user = await getOrCreateUser()

    const logs = await prisma.excuseLog.findMany({
        where: {   
            userId: user.id 
        },
        orderBy: { 
            date: 'desc' 
        },
    })

    const analytics = analyzeLogs(logs)



    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-6">
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Page Intro */}
            <section className="space-y-1">
              <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                Patterns
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Observations from your journey
              </p>
            </section>
    
            {/* Patterns Content */}
            <PatternOverview data={analytics} />
          </div>
        </main>
      )
    

}