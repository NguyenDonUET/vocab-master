import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ProgressState {
  learnedIds: string[]

  markLearned: (id: string) => void
  isLearned: (id: string) => boolean
  resetProgress: () => void
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      learnedIds: [],

      markLearned: (id) =>
        set((state) =>
          state.learnedIds.includes(id)
            ? state
            : { learnedIds: [...state.learnedIds, id] },
        ),

      isLearned: (id) => get().learnedIds.includes(id),

      resetProgress: () => set({ learnedIds: [] }),
    }),
    {
      name: 'learn-vocab-progress',
      partialize: (state) => ({ learnedIds: state.learnedIds }),
    },
  ),
)
