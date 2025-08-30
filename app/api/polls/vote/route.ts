import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const voteSchema = z.object({
  pollId: z.string().uuid('Invalid poll ID'),
  optionId: z.string().uuid('Invalid option ID'),
})

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Get authenticated user (optional for anonymous voting)
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    const userId = user?.id || null

    const body = await request.json()
    const { pollId, optionId } = voteSchema.parse(body)

    // Check if poll exists and is active
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select('id, is_active, expires_at')
      .eq('id', pollId)
      .eq('is_active', true)
      .single()

    if (pollError || !poll) {
      return NextResponse.json(
        { error: 'Poll not found or inactive' },
        { status: 404 }
      )
    }

    // Check if poll has expired
    if (poll.expires_at && new Date(poll.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Poll has expired' },
        { status: 400 }
      )
    }

    // Check if user already voted (only for authenticated users)
    if (userId) {
      const { data: existingVote } = await supabase
        .from('votes')
        .select('id')
        .eq('poll_id', pollId)
        .eq('user_id', userId)
        .single()

      if (existingVote) {
        return NextResponse.json(
          { error: 'Already voted on this poll' },
          { status: 400 }
        )
      }
    }

    // Check if option exists and belongs to the poll
    const { data: option, error: optionError } = await supabase
      .from('poll_options')
      .select('id')
      .eq('id', optionId)
      .eq('poll_id', pollId)
      .single()

    if (optionError || !option) {
      return NextResponse.json(
        { error: 'Invalid option' },
        { status: 400 }
      )
    }

    // Submit vote
    const { error: voteError } = await supabase
      .from('votes')
      .insert({
        poll_id: pollId,
        option_id: optionId,
        user_id: userId,
        ip_address: request.headers.get('x-forwarded-for') || request.ip,
        user_agent: request.headers.get('user-agent'),
      })

    if (voteError) throw voteError

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error submitting vote:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to submit vote' },
      { status: 500 }
    )
  }
}


