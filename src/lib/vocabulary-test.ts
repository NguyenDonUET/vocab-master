import { cache } from 'react'

import type { VocabularyTest as PrismaVocabularyTest } from '@prisma/client'

import { prisma } from '@/lib/prisma'
import type { CefrLevel } from '@/types/vocabulary'
import type { VocabularyTest, VocabularyTestQuestion } from '@/types/vocabulary-test'

function toVocabularyTest(row: PrismaVocabularyTest): VocabularyTest {
  return {
    level: row.level,
    questions: row.questions.map(
      (question): VocabularyTestQuestion => ({
        vocabularyId: question.vocabularyId,
        expression: question.expression,
        prompt: question.prompt,
        exampleIndex: question.exampleIndex,
        choices: [...question.choices],
        correctIndex: question.correctIndex,
      }),
    ),
  }
}

export const getVocabularyTest = cache(
  async (level: CefrLevel): Promise<VocabularyTest | null> => {
    const row = await prisma.vocabularyTest.findUnique({
      where: { level },
    })

    return row ? toVocabularyTest(row) : null
  },
)

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function pickExampleIndex(seed: string): 0 | 1 | 2 {
  let hash = 0
  for (const char of seed) {
    hash = (hash + char.charCodeAt(0)) % 3
  }
  return hash as 0 | 1 | 2
}

function createPrompt(example: string, expression: string): string {
  const regex = new RegExp(escapeRegExp(expression), 'i')
  if (!regex.test(example)) {
    return example
  }

  return example.replace(regex, '______')
}

function shuffleWithSeed<T>(items: T[], seed: string): T[] {
  const copy = [...items]
  let state = 0

  for (const char of seed) {
    state = (state * 31 + char.charCodeAt(0)) >>> 0
  }

  for (let index = copy.length - 1; index > 0; index -= 1) {
    state = (state * 1664525 + 1013904223) >>> 0
    const swapIndex = state % (index + 1)
    ;[copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]]
  }

  return copy
}

function pickDistractors(
  expressions: string[],
  correctExpression: string,
  seed: string,
): string[] {
  const pool = expressions.filter((item) => item !== correctExpression)
  const shuffled = shuffleWithSeed(pool, `${seed}:distractors`)
  return shuffled.slice(0, 3)
}

export interface GenerateVocabularyTestOptions {
  level: CefrLevel
  choiceCount?: number
}

export async function generateVocabularyTest({
  level,
  choiceCount = 4,
}: GenerateVocabularyTestOptions): Promise<VocabularyTest> {
  const entries = await prisma.vocabularyEntry.findMany({
    where: { level },
    orderBy: { expression: 'asc' },
    select: {
      id: true,
      expression: true,
      examples: true,
    },
  })

  if (entries.length < choiceCount) {
    throw new Error(
      `Need at least ${choiceCount} vocabulary entries at ${level} to generate a test.`,
    )
  }

  const expressions = entries.map((entry) => entry.expression)
  const questions: VocabularyTestQuestion[] = entries.map((entry) => {
    const exampleIndex = pickExampleIndex(`${level}:${entry.expression}`)
    const example = entry.examples[exampleIndex]
    const prompt = createPrompt(example, entry.expression)
    const distractors = pickDistractors(
      expressions,
      entry.expression,
      `${level}:${entry.expression}`,
    )
    const choices = shuffleWithSeed(
      [entry.expression, ...distractors],
      `${level}:${entry.expression}:choices`,
    )
    const correctIndex = choices.indexOf(entry.expression)

    return {
      vocabularyId: entry.id,
      expression: entry.expression,
      prompt,
      exampleIndex,
      choices,
      correctIndex,
    }
  })

  return {
    level,
    questions,
  }
}

export async function upsertVocabularyTest(test: VocabularyTest): Promise<void> {
  await prisma.vocabularyTest.upsert({
    where: { level: test.level },
    create: {
      level: test.level,
      questions: test.questions,
    },
    update: {
      questions: test.questions,
    },
  })
}
