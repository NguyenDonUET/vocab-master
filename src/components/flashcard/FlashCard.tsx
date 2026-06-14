'use client'

import { CardActions } from '@/components/flashcard/CardActions'
import { CardBack } from '@/components/flashcard/CardBack'
import { CardFront } from '@/components/flashcard/CardFront'
import { MarkLearnedButton } from '@/components/flashcard/MarkLearnedButton'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { useStudyStore } from '@/stores/useStudyStore'
import type { VocabularyEntry } from '@/types/vocabulary'

interface FlashCardProps {
  entry: VocabularyEntry
  deckLength: number
  canGoPrev: boolean
  canGoNext: boolean
}

export function FlashCard({
  entry,
  deckLength,
  canGoPrev,
  canGoNext,
}: FlashCardProps) {
  const isRevealed = useStudyStore((state) => state.isRevealed)

  return (
    <Card className="w-full overflow-hidden">
      <CardContent className="space-y-4 px-4 pb-4 md:space-y-6 md:px-6 md:pb-6">
        <CardFront entry={entry} />
        <div className="flex w-full justify-stretch border-t border-border/60 pt-4 sm:justify-end">
          <MarkLearnedButton entryId={entry.id} className="w-full sm:w-auto" />
        </div>
        {isRevealed && <CardBack entry={entry} />}
      </CardContent>
      <CardFooter className="border-t border-border/60 bg-muted/30 px-4 py-4 md:px-6">
        <CardActions
          deckLength={deckLength}
          canGoPrev={canGoPrev}
          canGoNext={canGoNext}
        />
      </CardFooter>
    </Card>
  )
}
