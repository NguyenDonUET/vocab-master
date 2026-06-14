import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'

import { AppLayout } from '@/components/layout/AppLayout'
import '@/styles/globals.css'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
})

export const metadata: Metadata = {
  title: 'Vocab Coach',
  description:
    'Study English vocabulary, phrasal verbs, and collocations with flash cards.',
  icons: {
    icon: '/icons.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={plusJakartaSans.variable}>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  )
}
