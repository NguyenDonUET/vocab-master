'use client'

import { FocusModeProgress } from '@/components/flashcard/FocusModeProgress'
import { FocusModeToggle } from '@/components/flashcard/FocusModeToggle'
import { LearnedFilterToggle } from '@/components/filters/LearnedFilterToggle'
import { spacing } from '@/lib/design-system'
import type { VocabularyEntry } from '@/types/vocabulary'

interface FocusModeToolbarProps {
  entries: VocabularyEntry[]
}

export function FocusModeToolbar({ entries }: FocusModeToolbarProps) {
  return (
    <div className={spacing.section}>
      <div className="flex items-center gap-3 sm:gap-4">
        <FocusModeProgress entries={entries} />
        <div className="ml-auto shrink-0">
          <FocusModeToggle />
        </div>
      </div>
      <LearnedFilterToggle />
    </div>
  )
}
