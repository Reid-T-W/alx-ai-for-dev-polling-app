"use client"

import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function TestRedirectPage() {
  const { user, session, loading } = useAuth()
  const router = useRouter()

  const testRedirects = () => {
    console.log('Testing redirects...')
    
    // Test 1: Direct router push
    console.log('Test 1: Direct router push to /dashboard')
    router.push('/dashboard')
    
    // Test 2: After a delay
    setTimeout(() => {
      console.log('Test 2: Delayed router push to /dashboard')
      router.push('/dashboard')
    }, 2000)
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
          <CardTitle>Redirect Test Page</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <strong>User:</strong> {user ? user.email : 'Not signed in'}
          </div>
          <div>
            <strong>Session:</strong> {session ? 'Active' : 'None'}
          </div>
          
          <div className="pt-4 space-y-2">
            <Button 
              onClick={() => router.push('/dashboard')}
              className="w-full"
            >
              Test Dashboard Redirect
            </Button>
            <Button 
              onClick={() => router.push('/auth/login?redirectTo=/dashboard')}
              variant="outline"
              className="w-full"
            >
              Test Login with Redirect
            </Button>
            <Button 
              onClick={testRedirects}
              variant="outline"
              className="w-full"
            >
              Test Multiple Redirects
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
