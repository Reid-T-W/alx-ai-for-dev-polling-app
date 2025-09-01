import { NextRequest, NextResponse } from 'next/server'
import { getPollById } from '@/lib/api/polls'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const pollId = params.id
    
    // Fetch real poll data from Supabase
    const poll = await getPollById(pollId)
    
    if (!poll) {
      return NextResponse.json(
        { error: 'Poll not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      poll
    })
  } catch (error) {
    console.error('Error fetching poll:', error)
    return NextResponse.json(
      { error: 'Failed to fetch poll' },
      { status: 500 }
    )
  }
}

