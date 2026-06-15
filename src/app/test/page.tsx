import { getVocabularyTest } from '@/lib/vocabulary-test'
import { getVocabularyEntries } from '@/lib/vocabulary'
import { TestPage } from '@/components/pages/TestPage'

const TEST_LEVEL = 'B1' as const

export default async function Page() {
  const [test, entries] = await Promise.all([
    getVocabularyTest(TEST_LEVEL),
    getVocabularyEntries(),
  ])

  const entriesById = Object.fromEntries(entries.map((entry) => [entry.id, entry]))

  return (
    <TestPage level={TEST_LEVEL} test={test} entriesById={entriesById} />
  )
}
