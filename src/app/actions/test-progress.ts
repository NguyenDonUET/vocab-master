'use server'

import { getDeviceId } from '@/lib/device-id'
import { recordPartResult, type CompletedTestPart } from '@/lib/test-progress'
import type { CefrLevel } from '@/types/vocabulary'

export async function recordTestPartResultAction(
  level: CefrLevel,
  partNumber: number,
  testVersion: number,
  correctCount: number,
  totalQuestions: number,
): Promise<CompletedTestPart[]> {
  const deviceId = await getDeviceId()
  return recordPartResult(
    deviceId,
    level,
    partNumber,
    testVersion,
    correctCount,
    totalQuestions,
  )
}
