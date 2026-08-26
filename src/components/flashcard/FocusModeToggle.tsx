'use client'

import { Maximize2, Minimize2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { kbdClass } from '@/lib/design-system'
import { useStudyStore } from '@/stores/useStudyStore'

export function FocusModeToggle() {
  const isFocusMode = useStudyStore((state) => state.isFocusMode)
  const toggleFocusMode = useStudyStore((state) => state.toggleFocusMode)

  if (isFocusMode) {
    return (
      <Button
        variant="outline"
        onClick={toggleFocusMode}
        aria-pressed
        aria-label="Exit focus mode"
      >
        <Minimize2 />
        Exit focus
        <kbd className={kbdClass('hidden sm:inline-flex')}>Esc</kbd>
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      onClick={toggleFocusMode}
      aria-pressed={false}
      aria-label="Enter focus mode"
    >
      <Maximize2 />
      Focus
    </Button>
  )
}
