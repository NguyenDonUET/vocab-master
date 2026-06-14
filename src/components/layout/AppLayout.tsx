import type { ReactNode } from 'react'

import { AppHeader } from '@/components/layout/AppHeader'

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-svh overflow-x-hidden bg-background">
      <AppHeader />
      <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8">
        <div className="mx-auto w-full max-w-3xl">{children}</div>
      </main>
    </div>
  )
}
