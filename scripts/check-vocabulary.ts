import {
  buildExpressionIndex,
  findGlobalExpressionDuplicates,
  findLevelExpressionDuplicates,
  formatDuplicateReport,
  loadRawDataset,
} from '../src/lib/vocabulary-index'
import { validateVocabularyDataset } from '../src/lib/vocabulary-validation'

function main() {
  const dataset = validateVocabularyDataset(loadRawDataset())
  const levelDuplicates = findLevelExpressionDuplicates(dataset.items)
  const globalDuplicates = findGlobalExpressionDuplicates(dataset.items)

  if (levelDuplicates.length === 0 && globalDuplicates.length === 0) {
    console.log(
      `Vocabulary check passed: ${dataset.items.length} entries, ${buildExpressionIndex(dataset.items).count} unique expressions.`,
    )
    return
  }

  console.error('Vocabulary check failed.\n')

  const levelReport = formatDuplicateReport(
    levelDuplicates,
    'Duplicate expression + level pairs',
  )
  if (levelReport) {
    console.error(levelReport)
    console.error('')
  }

  const globalReport = formatDuplicateReport(
    globalDuplicates,
    'Duplicate expressions across levels',
  )
  if (globalReport) {
    console.error(globalReport)
    console.error('')
  }

  process.exit(1)
}

main()
