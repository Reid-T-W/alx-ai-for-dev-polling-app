import { PollForm } from '@/components/polls/PollForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function CreatePollPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Poll</h1>
        <p className="text-gray-600 mt-2">Create a new poll and share it with others to get their votes.</p>
      </div>
      
      <PollForm />
    </div>
  )
}

export default CreatePollPage
