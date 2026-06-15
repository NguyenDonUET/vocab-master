import { useEffect } from 'react'

type TestAnswerState = 'unanswered' | 'correct' | 'incorrect'

interface UseTestKeyboardShortcutsOptions {
  choiceCount: number
  answerState: TestAnswerState
  onSelectChoice: (choiceIndex: number) => void
  onNext: () => void
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

function getChoiceIndexFromKey(key: string, choiceCount: number): number | null {
  const lower = key.toLowerCase()

  if (lower >= '1' && lower <= '9') {
    const index = Number(lower) - 1
    return index < choiceCount ? index : null
  }

  if (lower >= 'a' && lower <= 'z') {
    const index = lower.charCodeAt(0) - 'a'.charCodeAt(0)
    return index < choiceCount ? index : null
  }

  return null
}

export function useTestKeyboardShortcuts({
  choiceCount,
  answerState,
  onSelectChoice,
  onNext,
  enabled = true,
}: UseTestKeyboardShortcutsOptions) {
  useEffect(() => {
    if (!enabled) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) {
        return
      }

      if (answerState === 'unanswered') {
        const choiceIndex = getChoiceIndexFromKey(event.key, choiceCount)
        if (choiceIndex !== null) {
          event.preventDefault()
          onSelectChoice(choiceIndex)
        }
        return
      }

      if (event.key === 'Enter' || event.key === 'ArrowRight') {
        event.preventDefault()
        onNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [answerState, choiceCount, enabled, onNext, onSelectChoice])
}
