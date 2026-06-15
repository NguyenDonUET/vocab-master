'use client'

import { Circle, Layers } from 'lucide-react'
import Link from 'next/link'

import { PageHeader } from '@/components/ui/page-header'
import {
  getLevelBadgeClass,
  interactive,
  spacing,
  surface,
  typography,
} from '@/lib/design-system'
import { cn } from '@/lib/utils'
import {
  AVAILABLE_TEST_LEVELS,
  getTestLevelPath,
  getTestParts,
  type AvailableTestLevel,
  type VocabularyTest,
} from '@/types/vocabulary-test'

interface TestIndexPageProps {
  testsByLevel: Record<AvailableTestLevel, VocabularyTest | null>
}

export function TestIndexPage({ testsByLevel }: TestIndexPageProps) {
  const hasAnyTest = AVAILABLE_TEST_LEVELS.some(
    (level) => (testsByLevel?.[level]?.questions?.length ?? 0) > 0,
  )

  if (!hasAnyTest) {
    return (
      <div className={spacing.page}>
        <PageHeader
          title="Vocabulary test"
          description="Multiple-choice practice by CEFR level."
        />
        <div
          className={cn(
            surface.muted,
            'px-4 py-12 text-center md:px-6 md:py-16',
          )}
        >
          <Circle className="mx-auto size-5 text-muted-foreground/60" />
          <p className={cn(typography.sectionTitle, 'mt-4')}>
            No tests available
          </p>
          <p className={typography.body}>
            Generate test content first with{' '}
            <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">
              npm run test:generate
            </code>
            .
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={spacing.page}>
      <PageHeader
        title="Vocabulary test"
        description="Choose a CEFR level to start a multiple-choice vocabulary test."
      />

      <div className="grid gap-3 sm:grid-cols-2">
        {AVAILABLE_TEST_LEVELS.map((level) => {
          const test = testsByLevel?.[level]
          const parts = test ? getTestParts(test) : []
          const questionCount = test?.questions?.length ?? 0
          const isAvailable = questionCount > 0

          const content = (
            <>
              <div className="flex w-full items-center justify-between gap-2">
                <span
                  className={cn(
                    'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium',
                    getLevelBadgeClass(level),
                  )}
                >
                  {level}
                </span>
                <Layers className="size-4 text-muted-foreground/60" />
              </div>
              <p className={typography.body}>
                {isAvailable
                  ? `${questionCount} questions · ${parts.length} parts`
                  : 'Not generated yet'}
              </p>
            </>
          )

          if (!isAvailable) {
            return (
              <div
                key={level}
                className={cn(
                  surface.card,
                  'flex min-h-28 flex-col items-start justify-between gap-3 p-4 opacity-60',
                )}
              >
                {content}
              </div>
            )
          }

          return (
            <Link
              key={level}
              href={getTestLevelPath(level)}
              className={cn(
                surface.card,
                'flex min-h-28 flex-col items-start justify-between gap-3 p-4',
                interactive.transition,
                interactive.hoverSurface,
                interactive.activePress,
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              )}
            >
              {content}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
