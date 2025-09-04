import { NextRequest, NextResponse } from 'next/server'
import { getAllPolls, getPollStats } from '@/lib/api/polls'

export async function GET(request: NextRequest) {
  try {
    const [polls, stats] = await Promise.all([
      getAllPolls(),
      getPollStats(),
    ])

    return NextResponse.json({ polls, stats })
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
