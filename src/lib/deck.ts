import type { CefrLevel, VocabularyEntry } from '@/types/vocabulary'

export type LevelFilter = CefrLevel | 'all'
export type LearnedFilter = 'all' | 'unlearned' | 'learned'

export function filterDeck(
  items: VocabularyEntry[],
  levelFilter: LevelFilter,
  learnedFilter: LearnedFilter = 'all',
  learnedIds: string[] = [],
): VocabularyEntry[] {
  const sorted = [...items].sort((a, b) => {
    const levelOrder = a.level.localeCompare(b.level)
    if (levelOrder !== 0) {
      return levelOrder
    }
    return a.expression.localeCompare(b.expression)
  })

  const levelFiltered =
    levelFilter === 'all'
      ? sorted
      : sorted.filter((item) => item.level === levelFilter)

  if (learnedFilter === 'all') {
    return levelFiltered
  }

  const learnedSet = new Set(learnedIds)

  if (learnedFilter === 'learned') {
    return levelFiltered.filter((item) => learnedSet.has(item.id))
  }

  return levelFiltered.filter((item) => !learnedSet.has(item.id))
}

export interface ProgressStats {
  total: number
  learned: number
  remaining: number
  completionPercent: number
}

export function computeProgressStats(
  deck: VocabularyEntry[],
  learnedIds: string[],
): ProgressStats {
  const learnedSet = new Set(learnedIds)
  const total = deck.length
  const learned = deck.filter((item) => learnedSet.has(item.id)).length
  const remaining = total - learned
  const completionPercent =
    total === 0 ? 0 : Math.round((learned / total) * 100)

  return { total, learned, remaining, completionPercent }
}
