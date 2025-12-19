import type { Metadata } from 'next'
import localFont from 'next/font/local'
import '../globals.css'
import { SessionProvider } from '@/components/providers/SessionProvider'

const geistSans = localFont({
  src: '../fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: 'My Account - Syntropedia',
  description: 'Manage your Syntropedia account',
}

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
