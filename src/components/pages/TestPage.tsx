'use client'

import { Circle, Layers } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useMemo, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { PageHeader, SectionLabel } from '@/components/ui/page-header'
import { getLevelBadgeClass, interactive, kbdClass, spacing, surface, typography } from '@/lib/design-system'
import { formatPartOfSpeechLabel } from '@/lib/labels'
import { useTestKeyboardShortcuts } from '@/hooks/useTestKeyboardShortcuts'
import { cn } from '@/lib/utils'
import type { CefrLevel, VocabularyEntry } from '@/types/vocabulary'
import {
  getTestParts,
  TEST_QUESTIONS_PER_PART,
  type AvailableTestLevel,
  type VocabularyTest,
  type VocabularyTestQuestion,
} from '@/types/vocabulary-test'

interface TestPageProps {
  level: AvailableTestLevel
  test: VocabularyTest | null
  entriesById: Record<string, VocabularyEntry>
}

type AnswerState = 'unanswered' | 'correct' | 'incorrect'

function TestAnswerReveal({ entry }: { entry: VocabularyEntry }) {
  return (
    <div className={cn('border-t border-border/60 pt-4', spacing.section)}>
      <div className={cn('flex flex-wrap', spacing.tight)}>
        <Badge>{formatPartOfSpeechLabel(entry.partOfSpeech)}</Badge>
        <Badge variant="outline" className="font-mono text-xs">
          {entry.ipa}
        </Badge>
      </div>

      <div className={cn('grid gap-4 md:grid-cols-2', spacing.inline)}>
        <div className={surface.inset}>
          <SectionLabel>English</SectionLabel>
          <p className={cn('mt-2', typography.body, 'text-foreground')}>
            {entry.meaningEn}
          </p>
        </div>
        <div className={surface.inset}>
          <SectionLabel>Vietnamese</SectionLabel>
          <p className={cn('mt-2', typography.body, 'text-foreground')}>
            {entry.meaningVi}
          </p>
        </div>
      </div>
    </div>
  )
}

function getChoiceClassName(
  choiceIndex: number,
  selectedIndex: number | null,
  answerState: AnswerState,
  correctIndex: number,
): string {
  if (answerState === 'unanswered') {
    return ''
  }

  if (choiceIndex === correctIndex) {
    return 'border-2 border-level-a2 text-foreground'
  }

  if (selectedIndex === choiceIndex && answerState === 'incorrect') {
    return 'border-destructive/60 text-foreground'
  }

  return ''
}

function PartPicker({
  level,
  parts,
  onSelectPart,
}: {
  level: CefrLevel
  parts: ReturnType<typeof getTestParts>
  onSelectPart: (partNumber: number) => void
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <CardTitle>Choose a test part</CardTitle>
            <CardDescription>
              {level} vocabulary is split into {parts.length} parts of up to{' '}
              {TEST_QUESTIONS_PER_PART} questions each.
            </CardDescription>
          </div>
          <Button variant="outline" asChild className="shrink-0">
            <Link href="/test">Change level</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {parts.map((part) => (
            <button
              key={part.partNumber}
              type="button"
              onClick={() => onSelectPart(part.partNumber)}
              className={cn(
                surface.card,
                'flex min-h-28 flex-col items-start justify-between gap-3 p-4 text-left',
                interactive.transition,
                interactive.hoverSurface,
                interactive.activePress,
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              )}
            >
              <div className="flex w-full items-center justify-between gap-2">
                <span className={typography.label}>Part {part.partNumber}</span>
                <Layers className="size-4 text-muted-foreground/60" />
              </div>
              <p className={typography.body}>
                {part.questionCount}{' '}
                {part.questionCount === 1 ? 'question' : 'questions'}
              </p>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function QuestionCard({
  level,
  partNumber,
  question,
  questionNumber,
  totalQuestions,
  entry,
  onAnswered,
  onNext,
}: {
  level: CefrLevel
  partNumber: number
  question: VocabularyTestQuestion
  questionNumber: number
  totalQuestions: number
  entry: VocabularyEntry | undefined
  onAnswered: (isCorrect: boolean) => void
  onNext: () => void
}) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [answerState, setAnswerState] = useState<AnswerState>('unanswered')

  const progressValue = Math.round((questionNumber / totalQuestions) * 100)
  const isLastQuestion = questionNumber === totalQuestions

  const handleSelect = useCallback(
    (choiceIndex: number) => {
      if (answerState !== 'unanswered') {
        return
      }

      const isCorrect = choiceIndex === question.correctIndex
      setSelectedIndex(choiceIndex)
      setAnswerState(isCorrect ? 'correct' : 'incorrect')
      onAnswered(isCorrect)
    },
    [answerState, onAnswered, question.correctIndex],
  )

  useTestKeyboardShortcuts({
    choiceCount: question.choices?.length ?? 0,
    answerState,
    onSelectChoice: handleSelect,
    onNext,
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <CardTitle>
            Part {partNumber} · Question {questionNumber} of {totalQuestions}
          </CardTitle>
          <span
            className={cn(
              'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium',
              getLevelBadgeClass(level),
            )}
          >
            {level}
          </span>
        </div>
        <CardDescription>
          Choose the expression that best completes the sentence.{' '}
          <span className="text-muted-foreground/80">
            <kbd className={kbdClass()}>A</kbd>–<kbd className={kbdClass()}>D</kbd> or{' '}
            <kbd className={kbdClass()}>1</kbd>–<kbd className={kbdClass()}>4</kbd> to answer,{' '}
            <kbd className={kbdClass()}>Enter</kbd> for next.
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className={spacing.section}>
        <div className={cn(surface.inset, 'text-base leading-relaxed text-foreground')}>
          {question.prompt}
        </div>
        <div className="grid gap-3">
          {(question.choices ?? []).map((choice, choiceIndex) => (
            <Button
              key={`${question.vocabularyId}-${choice}`}
              type="button"
              variant="outline"
              disabled={answerState !== 'unanswered'}
              onClick={() => handleSelect(choiceIndex)}
              className={cn(
                'h-auto min-h-14 cursor-pointer justify-start whitespace-normal px-4 py-4 text-left md:min-h-12',
                'disabled:opacity-100',
                getChoiceClassName(
                  choiceIndex,
                  selectedIndex,
                  answerState,
                  question.correctIndex,
                ),
              )}
            >
              <span className="mr-3 shrink-0 font-medium text-muted-foreground">
                {String.fromCharCode(65 + choiceIndex)}.
              </span>
              <span>{choice}</span>
            </Button>
          ))}
        </div>
        {answerState !== 'unanswered' && entry && (
          <TestAnswerReveal entry={entry} />
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-4 border-t border-border/60 bg-muted/30">
        <div className="w-full space-y-2">
          <div className="flex w-full items-center justify-between gap-4">
            <span className={typography.body}>Progress</span>
            <span className={cn(typography.label, 'tabular-nums')}>
              {questionNumber}/{totalQuestions}
            </span>
          </div>
          <Progress value={progressValue} />
        </div>
        <Button
          onClick={onNext}
          disabled={answerState === 'unanswered'}
          className="w-full sm:ml-auto sm:w-auto"
        >
          {isLastQuestion ? 'Finish part' : 'Next question'}
        </Button>
      </CardFooter>
    </Card>
  )
}

function TestSummary({
  level,
  partNumber,
  correctCount,
  totalQuestions,
  onRetryPart,
  onChoosePart,
}: {
  level: CefrLevel
  partNumber: number
  correctCount: number
  totalQuestions: number
  onRetryPart: () => void
  onChoosePart: () => void
}) {
  const scorePercent = Math.round((correctCount / totalQuestions) * 100)

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {level} · Part {partNumber} complete
        </CardTitle>
        <CardDescription>
          Your score is shown below. Results are not saved.
        </CardDescription>
      </CardHeader>
      <CardContent className={spacing.section}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className={surface.inset}>
            <p className={typography.body}>Correct answers</p>
            <p className={typography.stat}>
              {correctCount}/{totalQuestions}
            </p>
          </div>
          <div className={surface.inset}>
            <p className={typography.body}>Score</p>
            <p className={typography.stat}>{scorePercent}%</p>
          </div>
        </div>
        <Progress value={scorePercent} />
      </CardContent>
      <CardFooter className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Button onClick={onRetryPart} className="w-full sm:w-auto">
          Try again
        </Button>
        <Button variant="outline" onClick={onChoosePart} className="w-full sm:w-auto">
          Choose another part
        </Button>
        <Button variant="outline" asChild className="w-full sm:w-auto">
          <Link href="/test">Change level</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export function TestPage({ level, test, entriesById }: TestPageProps) {
  const [selectedPart, setSelectedPart] = useState<number | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [sessionKey, setSessionKey] = useState(0)

  const parts = useMemo(() => (test ? getTestParts(test) : []), [test])
  const activePart = useMemo(
    () => parts.find((part) => part.partNumber === selectedPart) ?? null,
    [parts, selectedPart],
  )
  const questions = activePart?.questions ?? []
  const currentQuestion = questions[currentIndex]
  const isComplete = questions.length > 0 && currentIndex >= questions.length

  const resetSession = () => {
    setCurrentIndex(0)
    setCorrectCount(0)
    setSessionKey((key) => key + 1)
  }

  const handleAnswered = (isCorrect: boolean) => {
    if (isCorrect) {
      setCorrectCount((count) => count + 1)
    }
  }

  const handleNext = () => {
    setCurrentIndex((index) => index + 1)
  }

  const handleSelectPart = (partNumber: number) => {
    setSelectedPart(partNumber)
    resetSession()
  }

  const handleRetryPart = () => {
    resetSession()
  }

  const handleChoosePart = () => {
    setSelectedPart(null)
    resetSession()
  }

  if (!test || parts.length === 0) {
    return (
      <div className={spacing.page}>
        <PageHeader
          title={`${level} vocabulary test`}
          description="Multiple-choice practice by CEFR level."
        />
        <div className={cn(surface.muted, 'px-4 py-12 text-center md:px-6 md:py-16')}>
          <Circle className="mx-auto size-5 text-muted-foreground/60" />
          <p className={cn(typography.sectionTitle, 'mt-4')}>No test available</p>
          <p className={typography.body}>
            Generate the {level} test with{' '}
            <code className="rounded bg-muted px-1.5 py-0.5 text-foreground">
              npm run test:generate {level}
            </code>
            .
          </p>
          <Button variant="outline" asChild className="mt-4">
            <Link href="/test">Back to levels</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={spacing.page}>
      <PageHeader
        title={`${level} vocabulary test`}
        description={`Multiple-choice practice for ${level} vocabulary using example sentences.`}
      />

      {selectedPart === null ? (
        <PartPicker level={level} parts={parts} onSelectPart={handleSelectPart} />
      ) : isComplete ? (
        <TestSummary
          level={level}
          partNumber={selectedPart}
          correctCount={correctCount}
          totalQuestions={questions.length}
          onRetryPart={handleRetryPart}
          onChoosePart={handleChoosePart}
        />
      ) : (
        <QuestionCard
          key={`${sessionKey}-${currentQuestion.vocabularyId}`}
          level={level}
          partNumber={selectedPart}
          question={currentQuestion}
          questionNumber={currentIndex + 1}
          totalQuestions={questions.length}
          entry={entriesById[currentQuestion.vocabularyId]}
          onAnswered={handleAnswered}
          onNext={handleNext}
        />
      )}
    </div>
  )
}
