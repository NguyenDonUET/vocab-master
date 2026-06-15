'use client'

import { control, interactive } from '@/lib/design-system'
import type { LearnedFilter } from '@/lib/deck'
import { useStudyStore } from '@/stores/useStudyStore'
import { cn } from '@/lib/utils'

const LEARNED_FILTER_OPTIONS: { value: LearnedFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'unlearned', label: 'Unlearned' },
  { value: 'learned', label: 'Learned' },
]

export function LearnedFilterToggle() {
  const learnedFilter = useStudyStore((state) => state.learnedFilter)
  const setLearnedFilter = useStudyStore((state) => state.setLearnedFilter)

  return (
    <div
      role="group"
      aria-label="Progress filter"
      className={cn(
        'flex w-full overflow-hidden',
        control.height,
        control.radius,
        'border border-border/60 bg-muted/30',
      )}
    >
      {LEARNED_FILTER_OPTIONS.map((option, index) => {
        const isActive = learnedFilter === option.value

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => setLearnedFilter(option.value)}
            className={cn(
              'flex min-w-0 flex-1 items-center justify-center px-3 text-sm font-medium',
              interactive.transition,
              interactive.activePress,
              'focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
              index > 0 && 'border-l border-border/60',
              isActive
                ? 'bg-card text-foreground'
                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
