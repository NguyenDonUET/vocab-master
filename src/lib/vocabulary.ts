import { cache } from 'react'

import type { VocabularyEntry as PrismaVocabularyEntry } from '@prisma/client'

import { prisma } from '@/lib/prisma'
import {
  PRISMA_CATEGORY_TO_VOCABULARY,
  PRISMA_PART_OF_SPEECH_TO_VOCABULARY,
} from '@/lib/vocabulary-validation'
import type { VocabularyEntry } from '@/types/vocabulary'

const OBJECT_ID_PATTERN = /^[a-fA-F0-9]{24}$/

function isObjectId(id: string): boolean {
  return OBJECT_ID_PATTERN.test(id)
}

export function toVocabularyEntry(row: PrismaVocabularyEntry): VocabularyEntry {
  return {
    id: row.id,
    expression: row.expression,
    category: PRISMA_CATEGORY_TO_VOCABULARY[row.category],
    partOfSpeech: PRISMA_PART_OF_SPEECH_TO_VOCABULARY[row.partOfSpeech],
    level: row.level,
    ipa: row.ipa,
    meaningEn: row.meaningEn,
    meaningVi: row.meaningVi,
    examples: [row.examples[0], row.examples[1], row.examples[2]],
    conversation: {
      question: row.conversation.question,
      answer: row.conversation.answer,
    },
  }
}

export const getVocabularyEntries = cache(
  async (): Promise<VocabularyEntry[]> => {
    const rows = await prisma.vocabularyEntry.findMany({
      orderBy: [{ level: 'asc' }, { expression: 'asc' }],
    })

    return rows.map(toVocabularyEntry)
  },
)

export async function deleteVocabularyEntry(entryId: string): Promise<void> {
  if (!isObjectId(entryId)) {
    throw new Error('Invalid card.')
  }

  const entry = await prisma.vocabularyEntry.findUnique({
    where: { id: entryId },
    select: { id: true, level: true },
  })

  if (entry) {
    await prisma.vocabularyEntry.delete({
      where: { id: entryId },
    })

    const test = await prisma.vocabularyTest.findUnique({
      where: { level: entry.level },
      select: { questions: true },
    })

    if (test?.questions.some((question) => question.vocabularyId === entryId)) {
      await prisma.vocabularyTest.update({
        where: { level: entry.level },
        data: {
          questions: test.questions.filter(
            (question) => question.vocabularyId !== entryId,
          ),
        },
      })
    }
  }

  const progressRows = await prisma.userProgress.findMany({
    select: { deviceId: true, learnedIds: true },
  })

  await Promise.all(
    progressRows
      .filter((row) => row.learnedIds.includes(entryId))
      .map((row) =>
        prisma.userProgress.update({
          where: { deviceId: row.deviceId },
          data: {
            learnedIds: row.learnedIds.filter((id) => id !== entryId),
          },
        }),
      ),
  )
}
