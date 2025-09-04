"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Poll } from '@/types'
import { PollResults } from '@/components/polls/PollResults'
import { VoteButton } from '@/components/polls/VoteButton'
import { QRCode } from '@/components/polls/QRCode'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { Clock, Users, Share2 } from 'lucide-react'
import Link from 'next/link'

// Helper function to safely convert to Date
const safeDate = (dateValue: Date | string): Date => {
  if (dateValue instanceof Date) {
    return dateValue
  }
  return new Date(dateValue)
}

export default function PollPage() {
  const params = useParams()
  const pollId = params.id as string
  const [poll, setPoll] = useState<Poll | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const response = await fetch(`/api/polls/${pollId}`)
        if (!response.ok) {
          if (response.status === 404) {
            setError('Poll not found')
          } else {
            throw new Error('Failed to fetch poll')
          }
        } else {
          const data = await response.json()
          setPoll(data.poll)
        }
      } catch (error) {
        console.error('Error fetching poll:', error)
        setError('Failed to load poll')
      } finally {
        setLoading(false)
      }
    }

    if (pollId) {
      fetchPoll()
    }
  }, [pollId])

  const refreshPoll = async () => {
    try {
      const response = await fetch(`/api/polls/${pollId}`)
      if (response.ok) {
        const data = await response.json()
        setPoll(data.poll)
      }
    } catch {}
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading poll...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !poll) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Poll Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The poll you are looking for does not exist.'}</p>
          <Link href="/polls">
            <span className="text-blue-600 hover:text-blue-800">← Back to All Polls</span>
          </Link>
        </div>
      </div>
    )
  }

  const expiresAt = poll.expiresAt ? safeDate(poll.expiresAt) : null
  const createdAt = safeDate(poll.createdAt)
  
  const isExpired = expiresAt && expiresAt < new Date()
  const isActive = poll.isActive && !isExpired

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Poll Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{poll.title}</h1>
              {poll.description && (
                <p className="text-gray-600 text-lg">{poll.description}</p>
              )}
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant={isActive ? "default" : "secondary"}>
                {isActive ? "Active" : "Inactive"}
              </Badge>
              {expiresAt && (
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  {isExpired ? "Expired" : formatDistanceToNow(expiresAt, { addSuffix: true })}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{poll.totalVotes} total votes</span>
            </div>
            <span>•</span>
            <span>Created {formatDistanceToNow(createdAt, { addSuffix: true })}</span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Voting Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cast Your Vote</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {isActive ? (
                  poll.options.map((option) => (
                    <VoteButton
                      key={option.id}
                      pollId={poll.id}
                      optionId={option.id}
                      optionText={option.text}
                      onVoted={refreshPoll}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>This poll is no longer accepting votes.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* QR Code */}
            <QRCode pollId={poll.id} title="Share This Poll" />
          </div>

          {/* Results Section */}
          <div>
            <PollResults poll={poll} />
          </div>
        </div>

        {/* Back to Polls */}
        <div className="mt-8 text-center">
          <Link href="/polls">
            <span className="text-blue-600 hover:text-blue-800 text-sm">
              ← Back to All Polls
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}
