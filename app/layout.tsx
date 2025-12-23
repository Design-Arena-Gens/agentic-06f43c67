import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Goal Tracker',
  description: 'Track your goals and progress',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
