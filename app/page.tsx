import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'

export default async function Home() {
  // Simple redirect logic - middleware handles auth protection
  const DEV_BYPASS_AUTH = process.env.DEV_BYPASS_AUTH === 'true'
  
  if (DEV_BYPASS_AUTH) {
    redirect('/dashboard')
  }
  
  const { userId } = await auth()
  redirect(userId ? '/dashboard' : '/sign-in')
}
