'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { MobileNav } from '@/components/layout/MobileNav'
import { Badge } from '@/components/ui/badge'
import { control, interactive, typography } from '@/lib/design-system'
import { cn } from '@/lib/utils'

function navLinkClass(isActive: boolean) {
  return cn('ds-nav-link', isActive ? 'ds-nav-link-active' : 'ds-nav-link-inactive')
}

export function AppHeader() {
  const pathname = usePathname()
  const isTestRoute = pathname === '/test' || pathname.startsWith('/test/')

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between gap-3 px-4 md:gap-4 md:px-6">
        <Link
          href="/"
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
            className="hidden items-center gap-6 lg:flex"
            aria-label="Main navigation"
          >
            <Link href="/" className={navLinkClass(pathname === '/')}>
              Study
            </Link>
            <Link
              href="/dashboard"
              className={navLinkClass(pathname === '/dashboard')}
            >
              Dashboard
            </Link>
            <Link href="/test" className={navLinkClass(isTestRoute)}>
              Test
            </Link>
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
