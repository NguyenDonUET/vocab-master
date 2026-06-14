import { BookOpen } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type { LevelFilter } from '@/lib/deck'
import { spacing, surface, typography } from '@/lib/design-system'
import { useStudyStore } from '@/stores/useStudyStore'
import { cn } from '@/lib/utils'

interface EmptyDeckStateProps {
  levelFilter: LevelFilter
}

export function EmptyDeckState({ levelFilter }: EmptyDeckStateProps) {
  const setLevelFilter = useStudyStore((state) => state.setLevelFilter)

  const message =
    levelFilter === 'all'
      ? 'No vocabulary cards are available yet.'
      : `No cards found for level ${levelFilter}.`

  return (
    <div className={cn(surface.muted, 'px-4 py-12 text-center md:px-6 md:py-16', spacing.section)}>
      <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-muted">
        <BookOpen className="size-5 text-muted-foreground/60" />
      </div>
      <div className={spacing.section}>
        <p className={typography.sectionTitle}>No cards available</p>
        <p className={typography.body}>{message}</p>
      </div>
      {levelFilter !== 'all' && (
        <Button variant="outline" onClick={() => setLevelFilter('all')}>
          Show all levels
        </Button>
      )}
    </div>
  )
}
