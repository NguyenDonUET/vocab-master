import { Badge } from '@/components/ui/badge'
import {
  getCategoryBadgeClass,
  getLevelBadgeClass,
  spacing,
  typography,
} from '@/lib/design-system'
import { formatCategoryLabel } from '@/lib/labels'
import { cn } from '@/lib/utils'
import type { VocabularyEntry } from '@/types/vocabulary'

interface CardFrontProps {
  entry: VocabularyEntry
}

export function CardFront({ entry }: CardFrontProps) {
  return (
    <div
      className={cn('flex flex-col items-center text-center', spacing.section)}
    >
      <div
        className={cn(
          'flex flex-wrap items-center justify-center pt-4',
          spacing.tight,
        )}
      >
        <Badge
          variant="outline"
          className={cn('font-semibold', getLevelBadgeClass(entry.level))}
        >
          {entry.level}
        </Badge>
        <Badge
          variant="outline"
          className={getCategoryBadgeClass(entry.category)}
        >
          {formatCategoryLabel(entry.category)}
        </Badge>
      </div>
      <p className={typography.expression}>{entry.expression}</p>
    </div>
  )
}
