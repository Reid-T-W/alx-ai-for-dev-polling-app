import { UpdatePollData } from '@/types'

export type CreatePollRequest = {
  title: string
  description?: string
  options: string[]
  // datetime-local string or undefined
  expiresAt?: string
}

export async function createPoll(pollData: CreatePollRequest): Promise<{ pollId: string }> {
  const response = await fetch('/api/polls', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(pollData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to create poll')
  }

  return response.json()
}

export async function submitVote(pollId: string, optionId: string): Promise<void> {
  const response = await fetch('/api/polls/vote', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ pollId, optionId }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to submit vote')
  }
}

export async function deletePoll(pollId: string): Promise<void> {
  const response = await fetch(`/api/polls/${pollId}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to delete poll')
  }
}

export async function updatePoll(pollId: string, updates: UpdatePollData): Promise<void> {
  const response = await fetch(`/api/polls/${pollId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to update poll')
  }
}

// Real-time subscription helper
export function subscribeToPollUpdates(pollId: string, callback: (data: any) => void) {
  const { createClient } = require('@/lib/supabase/client')
  const supabase = createClient()
  
  return supabase
    .channel(`poll-${pollId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'votes',
        filter: `poll_id=eq.${pollId}`,
      },
      callback
    )
    .subscribe()
}


