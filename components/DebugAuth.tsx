"use client"

import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function DebugAuth() {
  const { user, session, loading } = useAuth()

  // Only show in development and when explicitly enabled
  if (process.env.NODE_ENV !== 'development' || !process.env.NEXT_PUBLIC_DEBUG_AUTH) {
    return null
  }

  return (
    <Card className="mb-4 border-yellow-200 bg-yellow-50">
      <CardHeader>
        <CardTitle className="text-sm text-yellow-800">Debug: Auth State</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xs space-y-1">
          <div><strong>Loading:</strong> {loading ? 'true' : 'false'}</div>
          <div><strong>User:</strong> {user ? user.email : 'null'}</div>
          <div><strong>User ID:</strong> {user?.id || 'null'}</div>
          <div><strong>Session:</strong> {session ? 'Active' : 'None'}</div>
          <div><strong>Session Token:</strong> {session?.access_token ? 'Present' : 'None'}</div>
          <div><strong>Session Expires:</strong> {session?.expires_at ? new Date(session.expires_at * 1000).toLocaleString() : 'None'}</div>
        </div>
      </CardContent>
    </Card>
  )
}
