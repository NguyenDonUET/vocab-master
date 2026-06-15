import { getVocabularyTest } from '@/lib/vocabulary-test'
import { getVocabularyEntries } from '@/lib/vocabulary'
import { TestPage } from '@/components/pages/TestPage'
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

  const [test, entries] = await Promise.all([
    getVocabularyTest(level),
    getVocabularyEntries(),
  ])

  const entriesById = Object.fromEntries(entries.map((entry) => [entry.id, entry]))

  return <TestPage key={level} level={level} test={test} entriesById={entriesById} />
}
