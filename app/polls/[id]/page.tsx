"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, User, Vote, CheckCircle } from "lucide-react"
import { Poll, PollOption } from "@/types"

// Sample poll data
const samplePoll: Poll = {
  id: "1",
  title: "What's your favorite programming language?",
  description: "Let's see what the community prefers for development. This poll will help us understand the most popular languages among developers.",
  options: [
    { id: "1", text: "JavaScript", votes: 45, percentage: 45 },
    { id: "2", text: "Python", votes: 35, percentage: 35 },
    { id: "3", text: "TypeScript", votes: 20, percentage: 20 }
  ],
  createdBy: "John Doe",
  createdAt: new Date("2024-01-15"),
  isActive: true,
  totalVotes: 100
}

export default function PollDetailPage({ params }: { params: { id: string } }) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [poll, setPoll] = useState<Poll>(samplePoll)

  const handleVote = () => {
    if (!selectedOption) return

    // Update the poll with the new vote
    const updatedPoll = {
      ...poll,
      options: poll.options.map(option => 
        option.id === selectedOption 
          ? { ...option, votes: option.votes + 1, percentage: ((option.votes + 1) / (poll.totalVotes + 1)) * 100 }
          : { ...option, percentage: (option.votes / (poll.totalVotes + 1)) * 100 }
      ),
      totalVotes: poll.totalVotes + 1
    }
    
    setPoll(updatedPoll)
    setHasVoted(true)
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{poll.title}</CardTitle>
            {poll.description && (
              <CardDescription className="text-base">
                {poll.description}
              </CardDescription>
            )}
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Created by {poll.createdBy}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(poll.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Vote className="h-4 w-4" />
                <span>{poll.totalVotes} votes</span>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {!hasVoted && poll.isActive ? (
              <>
                <div className="space-y-3">
                  {poll.options.map((option) => (
                    <div
                      key={option.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedOption === option.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedOption(option.id)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{option.text}</span>
                        {selectedOption === option.id && (
                          <CheckCircle className="h-5 w-5 text-blue-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button 
                  onClick={handleVote} 
                  disabled={!selectedOption}
                  className="w-full"
                >
                  Vote
                </Button>
              </>
            ) : (
              <div className="space-y-3">
                {poll.options.map((option) => (
                  <div key={option.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{option.text}</span>
                      <span className="text-sm text-muted-foreground">
                        {option.votes} votes ({option.percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${option.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
                
                {hasVoted && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 text-center">
                      Thank you for voting! Your vote has been recorded.
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {!poll.isActive && (
              <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-gray-600 text-center">
                  This poll is no longer active.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
