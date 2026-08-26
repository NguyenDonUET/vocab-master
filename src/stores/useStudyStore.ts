import { create } from 'zustand'

import type { LevelFilter, LearnedFilter } from '@/lib/deck'

interface StudyState {
  levelFilter: LevelFilter
  learnedFilter: LearnedFilter
  currentIndex: number
  isRevealed: boolean
  isFocusMode: boolean

  setLevelFilter: (level: LevelFilter) => void
  setLearnedFilter: (filter: LearnedFilter) => void
  setCurrentIndex: (index: number) => void
  nextCard: (deckLength: number) => void
  prevCard: () => void
  reveal: () => void
  hide: () => void
  resetReveal: () => void
  toggleFocusMode: () => void
  setFocusMode: (value: boolean) => void
}

export const useStudyStore = create<StudyState>((set) => ({
  levelFilter: 'all',
  learnedFilter: 'all',
  currentIndex: 0,
  isRevealed: false,
  isFocusMode: false,

  setLevelFilter: (level) =>
    set({ levelFilter: level, currentIndex: 0, isRevealed: false }),

  setLearnedFilter: (filter) =>
    set({ learnedFilter: filter, currentIndex: 0, isRevealed: false }),

  setCurrentIndex: (index) => set({ currentIndex: index, isRevealed: false }),

  nextCard: (deckLength) =>
    set((state) => ({
      currentIndex:
        deckLength === 0 ? 0 : Math.min(state.currentIndex + 1, deckLength - 1),
      isRevealed: false,
    })),

  prevCard: () =>
    set((state) => ({
      currentIndex: Math.max(state.currentIndex - 1, 0),
      isRevealed: false,
    })),

  reveal: () => set({ isRevealed: true }),

  hide: () => set({ isRevealed: false }),

  resetReveal: () => set({ isRevealed: false }),

  toggleFocusMode: () => set((state) => ({ isFocusMode: !state.isFocusMode })),

  setFocusMode: (value) => set({ isFocusMode: value }),
}))
