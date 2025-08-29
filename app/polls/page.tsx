import { PollCard } from "@/components/polls/PollCard"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { Poll } from "@/types"

// Sample data for demonstration
const samplePolls: Poll[] = [
  {
    id: "1",
    title: "What's your favorite programming language?",
    description: "Let's see what the community prefers for development",
    options: [
      { id: "1", text: "JavaScript", votes: 45, percentage: 45 },
      { id: "2", text: "Python", votes: 35, percentage: 35 },
      { id: "3", text: "TypeScript", votes: 20, percentage: 20 }
    ],
    createdBy: "John Doe",
    createdAt: new Date("2024-01-15"),
    isActive: true,
    totalVotes: 100
  },
  {
    id: "2",
    title: "Best framework for building web apps?",
    description: "Share your experience with different frameworks",
    options: [
      { id: "4", text: "React", votes: 60, percentage: 60 },
      { id: "5", text: "Vue", votes: 25, percentage: 25 },
      { id: "6", text: "Angular", votes: 15, percentage: 15 }
    ],
    createdBy: "Jane Smith",
    createdAt: new Date("2024-01-10"),
    expiresAt: new Date("2024-02-10"),
    isActive: true,
    totalVotes: 100
  }
]

export default function PollsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Polls</h1>
          <p className="text-gray-600 mt-2">Discover and participate in community polls</p>
        </div>
        <Link href="/polls/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Poll
          </Button>
        </Link>
      </div>

      {samplePolls.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No polls yet</h3>
          <p className="text-gray-600 mb-4">Be the first to create a poll!</p>
          <Link href="/polls/create">
            <Button>Create your first poll</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {samplePolls.map((poll) => (
            <PollCard key={poll.id} poll={poll} />
          ))}
        </div>
      )}
    </div>
  )
}
