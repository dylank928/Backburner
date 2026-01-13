'use client'

import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'

export default function Header() {
  const { isLoaded, user } = useUser()
  const DEV_BYPASS_AUTH = process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === 'true'
  
  return (
    <header className="border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Backburner
        </Link>
        {DEV_BYPASS_AUTH ? (
          <span className="text-sm text-gray-500 dark:text-gray-400">Dev Mode</span>
        ) : (
          isLoaded && <UserButton afterSignOutUrl="/sign-in" />
        )}
      </div>
    </header>
  )
}
