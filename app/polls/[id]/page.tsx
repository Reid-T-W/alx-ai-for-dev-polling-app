import { createClient } from '@/lib/supabase/server'
import { getPollById } from '@/lib/api/polls'
import { notFound } from 'next/navigation'
import { PollResults } from '@/components/polls/PollResults'
import { VoteButton } from '@/components/polls/VoteButton'
import { QRCode } from '@/components/polls/QRCode'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { Clock, Users, Share2 } from 'lucide-react'
import Link from 'next/link'

interface PollPageProps {
  params: {
    id: string
  }
}

export default async function PollPage({ params }: PollPageProps) {
  const poll = await getPollById(params.id)
  
  if (!poll) {
    notFound()
  }

  const isExpired = poll.expiresAt && new Date(poll.expiresAt) < new Date()
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
              {poll.expiresAt && (
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  {isExpired ? "Expired" : formatDistanceToNow(new Date(poll.expiresAt), { addSuffix: true })}
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
            <span>Created {formatDistanceToNow(poll.createdAt, { addSuffix: true })}</span>
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

        {/* Back to Dashboard */}
        <div className="mt-8 text-center">
          <Link href="/dashboard">
            <span className="text-blue-600 hover:text-blue-800 text-sm">
              ← Back to Dashboard
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}
