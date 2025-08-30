'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Poll } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface PollResultsProps {
  poll: Poll
  showVoteCounts?: boolean
}

export function PollResults({ poll, showVoteCounts = true }: PollResultsProps) {
  const [currentPoll, setCurrentPoll] = useState(poll)
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel(`poll-${poll.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'votes',
          filter: `poll_id=eq.${poll.id}`,
        },
        async (payload) => {
          // Refetch poll data to get updated results
          const { data: updatedPoll } = await supabase
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
            .eq('id', poll.id)
            .single()

          if (updatedPoll) {
            const totalVotes = updatedPoll.poll_options.reduce(
              (sum, option) => sum + (option.votes[0]?.count || 0),
              0
            )

            const transformedPoll: Poll = {
              id: updatedPoll.id,
              title: updatedPoll.title,
              description: updatedPoll.description || undefined,
              createdBy: updatedPoll.created_by,
              createdAt: new Date(updatedPoll.created_at),
              updatedAt: new Date(updatedPoll.updated_at),
              expiresAt: updatedPoll.expires_at ? new Date(updatedPoll.expires_at) : undefined,
              isActive: updatedPoll.is_active,
              totalVotes,
              options: updatedPoll.poll_options.map(option => ({
                id: option.id,
                text: option.text,
                orderIndex: option.order_index,
                votes: option.votes[0]?.count || 0,
                percentage: totalVotes > 0 ? ((option.votes[0]?.count || 0) / totalVotes) * 100 : 0,
                createdAt: new Date(option.created_at),
              })),
            }

            setCurrentPoll(transformedPoll)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [poll.id, supabase])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Results</span>
          <span className="text-sm font-normal text-gray-600">
            {currentPoll.totalVotes} total votes
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentPoll.options.map((option) => (
          <div key={option.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">{option.text}</span>
              <div className="text-right">
                <div className="font-semibold">{option.percentage.toFixed(1)}%</div>
                {showVoteCounts && (
                  <div className="text-sm text-gray-600">{option.votes} votes</div>
                )}
              </div>
            </div>
            <Progress value={option.percentage} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}


