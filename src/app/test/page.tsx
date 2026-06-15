import { getVocabularyTest } from '@/lib/vocabulary-test'
import { TestIndexPage } from '@/components/pages/TestIndexPage'
import { AVAILABLE_TEST_LEVELS } from '@/types/vocabulary-test'

export default async function Page() {
  const tests = await Promise.all(
    AVAILABLE_TEST_LEVELS.map((level) => getVocabularyTest(level)),
  )

  const testsByLevel = Object.fromEntries(
    AVAILABLE_TEST_LEVELS.map((level, index) => [level, tests[index]]),
  ) as Record<
    (typeof AVAILABLE_TEST_LEVELS)[number],
    Awaited<ReturnType<typeof getVocabularyTest>>
  >

  return <TestIndexPage testsByLevel={testsByLevel} />
}
