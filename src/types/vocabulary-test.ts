import type { CefrLevel } from '@/types/vocabulary'

export const AVAILABLE_TEST_LEVELS = [
  'B1',
  'B2',
] as const satisfies readonly CefrLevel[]
export type AvailableTestLevel = (typeof AVAILABLE_TEST_LEVELS)[number]

export function isAvailableTestLevel(
  level: string,
): level is AvailableTestLevel {
  return (AVAILABLE_TEST_LEVELS as readonly string[]).includes(level)
}

export function parseTestLevelParam(param: string): AvailableTestLevel | null {
  const normalized = param.toUpperCase()
  return isAvailableTestLevel(normalized) ? normalized : null
}

export function getTestLevelPath(level: AvailableTestLevel): string {
  return `/test/${level.toLowerCase()}`
}

export interface VocabularyTestQuestion {
  vocabularyId: string
  expression: string
  prompt: string
  exampleIndex: number
  choices: string[]
  correctIndex: number
}

export interface VocabularyTest {
  level: CefrLevel
  questions: VocabularyTestQuestion[]
}

export interface VocabularyTestPart {
  partNumber: number
  questionCount: number
  questions: VocabularyTestQuestion[]
}

export const TEST_PART_COUNT = 5
export const TEST_QUESTIONS_PER_PART = 20

export function getTestParts(test: VocabularyTest): VocabularyTestPart[] {
  const questions = test.questions ?? []

  return Array.from({ length: TEST_PART_COUNT }, (_, index) => {
    const start = index * TEST_QUESTIONS_PER_PART
    const partQuestions = questions.slice(
      start,
      start + TEST_QUESTIONS_PER_PART,
    )

    return {
      partNumber: index + 1,
      questionCount: partQuestions.length,
      questions: partQuestions,
    }
  }).filter((part) => part.questionCount > 0)
}
