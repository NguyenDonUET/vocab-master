'use client'

import { useEffect, useRef } from 'react'

import { useProgressStore } from '@/stores/useProgressStore'

interface ProgressHydratorProps {
  initialLearnedIds: string[]
}

export function ProgressHydrator({ initialLearnedIds }: ProgressHydratorProps) {
  const hydrated = useRef(false)

  useEffect(() => {
    if (hydrated.current) {
      return
    }

    useProgressStore.getState().hydrate(initialLearnedIds)
    hydrated.current = true
  }, [initialLearnedIds])

  return null
}
