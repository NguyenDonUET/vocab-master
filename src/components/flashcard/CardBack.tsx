import { Badge } from '@/components/ui/badge'
import { SectionLabel } from '@/components/ui/page-header'
import { spacing, surface, typography } from '@/lib/design-system'
import { formatPartOfSpeechLabel } from '@/lib/labels'
import { cn } from '@/lib/utils'
import type { VocabularyEntry } from '@/types/vocabulary'

interface CardBackProps {
  entry: VocabularyEntry
}

export function CardBack({ entry }: CardBackProps) {
  return (
    <div className={cn('border-t border-border/60 pt-6', spacing.section)}>
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

      <div className={surface.inset}>
        <SectionLabel>Examples</SectionLabel>
        <ol className={cn('mt-4', spacing.section)}>
          {entry.examples.map((example, index) => (
            <li
              key={index}
              className={cn(
                'flex',
                spacing.inline,
                typography.body,
                'text-foreground',
              )}
            >
              <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-semibold text-muted-foreground">
                {index + 1}
              </span>
              <span className="break-words">{example}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className={surface.inset}>
        <SectionLabel>Q&A</SectionLabel>
        <div className={cn('mt-4', spacing.section)}>
          <div className="flex justify-start">
            <div className="max-w-[90%] rounded-2xl rounded-tl-sm border border-border/60 bg-muted/60 px-4 py-3">
              <p className="mb-1 text-xs font-semibold text-muted-foreground">
                Alex
              </p>
              <p className={cn(typography.body, 'text-foreground')}>
                {entry.conversation.question}
              </p>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="max-w-[90%] rounded-2xl rounded-tr-sm border border-primary/20 bg-primary/10 px-4 py-3">
              <p className="mb-1 text-xs font-semibold text-muted-foreground">
                Sam
              </p>
              <p className={cn(typography.body, 'text-foreground')}>
                {entry.conversation.answer}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
