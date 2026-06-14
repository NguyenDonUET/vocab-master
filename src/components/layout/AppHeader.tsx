import { Link, NavLink } from 'react-router-dom'

import { MobileNav } from '@/components/layout/MobileNav'
import { Badge } from '@/components/ui/badge'
import { control, interactive, typography } from '@/lib/design-system'
import { cn } from '@/lib/utils'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn('ds-nav-link', isActive ? 'ds-nav-link-active' : 'ds-nav-link-inactive')

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-3 px-4 md:gap-4 md:px-6">
        <Link
          to="/"
          className={cn(
            'flex min-w-0 items-center gap-2',
            typography.sectionTitle,
            'text-base md:text-lg',
            interactive.transition,
            'hover:text-primary',
          )}
        >
          <span
            className={cn(
              'flex size-8 shrink-0 items-center justify-center bg-primary text-sm font-bold text-primary-foreground',
              control.radius,
            )}
          >
            V
          </span>
          <span className="truncate">Vocab Coach</span>
        </Link>

        <div className="flex items-center gap-2 md:gap-4">
          <nav
            className={cn(
              'hidden items-center gap-1 border border-border/60 bg-card p-1 lg:flex',
              control.radius,
            )}
            aria-label="Main navigation"
          >
            <NavLink to="/" end className={navLinkClass}>
              Study
            </NavLink>
            <NavLink to="/dashboard" className={navLinkClass}>
              Dashboard
            </NavLink>
          </nav>
          <Badge variant="secondary" className="hidden sm:inline-flex">
            A2–C2
          </Badge>
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
