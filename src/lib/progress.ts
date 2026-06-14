import { prisma } from '@/lib/prisma'

export async function getProgress(deviceId: string): Promise<string[]> {
  const progress = await prisma.userProgress.findUnique({
    where: { deviceId },
    select: { learnedIds: true },
  })

  return progress?.learnedIds ?? []
}

export async function markLearned(
  deviceId: string,
  entryId: string,
): Promise<string[]> {
  const existing = await prisma.userProgress.findUnique({
    where: { deviceId },
    select: { learnedIds: true },
  })

  if (existing?.learnedIds.includes(entryId)) {
    return existing.learnedIds
  }

  const progress = await prisma.userProgress.upsert({
    where: { deviceId },
    create: {
      deviceId,
      learnedIds: [entryId],
    },
    update: {
      learnedIds: {
        push: entryId,
      },
    },
    select: { learnedIds: true },
  })

  return progress.learnedIds
}

export async function resetProgress(deviceId: string): Promise<void> {
  await prisma.userProgress.upsert({
    where: { deviceId },
    create: {
      deviceId,
      learnedIds: [],
    },
    update: {
      learnedIds: [],
    },
  })
}
