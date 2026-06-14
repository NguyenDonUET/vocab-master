'use client'

import { EmptyDeckState } from '@/components/flashcard/EmptyDeckState'
import { FlashCard } from '@/components/flashcard/FlashCard'
import { LevelFilter } from '@/components/filters/LevelFilter'
import { ProgressHydrator } from '@/components/progress/ProgressHydrator'
import { useFilteredDeck } from '@/hooks/useFilteredDeck'
import { useStudyKeyboardShortcuts } from '@/hooks/useStudyKeyboardShortcuts'
import { spacing, surfaces, typography } from '@/lib/design-system'
import { useStudyStore } from '@/stores/useStudyStore'
import { cn } from '@/lib/utils'
import type { VocabularyEntry } from '@/types/vocabulary'

interface StudyPageProps {
  entries: VocabularyEntry[]
  initialLearnedIds: string[]
}

export function StudyPage({ entries, initialLearnedIds }: StudyPageProps) {
  const levelFilter = useStudyStore((state) => state.levelFilter)
  const { currentCard, deck, currentIndex, canGoNext, canGoPrev } =
    useFilteredDeck(entries)

  useStudyKeyboardShortcuts({
    deckLength: deck.length,
    canGoNext,
    canGoPrev,
    enabled: deck.length > 0,
  })

  return (
    <div className={surfaces.page}>
      <ProgressHydrator initialLearnedIds={initialLearnedIds} />
      <LevelFilter entries={entries} />

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
