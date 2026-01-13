import { auth } from '@clerk/nextjs/server'
import { prisma } from './prisma'

// Development mode: create a dummy user if auth is bypassed
const DEV_BYPASS_AUTH = process.env.DEV_BYPASS_AUTH === 'true'

/**
 * Get or create user in database
 * Note: This will be needed when we start logging data (Day 2+)
 * For Day 1, this is kept for future use but not called
 */
export async function getOrCreateUser() {
  if (DEV_BYPASS_AUTH) {
    // Return a dummy user for development
    let devUser = await prisma.user.findFirst({
      where: { clerkId: 'dev-user-bypass' },
    })
    
    if (!devUser) {
      devUser = await prisma.user.create({
        data: {
          clerkId: 'dev-user-bypass',
        },
      })
    }
    
    return devUser
  }
  
  const { userId } = await auth()
  
  if (!userId) {
    throw new Error('Unauthorized')
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  })

  if (user) {
    return user
  }

  // Create new user if doesn't exist
  return await prisma.user.create({
    data: {
      clerkId: userId,
    },
  })
}
