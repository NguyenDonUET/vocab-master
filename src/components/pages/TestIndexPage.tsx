'use client'

import { Check, Circle, Layers } from 'lucide-react'
import Link from 'next/link'

import { TestProgressHydrator } from '@/components/progress/TestProgressHydrator'
import { PageHeader } from '@/components/ui/page-header'
import {
  getLevelBadgeClass,
  interactive,
  spacing,
  surface,
  typography,
} from '@/lib/design-system'
import { cn } from '@/lib/utils'
import type { CompletedTestPart } from '@/lib/test-progress'
import { useTestProgressStore } from '@/stores/useTestProgressStore'
import {
  AVAILABLE_TEST_LEVELS,
  getTestLevelPath,
  getTestParts,
  type AvailableTestLevel,
  type VocabularyTest,
} from '@/types/vocabulary-test'

interface TestIndexPageProps {
  testsByLevel: Record<AvailableTestLevel, VocabularyTest | null>
  initialCompletedParts: CompletedTestPart[]
}

function LevelTestCard({
  level,
  test,
}: {
  level: AvailableTestLevel
  test: VocabularyTest
}) {
  const isLevelComplete = useTestProgressStore((state) => state.isLevelComplete)
  const getMasteredPartCount = useTestProgressStore(
    (state) => state.getMasteredPartCount,
  )
  const getAttemptedPartCount = useTestProgressStore(
    (state) => state.getAttemptedPartCount,
  )

  const parts = getTestParts(test)
  const questionCount = test.questions?.length ?? 0
  const masteredCount = getMasteredPartCount(level, parts, test.testVersion)
  const attemptedCount = getAttemptedPartCount(level, parts, test.testVersion)
  const levelComplete = isLevelComplete(level, parts, test.testVersion)

  return (
    <Link
      href={getTestLevelPath(level)}
      className={cn(
        surface.card,
        'flex min-h-28 flex-col items-start justify-between gap-3 p-4',
        interactive.transition,
        interactive.hoverSurface,
        interactive.activePress,
        levelComplete && 'border-level-a2/30',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      )}
    >
      <div className="flex w-full items-center justify-between gap-2">
        <span
          className={cn(
            'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium',
            getLevelBadgeClass(level),
          )}
        >
          {level}
        </span>
        {levelComplete ? (
          <Check
            className="size-4 text-level-a2"
            aria-label={`${level} test mastered`}
          />
        ) : (
          <Layers className="size-4 text-muted-foreground/60" />
        )}
      </div>
      <div className="space-y-1">
        <p className={typography.body}>
          {questionCount} questions · {parts.length} parts
        </p>
        {parts.length > 0 && masteredCount > 0 && !levelComplete && (
          <p className="text-xs text-muted-foreground">
            {masteredCount}/{parts.length} parts at 100%
          </p>
        )}
        {parts.length > 0 && masteredCount === 0 && attemptedCount > 0 && (
          <p className="text-xs text-muted-foreground">In progress</p>
        )}
      </div>
    </Link>
  )
}

export function TestIndexPage({
  testsByLevel,
  initialCompletedParts,
}: TestIndexPageProps) {
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
      <TestProgressHydrator initialCompletedParts={initialCompletedParts} />
      <PageHeader
        title="Vocabulary test"
        description="Choose a CEFR level to start a multiple-choice vocabulary test."
      />

      <div className="grid gap-3 sm:grid-cols-2">
        {AVAILABLE_TEST_LEVELS.map((level) => {
          const test = testsByLevel?.[level]
          const questionCount = test?.questions?.length ?? 0
          const isAvailable = questionCount > 0

          if (!isAvailable) {
            return (
              <div
                key={level}
                className={cn(
                  surface.card,
                  'flex min-h-28 flex-col items-start justify-between gap-3 p-4 opacity-60',
                )}
              >
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
                <p className={typography.body}>Not generated yet</p>
              </div>
            )
          }

          if (!test) {
            return null
          }

          return <LevelTestCard key={level} level={level} test={test} />
        })}
      </div>
    </div>
  )
}
