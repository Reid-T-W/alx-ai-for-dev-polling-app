import { NextRequest, NextResponse } from 'next/server'
import { submitVote } from '@/lib/api/polls'

export async function POST(request: NextRequest) {
  try {
    const { pollId, optionId } = await request.json()
    
    if (!pollId || !optionId) {
      return NextResponse.json(
        { error: 'Poll ID and Option ID are required' },
        { status: 400 }
      )
    }

    // Submit vote to Supabase
    await submitVote(pollId, optionId)

    return NextResponse.json({
      success: true,
      message: 'Vote submitted successfully'
    })
  } catch (error) {
    console.error('Error submitting vote:', error)
    const message = (typeof error === 'object' && error && 'message' in (error as any))
      ? String((error as any).message)
      : 'Failed to submit vote'
    return NextResponse.json({ message }, { status: 500 })
  }
}


