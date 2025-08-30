import { createClient } from '@/lib/supabase/server'
import { Poll, CreatePollData, PollStats } from '@/types'
import { transformPoll, transformPollForInsert } from '@/lib/transformers'
import { Tables } from '@/types'

export async function getPollsByUser(userId: string): Promise<Poll[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('polls')
    .select(`
      *,
      poll_options (
        id,
        text,
        order_index,
        created_at,
        votes (count)
      )
    `)
    .eq('created_by', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  
  return (data || []).map(transformPoll)
}

export async function getPollById(pollId: string): Promise<Poll | null> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('polls')
    .select(`
      *,
      poll_options (
        id,
        text,
        order_index,
        created_at,
        votes (count)
      )
    `)
    .eq('id', pollId)
    .eq('is_active', true)
    .single()

  if (error || !data) return null
  
  return transformPoll(data)
}

export async function createPoll(pollData: CreatePollData, userId: string): Promise<string> {
  const supabase = createClient()
  
  // Insert poll
  const pollInsert = transformPollForInsert({
    title: pollData.title,
    description: pollData.description,
    createdBy: userId,
    expiresAt: pollData.expiresAt,
  })

  const { data: poll, error: pollError } = await supabase
    .from('polls')
    .insert(pollInsert)
    .select()
    .single()

  if (pollError) throw pollError

  // Insert poll options
  const optionsData: Tables<'poll_options'>['Insert'][] = pollData.options.map((text, index) => ({
    poll_id: poll.id,
    text,
    order_index: index,
  }))

  const { error: optionsError } = await supabase
    .from('poll_options')
    .insert(optionsData)

  if (optionsError) throw optionsError

  return poll.id
}

export async function getPollStats(userId: string): Promise<PollStats> {
  const supabase = createClient()
  
  const { data: polls, error } = await supabase
    .from('polls')
    .select(`
      id,
      is_active,
      poll_options (
        votes (count)
      )
    `)
    .eq('created_by', userId)

  if (error) throw error

  const totalPolls = polls?.length || 0
  const activePolls = polls?.filter(poll => poll.is_active).length || 0
  const totalVotes = polls?.reduce((sum, poll) => 
    sum + poll.poll_options.reduce((optionSum, option) => 
      optionSum + (option.votes[0]?.count || 0), 0
    ), 0
  ) || 0
  const averageVotesPerPoll = totalPolls > 0 ? totalVotes / totalPolls : 0

  return {
    totalPolls,
    totalVotes,
    activePolls,
    averageVotesPerPoll,
  }
}

export async function deletePoll(pollId: string, userId: string): Promise<void> {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('polls')
    .delete()
    .eq('id', pollId)
    .eq('created_by', userId)

  if (error) throw error
}

export async function updatePoll(
  pollId: string, 
  updates: { title?: string; description?: string; isActive?: boolean; expiresAt?: Date },
  userId: string
): Promise<void> {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('polls')
    .update({
      title: updates.title,
      description: updates.description,
      is_active: updates.isActive,
      expires_at: updates.expiresAt?.toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', pollId)
    .eq('created_by', userId)

  if (error) throw error
}


