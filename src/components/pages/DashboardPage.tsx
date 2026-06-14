'use client'

import { LevelFilter } from '@/components/filters/LevelFilter'
import { ProgressPanel } from '@/components/progress/ProgressPanel'
import { PageHeader } from '@/components/ui/page-header'
import { surfaces } from '@/lib/design-system'
import { getVocabularyEntries } from '@/lib/vocabulary'

const vocabulary = getVocabularyEntries()

export function DashboardPage() {
  return (
    <div className={surfaces.page}>
      <PageHeader
        title="Dashboard"
        description="Track your vocabulary progress across CEFR levels."
      />
      <LevelFilter />
      <ProgressPanel entries={vocabulary} />
    </div>
  )
}
