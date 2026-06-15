import { PrismaClient } from '@prisma/client'

import {
  generateVocabularyTest,
  upsertVocabularyTest,
} from '../src/lib/vocabulary-test'
import type { CefrLevel } from '../src/types/vocabulary'

const prisma = new PrismaClient()
const SUPPORTED_LEVELS: CefrLevel[] = ['B1']

async function main() {
  const levelArg = process.argv[2] as CefrLevel | undefined
  const levels = levelArg ? [levelArg] : SUPPORTED_LEVELS

  for (const level of levels) {
    const test = await generateVocabularyTest({ level })
    await upsertVocabularyTest(test)
    console.log(
      `Generated ${test.questions.length} questions for ${level} vocabulary test.`,
    )
  }
}

main()
  .catch((error) => {
    console.error('Test generation failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
