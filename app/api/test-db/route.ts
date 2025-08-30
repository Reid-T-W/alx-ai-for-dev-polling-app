import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Test basic database connection
    const { data: polls, error: pollsError } = await supabase
      .from('polls')
      .select('count')
      .limit(1)

    if (pollsError) {
      return NextResponse.json({ 
        error: 'Database connection failed', 
        details: pollsError.message 
      }, { status: 500 })
    }

    // Test poll_options table
    const { data: options, error: optionsError } = await supabase
      .from('poll_options')
      .select('count')
      .limit(1)

    if (optionsError) {
      return NextResponse.json({ 
        error: 'Poll options table not found', 
        details: optionsError.message 
      }, { status: 500 })
    }

    // Test votes table
    const { data: votes, error: votesError } = await supabase
      .from('votes')
      .select('count')
      .limit(1)

    if (votesError) {
      return NextResponse.json({ 
        error: 'Votes table not found', 
        details: votesError.message 
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      user: user.email,
      tables: {
        polls: 'OK',
        poll_options: 'OK',
        votes: 'OK'
      }
    })
  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json(
      { error: 'Database test failed', details: error },
      { status: 500 }
    )
  }
}
