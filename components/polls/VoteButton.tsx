'use client'

import { useState } from 'react'
import { useVote } from '@/hooks/useVote'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import toast from 'react-hot-toast'

interface VoteButtonProps {
  pollId: string
  optionId: string
  optionText: string
  disabled?: boolean
  className?: string
}

export function VoteButton({ 
  pollId, 
  optionId, 
  optionText, 
  disabled = false,
  className = ""
}: VoteButtonProps) {
  const { vote, voting, error } = useVote()
  const [hasVoted, setHasVoted] = useState(false)

  const handleVote = async () => {
    try {
      await vote(pollId, optionId)
      setHasVoted(true)
      toast.success(`Voted for "${optionText}"`)
    } catch (error) {
      toast.error('Failed to submit vote')
    }
  }

  if (hasVoted) {
    return (
      <Button
        disabled
        variant="outline"
        className={`w-full ${className}`}
      >
        <Check className="h-4 w-4 mr-2" />
        Voted
      </Button>
    )
  }

  return (
    <Button
      onClick={handleVote}
      disabled={disabled || voting}
      className={`w-full ${className}`}
      variant={voting ? "outline" : "default"}
    >
      {voting ? 'Voting...' : optionText}
    </Button>
  )
}


