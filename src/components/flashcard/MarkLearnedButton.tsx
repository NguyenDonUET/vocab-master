'use client'

import { Check, Undo2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useProgressStore } from '@/stores/useProgressStore'
import { useStudyStore } from '@/stores/useStudyStore'

interface MarkLearnedButtonProps {
  entryId: string
  deckLength: number
  canGoNext: boolean
  className?: string
}

export function MarkLearnedButton({
  entryId,
  deckLength,
  canGoNext,
  className,
}: MarkLearnedButtonProps) {
  const markLearned = useProgressStore((state) => state.markLearned)
  const unmarkLearned = useProgressStore((state) => state.unmarkLearned)
  const nextCard = useStudyStore((state) => state.nextCard)
  const learnedFilter = useStudyStore((state) => state.learnedFilter)
  const learned = useProgressStore((state) => state.learnedIds.includes(entryId))

  const handleMarkLearned = () => {
    void markLearned(entryId)
    if (canGoNext && learnedFilter !== 'unlearned') {
      nextCard(deckLength)
    }
  }

  if (learned) {
    return (
      <div className={cn('flex w-full items-center gap-2 sm:w-auto', className)}>
        <Button variant="secondary" disabled className="flex-1 sm:flex-none">
          <Check />
          <span className="truncate">Learned</span>
        </Button>
        <Button
          variant="outline"
          onClick={() => unmarkLearned(entryId)}
          className="flex-1 sm:flex-none"
        >
          <Undo2 />
          <span className="truncate">Undo</span>
        </Button>
      </div>
    )
  }

  return (
    <Button
      variant="outline"
      onClick={handleMarkLearned}
      className={cn(className)}
    >
      <Check />
      <span className="truncate">Mark as learned</span>
    </Button>
  )
}
