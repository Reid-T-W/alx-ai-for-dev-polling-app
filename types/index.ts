// Application-level models (what your frontend uses)
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: Date | string
  updatedAt: Date | string
}

export interface Poll {
  id: string
  title: string
  description?: string
  options: PollOption[]
  createdBy: string
  createdAt: Date | string
  updatedAt: Date | string
  expiresAt?: Date | string
  isActive: boolean
  totalVotes: number
}

export interface PollOption {
  id: string
  text: string
  orderIndex: number
  votes: number
  percentage: number
  createdAt: Date | string
}

export interface Vote {
  id: string
  pollId: string
  optionId: string
  userId?: string
  ipAddress?: string
  userAgent?: string
  createdAt: Date | string
}

// Input/Output types for API operations
export interface CreatePollData {
  title: string
  description?: string
  options: string[]
  expiresAt?: Date
}

export interface UpdatePollData {
  title?: string
  description?: string
  isActive?: boolean
  expiresAt?: Date
}

export interface PollStats {
  totalPolls: number
  totalVotes: number
  activePolls: number
  averageVotesPerPoll: number
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Database schema types (auto-generated from Supabase)
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      polls: {
        Row: {
          id: string
          title: string
          description: string | null
          created_by: string
          is_active: boolean
          expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          created_by: string
          is_active?: boolean
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          created_by?: string
          is_active?: boolean
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      poll_options: {
        Row: {
          id: string
          poll_id: string
          text: string
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          poll_id: string
          text: string
          order_index: number
          created_at?: string
        }
        Update: {
          id?: string
          poll_id?: string
          text?: string
          order_index?: number
          created_at?: string
        }
      }
      votes: {
        Row: {
          id: string
          poll_id: string
          option_id: string
          user_id: string | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          poll_id: string
          option_id: string
          user_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          poll_id?: string
          option_id?: string
          user_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
    }
  }
}

// Type helpers
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
