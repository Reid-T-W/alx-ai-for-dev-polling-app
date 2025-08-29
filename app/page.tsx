import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Users, Plus, Vote } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Create and Share
            <span className="text-blue-600 block">Amazing Polls</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Build engaging polls, gather community feedback, and make data-driven decisions with our intuitive polling platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/polls">
              <Button size="lg" className="text-lg px-8 py-3">
                <BarChart3 className="h-5 w-5 mr-2" />
                Explore Polls
              </Button>
            </Link>
            <Link href="/polls/create">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                <Plus className="h-5 w-5 mr-2" />
                Create Poll
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Plus className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Easy Creation</CardTitle>
              <CardDescription>
                Create polls in seconds with our intuitive interface. Add multiple options, descriptions, and expiration dates.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Vote className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Real-time Voting</CardTitle>
              <CardDescription>
                Watch results update in real-time as people vote. See percentages and vote counts instantly.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>Community Driven</CardTitle>
              <CardDescription>
                Share polls with your community and gather valuable insights. Perfect for teams, organizations, and communities.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Get Started</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <Link href="/polls">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <BarChart3 className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                  <h3 className="font-semibold mb-2">Browse Polls</h3>
                  <p className="text-sm text-gray-600">Discover and participate in community polls</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/polls/create">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Plus className="h-8 w-8 mx-auto mb-3 text-green-600" />
                  <h3 className="font-semibold mb-2">Create Poll</h3>
                  <p className="text-sm text-gray-600">Start a new poll and gather opinions</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/auth/register">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 mx-auto mb-3 text-purple-600" />
                  <h3 className="font-semibold mb-2">Sign Up</h3>
                  <p className="text-sm text-gray-600">Create an account to manage your polls</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <BarChart3 className="h-8 w-8 mx-auto mb-3 text-orange-600" />
                  <h3 className="font-semibold mb-2">Dashboard</h3>
                  <p className="text-sm text-gray-600">View your polls and analytics</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
