import { cache } from 'react'

import type { VocabularyEntry as PrismaVocabularyEntry } from '@prisma/client'

import { prisma } from '@/lib/prisma'
import {
  PRISMA_CATEGORY_TO_VOCABULARY,
  PRISMA_PART_OF_SPEECH_TO_VOCABULARY,
} from '@/lib/vocabulary-validation'
import type { VocabularyEntry } from '@/types/vocabulary'

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
