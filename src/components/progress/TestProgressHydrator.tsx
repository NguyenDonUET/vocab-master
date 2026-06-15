'use client'

import { useEffect, useRef } from 'react'

import type { CompletedTestPart } from '@/lib/test-progress'
import { useTestProgressStore } from '@/stores/useTestProgressStore'

interface TestProgressHydratorProps {
  initialCompletedParts: CompletedTestPart[]
}

export function TestProgressHydrator({
  initialCompletedParts,
}: TestProgressHydratorProps) {
  const hydrated = useRef(false)

  useEffect(() => {
    if (hydrated.current) {
      return
    }

    useTestProgressStore.getState().hydrate(initialCompletedParts)
    hydrated.current = true
  }, [initialCompletedParts])

  return null
}
