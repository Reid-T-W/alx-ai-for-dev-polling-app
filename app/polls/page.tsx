"use client"

import { useEffect, useState } from 'react'
import { PollCard } from "@/components/polls/PollCard"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { Poll } from "@/types"
import withAuth from "@/hocs/withAuth"

function PollsPage() {
  const [polls, setPolls] = useState<Poll[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await fetch('/api/polls')
        if (!response.ok) {
          throw new Error('Failed to fetch polls')
        }
        const data = await response.json()
        setPolls(data.polls || [])
      } catch (error) {
        console.error('Error fetching polls:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPolls()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading polls...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Polls</h1>
        <Button asChild>
          <Link href="/polls/create">
            <Plus className="mr-2 h-4 w-4" /> Create New Poll
          </Link>
        </Button>
      </div>

      {polls.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {polls.map((poll) => (
            <PollCard key={poll.id} poll={poll} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No polls available. Click "Create New Poll" to get started!</p>
      )}
    </div>
  )
}

export default withAuth(PollsPage)
