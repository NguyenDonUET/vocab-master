import { useMemo } from 'react'

import { computeProgressStats, filterDeck } from '@/lib/deck'
import { useProgressStore } from '@/stores/useProgressStore'
import { useStudyStore } from '@/stores/useStudyStore'
import type { VocabularyEntry } from '@/types/vocabulary'

export function useProgressStats(entries: VocabularyEntry[]) {
  const levelFilter = useStudyStore((state) => state.levelFilter)
  const learnedIds = useProgressStore((state) => state.learnedIds)

  const deck = useMemo(
    () => filterDeck(entries, levelFilter),
    [entries, levelFilter],
  )

  return useMemo(
    () => computeProgressStats(deck, learnedIds),
    [deck, learnedIds],
  )
}
