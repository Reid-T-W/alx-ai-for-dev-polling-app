'use client'

import { useState, useEffect } from 'react'
import { Poll } from '@/types'
import { createClient } from '@/lib/supabase/client'

export function useUserPolls() {
  const [polls, setPolls] = useState<Poll[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function fetchPolls() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('Not authenticated')

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
          .eq('created_by', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error

        // Transform the data to match our Poll interface
        const transformedPolls = (data || []).map(poll => {
          const totalVotes = poll.poll_options.reduce(
            (sum, option) => sum + (option.votes[0]?.count || 0),
            0
          )

          return {
            id: poll.id,
            title: poll.title,
            description: poll.description || undefined,
            createdBy: poll.created_by,
            createdAt: new Date(poll.created_at),
            updatedAt: new Date(poll.updated_at),
            expiresAt: poll.expires_at ? new Date(poll.expires_at) : undefined,
            isActive: poll.is_active,
            totalVotes,
            options: poll.poll_options.map(option => ({
              id: option.id,
              text: option.text,
              orderIndex: option.order_index,
              votes: option.votes[0]?.count || 0,
              percentage: totalVotes > 0 ? ((option.votes[0]?.count || 0) / totalVotes) * 100 : 0,
              createdAt: new Date(option.created_at),
            })),
          }
        })

        setPolls(transformedPolls)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch polls')
      } finally {
        setLoading(false)
      }
    }

    fetchPolls()
  }, [supabase])

  return { polls, loading, error, refetch: () => setLoading(true) }
}


