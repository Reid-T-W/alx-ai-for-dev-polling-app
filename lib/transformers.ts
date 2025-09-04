import { Tables, Inserts } from '@/types'
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
export function transformPollOption(
  dbOption: Tables<'poll_options'> & { votes?: { count: number }[] }
): PollOption {
  const votesCount = dbOption.votes && dbOption.votes.length > 0
    ? dbOption.votes[0]?.count ?? 0
    : 0

  return {
    id: dbOption.id,
    text: (dbOption as any).text ?? (dbOption as any).option_text,
    orderIndex: dbOption.order_index,
    votes: votesCount,
    percentage: 0, // Percentage should be set in context of totalVotes in transformPoll
    createdAt: new Date(dbOption.created_at),
  }
}

export function transformPoll(
  dbPoll: Tables<'polls'> & {
    poll_options: (Tables<'poll_options'> & {
      votes?: { count: number }[]
    })[]
  }
): Poll {
  // Handle the case where poll_options may be empty or undefined
  const pollOptions = Array.isArray(dbPoll.poll_options) ? dbPoll.poll_options : [];

  // Calculate totalVotes safely, considering missing or empty votes arrays
  const totalVotes = pollOptions.reduce((sum, option) => {
    const votesCount =
      Array.isArray(option.votes) && option.votes.length > 0
        ? option.votes[0]?.count ?? 0
        : 0;
    return sum + votesCount;
  }, 0);

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
    options: pollOptions.map(option => {
      const votesCount =
        Array.isArray(option.votes) && option.votes.length > 0
          ? option.votes[0]?.count ?? 0
          : 0;
      return {
        id: option.id,
        text: (option as any).text ?? (option as any).option_text,
        orderIndex: option.order_index,
        votes: votesCount,
        percentage: totalVotes > 0 ? (votesCount / totalVotes) * 100 : 0,
        createdAt: new Date(option.created_at),
      };
    }),
  };
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
}): Inserts<'polls'> {
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
}): Inserts<'votes'> {
  return {
    poll_id: vote.pollId,
    option_id: vote.optionId,
    user_id: vote.userId || null,
    ip_address: vote.ipAddress || null,
    user_agent: vote.userAgent || null,
  }
}


