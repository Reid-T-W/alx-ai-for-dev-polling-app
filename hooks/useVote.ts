'use client'

import { useState } from 'react'
import { submitVote } from '@/lib/api/client'

export function useVote() {
  const [voting, setVoting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const vote = async (pollId: string, optionId: string) => {
    setVoting(true)
    setError(null)
    
    try {
      await submitVote(pollId, optionId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit vote')
      throw err
    } finally {
      setVoting(false)
    }
  }

  return { vote, voting, error }
}


