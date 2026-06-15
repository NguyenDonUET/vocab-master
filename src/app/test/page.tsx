import { TestIndexPage } from '@/components/pages/TestIndexPage'
import { getDeviceId } from '@/lib/device-id'
import { getTestProgress } from '@/lib/test-progress'
import { getVocabularyTest } from '@/lib/vocabulary-test'
import { AVAILABLE_TEST_LEVELS } from '@/types/vocabulary-test'

export default async function Page() {
  const [tests, deviceId] = await Promise.all([
    Promise.all(AVAILABLE_TEST_LEVELS.map((level) => getVocabularyTest(level))),
    getDeviceId(),
  ])
  const initialCompletedParts = await getTestProgress(deviceId)

  const testsByLevel = Object.fromEntries(
    AVAILABLE_TEST_LEVELS.map((level, index) => [level, tests[index]]),
  ) as Record<
    (typeof AVAILABLE_TEST_LEVELS)[number],
    Awaited<ReturnType<typeof getVocabularyTest>>
  >

  return (
    <TestIndexPage
      testsByLevel={testsByLevel}
      initialCompletedParts={initialCompletedParts}
    />
  )
}
