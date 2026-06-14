import { PrismaClient } from '@prisma/client'

import { loadRawDataset } from '../src/lib/vocabulary-index'
import {
  PART_OF_SPEECH_TO_PRISMA,
  validateVocabularyDataset,
  VOCABULARY_CATEGORY_TO_PRISMA,
} from '../src/lib/vocabulary-validation'
import type { CefrLevel, VocabularyEntryInput } from '../src/types/vocabulary'

const prisma = new PrismaClient()
const UPDATE_BATCH_SIZE = 25

function entryKey(expression: string, level: CefrLevel) {
  return `${level}::${expression}`
}

function toPrismaEntry(entry: VocabularyEntryInput) {
  return {
    expression: entry.expression,
    category: VOCABULARY_CATEGORY_TO_PRISMA[entry.category],
    partOfSpeech: PART_OF_SPEECH_TO_PRISMA[entry.partOfSpeech],
    level: entry.level,
    ipa: entry.ipa,
    meaningEn: entry.meaningEn,
    meaningVi: entry.meaningVi,
    examples: [...entry.examples],
    conversation: {
      question: entry.conversation.question,
      answer: entry.conversation.answer,
    },
  }
}

type PrismaEntryPayload = ReturnType<typeof toPrismaEntry>
type PrismaEntryUpdate = Omit<PrismaEntryPayload, 'expression' | 'level'>

function toUpdatePayload(data: PrismaEntryPayload): PrismaEntryUpdate {
  const { expression: _expression, level: _level, ...update } = data
  return update
}

function entryContentKey(data: PrismaEntryUpdate): string {
  return JSON.stringify(data)
}

async function runBatchedUpdates(
  updates: { id: string; data: PrismaEntryUpdate }[],
): Promise<void> {
  for (let index = 0; index < updates.length; index += UPDATE_BATCH_SIZE) {
    const batch = updates.slice(index, index + UPDATE_BATCH_SIZE)

    await Promise.all(
      batch.map(({ id, data }) =>
        prisma.vocabularyEntry.update({
          where: { id },
          data,
        }),
      ),
    )
  }
}

async function main() {
  const startedAt = Date.now()
  const dataset = validateVocabularyDataset(loadRawDataset())

  const existing = await prisma.vocabularyEntry.findMany({
    select: {
      id: true,
      expression: true,
      level: true,
      category: true,
      partOfSpeech: true,
      ipa: true,
      meaningEn: true,
      meaningVi: true,
      examples: true,
      conversation: true,
    },
  })

  const existingByKey = new Map(
    existing.map((row) => [entryKey(row.expression, row.level), row]),
  )

  const toCreate: PrismaEntryPayload[] = []
  const toUpdate: { id: string; data: PrismaEntryUpdate }[] = []

  for (const entry of dataset.items) {
    const data = toPrismaEntry(entry)
    const key = entryKey(entry.expression, entry.level)
    const row = existingByKey.get(key)
    const updateData = toUpdatePayload(data)

    if (!row) {
      toCreate.push(data)
      continue
    }

    const existingUpdate = {
      category: row.category,
      partOfSpeech: row.partOfSpeech,
      ipa: row.ipa,
      meaningEn: row.meaningEn,
      meaningVi: row.meaningVi,
      examples: row.examples,
      conversation: row.conversation,
    }

    if (entryContentKey(existingUpdate) !== entryContentKey(updateData)) {
      toUpdate.push({ id: row.id, data: updateData })
    }
  }

  if (toCreate.length > 0) {
    await prisma.vocabularyEntry.createMany({ data: toCreate })
  }

  await runBatchedUpdates(toUpdate)

  const unchanged = dataset.items.length - toCreate.length - toUpdate.length
  const elapsedMs = Date.now() - startedAt

  console.log(
    `Seeded ${dataset.items.length} vocabulary entries in ${elapsedMs}ms ` +
      `(${toCreate.length} created, ${toUpdate.length} updated, ${unchanged} unchanged).`,
  )
}

main()
  .catch((error) => {
    console.error('Seed failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
