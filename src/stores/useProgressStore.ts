import {
  markLearnedAction,
  resetProgressAction,
  unmarkLearnedAction,
} from '@/app/actions/progress'
import { create } from 'zustand'

interface ProgressState {
  learnedIds: string[]
  hydrated: boolean

  hydrate: (learnedIds: string[]) => void
  markLearned: (id: string) => Promise<void>
  unmarkLearned: (id: string) => Promise<void>
  isLearned: (id: string) => boolean
  resetProgress: () => Promise<void>
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  learnedIds: [],
  hydrated: false,

  hydrate: (learnedIds) =>
    set({
      learnedIds,
      hydrated: true,
    }),

  markLearned: async (id) => {
    const previousIds = get().learnedIds

    if (previousIds.includes(id)) {
      return
    }

    set({ learnedIds: [...previousIds, id] })

    try {
      const learnedIds = await markLearnedAction(id)
      set({ learnedIds })
    } catch {
      set({ learnedIds: previousIds })
    }
  },

  unmarkLearned: async (id) => {
    const previousIds = get().learnedIds

    if (!previousIds.includes(id)) {
      return
    }

    set({ learnedIds: previousIds.filter((learnedId) => learnedId !== id) })

    try {
      const learnedIds = await unmarkLearnedAction(id)
      set({ learnedIds })
    } catch {
      set({ learnedIds: previousIds })
    }
  },

  isLearned: (id) => get().learnedIds.includes(id),

  resetProgress: async () => {
    const previousIds = get().learnedIds

    set({ learnedIds: [] })

    try {
      await resetProgressAction()
    } catch {
      set({ learnedIds: previousIds })
    }
  },
}))
