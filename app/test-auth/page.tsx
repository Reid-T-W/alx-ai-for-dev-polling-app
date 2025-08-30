"use client"

import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function TestAuthPage() {
  const { user, session, loading, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    toast.success('Signed out successfully')
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Authentication Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <strong>Loading:</strong> {loading ? 'true' : 'false'}
          </div>
          <div>
            <strong>User:</strong> {user ? user.email : 'Not signed in'}
          </div>
          <div>
            <strong>User ID:</strong> {user?.id || 'N/A'}
          </div>
          <div>
            <strong>Session:</strong> {session ? 'Active' : 'None'}
          </div>
          <div>
            <strong>Session Token:</strong> {session?.access_token ? 'Present' : 'None'}
          </div>
          
          <div className="pt-4 space-y-2">
            <Button 
              onClick={() => router.push('/dashboard')}
              className="w-full"
            >
              Test Dashboard Access
            </Button>
            <Button 
              onClick={() => router.push('/auth/login?redirectTo=/dashboard')}
              variant="outline"
              className="w-full"
            >
              Test Login with Dashboard Redirect
            </Button>
            <Button 
              onClick={handleSignOut}
              variant="outline"
              className="w-full"
            >
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
