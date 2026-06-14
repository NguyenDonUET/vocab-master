import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SectionLabel } from '@/components/ui/page-header'
import type { LevelFilter } from '@/lib/deck'
import { spacing, surface, typography } from '@/lib/design-system'
import { useStudyStore } from '@/stores/useStudyStore'
import { cn } from '@/lib/utils'
import { CEFR_LEVELS } from '@/types/vocabulary'

const FILTER_OPTIONS: { value: LevelFilter; label: string }[] = [
  { value: 'all', label: 'All levels' },
  ...CEFR_LEVELS.map((level) => ({ value: level, label: level })),
]

export function LevelFilter() {
  const levelFilter = useStudyStore((state) => state.levelFilter)
  const setLevelFilter = useStudyStore((state) => state.setLevelFilter)

  return (
    <div
      className={cn(
        surface.panel,
        'flex flex-col sm:flex-row sm:items-center sm:justify-between',
        spacing.inline,
      )}
    >
      <div className={spacing.section}>
        <SectionLabel>Filter</SectionLabel>
        <label htmlFor="level-filter" className={typography.label}>
          CEFR level
        </label>
      </div>
      <Select
        value={levelFilter}
        onValueChange={(value) => setLevelFilter(value as LevelFilter)}
      >
        <SelectTrigger id="level-filter" className="w-full md:w-44">
          <SelectValue placeholder="Select level" />
        </SelectTrigger>
        <SelectContent>
          {FILTER_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
