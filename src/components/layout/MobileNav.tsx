'use client'

import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { interactive, typography } from '@/lib/design-system'
import { cn } from '@/lib/utils'

function navLinkClass(isActive: boolean) {
  return cn(
    'flex min-h-11 w-full items-center rounded-md px-4 text-base font-medium',
    interactive.transition,
    isActive
      ? 'bg-primary text-primary-foreground'
      : 'bg-muted/50 text-foreground hover:bg-accent hover:text-accent-foreground',
  )
}

export function MobileNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  const close = () => setOpen(false)

  const overlay = open
    ? createPortal(
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-foreground/20 backdrop-blur-[2px]"
            aria-label="Close navigation menu"
            onClick={close}
          />

          <nav
            className="absolute inset-y-0 right-0 flex w-[min(100vw,20rem)] flex-col border-l border-border/60 bg-background shadow-xl"
            aria-label="Mobile navigation"
          >
            <div className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border/60 px-4">
              <span className={cn(typography.sectionTitle, 'text-lg')}>Menu</span>
              <Button
                ref={closeButtonRef}
                variant="ghost"
                size="icon"
                className="size-11 shrink-0"
                onClick={close}
                aria-label="Close navigation menu"
              >
                <X />
              </Button>
            </div>

            <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-4">
              <Link
                href="/"
                className={navLinkClass(pathname === '/')}
                onClick={close}
              >
                Study
              </Link>
              <Link
                href="/dashboard"
                className={navLinkClass(pathname === '/dashboard')}
                onClick={close}
              >
                Dashboard
              </Link>

              <div className="mt-auto pt-4">
                <Badge variant="secondary">A2–C2</Badge>
              </div>
            </div>
          </nav>
        </div>,
        document.body,
      )
    : null

  return (
    <div className="lg:hidden">
      <Button
        variant="outline"
        size="icon"
        className="size-11 shrink-0"
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={open}
      >
        <Menu />
      </Button>
      {overlay}
    </div>
  )
}
