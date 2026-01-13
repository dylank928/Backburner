import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { getOrCreateUser } from '@/lib/auth'
import { startOfDay, endOfDay } from 'date-fns'

export async function POST(request: NextRequest) {
  try {
    const DEV_BYPASS_AUTH = process.env.DEV_BYPASS_AUTH === 'true'
    
    if (!DEV_BYPASS_AUTH) {
      const { userId } = await auth()
      
      if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    const user = await getOrCreateUser()
    const body = await request.json()
    const { intendedTask, excuseCategory, note } = body

    if (!intendedTask || !excuseCategory) {
      return NextResponse.json(
        { error: 'Intended task and excuse category are required' },
        { status: 400 }
      )
    }

    // Get today's date range
    const today = new Date()
    const todayStart = startOfDay(today)
    const todayEnd = endOfDay(today)

    // Check if entry exists for today
    const existingLog = await prisma.excuseLog.findFirst({
      where: {
        userId: user.id,
        date: {
          gte: todayStart,
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
          intendedTask,
          excuseCategory,
          note: note || null,
        },
      })
    } else {
      log = await prisma.excuseLog.create({
        data: {
          userId: user.id,
          date: todayStart,
          intendedTask,
          excuseCategory,
          note: note || null,
        },
      })
    }

    return NextResponse.json({ success: true, log }, { status: 200 })
  } catch (error) {
    console.error('Error saving excuse log:', error)
    
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
