import { Check } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useProgressStore } from '@/stores/useProgressStore'

interface MarkLearnedButtonProps {
  entryId: string
  className?: string
}

export function MarkLearnedButton({ entryId, className }: MarkLearnedButtonProps) {
  const markLearned = useProgressStore((state) => state.markLearned)
  const learned = useProgressStore((state) => state.learnedIds.includes(entryId))

  return (
    <Button
      variant={learned ? 'secondary' : 'outline'}
      onClick={() => markLearned(entryId)}
      disabled={learned}
      className={cn(className)}
    >
      <Check />
      <span className="truncate">
        {learned ? 'Learned' : 'Mark as learned'}
      </span>
    </Button>
  )
}
