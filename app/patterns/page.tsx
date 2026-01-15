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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Header />
            <main className="max-w-4xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        Patterns
                    </h1>
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8 text-center">
                        <p className="text-gray-600 dark:text-gray-400">
                            Analyze your deferral habits and identify recurring themes.
                        </p>
                    </div>
                </div>
                {<PatternOverview data={analytics} />}
            </main>
        </div>
    )

}