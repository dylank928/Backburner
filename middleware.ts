import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/',
])

// Development mode: bypass auth if DEV_BYPASS_AUTH is set
const DEV_BYPASS_AUTH = process.env.DEV_BYPASS_AUTH === 'true'

export default clerkMiddleware(async (auth, request) => {
  if (DEV_BYPASS_AUTH) {
    // Skip auth in development
    return
  }
  
  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
