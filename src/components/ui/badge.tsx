import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { control } from '@/lib/design-system'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  cn(
    'inline-flex items-center border px-2.5 py-0.5 text-xs font-semibold',
    control.radius,
  ),
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        outline: 'border-border/60 text-foreground',
        destructive:
          'border-transparent bg-destructive text-primary-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
