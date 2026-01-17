'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, PlusCircle, Clock, BarChart3 } from 'lucide-react'

const navItems = [
  { href: '/dashboard', icon: Home },
  { href: '/log', icon: PlusCircle },
  { href: '/history', icon: Clock },
  { href: '/patterns', icon: BarChart3 },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-xl justify-around py-2">
        {navItems.map(({ href, icon: Icon }) => {
          const isActive = pathname.startsWith(href)

          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 rounded-lg px-3 py-2 ${
                isActive
                  ? 'text-orange-600'
                  : 'text-zinc-400'
              }`}
            >
              <Icon className="h-6 w-6" />
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
