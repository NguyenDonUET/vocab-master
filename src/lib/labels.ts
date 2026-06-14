import type { PartOfSpeech, VocabularyCategory } from '@/types/vocabulary'

const CATEGORY_LABELS: Record<VocabularyCategory, string> = {
  word: 'Word',
  'phrasal-verb': 'Phrasal Verb',
  'fixed-expression': 'Fixed Expression',
  collocation: 'Collocation',
}

const PART_OF_SPEECH_LABELS: Record<PartOfSpeech, string> = {
  noun: 'Noun',
  verb: 'Verb',
  adjective: 'Adjective',
  adverb: 'Adverb',
  'phrasal-verb': 'Phrasal Verb',
  expression: 'Expression',
  collocation: 'Collocation',
}

export function formatCategoryLabel(category: VocabularyCategory): string {
  return CATEGORY_LABELS[category]
}

export function formatPartOfSpeechLabel(partOfSpeech: PartOfSpeech): string {
  return PART_OF_SPEECH_LABELS[partOfSpeech]
}
