import type { CefrLevel } from '@/types/vocabulary'

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
  return Array.from({ length: TEST_PART_COUNT }, (_, index) => {
    const start = index * TEST_QUESTIONS_PER_PART
    const questions = test.questions.slice(start, start + TEST_QUESTIONS_PER_PART)

    return {
      partNumber: index + 1,
      questionCount: questions.length,
      questions,
    }
  }).filter((part) => part.questionCount > 0)
}
