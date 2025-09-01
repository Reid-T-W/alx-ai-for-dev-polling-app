"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PollCard } from "@/components/polls/PollCard"
import { Plus, BarChart3, Users, TrendingUp } from "lucide-react"
import Link from "next/link"
import withAuth from '@/hocs/withAuth'
import { useAuth } from '@/contexts/AuthContext'
import { Poll, PollStats } from '@/types'
import toast from 'react-hot-toast'

function DashboardPage() {
  const { user, session } = useAuth()
  const [userPolls, setUserPolls] = useState<Poll[]>([])
  const [stats, setStats] = useState<PollStats>({ totalPolls: 0, totalVotes: 0, activePolls: 0, averageVotesPerPoll: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load data regardless of authentication status
    console.log('Fetching dashboard data')
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/dashboard')
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to fetch dashboard data')
        }
        const data = await response.json()
        setUserPolls(data.polls || [])
        setStats(data.stats || { totalPolls: 0, totalVotes: 0, activePolls: 0, averageVotesPerPoll: 0 })
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        toast.error(error instanceof Error ? error.message : 'Failed to load dashboard data')
        // Set empty data on error
        setUserPolls([])
        setStats({ totalPolls: 0, totalVotes: 0, activePolls: 0, averageVotesPerPoll: 0 })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's an overview of your polls.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Polls</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPolls}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalPolls > 0 ? `${Math.round(stats.averageVotesPerPoll)} avg votes per poll` : 'No polls yet'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVotes}</div>
            <p className="text-xs text-muted-foreground">
              Across all your polls
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Polls</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activePolls}</div>
            <p className="text-xs text-muted-foreground">
              Currently accepting votes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Polls */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Your Recent Polls</h2>
          <Link href="/polls/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create New Poll
            </Button>
          </Link>
        </div>

        {userPolls.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No polls yet</h3>
              <p className="text-gray-600 mb-4">Create your first poll to get started!</p>
              <Link href="/polls/create">
                <Button>Create your first poll</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {userPolls.slice(0, 6).map((poll) => (
              <PollCard key={poll.id} poll={poll} />
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks to help you manage your polls
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/polls/create">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <Plus className="h-6 w-6" />
                <span>Create Poll</span>
              </Button>
            </Link>
            <Link href="/polls">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <BarChart3 className="h-6 w-6" />
                <span>View All Polls</span>
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <Users className="h-6 w-6" />
                <span>Manage Account</span>
              </Button>
            </Link>
            <Link href="/polls">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                <TrendingUp className="h-6 w-6" />
                <span>View Analytics</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default withAuth(DashboardPage)
