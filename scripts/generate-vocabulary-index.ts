import { writeFileSync } from 'node:fs'
import { join } from 'node:path'

import {
  buildExpressionIndex,
  loadRawDataset,
} from '../src/lib/vocabulary-index'
import { validateVocabularyDataset } from '../src/lib/vocabulary-validation'

const OUTPUT_PATH = join(process.cwd(), 'src/data/expressions-index.json')

function main() {
  const dataset = validateVocabularyDataset(loadRawDataset())
  const index = buildExpressionIndex(dataset.items)

  writeFileSync(OUTPUT_PATH, `${JSON.stringify(index, null, 2)}\n`)
  console.log(
    `Generated ${OUTPUT_PATH} with ${index.count} expressions from ${dataset.items.length} entries.`,
  )
}

main()
