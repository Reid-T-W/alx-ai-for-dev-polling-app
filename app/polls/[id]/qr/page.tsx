import { createClient } from '@/lib/supabase/server'
import { getPollById } from '@/lib/api/polls'
import { notFound } from 'next/navigation'
import { QRCode } from '@/components/polls/QRCode'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { Clock, Users, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface QRPageProps {
  params: {
    id: string
  }
}

export default async function QRPage({ params }: QRPageProps) {
  const poll = await getPollById(params.id)
  
  if (!poll) {
    notFound()
  }

  const isExpired = poll.expiresAt && new Date(poll.expiresAt) < new Date()
  const isActive = poll.isActive && !isExpired

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Link href={`/polls/${poll.id}`}>
            <span className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm">
              <ArrowLeft className="h-4 w-4" />
              Back to Poll
            </span>
          </Link>
        </div>

        {/* Poll Info */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-xl mb-2">{poll.title}</CardTitle>
                {poll.description && (
                  <p className="text-gray-600 text-sm">{poll.description}</p>
                )}
              </div>
              <Badge variant={isActive ? "default" : "secondary"}>
                {isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{poll.totalVotes} votes</span>
              </div>
              {poll.expiresAt && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>
                      {isExpired ? "Expired" : formatDistanceToNow(new Date(poll.expiresAt), { addSuffix: true })}
                    </span>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* QR Code */}
        <QRCode pollId={poll.id} size={300} title="Scan to Vote" />
      </div>
    </div>
  )
}


