'use client'

import { Loader2, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { deleteVocabularyAction } from '@/app/actions/vocabulary'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useProgressStore } from '@/stores/useProgressStore'
import { useStudyStore } from '@/stores/useStudyStore'

interface DeleteCardButtonProps {
  entryId: string
  expression: string
  onDeleted: (entryId: string) => void
  className?: string
}

export function DeleteCardButton({
  entryId,
  expression,
  onDeleted,
  className,
}: DeleteCardButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const forgetEntry = useProgressStore((state) => state.forgetEntry)
  const resetReveal = useStudyStore((state) => state.resetReveal)

  useEffect(() => {
    setIsDeleting(false)
    setError(null)
  }, [entryId])

  const handleDelete = async () => {
    setIsDeleting(true)
    setError(null)

    try {
      await deleteVocabularyAction(entryId)
      forgetEntry(entryId)
      resetReveal()
      onDeleted(entryId)
      router.refresh()
    } catch {
      setError('Could not delete this card. Try again.')
      setIsDeleting(false)
    }
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Button
        type="button"
        variant="outline"
        disabled={isDeleting}
        onClick={() => {
          void handleDelete()
        }}
        aria-label={`Delete ${expression}`}
        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
      >
        {isDeleting ? <Loader2 className="animate-spin" /> : <Trash2 />}
        <span className="truncate">
          {isDeleting ? 'Deleting...' : 'Delete'}
        </span>
      </Button>
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
