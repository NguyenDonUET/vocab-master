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
  const index = buildExpressionIndex(dataset.items)
  const globalDuplicates = findGlobalExpressionDuplicates(dataset.items)

  if (levelDuplicates.length === 0) {
    const crossLevelNote =
      globalDuplicates.length > 0
        ? ` (${globalDuplicates.length} expressions appear at multiple levels)`
        : ''
    console.log(
      `Vocabulary check passed: ${dataset.items.length} entries, ${index.count} unique expressions${crossLevelNote}.`,
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

  process.exit(1)
}

main()
