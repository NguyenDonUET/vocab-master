import { useEffect } from 'react'

import { useStudyStore } from '@/stores/useStudyStore'

interface UseStudyKeyboardShortcutsOptions {
  deckLength: number
  canGoNext: boolean
  canGoPrev: boolean
  enabled?: boolean
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return (
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.tagName === 'SELECT' ||
    target.isContentEditable
  )
}

export function useStudyKeyboardShortcuts({
  deckLength,
  canGoNext,
  canGoPrev,
  enabled = true,
}: UseStudyKeyboardShortcutsOptions) {
  const prevCard = useStudyStore((state) => state.prevCard)
  const nextCard = useStudyStore((state) => state.nextCard)
  const reveal = useStudyStore((state) => state.reveal)
  const hide = useStudyStore((state) => state.hide)
  const isRevealed = useStudyStore((state) => state.isRevealed)

  useEffect(() => {
    if (!enabled) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) {
        return
      }

      switch (event.key) {
        case 'ArrowLeft':
          if (canGoPrev) {
            event.preventDefault()
            prevCard()
          }
          break
        case 'ArrowRight':
          if (canGoNext) {
            event.preventDefault()
            nextCard(deckLength)
          }
          break
        case ' ':
          event.preventDefault()
          if (isRevealed) {
            hide()
          } else {
            reveal()
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    canGoNext,
    canGoPrev,
    deckLength,
    enabled,
    hide,
    isRevealed,
    nextCard,
    prevCard,
    reveal,
  ])
}
