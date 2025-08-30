"use client"

import { Poll } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { BarChart3, Users, Clock, Share2 } from 'lucide-react'
import Link from 'next/link'

interface PollCardProps {
  poll: Poll
  showActions?: boolean
}

export function PollCard({ poll, showActions = true }: PollCardProps) {
  const isExpired = poll.expiresAt && new Date(poll.expiresAt) < new Date()
  const isActive = poll.isActive && !isExpired

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{poll.title}</CardTitle>
            {poll.description && (
              <CardDescription className="text-sm mb-3">
                {poll.description}
              </CardDescription>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant={isActive ? "default" : "secondary"}>
              {isActive ? "Active" : "Inactive"}
            </Badge>
            {poll.expiresAt && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                {isExpired ? "Expired" : formatDistanceToNow(new Date(poll.expiresAt), { addSuffix: true })}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Poll Options Preview */}
        <div className="space-y-2">
          {poll.options.slice(0, 3).map((option) => (
            <div key={option.id} className="flex justify-between items-center text-sm">
              <span className="truncate flex-1">{option.text}</span>
              <span className="text-gray-600 ml-2">
                {option.votes} votes
              </span>
            </div>
          ))}
          {poll.options.length > 3 && (
            <div className="text-sm text-gray-500">
              +{poll.options.length - 3} more options
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{poll.totalVotes} votes</span>
            </div>
            <div className="flex items-center gap-1">
              <BarChart3 className="h-4 w-4" />
              <span>{poll.options.length} options</span>
            </div>
          </div>
          <div className="text-xs">
            Created {formatDistanceToNow(poll.createdAt, { addSuffix: true })}
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2 pt-2 border-t">
            <Link href={`/polls/${poll.id}`} className="flex-1">
              <Button variant="outline" className="w-full">
                View Poll
              </Button>
            </Link>
            <Link href={`/polls/${poll.id}/qr`}>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
