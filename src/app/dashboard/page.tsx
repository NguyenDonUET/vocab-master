import { DashboardPage } from '@/components/pages/DashboardPage'
import { getDeviceId } from '@/lib/device-id'
import { getProgress } from '@/lib/progress'
import { getVocabularyEntries } from '@/lib/vocabulary'

export default async function Page() {
  const [entries, deviceId] = await Promise.all([
    getVocabularyEntries(),
    getDeviceId(),
  ])
  const learnedIds = await getProgress(deviceId)

  return (
    <DashboardPage entries={entries} initialLearnedIds={learnedIds} />
  )
}
