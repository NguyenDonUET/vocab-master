import { useEffect, useMemo } from 'react'

import { filterDeck } from '@/lib/deck'
import { useStudyStore } from '@/stores/useStudyStore'
import type { VocabularyEntry } from '@/types/vocabulary'

export function useFilteredDeck(entries: VocabularyEntry[]) {
  const levelFilter = useStudyStore((state) => state.levelFilter)
  const currentIndex = useStudyStore((state) => state.currentIndex)
  const setCurrentIndex = useStudyStore((state) => state.setCurrentIndex)

  const deck = useMemo(
    () => filterDeck(entries, levelFilter),
    [entries, levelFilter],
  )

  useEffect(() => {
    if (deck.length === 0) {
      if (currentIndex !== 0) {
        setCurrentIndex(0)
      }
      return
    }

    if (currentIndex >= deck.length) {
      setCurrentIndex(deck.length - 1)
    }
  }, [currentIndex, deck.length, setCurrentIndex])

  const safeIndex =
    deck.length === 0 ? 0 : Math.min(currentIndex, deck.length - 1)
  const currentCard = deck[safeIndex] ?? null
  const canGoNext = deck.length > 0 && safeIndex < deck.length - 1
  const canGoPrev = deck.length > 0 && safeIndex > 0

  return {
    deck,
    currentCard,
    currentIndex: safeIndex,
    canGoNext,
    canGoPrev,
  }
}
