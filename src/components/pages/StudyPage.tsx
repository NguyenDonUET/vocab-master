'use client'

import { EmptyDeckState } from '@/components/flashcard/EmptyDeckState'
import { FlashCard } from '@/components/flashcard/FlashCard'
import { LevelFilter } from '@/components/filters/LevelFilter'
import { useFilteredDeck } from '@/hooks/useFilteredDeck'
import { useStudyKeyboardShortcuts } from '@/hooks/useStudyKeyboardShortcuts'
import { spacing, surfaces, typography } from '@/lib/design-system'
import { getVocabularyEntries } from '@/lib/vocabulary'
import { useStudyStore } from '@/stores/useStudyStore'
import { cn } from '@/lib/utils'

const vocabulary = getVocabularyEntries()

export function StudyPage() {
  const levelFilter = useStudyStore((state) => state.levelFilter)
  const { currentCard, deck, currentIndex, canGoNext, canGoPrev } =
    useFilteredDeck(vocabulary)

  useStudyKeyboardShortcuts({
    deckLength: deck.length,
    canGoNext,
    canGoPrev,
    enabled: deck.length > 0,
  })

  return (
    <div className={surfaces.page}>
      <LevelFilter />

      {currentCard ? (
        <div className={cn('w-full', spacing.section)}>
          <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <p className={typography.body}>
              Card{' '}
              <span className={typography.label}>{currentIndex + 1}</span> of{' '}
              <span className={typography.label}>{deck.length}</span>
            </p>
          </div>
          <FlashCard
            entry={currentCard}
            deckLength={deck.length}
            canGoPrev={canGoPrev}
            canGoNext={canGoNext}
          />
        </div>
      ) : (
        <EmptyDeckState levelFilter={levelFilter} />
      )}
    </div>
  )
}
