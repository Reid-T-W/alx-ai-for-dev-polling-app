"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function EnvCheckPage() {
  const envVars = {
    'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL,
    'NEXT_PUBLIC_SUPABASE_ANON_KEY': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set (hidden)' : 'Not set',
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Environment Variables Check</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(envVars).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <strong>{key}:</strong>
              <span className={value ? 'text-green-600' : 'text-red-600'}>
                {value || 'Not set'}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
