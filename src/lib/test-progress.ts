import { prisma } from '@/lib/prisma'
import type { CefrLevel } from '@/types/vocabulary'

export interface CompletedTestPart {
  key: string
  testVersion: number
  bestCorrect: number
  totalQuestions: number
}

function normalizeCompletedParts(parts: unknown[]): CompletedTestPart[] {
  const normalized: CompletedTestPart[] = []

  for (const part of parts) {
    if (!part || typeof part !== 'object') {
      continue
    }

    const candidate = part as {
      key?: unknown
      testVersion?: unknown
      bestCorrect?: unknown
      totalQuestions?: unknown
    }

    if (
      typeof candidate.key !== 'string' ||
      typeof candidate.testVersion !== 'number' ||
      typeof candidate.bestCorrect !== 'number' ||
      typeof candidate.totalQuestions !== 'number' ||
      candidate.totalQuestions < 1
    ) {
      continue
    }

    normalized.push({
      key: candidate.key,
      testVersion: candidate.testVersion,
      bestCorrect: candidate.bestCorrect,
      totalQuestions: candidate.totalQuestions,
    })
  }

  return normalized
}

function needsCompletedPartsRepair(
  rawParts: unknown[],
  normalizedParts: CompletedTestPart[],
): boolean {
  if (rawParts.length !== normalizedParts.length) {
    return true
  }

  return rawParts.some((part) => normalizeCompletedParts([part]).length === 0)
}

async function loadCompletedParts(deviceId: string): Promise<{
  rawParts: unknown[]
  completedParts: CompletedTestPart[]
}> {
  const result = await prisma.testProgress.findRaw({
    filter: { _id: deviceId },
    options: { projection: { completedParts: 1 } },
  })

  if (!Array.isArray(result) || result.length === 0) {
    return { rawParts: [], completedParts: [] }
  }

  const rawParts =
    (result[0] as { completedParts?: unknown[] }).completedParts ?? []

  return {
    rawParts,
    completedParts: normalizeCompletedParts(rawParts),
  }
}

async function saveCompletedParts(
  deviceId: string,
  completedParts: CompletedTestPart[],
): Promise<CompletedTestPart[]> {
  const progress = await prisma.testProgress.upsert({
    where: { deviceId },
    create: {
      deviceId,
      completedParts,
    },
    update: {
      completedParts,
    },
    select: { completedParts: true },
  })

  return normalizeCompletedParts(progress.completedParts)
}

async function repairCompletedParts(
  deviceId: string,
  rawParts: unknown[],
  completedParts: CompletedTestPart[],
): Promise<void> {
  if (!needsCompletedPartsRepair(rawParts, completedParts)) {
    return
  }

  await saveCompletedParts(deviceId, completedParts)
}

export interface PartBestScore {
  bestCorrect: number
  totalQuestions: number
}

export function partKey(level: CefrLevel, partNumber: number): string {
  return `${level}:${partNumber}`
}

export function parsePartKey(
  key: string,
): { level: CefrLevel; partNumber: number } | null {
  const separatorIndex = key.indexOf(':')
  if (separatorIndex === -1) {
    return null
  }

  const level = key.slice(0, separatorIndex) as CefrLevel
  const partNumber = Number.parseInt(key.slice(separatorIndex + 1), 10)

  if (!Number.isFinite(partNumber) || partNumber < 1) {
    return null
  }

  return { level, partNumber }
}

function findPartEntry(
  completedParts: CompletedTestPart[],
  level: CefrLevel,
  partNumber: number,
  testVersion: number,
): CompletedTestPart | undefined {
  const key = partKey(level, partNumber)
  return completedParts.find(
    (part) => part.key === key && part.testVersion === testVersion,
  )
}

export function getPartBestScore(
  completedParts: CompletedTestPart[],
  level: CefrLevel,
  partNumber: number,
  testVersion: number,
  currentQuestionCount?: number,
): PartBestScore | null {
  const entry = findPartEntry(completedParts, level, partNumber, testVersion)

  if (!entry || entry.totalQuestions < 1) {
    return null
  }

  if (
    currentQuestionCount !== undefined &&
    entry.totalQuestions !== currentQuestionCount
  ) {
    return null
  }

  return {
    bestCorrect: entry.bestCorrect,
    totalQuestions: entry.totalQuestions,
  }
}

export function isPartMastered(
  completedParts: CompletedTestPart[],
  level: CefrLevel,
  partNumber: number,
  testVersion: number,
  currentQuestionCount: number,
): boolean {
  const score = getPartBestScore(
    completedParts,
    level,
    partNumber,
    testVersion,
    currentQuestionCount,
  )

  return (
    score !== null &&
    score.bestCorrect === score.totalQuestions &&
    score.totalQuestions > 0
  )
}

export function getMasteredPartNumbers(
  completedParts: CompletedTestPart[],
  level: CefrLevel,
  testVersion: number,
  partQuestionCounts: Record<number, number>,
): number[] {
  return Object.entries(partQuestionCounts)
    .filter(([partNumber, questionCount]) =>
      isPartMastered(
        completedParts,
        level,
        Number(partNumber),
        testVersion,
        questionCount,
      ),
    )
    .map(([partNumber]) => Number(partNumber))
    .sort((a, b) => a - b)
}

export function isLevelComplete(
  completedParts: CompletedTestPart[],
  level: CefrLevel,
  parts: Array<{ partNumber: number; questionCount: number }>,
  testVersion: number,
): boolean {
  if (parts.length === 0) {
    return false
  }

  return parts.every((part) =>
    isPartMastered(
      completedParts,
      level,
      part.partNumber,
      testVersion,
      part.questionCount,
    ),
  )
}

export async function getTestProgress(
  deviceId: string,
): Promise<CompletedTestPart[]> {
  const { rawParts, completedParts } = await loadCompletedParts(deviceId)
  await repairCompletedParts(deviceId, rawParts, completedParts)
  return completedParts
}

export async function recordPartResult(
  deviceId: string,
  level: CefrLevel,
  partNumber: number,
  testVersion: number,
  correctCount: number,
  totalQuestions: number,
): Promise<CompletedTestPart[]> {
  const key = partKey(level, partNumber)
  const { completedParts } = await loadCompletedParts(deviceId)
  const existingEntry = findPartEntry(
    completedParts,
    level,
    partNumber,
    testVersion,
  )
  const bestCorrect = Math.max(existingEntry?.bestCorrect ?? 0, correctCount)

  if (
    existingEntry &&
    existingEntry.bestCorrect === bestCorrect &&
    existingEntry.totalQuestions === totalQuestions
  ) {
    return completedParts
  }

  const updatedParts = [
    ...completedParts.filter((part) => part.key !== key),
    { key, testVersion, bestCorrect, totalQuestions },
  ]

  return saveCompletedParts(deviceId, updatedParts)
}
