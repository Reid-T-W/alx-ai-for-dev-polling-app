import { PollCard } from "@/components/polls/PollCard"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { Poll } from "@/types"
import { getPollsByUser } from "@/lib/api/polls"
import { createClient } from "@/lib/supabase/server"

export default async function PollsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let polls: Poll[] = []

  if (user) {
    polls = await getPollsByUser(user.id)
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Polls</h1>
        <Button asChild>
          <Link href="/polls/create">
            <Plus className="mr-2 h-4 w-4" /> Create New Poll
          </Link>
        </Button>
      </div>

      {user ? (
        polls.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {polls.map((poll) => (
              <PollCard key={poll.id} poll={poll} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No polls created yet. Click "Create New Poll" to get started!</p>
        )
      ) : (
        <p className="text-center text-gray-500">Please log in to view your polls.</p>
      )}
    </div>
  )
}
