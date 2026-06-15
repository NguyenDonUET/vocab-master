import { TestPage } from '@/components/pages/TestPage'
import { getDeviceId } from '@/lib/device-id'
import { getProgress } from '@/lib/progress'
import { getTestProgress } from '@/lib/test-progress'
import { getVocabularyEntries } from '@/lib/vocabulary'
import { getVocabularyTest } from '@/lib/vocabulary-test'
import { parseTestLevelParam } from '@/types/vocabulary-test'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ level: string }>
}

export default async function Page({ params }: PageProps) {
  const { level: levelParam } = await params
  const level = parseTestLevelParam(levelParam)

  if (!level) {
    notFound()
  }

  const [test, entries, deviceId] = await Promise.all([
    getVocabularyTest(level),
    getVocabularyEntries(),
    getDeviceId(),
  ])
  const initialLearnedIds = await getProgress(deviceId)
  const initialCompletedParts = await getTestProgress(deviceId)

  const entriesById = Object.fromEntries(
    entries.map((entry) => [entry.id, entry]),
  )

  return (
    <TestPage
      key={level}
      level={level}
      test={test}
      entriesById={entriesById}
      initialLearnedIds={initialLearnedIds}
      initialCompletedParts={initialCompletedParts}
    />
  )
}
