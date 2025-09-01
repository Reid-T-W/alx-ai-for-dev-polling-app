import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Return mock data for testing without authentication
    const now = new Date()
    const mockPolls = [
      {
        id: '1',
        title: 'Sample Poll 1',
        description: 'This is a sample poll for testing',
        createdBy: 'user1',
        isActive: true,
        expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: now,
        options: [
          { id: '1', text: 'Option 1', votes: 5, orderIndex: 0, percentage: 50, createdAt: now },
          { id: '2', text: 'Option 2', votes: 3, orderIndex: 1, percentage: 30, createdAt: now },
          { id: '3', text: 'Option 3', votes: 2, orderIndex: 2, percentage: 20, createdAt: now }
        ],
        totalVotes: 10
      },
      {
        id: '2',
        title: 'Sample Poll 2',
        description: 'Another sample poll',
        createdBy: 'user1',
        isActive: true,
        expiresAt: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
        createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        updatedAt: now,
        options: [
          { id: '4', text: 'Yes', votes: 8, orderIndex: 0, percentage: 67, createdAt: now },
          { id: '5', text: 'No', votes: 4, orderIndex: 1, percentage: 33, createdAt: now }
        ],
        totalVotes: 12
      }
    ]

    const mockStats = {
      totalPolls: 2,
      totalVotes: 22,
      activePolls: 2,
      averageVotesPerPoll: 11
    }

    return NextResponse.json({
      polls: mockPolls,
      stats: mockStats
    })
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
