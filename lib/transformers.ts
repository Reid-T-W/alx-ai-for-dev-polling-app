import { Tables } from '@/types'
import { User, Poll, PollOption, Vote } from '@/types'

// Transform database row to application model
export function transformUser(dbUser: Tables<'profiles'>): User {
  return {
    id: dbUser.id,
    email: dbUser.email,
    name: dbUser.name || '',
    avatar: dbUser.avatar_url || undefined,
    createdAt: new Date(dbUser.created_at),
    updatedAt: new Date(dbUser.updated_at),
  }
}

export function transformPoll(
  dbPoll: Tables<'polls'> & {
    poll_options: (Tables<'poll_options'> & {
      votes: { count: number }[]
    })[]
  }
): Poll {
  const totalVotes = dbPoll.poll_options.reduce(
    (sum, option) => sum + (option.votes[0]?.count || 0),
    0
  )

  return {
    id: dbPoll.id,
    title: dbPoll.title,
    description: dbPoll.description || undefined,
    createdBy: 'anonymous', // Default value since field was removed
    createdAt: new Date(dbPoll.created_at),
    updatedAt: new Date(dbPoll.updated_at),
    expiresAt: dbPoll.expires_at ? new Date(dbPoll.expires_at) : undefined,
    isActive: dbPoll.is_active,
    totalVotes,
    options: dbPoll.poll_options.map(option => ({
      id: option.id,
      text: option.text,
      orderIndex: option.order_index,
      votes: option.votes[0]?.count || 0,
      percentage: totalVotes > 0 ? ((option.votes[0]?.count || 0) / totalVotes) * 100 : 0,
      createdAt: new Date(option.created_at),
    })),
  }
}

export function transformVote(dbVote: Tables<'votes'>): Vote {
  return {
    id: dbVote.id,
    pollId: dbVote.poll_id,
    optionId: dbVote.option_id,
    userId: dbVote.user_id || undefined,
    ipAddress: dbVote.ip_address || undefined,
    userAgent: dbVote.user_agent || undefined,
    createdAt: new Date(dbVote.created_at),
  }
}

// Transform application model to database insert
export function transformPollForInsert(poll: {
  title: string
  description?: string
  expiresAt?: Date
}): Tables<'polls'>['Insert'] {
  return {
    title: poll.title,
    description: poll.description || null,
    expires_at: poll.expiresAt?.toISOString() || null,
  }
}

export function transformVoteForInsert(vote: {
  pollId: string
  optionId: string
  userId?: string
  ipAddress?: string
  userAgent?: string
}): Tables<'votes'>['Insert'] {
  return {
    poll_id: vote.pollId,
    option_id: vote.optionId,
    user_id: vote.userId || null,
    ip_address: vote.ipAddress || null,
    user_agent: vote.userAgent || null,
  }
}


