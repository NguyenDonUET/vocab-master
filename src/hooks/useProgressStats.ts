import { useMemo } from 'react'

import { computeProgressStats, filterDeck } from '@/lib/deck'
import { useProgressStore } from '@/stores/useProgressStore'
import { useStudyStore } from '@/stores/useStudyStore'
import type { VocabularyEntry } from '@/types/vocabulary'

export function useProgressStats(entries: VocabularyEntry[]) {
  const levelFilter = useStudyStore((state) => state.levelFilter)
  const learnedFilter = useStudyStore((state) => state.learnedFilter)
  const learnedIds = useProgressStore((state) => state.learnedIds)

  const deck = useMemo(
    () => filterDeck(entries, levelFilter, learnedFilter, learnedIds),
    [entries, levelFilter, learnedFilter, learnedIds],
  )

  return useMemo(
    () => computeProgressStats(deck, learnedIds),
    [deck, learnedIds],
  )
}
