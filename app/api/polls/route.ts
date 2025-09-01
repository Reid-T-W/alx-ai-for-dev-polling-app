import { NextRequest, NextResponse } from 'next/server'
import { createPoll, getAllPolls } from '@/lib/api/polls'

export async function GET(request: NextRequest) {
  try {
    // Fetch real polls from Supabase
    const polls = await getAllPolls()

    return NextResponse.json({
      polls
    })
  } catch (error) {
    console.error('Error fetching polls data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch polls data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, options, expiresAt } = body

    // Validate required fields
    if (!title || !options || options.length < 2) {
      return NextResponse.json(
        { error: 'Title and at least 2 options are required' },
        { status: 400 }
      )
    }

    // Create poll data object
    const pollData = {
      title,
      description,
      options: options.filter((option: string) => option.trim() !== ''),
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
    }
    
    // Save to Supabase using the existing createPoll function
    const pollId = await createPoll(pollData)
    
    console.log('Poll created successfully:', pollId)

    return NextResponse.json({
      pollId,
      success: true,
      message: 'Poll created successfully'
    })
  } catch (error) {
    console.error('Error creating poll:', error)
    return NextResponse.json(
      { error: 'Failed to create poll' },
      { status: 500 }
    )
  }
}


