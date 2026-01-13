import Header from '@/components/Header'

export default async function DashboardPage() {
  // Auth is handled by middleware - if we reach here, user is authenticated
  // No need for manual checks or database calls in Day 1

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

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8 text-center">
          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-6">
            Notice what keeps getting pushed back.
          </p>
          <button
            disabled
            className="inline-block px-6 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg font-medium cursor-not-allowed opacity-50"
            aria-label="Log today (coming soon)"
          >
            Log today
          </button>
        </div>
      </main>
    </div>
  )
}
