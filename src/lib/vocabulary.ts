import type {
  CefrLevel,
  PartOfSpeech,
  VocabularyCategory,
  VocabularyConversation,
  VocabularyDataset,
  VocabularyEntry,
} from '@/types/vocabulary'
import {
  CEFR_LEVELS,
  PARTS_OF_SPEECH,
  VOCABULARY_CATEGORIES,
} from '@/types/vocabulary'
import a2Items from '@/data/levels/a2.json'
import b1Items from '@/data/levels/b1.json'
import b2Items from '@/data/levels/b2.json'
import c1Items from '@/data/levels/c1.json'
import c2Items from '@/data/levels/c2.json'

const DATASET_VERSION = 1

const itemsByLevel: Record<CefrLevel, unknown[]> = {
  A2: a2Items,
  B1: b1Items,
  B2: b2Items,
  C1: c1Items,
  C2: c2Items,
}

const rawDataset = {
  version: DATASET_VERSION,
  items: CEFR_LEVELS.flatMap((level) => itemsByLevel[level]),
}

function isCefrLevel(value: unknown): value is CefrLevel {
  return typeof value === 'string' && CEFR_LEVELS.includes(value as CefrLevel)
}

function isVocabularyCategory(value: unknown): value is VocabularyCategory {
  return (
    typeof value === 'string' &&
    VOCABULARY_CATEGORIES.includes(value as VocabularyCategory)
  )
}

function isPartOfSpeech(value: unknown): value is PartOfSpeech {
  return (
    typeof value === 'string' &&
    PARTS_OF_SPEECH.includes(value as PartOfSpeech)
  )
}

function countSentences(text: string): number {
  return text.split(/[.!?]+/).filter((part) => part.trim().length > 0).length
}

function validateConversation(
  value: unknown,
  id: string,
): VocabularyConversation {
  if (!value || typeof value !== 'object') {
    throw new Error(`Entry "${id}" must include a conversation object.`)
  }

  const record = value as Record<string, unknown>
  const question = record.question
  const answer = record.answer

  if (typeof question !== 'string' || question.trim().length === 0) {
    throw new Error(`Entry "${id}" has an invalid conversation.question.`)
  }

  if (typeof answer !== 'string' || answer.trim().length === 0) {
    throw new Error(`Entry "${id}" has an invalid conversation.answer.`)
  }

  const answerSentences = countSentences(answer)
  if (answerSentences < 1 || answerSentences > 3) {
    throw new Error(
      `Entry "${id}" conversation.answer must contain 1 to 3 sentences.`,
    )
  }

  return {
    question: question.trim(),
    answer: answer.trim(),
  }
}

function validateEntry(entry: unknown, index: number): VocabularyEntry {
  if (!entry || typeof entry !== 'object') {
    throw new Error(`Vocabulary entry at index ${index} must be an object.`)
  }

  const record = entry as Record<string, unknown>
  const id = record.id
  const expression = record.expression
  const category = record.category
  const partOfSpeech = record.partOfSpeech
  const level = record.level
  const ipa = record.ipa
  const meaningEn = record.meaningEn
  const meaningVi = record.meaningVi
  const examples = record.examples
  const conversation = record.conversation

  if (typeof id !== 'string' || id.trim().length === 0) {
    throw new Error(`Entry at index ${index} has an invalid id.`)
  }

  if (typeof expression !== 'string' || expression.trim().length === 0) {
    throw new Error(`Entry "${id}" has an invalid expression.`)
  }

  if (!isVocabularyCategory(category)) {
    throw new Error(`Entry "${id}" has an invalid category.`)
  }

  if (!isPartOfSpeech(partOfSpeech)) {
    throw new Error(`Entry "${id}" has an invalid partOfSpeech.`)
  }

  if (!isCefrLevel(level)) {
    throw new Error(`Entry "${id}" has an invalid level.`)
  }

  if (typeof ipa !== 'string' || ipa.trim().length === 0) {
    throw new Error(`Entry "${id}" has an invalid ipa.`)
  }

  if (typeof meaningEn !== 'string' || meaningEn.trim().length === 0) {
    throw new Error(`Entry "${id}" has an invalid meaningEn.`)
  }

  if (typeof meaningVi !== 'string' || meaningVi.trim().length === 0) {
    throw new Error(`Entry "${id}" has an invalid meaningVi.`)
  }

  if (!Array.isArray(examples) || examples.length !== 3) {
    throw new Error(`Entry "${id}" must have exactly 3 examples.`)
  }

  if (!examples.every((example) => typeof example === 'string' && example.trim().length > 0)) {
    throw new Error(`Entry "${id}" has invalid example sentences.`)
  }

  const validatedConversation = validateConversation(conversation, id)

  return {
    id,
    expression,
    category,
    partOfSpeech,
    level,
    ipa,
    meaningEn,
    meaningVi,
    examples: [examples[0], examples[1], examples[2]],
    conversation: validatedConversation,
  }
}

export function validateVocabularyDataset(data: unknown): VocabularyDataset {
  if (!data || typeof data !== 'object') {
    throw new Error('Vocabulary dataset must be an object.')
  }

  const record = data as Record<string, unknown>
  const version = record.version
  const items = record.items

  if (typeof version !== 'number' || !Number.isInteger(version) || version < 1) {
    throw new Error('Vocabulary dataset version must be a positive integer.')
  }

  if (!Array.isArray(items)) {
    throw new Error('Vocabulary dataset items must be an array.')
  }

  const validatedItems = items.map(validateEntry)
  const seenIds = new Set<string>()

  for (const item of validatedItems) {
    if (seenIds.has(item.id)) {
      throw new Error(`Duplicate vocabulary id found: "${item.id}".`)
    }
    seenIds.add(item.id)
  }

  return {
    version,
    items: validatedItems,
  }
}

export function loadVocabulary(): VocabularyDataset {
  try {
    return validateVocabularyDataset(rawDataset)
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown validation error.'

    if (process.env.NODE_ENV === 'development') {
      console.error('[vocabulary] Failed to load dataset:', message)
    }

    throw error
  }
}

export function getVocabularyEntries(): VocabularyEntry[] {
  return loadVocabulary().items
}
