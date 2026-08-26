'use client'

import { useMemo } from 'react'

import { Progress } from '@/components/ui/progress'
import { computeProgressStats, filterDeck } from '@/lib/deck'
import { typography } from '@/lib/design-system'
import { useProgressStore } from '@/stores/useProgressStore'
import { useStudyStore } from '@/stores/useStudyStore'
import { cn } from '@/lib/utils'
import type { VocabularyEntry } from '@/types/vocabulary'

interface FocusModeProgressProps {
  entries: VocabularyEntry[]
}

export function FocusModeProgress({ entries }: FocusModeProgressProps) {
  const levelFilter = useStudyStore((state) => state.levelFilter)
  const learnedIds = useProgressStore((state) => state.learnedIds)

  const { total, learned, remaining, completionPercent } = useMemo(() => {
    const levelDeck = filterDeck(entries, levelFilter, 'all', learnedIds)
    return computeProgressStats(levelDeck, learnedIds)
  }, [entries, learnedIds, levelFilter])

  if (total === 0) {
    return null
  }

  return (
    <div className="min-w-0 flex-1 space-y-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <p className={typography.body}>
          <span className={cn(typography.label, 'tabular-nums')}>
            {learned}
          </span>
          {' of '}
          <span className={cn(typography.label, 'tabular-nums')}>{total}</span>
          {' learned'}
        </p>
        <p className={cn(typography.body, 'tabular-nums')}>
          {remaining === 0 ? 'All learned' : `${remaining} left`}
        </p>
      </div>
      <Progress
        value={completionPercent}
        className="h-1.5"
        aria-label={`${learned} of ${total} cards learned`}
      />
    </div>
  )
}
