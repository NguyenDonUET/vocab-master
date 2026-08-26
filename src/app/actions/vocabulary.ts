'use server'

import { revalidatePath } from 'next/cache'

import { deleteVocabularyEntry } from '@/lib/vocabulary'

export async function deleteVocabularyAction(entryId: string): Promise<void> {
  await deleteVocabularyEntry(entryId)
  revalidatePath('/')
  revalidatePath('/dashboard')
  revalidatePath('/test', 'layout')
}
