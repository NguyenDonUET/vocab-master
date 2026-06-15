import type {
  CefrLevel,
  PartOfSpeech,
  VocabularyCategory,
  VocabularyConversation,
  VocabularyDataset,
  VocabularyEntryInput,
} from '@/types/vocabulary'
import {
  CEFR_LEVELS,
  PARTS_OF_SPEECH,
  VOCABULARY_CATEGORIES,
} from '@/types/vocabulary'
import {
  findGlobalExpressionDuplicates,
  findLevelExpressionDuplicates,
  formatDuplicateReport,
} from '@/lib/vocabulary-index'

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
    typeof value === 'string' && PARTS_OF_SPEECH.includes(value as PartOfSpeech)
  )
}

function countSentences(text: string): number {
  return text.split(/[.!?]+/).filter((part) => part.trim().length > 0).length
}

function entryLabel(expression: string, level: CefrLevel): string {
  return `"${expression}" (${level})`
}

function validateConversation(
  value: unknown,
  label: string,
): VocabularyConversation {
  if (!value || typeof value !== 'object') {
    throw new Error(`Entry ${label} must include a conversation object.`)
  }

  const record = value as Record<string, unknown>
  const question = record.question
  const answer = record.answer

  if (typeof question !== 'string' || question.trim().length === 0) {
    throw new Error(`Entry ${label} has an invalid conversation.question.`)
  }

  if (typeof answer !== 'string' || answer.trim().length === 0) {
    throw new Error(`Entry ${label} has an invalid conversation.answer.`)
  }

  const answerSentences = countSentences(answer)
  if (answerSentences < 1 || answerSentences > 3) {
    throw new Error(
      `Entry ${label} conversation.answer must contain 1 to 3 sentences.`,
    )
  }

  return {
    question: question.trim(),
    answer: answer.trim(),
  }
}

function validateEntry(entry: unknown, index: number): VocabularyEntryInput {
  if (!entry || typeof entry !== 'object') {
    throw new Error(`Vocabulary entry at index ${index} must be an object.`)
  }

  const record = entry as Record<string, unknown>
  const expression = record.expression
  const category = record.category
  const partOfSpeech = record.partOfSpeech
  const level = record.level
  const ipa = record.ipa
  const meaningEn = record.meaningEn
  const meaningVi = record.meaningVi
  const examples = record.examples
  const conversation = record.conversation

  if (typeof expression !== 'string' || expression.trim().length === 0) {
    throw new Error(`Entry at index ${index} has an invalid expression.`)
  }

  if (!isVocabularyCategory(category)) {
    throw new Error(
      `Entry ${entryLabel(expression, level as CefrLevel)} has an invalid category.`,
    )
  }

  if (!isPartOfSpeech(partOfSpeech)) {
    throw new Error(
      `Entry ${entryLabel(expression, level as CefrLevel)} has an invalid partOfSpeech.`,
    )
  }

  if (!isCefrLevel(level)) {
    throw new Error(`Entry "${expression}" has an invalid level.`)
  }

  const label = entryLabel(expression, level)

  if (typeof ipa !== 'string' || ipa.trim().length === 0) {
    throw new Error(`Entry ${label} has an invalid ipa.`)
  }

  if (typeof meaningEn !== 'string' || meaningEn.trim().length === 0) {
    throw new Error(`Entry ${label} has an invalid meaningEn.`)
  }

  if (typeof meaningVi !== 'string' || meaningVi.trim().length === 0) {
    throw new Error(`Entry ${label} has an invalid meaningVi.`)
  }

  if (!Array.isArray(examples) || examples.length !== 3) {
    throw new Error(`Entry ${label} must have exactly 3 examples.`)
  }

  if (
    !examples.every(
      (example) => typeof example === 'string' && example.trim().length > 0,
    )
  ) {
    throw new Error(`Entry ${label} has invalid example sentences.`)
  }

  const validatedConversation = validateConversation(conversation, label)

  return {
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

  if (
    typeof version !== 'number' ||
    !Number.isInteger(version) ||
    version < 1
  ) {
    throw new Error('Vocabulary dataset version must be a positive integer.')
  }

  if (!Array.isArray(items)) {
    throw new Error('Vocabulary dataset items must be an array.')
  }

  const validatedItems = items.map(validateEntry)

  const levelDuplicates = findLevelExpressionDuplicates(validatedItems)
  if (levelDuplicates.length > 0) {
    throw new Error(
      formatDuplicateReport(
        levelDuplicates,
        'Duplicate vocabulary entry found',
      ),
    )
  }

  const globalDuplicates = findGlobalExpressionDuplicates(validatedItems)
  if (globalDuplicates.length > 0) {
    throw new Error(
      formatDuplicateReport(
        globalDuplicates,
        'Expression already used in another level',
      ),
    )
  }

  return {
    version,
    items: validatedItems,
  }
}

export const VOCABULARY_CATEGORY_TO_PRISMA = {
  word: 'word',
  'phrasal-verb': 'phrasal_verb',
  'fixed-expression': 'fixed_expression',
  collocation: 'collocation',
} as const satisfies Record<VocabularyCategory, string>

export const PART_OF_SPEECH_TO_PRISMA = {
  noun: 'noun',
  verb: 'verb',
  adjective: 'adjective',
  adverb: 'adverb',
  'phrasal-verb': 'phrasal_verb',
  expression: 'expression',
  collocation: 'collocation',
} as const satisfies Record<PartOfSpeech, string>

export const PRISMA_CATEGORY_TO_VOCABULARY = {
  word: 'word',
  phrasal_verb: 'phrasal-verb',
  fixed_expression: 'fixed-expression',
  collocation: 'collocation',
} as const

export const PRISMA_PART_OF_SPEECH_TO_VOCABULARY = {
  noun: 'noun',
  verb: 'verb',
  adjective: 'adjective',
  adverb: 'adverb',
  phrasal_verb: 'phrasal-verb',
  expression: 'expression',
  collocation: 'collocation',
} as const
