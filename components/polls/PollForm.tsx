'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createPoll } from '@/lib/api/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Plus, Trash2, Calendar } from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const pollSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().optional(),
  options: z.array(z.string().min(1, 'Option text is required').max(100, 'Option too long')).min(2, 'At least 2 options required').max(10, 'Maximum 10 options allowed'),
  expiresAt: z.string().optional(),
})

type PollFormData = z.infer<typeof pollSchema>

export function PollForm() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  
  const { register, handleSubmit, control, formState: { errors }, watch } = useForm<PollFormData>({
    resolver: zodResolver(pollSchema),
    defaultValues: {
      title: '',
      description: '',
      options: ['', ''],
      expiresAt: '',
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'options',
  })

  const options = watch('options')

  const onSubmit = async (data: PollFormData) => {
    setLoading(true)
    try {
      const { pollId } = await createPoll({
        title: data.title,
        description: data.description,
        options: data.options.filter(option => option.trim() !== ''),
        expiresAt: data.expiresAt || undefined,
      })
      toast.success('Poll created successfully!')
      router.push(`/polls/${pollId}`)
    } catch (error) {
      console.error('Error creating poll:', error)
      toast.error('Failed to create poll')
    } finally {
      setLoading(false)
    }
  }

  const addOption = () => {
    if (fields.length < 10) {
      append('')
    }
  }

  const removeOption = (index: number) => {
    if (fields.length > 2) {
      remove(index)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Poll</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Poll Title *</Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="What's your question?"
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Add more context to your poll..."
              rows={3}
            />
          </div>

          {/* Options */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Poll Options *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addOption}
                disabled={fields.length >= 10}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Option
              </Button>
            </div>
            
            <div className="space-y-3">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <Input
                    {...register(`options.${index}`)}
                    placeholder={`Option ${index + 1}`}
                    className={errors.options?.[index] ? 'border-red-500' : ''}
                  />
                  {fields.length > 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeOption(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            
            {errors.options && (
              <p className="text-sm text-red-500">{errors.options.message}</p>
            )}
          </div>

          {/* Expiration Date */}
          <div className="space-y-2">
            <Label htmlFor="expiresAt">Expiration Date (Optional)</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="expiresAt"
                type="datetime-local"
                {...register('expiresAt')}
                className="pl-10"
              />
            </div>
            <p className="text-xs text-gray-500">
              Leave empty for no expiration
            </p>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Creating...' : 'Create Poll'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}


