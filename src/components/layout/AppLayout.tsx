'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'

import { AppHeader } from '@/components/layout/AppHeader'
import { useStudyStore } from '@/stores/useStudyStore'
import { cn } from '@/lib/utils'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname()
  const isFocusMode = useStudyStore((state) => state.isFocusMode)
  const hideChrome = isFocusMode && pathname === '/'

  return (
    <div className="min-h-svh overflow-x-hidden bg-background">
      {hideChrome ? null : <AppHeader />}
      <main
        className={cn(
          'mx-auto w-full max-w-7xl px-4 md:px-6',
          hideChrome ? 'py-4' : 'py-6 md:py-8',
        )}
      >
        <div className="mx-auto w-full max-w-3xl">{children}</div>
      </main>
    </div>
  )
}
