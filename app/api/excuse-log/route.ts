import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { getOrCreateUser } from '@/lib/auth'
import { startOfDay, endOfDay } from 'date-fns'

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const DEV_BYPASS_AUTH = process.env.DEV_BYPASS_AUTH === 'true'
    
    if (!DEV_BYPASS_AUTH) {
      const { userId } = await auth()
      
      if (!userId) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }
    }

    // Get or create user in database
    const user = await getOrCreateUser()

    // Parse request body
    const body = await request.json()
    const { intendedTask, excuseCategory, note } = body

    // Validation
    if (!intendedTask || typeof intendedTask !== 'string' || intendedTask.trim() === '') {
      return NextResponse.json(
        { error: 'Intended task is required' },
        { status: 400 }
      )
    }

    if (!excuseCategory || typeof excuseCategory !== 'string' || excuseCategory.trim() === '') {
      return NextResponse.json(
        { error: 'Excuse category is required' },
        { status: 400 }
      )
    }

    // Verify category exists in database
    const categoryExists = await prisma.excuseCategory.findUnique({
      where: { name: excuseCategory },
    })

    if (!categoryExists) {
      return NextResponse.json(
        { error: 'Invalid excuse category' },
        { status: 400 }
      )
    }

    // Normalize date to start of local day (midnight)
    const today = startOfDay(new Date())
    const todayEnd = endOfDay(new Date())

    // Check if entry exists for today
    const existingLog = await prisma.excuseLog.findFirst({
      where: {
        userId: user.id,
        date: {
          gte: today,
          lte: todayEnd,
        },
      },
    })

    // Upsert: update if exists, create if not
    let log
    if (existingLog) {
      log = await prisma.excuseLog.update({
        where: { id: existingLog.id },
        data: {
          intendedTask: intendedTask.trim(),
          excuseCategory: excuseCategory.trim(),
          note: note ? note.trim() : null,
        },
      })
    } else {
      log = await prisma.excuseLog.create({
        data: {
          userId: user.id,
          date: today,
          intendedTask: intendedTask.trim(),
          excuseCategory: excuseCategory.trim(),
          note: note ? note.trim() : null,
        },
      })
    }

    return NextResponse.json(
      { 
        success: true, 
        log: {
          id: log.id,
          intendedTask: log.intendedTask,
          excuseCategory: log.excuseCategory,
          note: log.note,
          date: log.date.toISOString(),
        }
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error saving excuse log:', error)
    
    // Handle unique constraint violation (shouldn't happen with our logic, but safety check)
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'An entry already exists for today' },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to save entry' },
      { status: 500 }
    )
  }
}
