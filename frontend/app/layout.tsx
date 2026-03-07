import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'SkillDuel | Learn faster. Challenge friends.',
  description: 'An AI-powered learning platform where users watch short lessons and challenge friends in knowledge duels.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} antialiased font-sans bg-slate-50 text-slate-900 selection:bg-indigo-500/30`}>
        {children}
      </body>
    </html>
  )
}
