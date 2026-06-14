'use client'

import { LevelFilter } from '@/components/filters/LevelFilter'
import { ProgressHydrator } from '@/components/progress/ProgressHydrator'
import { ProgressPanel } from '@/components/progress/ProgressPanel'
import { PageHeader } from '@/components/ui/page-header'
import { surfaces } from '@/lib/design-system'
import type { VocabularyEntry } from '@/types/vocabulary'

interface DashboardPageProps {
  entries: VocabularyEntry[]
  initialLearnedIds: string[]
}

export function DashboardPage({
  entries,
  initialLearnedIds,
}: DashboardPageProps) {
  return (
    <div className={surfaces.page}>
      <ProgressHydrator initialLearnedIds={initialLearnedIds} />
      <PageHeader
        title="Dashboard"
        description="Track your vocabulary progress across CEFR levels."
      />
      <LevelFilter entries={entries} />
      <ProgressPanel entries={entries} />
    </div>
  )
}
