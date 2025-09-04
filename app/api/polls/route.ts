import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
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
    console.log('POST /api/polls called');

    const schema = z.object({
      title: z.string().min(1, 'Title is required').max(200),
      description: z.string().optional(),
      options: z
        .array(z.string().min(1, 'Option text is required').max(100))
        .min(2, 'At least 2 options required')
        .max(10, 'Maximum 10 options allowed'),
      // Accept the raw string from <input type="datetime-local">; we'll validate at runtime
      expiresAt: z.string().optional(),
    })

    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid payload', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { title, description, options, expiresAt } = parsed.data

    // Normalize and validate expiresAt (datetime-local string)
    const expiresAtDate = expiresAt ? new Date(expiresAt) : undefined
    if (expiresAt && (isNaN(expiresAtDate!.getTime()))) {
      return NextResponse.json(
        { error: 'Invalid expiresAt value' },
        { status: 400 }
      )
    }

    const pollData = {
      title,
      description,
      options: options.filter((option: string) => option.trim() !== ''),
      expiresAt: expiresAtDate,
    }
    
    // Save to Supabase using the existing createPoll function
    const pollId = await createPoll(pollData)
    
    console.log('Poll created successfully:', pollId)

    return NextResponse.json(
      {
        pollId,
        success: true,
        message: 'Poll created successfully',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating poll:', error)
    return NextResponse.json(
      { error: 'Failed to create poll' },
      { status: 500 }
    )
  }
}


