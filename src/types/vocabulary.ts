export type CefrLevel = 'A2' | 'B1' | 'B2' | 'C1' | 'C2'

export type VocabularyCategory =
  | 'word'
  | 'phrasal-verb'
  | 'fixed-expression'
  | 'collocation'

export type PartOfSpeech =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'phrasal-verb'
  | 'expression'
  | 'collocation'

export interface VocabularyEntry {
  id: string
  expression: string
  category: VocabularyCategory
  partOfSpeech: PartOfSpeech
  level: CefrLevel
  ipa: string
  meaningEn: string
  meaningVi: string
  examples: [string, string, string]
}

export interface VocabularyDataset {
  version: number
  items: VocabularyEntry[]
}

export const CEFR_LEVELS: CefrLevel[] = ['A2', 'B1', 'B2', 'C1', 'C2']

export const VOCABULARY_CATEGORIES: VocabularyCategory[] = [
  'word',
  'phrasal-verb',
  'fixed-expression',
  'collocation',
]

export const PARTS_OF_SPEECH: PartOfSpeech[] = [
  'noun',
  'verb',
  'adjective',
  'adverb',
  'phrasal-verb',
  'expression',
  'collocation',
]
