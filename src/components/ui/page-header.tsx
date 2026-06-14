import type { ReactNode } from 'react'

import {
  pageDescriptionClass,
  pageHeaderClass,
  pageTitleClass,
  sectionLabelClass,
} from '@/lib/design-system'

interface PageHeaderProps {
  title: string
  description?: string
  className?: string
}

export function PageHeader({ title, description, className }: PageHeaderProps) {
  return (
    <header className={pageHeaderClass(className)}>
      <h1 className={pageTitleClass()}>{title}</h1>
      {description ? (
        <p className={pageDescriptionClass()}>{description}</p>
      ) : null}
    </header>
  )
}

interface SectionLabelProps {
  children: ReactNode
  className?: string
}

export function SectionLabel({ children, className }: SectionLabelProps) {
  return <p className={sectionLabelClass(className)}>{children}</p>
}
