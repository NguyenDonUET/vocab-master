'use client'

import { useMemo } from 'react'

import { LearnedFilterToggle } from '@/components/filters/LearnedFilterToggle'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SectionLabel } from '@/components/ui/page-header'
import { filterDeck } from '@/lib/deck'
import type { LevelFilter } from '@/lib/deck'
import { spacing, surface, typography } from '@/lib/design-system'
import { useProgressStore } from '@/stores/useProgressStore'
import { useStudyStore } from '@/stores/useStudyStore'
import { cn } from '@/lib/utils'
import { CEFR_LEVELS, type VocabularyEntry } from '@/types/vocabulary'

const FILTER_OPTIONS: { value: LevelFilter; label: string }[] = [
  { value: 'all', label: 'All levels' },
  ...CEFR_LEVELS.map((level) => ({ value: level, label: level })),
]

function formatVocabCount(count: number): string {
  return `${count} ${count === 1 ? 'vocabulary' : 'vocabularies'}`
}

interface LevelFilterProps {
  entries: VocabularyEntry[]
}

export function LevelFilter({ entries }: LevelFilterProps) {
  const levelFilter = useStudyStore((state) => state.levelFilter)
  const learnedFilter = useStudyStore((state) => state.learnedFilter)
  const learnedIds = useProgressStore((state) => state.learnedIds)
  const setLevelFilter = useStudyStore((state) => state.setLevelFilter)

  const vocabCount = useMemo(
    () => filterDeck(entries, levelFilter, learnedFilter, learnedIds).length,
    [entries, levelFilter, learnedFilter, learnedIds],
  )

  return (
    <div className={cn(surface.panel, spacing.section)}>
      <div className="space-y-1">
        <SectionLabel>Filters</SectionLabel>
        <p className={typography.body}>{formatVocabCount(vocabCount)}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="level-filter" className={typography.label}>
            CEFR level
          </label>
          <Select
            value={levelFilter}
            onValueChange={(value) => setLevelFilter(value as LevelFilter)}
          >
            <SelectTrigger id="level-filter" className="w-full">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              {FILTER_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <span className={typography.label}>Progress</span>
          <LearnedFilterToggle />
        </div>
      </div>
    </div>
  )
}
