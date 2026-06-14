import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import type { CefrLevel, VocabularyEntryInput } from '@/types/vocabulary'
import { CEFR_LEVELS } from '@/types/vocabulary'

export const DATASET_VERSION = 1
export const DATA_DIR = join(process.cwd(), 'src/data/levels')

export function normalizeExpression(expression: string): string {
  return expression.trim().toLowerCase()
}

export function levelFileName(level: CefrLevel): string {
  return `${level.toLowerCase()}.json`
}

export function loadLevelItems(level: CefrLevel): unknown[] {
  const filePath = join(DATA_DIR, levelFileName(level))
  const raw = readFileSync(filePath, 'utf-8')
  return JSON.parse(raw) as unknown[]
}

export function loadRawDatasetItems(): unknown[] {
  return CEFR_LEVELS.flatMap((level) => loadLevelItems(level))
}

export function loadRawDataset(): { version: number; items: unknown[] } {
  return {
    version: DATASET_VERSION,
    items: loadRawDatasetItems(),
  }
}

export interface ExpressionOccurrence {
  expression: string
  level: CefrLevel
  file: string
}

export interface GlobalExpressionDuplicate {
  expression: string
  occurrences: ExpressionOccurrence[]
}

export function findLevelExpressionDuplicates(
  items: VocabularyEntryInput[],
): GlobalExpressionDuplicate[] {
  const seen = new Map<string, ExpressionOccurrence[]>()

  for (const item of items) {
    const key = `${item.level}::${normalizeExpression(item.expression)}`
    const occurrence: ExpressionOccurrence = {
      expression: item.expression,
      level: item.level,
      file: levelFileName(item.level),
    }

    const existing = seen.get(key) ?? []
    existing.push(occurrence)
    seen.set(key, existing)
  }

  return [...seen.entries()]
    .filter(([, occurrences]) => occurrences.length > 1)
    .map(([key, occurrences]) => ({
      expression: occurrences[0].expression,
      occurrences,
    }))
}

export function findGlobalExpressionDuplicates(
  items: VocabularyEntryInput[],
): GlobalExpressionDuplicate[] {
  const seen = new Map<string, ExpressionOccurrence[]>()

  for (const item of items) {
    const key = normalizeExpression(item.expression)
    const occurrence: ExpressionOccurrence = {
      expression: item.expression,
      level: item.level,
      file: levelFileName(item.level),
    }

    const existing = seen.get(key) ?? []
    existing.push(occurrence)
    seen.set(key, existing)
  }

  return [...seen.entries()]
    .filter(([, occurrences]) => occurrences.length > 1)
    .map(([, occurrences]) => ({
      expression: occurrences[0].expression,
      occurrences,
    }))
}

export interface ExpressionIndex {
  generatedAt: string
  count: number
  expressions: string[]
  byLevel: Record<CefrLevel, string[]>
}

export function buildExpressionIndex(
  items: VocabularyEntryInput[],
): ExpressionIndex {
  const expressions = [
    ...new Set(items.map((item) => normalizeExpression(item.expression))),
  ].sort()

  const byLevel = Object.fromEntries(
    CEFR_LEVELS.map((level) => [level, [] as string[]]),
  ) as Record<CefrLevel, string[]>

  for (const item of items) {
    byLevel[item.level].push(item.expression)
  }

  for (const level of CEFR_LEVELS) {
    byLevel[level].sort((a, b) =>
      normalizeExpression(a).localeCompare(normalizeExpression(b)),
    )
  }

  return {
    generatedAt: new Date().toISOString(),
    count: expressions.length,
    expressions,
    byLevel,
  }
}

export function formatDuplicateReport(
  duplicates: GlobalExpressionDuplicate[],
  title: string,
): string {
  if (duplicates.length === 0) {
    return ''
  }

  const lines = duplicates.map((duplicate) => {
    const locations = duplicate.occurrences
      .map((occurrence) => `${occurrence.file} (${occurrence.level})`)
      .join(', ')
    return `  - "${duplicate.expression}" in ${locations}`
  })

  return `${title}:\n${lines.join('\n')}`
}
