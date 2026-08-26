'use client'

import { useEffect, useMemo, useState } from 'react'

import { EmptyDeckState } from '@/components/flashcard/EmptyDeckState'
import { FlashCard } from '@/components/flashcard/FlashCard'
import { FocusModeToggle } from '@/components/flashcard/FocusModeToggle'
import { FocusModeToolbar } from '@/components/flashcard/FocusModeToolbar'
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
  const [removedIds, setRemovedIds] = useState<string[]>([])
  const levelFilter = useStudyStore((state) => state.levelFilter)
  const learnedFilter = useStudyStore((state) => state.learnedFilter)
  const isFocusMode = useStudyStore((state) => state.isFocusMode)
  const visibleEntries = useMemo(
    () => entries.filter((entry) => !removedIds.includes(entry.id)),
    [entries, removedIds],
  )
  const { currentCard, deck, currentIndex, canGoNext, canGoPrev } =
    useFilteredDeck(visibleEntries)

  useStudyKeyboardShortcuts({
    deckLength: deck.length,
    canGoNext,
    canGoPrev,
    enabled: deck.length > 0 || isFocusMode,
  })

  useEffect(() => {
    return () => {
      useStudyStore.getState().setFocusMode(false)
    }
  }, [])

  const flashCard = currentCard ? (
    <FlashCard
      entry={currentCard}
      deckLength={deck.length}
      canGoPrev={canGoPrev}
      canGoNext={canGoNext}
      onDeleted={(entryId) =>
        setRemovedIds((current) =>
          current.includes(entryId) ? current : [...current, entryId],
        )
      }
    />
  ) : (
    <EmptyDeckState levelFilter={levelFilter} learnedFilter={learnedFilter} />
  )

  return (
    <div
      className={cn(
        isFocusMode
          ? 'flex min-h-[calc(100svh-2rem)] flex-col justify-center'
          : surfaces.page,
      )}
    >
      <ProgressHydrator initialLearnedIds={initialLearnedIds} />
      {isFocusMode ? null : <LevelFilter entries={visibleEntries} />}

      {isFocusMode ? (
        <div className={cn('w-full', spacing.section)}>
          <FocusModeToolbar entries={visibleEntries} />
          {flashCard}
        </div>
      ) : currentCard ? (
        <div className={cn('w-full', spacing.section)}>
          <div className="flex items-center justify-between gap-3">
            <p className={typography.body}>
              Card <span className={typography.label}>{currentIndex + 1}</span>{' '}
              of <span className={typography.label}>{deck.length}</span>
            </p>
            <div className="shrink-0">
              <FocusModeToggle />
            </div>
          </div>
          {flashCard}
        </div>
      ) : (
        <div className={cn('w-full', spacing.section)}>
          <div className="flex justify-end">
            <FocusModeToggle />
          </div>
          {flashCard}
        </div>
      )}
    </div>
  )
}
