import {
  interactive,
  sectionLabelClass,
  surface,
  typography,
} from '@/lib/design-system'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: number | string
  className?: string
}

export function StatCard({ label, value, className }: StatCardProps) {
  return (
    <div
      className={cn(
        surface.inset,
        interactive.transition,
        interactive.hoverSurface,
        className,
      )}
    >
      <p className={sectionLabelClass()}>{label}</p>
      <p className={cn('mt-2', typography.stat)}>{value}</p>
    </div>
  )
}
