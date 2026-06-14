import { getDeviceId } from '@/lib/device-id'
import { getProgress } from '@/lib/progress'
import { getVocabularyEntries } from '@/lib/vocabulary'
import { StudyPage } from '@/components/pages/StudyPage'

export default async function Page() {
  const [entries, deviceId] = await Promise.all([
    getVocabularyEntries(),
    getDeviceId(),
  ])
  const learnedIds = await getProgress(deviceId)

  return <StudyPage entries={entries} initialLearnedIds={learnedIds} />
}
