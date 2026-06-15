'use server'

import { getDeviceId } from '@/lib/device-id'
import { markLearned, resetProgress, unmarkLearned } from '@/lib/progress'

export async function markLearnedAction(entryId: string): Promise<string[]> {
  const deviceId = await getDeviceId()
  return markLearned(deviceId, entryId)
}

export async function unmarkLearnedAction(entryId: string): Promise<string[]> {
  const deviceId = await getDeviceId()
  return unmarkLearned(deviceId, entryId)
}

export async function resetProgressAction(): Promise<void> {
  const deviceId = await getDeviceId()
  await resetProgress(deviceId)
}
