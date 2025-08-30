'use client'

import { QRCodeSVG } from 'qrcode.react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Copy, Check } from 'lucide-react'

interface QRCodeProps {
  pollId: string
  size?: number
  title?: string
}

export function QRCode({ pollId, size = 200, title = 'Share Poll' }: QRCodeProps) {
  const [isCopied, setIsCopied] = useState(false)
  const pollUrl = `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/polls/${pollId}`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(pollUrl)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <div className="p-4 bg-white rounded-lg border">
          <QRCodeSVG
            value={pollUrl}
            size={size}
            level="M"
            includeMargin={true}
          />
        </div>
        
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">Scan to vote</p>
          <Button
            onClick={copyToClipboard}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            {isCopied ? (
              <>
                <Check className="h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy link
              </>
            )}
          </Button>
        </div>
        
        <div className="text-xs text-gray-500 text-center max-w-full break-all">
          {pollUrl}
        </div>
      </CardContent>
    </Card>
  )
}


