'use client'

import { Check, Undo2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useProgressStore } from '@/stores/useProgressStore'

interface MarkUnlearnedButtonProps {
  entryId: string
  className?: string
}

export function MarkUnlearnedButton({
  entryId,
  className,
}: MarkUnlearnedButtonProps) {
  const unmarkLearned = useProgressStore((state) => state.unmarkLearned)
  const learned = useProgressStore((state) =>
    state.learnedIds.includes(entryId),
  )

  if (!learned) {
    return (
      <Button
        variant="outline"
        disabled
        className={cn('w-full sm:w-auto', className)}
      >
        <Check />
        <span className="truncate">Already unlearned</span>
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      onClick={() => unmarkLearned(entryId)}
      className={cn('w-full sm:w-auto', className)}
    >
      <Undo2 />
      <span className="truncate">Mark as unlearned</span>
    </Button>
  )
}
