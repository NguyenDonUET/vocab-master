'use client'

import { ChevronLeft, ChevronRight, Eye, EyeOff } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useStudyStore } from '@/stores/useStudyStore'

interface CardActionsProps {
  deckLength: number
  canGoPrev: boolean
  canGoNext: boolean
}

export function CardActions({
  deckLength,
  canGoPrev,
  canGoNext,
}: CardActionsProps) {
  const isRevealed = useStudyStore((state) => state.isRevealed)
  const reveal = useStudyStore((state) => state.reveal)
  const hide = useStudyStore((state) => state.hide)
  const prevCard = useStudyStore((state) => state.prevCard)
  const nextCard = useStudyStore((state) => state.nextCard)

  return (
    <div className="flex w-full flex-col gap-3 sm:grid sm:grid-cols-3 sm:items-center sm:gap-4">
      <div className="flex justify-stretch sm:justify-start">
        <Button
          variant="outline"
          onClick={prevCard}
          disabled={!canGoPrev}
          aria-label="Previous card"
          className="w-full sm:w-auto"
        >
          <ChevronLeft />
          <span className="hidden sm:inline">Previous</span>
          <span className="sm:hidden">Prev</span>
        </Button>
      </div>

      <div className="flex justify-stretch sm:justify-center">
        {isRevealed ? (
          <Button variant="outline" onClick={hide} className="w-full sm:w-auto">
            <EyeOff />
            Hide
          </Button>
        ) : (
          <Button onClick={reveal} className="w-full sm:w-auto">
            <Eye />
            Show
          </Button>
        )}
      </div>

      <div className="flex justify-stretch sm:justify-end">
        <Button
          variant="outline"
          onClick={() => nextCard(deckLength)}
          disabled={!canGoNext}
          aria-label="Next card"
          className="w-full sm:w-auto"
        >
          Next
          <ChevronRight />
        </Button>
      </div>
    </div>
  )
}
