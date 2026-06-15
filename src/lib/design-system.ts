import { cn } from '@/lib/utils'
import type { CefrLevel, VocabularyCategory } from '@/types/vocabulary'

/** 8px-grid spacing */
export const spacing = {
  page: 'space-y-6',
  section: 'space-y-4',
  inline: 'gap-4',
  tight: 'gap-2',
} as const

/** Shared control sizing — 44px touch targets on mobile */
export const control = {
  height: 'min-h-11 md:min-h-9 md:h-9',
  radius: 'rounded-md',
} as const

/** Typography scale */
export const typography = {
  pageTitle: 'text-2xl font-bold tracking-tight text-foreground md:text-3xl',
  sectionTitle:
    'text-lg font-semibold tracking-tight text-foreground md:text-xl',
  cardTitle: 'text-lg font-semibold tracking-tight text-foreground md:text-xl',
  label: 'text-sm font-medium text-foreground',
  body: 'text-sm text-muted-foreground leading-relaxed',
  expression:
    'break-words text-2xl font-semibold tracking-tight text-foreground md:text-3xl',
  stat: 'text-xl font-semibold tabular-nums tracking-tight text-foreground md:text-2xl',
} as const

/** Surfaces & containers */
export const surface = {
  card: 'rounded-xl border border-border/60 bg-card shadow-sm',
  panel: 'rounded-xl border border-border/60 bg-card p-4 shadow-sm md:p-6',
  muted: 'rounded-xl border border-dashed border-border/60 bg-muted/40',
  inset: 'rounded-lg border border-border/60 bg-muted/30 p-3 md:p-4',
} as const

/** Interaction */
export const interactive = {
  transition: 'transition-all duration-200 ease-in-out',
  hoverSurface: 'hover:border-border/80 hover:bg-muted/50',
  activePress: 'active:scale-[0.98]',
} as const

/** CEFR level badges — semantic token tints */
export const levelBadgeClass: Record<CefrLevel, string> = {
  A2: 'border-level-a2/30 bg-level-a2/10 text-level-a2',
  B1: 'border-level-b1/30 bg-level-b1/10 text-level-b1',
  B2: 'border-level-b2/30 bg-level-b2/10 text-level-b2',
  C1: 'border-level-c1/30 bg-level-c1/10 text-level-c1',
  C2: 'border-level-c2/30 bg-level-c2/10 text-level-c2',
}

/** Category badges — semantic tokens only */
export const categoryBadgeClass: Record<VocabularyCategory, string> = {
  word: 'border-border/60 bg-muted text-muted-foreground',
  'phrasal-verb': 'border-primary/30 bg-primary/10 text-primary',
  'fixed-expression':
    'border-secondary-foreground/20 bg-secondary text-secondary-foreground',
  collocation: 'border-accent-foreground/20 bg-accent text-accent-foreground',
}

export function getLevelBadgeClass(level: CefrLevel): string {
  return levelBadgeClass[level]
}

export function getCategoryBadgeClass(category: VocabularyCategory): string {
  return categoryBadgeClass[category]
}

export const surfaces = {
  page: spacing.page,
  card: surface.panel,
  empty: surface.muted,
} as const

export function pageHeaderClass(className?: string) {
  return cn(spacing.section, className)
}

export function pageTitleClass(className?: string) {
  return cn(typography.pageTitle, className)
}

export function pageDescriptionClass(className?: string) {
  return cn(typography.body, className)
}

export function sectionLabelClass(className?: string) {
  return cn(
    'text-xs font-semibold uppercase tracking-wide text-muted-foreground',
    className,
  )
}

export function kbdClass(className?: string) {
  return cn(
    'inline-flex min-h-6 min-w-6 items-center justify-center rounded-md border border-border/60 bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground',
    className,
  )
}
