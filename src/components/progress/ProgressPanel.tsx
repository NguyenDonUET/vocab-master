import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { StatCard } from '@/components/ui/stat-card'
import { useProgressStats } from '@/hooks/useProgressStats'
import { spacing, surface, typography } from '@/lib/design-system'
import { useStudyStore } from '@/stores/useStudyStore'
import { cn } from '@/lib/utils'
import type { VocabularyEntry } from '@/types/vocabulary'

interface ProgressPanelProps {
  entries: VocabularyEntry[]
}

export function ProgressPanel({ entries }: ProgressPanelProps) {
  const levelFilter = useStudyStore((state) => state.levelFilter)
  const { total, learned, remaining, completionPercent } =
    useProgressStats(entries)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Study progress</CardTitle>
        <CardDescription>
          {levelFilter === 'all'
            ? 'All CEFR levels'
            : `Filtered to ${levelFilter} only`}
        </CardDescription>
      </CardHeader>
      <CardContent className={spacing.section}>
        <div className={cn('grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4', spacing.inline)}>
          <StatCard label="Total" value={total} />
          <StatCard label="Learned" value={learned} />
          <StatCard label="Remaining" value={remaining} />
          <StatCard label="Completion" value={`${completionPercent}%`} />
        </div>
        <div className={cn(surface.inset, spacing.section)}>
          <div className="flex items-center justify-between">
            <span className={typography.body}>Overall completion</span>
            <span className={cn(typography.label, 'tabular-nums')}>
              {completionPercent}%
            </span>
          </div>
          <Progress value={completionPercent} />
        </div>
      </CardContent>
    </Card>
  )
}
