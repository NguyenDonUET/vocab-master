import { recordTestPartResultAction } from '@/app/actions/test-progress'
import {
  getPartBestScore,
  isLevelComplete,
  isPartMastered,
  partKey,
  type CompletedTestPart,
} from '@/lib/test-progress'
import type { CefrLevel } from '@/types/vocabulary'
import { create } from 'zustand'

interface TestProgressState {
  completedParts: CompletedTestPart[]
  hydrated: boolean

  hydrate: (completedParts: CompletedTestPart[]) => void
  recordPartResult: (
    level: CefrLevel,
    partNumber: number,
    testVersion: number,
    correctCount: number,
    totalQuestions: number,
  ) => Promise<void>
  getPartBestScore: (
    level: CefrLevel,
    partNumber: number,
    testVersion: number,
    currentQuestionCount: number,
  ) => ReturnType<typeof getPartBestScore>
  isPartMastered: (
    level: CefrLevel,
    partNumber: number,
    testVersion: number,
    currentQuestionCount: number,
  ) => boolean
  isLevelComplete: (
    level: CefrLevel,
    parts: Array<{ partNumber: number; questionCount: number }>,
    testVersion: number,
  ) => boolean
  getMasteredPartCount: (
    level: CefrLevel,
    parts: Array<{ partNumber: number; questionCount: number }>,
    testVersion: number,
  ) => number
  getAttemptedPartCount: (
    level: CefrLevel,
    parts: Array<{ partNumber: number; questionCount: number }>,
    testVersion: number,
  ) => number
}

export const useTestProgressStore = create<TestProgressState>((set, get) => ({
  completedParts: [],
  hydrated: false,

  hydrate: (completedParts) =>
    set({
      completedParts,
      hydrated: true,
    }),

  recordPartResult: async (
    level,
    partNumber,
    testVersion,
    correctCount,
    totalQuestions,
  ) => {
    const previousParts = get().completedParts
    const key = partKey(level, partNumber)
    const existingEntry = previousParts.find(
      (part) => part.key === key && part.testVersion === testVersion,
    )
    const bestCorrect = Math.max(existingEntry?.bestCorrect ?? 0, correctCount)

    if (
      existingEntry &&
      existingEntry.bestCorrect === bestCorrect &&
      existingEntry.totalQuestions === totalQuestions
    ) {
      return
    }

    const optimisticParts = [
      ...previousParts.filter((part) => part.key !== key),
      { key, testVersion, bestCorrect, totalQuestions },
    ]

    set({ completedParts: optimisticParts })

    try {
      const completedParts = await recordTestPartResultAction(
        level,
        partNumber,
        testVersion,
        correctCount,
        totalQuestions,
      )
      set({ completedParts })
    } catch {
      set({ completedParts: previousParts })
    }
  },

  getPartBestScore: (level, partNumber, testVersion, currentQuestionCount) =>
    getPartBestScore(
      get().completedParts,
      level,
      partNumber,
      testVersion,
      currentQuestionCount,
    ),

  isPartMastered: (level, partNumber, testVersion, currentQuestionCount) =>
    isPartMastered(
      get().completedParts,
      level,
      partNumber,
      testVersion,
      currentQuestionCount,
    ),

  isLevelComplete: (level, parts, testVersion) =>
    isLevelComplete(get().completedParts, level, parts, testVersion),

  getMasteredPartCount: (level, parts, testVersion) =>
    parts.filter((part) =>
      isPartMastered(
        get().completedParts,
        level,
        part.partNumber,
        testVersion,
        part.questionCount,
      ),
    ).length,

  getAttemptedPartCount: (level, parts, testVersion) =>
    parts.filter(
      (part) =>
        getPartBestScore(
          get().completedParts,
          level,
          part.partNumber,
          testVersion,
          part.questionCount,
        ) !== null,
    ).length,
}))
