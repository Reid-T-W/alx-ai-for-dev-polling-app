"use client"

import { Poll } from "@/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, User, Vote } from "lucide-react"
import Link from "next/link"

interface PollCardProps {
  poll: Poll
}

export function PollCard({ poll }: PollCardProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString()
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="line-clamp-2">{poll.title}</CardTitle>
        {poll.description && (
          <CardDescription className="line-clamp-2">
            {poll.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{poll.createdBy}</span>
            </div>
            <div className="flex items-center gap-2">
              <Vote className="h-4 w-4" />
              <span>{poll.totalVotes} votes</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Created {formatDate(poll.createdAt)}</span>
            {poll.expiresAt && (
              <>
                <span>•</span>
                <span>Expires {formatDate(poll.expiresAt)}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              poll.isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {poll.isActive ? 'Active' : 'Closed'}
            </span>
          </div>

          <Link href={`/polls/${poll.id}`}>
            <Button className="w-full">
              View Poll
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
