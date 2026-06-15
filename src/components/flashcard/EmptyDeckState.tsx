'use client'

import { BookOpen, GraduationCap } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type { LearnedFilter, LevelFilter } from '@/lib/deck'
import { spacing, surface, typography } from '@/lib/design-system'
import { useStudyStore } from '@/stores/useStudyStore'
import { cn } from '@/lib/utils'

interface EmptyDeckStateProps {
  levelFilter: LevelFilter
  learnedFilter: LearnedFilter
}

function getEmptyStateContent(
  levelFilter: LevelFilter,
  learnedFilter: LearnedFilter,
): {
  title: string
  message: string
  icon: typeof BookOpen
  showResetLevel: boolean
  showResetProgress: boolean
} {
  if (learnedFilter === 'unlearned') {
    return {
      title: 'All caught up',
      message:
        levelFilter === 'all'
          ? 'You have learned every vocabulary item. Review learned words or reset your progress to study again.'
          : `You have learned every item at ${levelFilter}. Try another level or review learned words.`,
      icon: GraduationCap,
      showResetLevel: levelFilter !== 'all',
      showResetProgress: true,
    }
  }

  if (learnedFilter === 'learned') {
    return {
      title: 'Nothing learned yet',
      message:
        levelFilter === 'all'
          ? 'Mark words as learned while studying to build your progress here.'
          : `No learned vocabulary at ${levelFilter} yet. Study this level and mark words as you go.`,
      icon: BookOpen,
      showResetLevel: levelFilter !== 'all',
      showResetProgress: true,
    }
  }

  return {
    title: 'No cards available',
    message:
      levelFilter === 'all'
        ? 'No vocabulary cards are available yet.'
        : `No cards found for level ${levelFilter}.`,
    icon: BookOpen,
    showResetLevel: levelFilter !== 'all',
    showResetProgress: false,
  }
}

export function EmptyDeckState({
  levelFilter,
  learnedFilter,
}: EmptyDeckStateProps) {
  const setLevelFilter = useStudyStore((state) => state.setLevelFilter)
  const setLearnedFilter = useStudyStore((state) => state.setLearnedFilter)
  const {
    title,
    message,
    icon: Icon,
    showResetLevel,
    showResetProgress,
  } = getEmptyStateContent(levelFilter, learnedFilter)

  return (
    <div
      className={cn(
        surface.muted,
        'px-4 py-12 text-center md:px-6 md:py-16',
        spacing.section,
      )}
    >
      <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-muted">
        <Icon className="size-5 text-muted-foreground/60" />
      </div>
      <div className={spacing.section}>
        <p className={typography.sectionTitle}>{title}</p>
        <p className={typography.body}>{message}</p>
      </div>
      {(showResetLevel || showResetProgress) && (
        <div className="flex flex-col items-center justify-center gap-2 sm:flex-row">
          {showResetLevel && (
            <Button variant="outline" onClick={() => setLevelFilter('all')}>
              Show all levels
            </Button>
          )}
          {showResetProgress && (
            <Button
              variant="outline"
              onClick={() =>
                setLearnedFilter(
                  learnedFilter === 'learned' ? 'all' : 'learned',
                )
              }
            >
              {learnedFilter === 'learned'
                ? 'Show all words'
                : 'Review learned words'}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
