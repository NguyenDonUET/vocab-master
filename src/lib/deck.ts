import type { CefrLevel, VocabularyEntry } from '@/types/vocabulary'

export type LevelFilter = CefrLevel | 'all'

export function filterDeck(
  items: VocabularyEntry[],
  levelFilter: LevelFilter,
): VocabularyEntry[] {
  const sorted = [...items].sort((a, b) => a.id.localeCompare(b.id))

  if (levelFilter === 'all') {
    return sorted
  }

  return sorted.filter((item) => item.level === levelFilter)
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
