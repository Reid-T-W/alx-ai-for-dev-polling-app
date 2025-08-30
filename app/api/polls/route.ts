import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const createPollSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().optional(),
  options: z.array(z.string().min(1, 'Option text is required').max(100, 'Option too long')).min(2, 'At least 2 options required').max(10, 'Maximum 10 options allowed'),
  expiresAt: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createPollSchema.parse(body)

    // Create poll
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .insert({
        title: validatedData.title,
        description: validatedData.description,
        created_by: user.id,
        expires_at: validatedData.expiresAt ? new Date(validatedData.expiresAt).toISOString() : null,
      })
      .select()
      .single()

    if (pollError) throw pollError

    // Create poll options
    const optionsData = validatedData.options.map((text, index) => ({
      poll_id: poll.id,
      text,
      order_index: index,
    }))

    const { error: optionsError } = await supabase
      .from('poll_options')
      .insert(optionsData)

    if (optionsError) throw optionsError

    return NextResponse.json({ pollId: poll.id })
  } catch (error) {
    console.error('Error creating poll:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create poll' },
      { status: 500 }
    )
  }
}


