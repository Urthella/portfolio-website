import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: 'Utku Demirtaş | Frontend Developer',
  description: 'Portfolio and projects by Utku Demirtaş, specializing in React, Next.js, and modern web development.',
  generator: 'Next.js by Utku Demirtaş',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
          html {
            font-family: ${GeistSans.style.fontFamily};
            --font-sans: ${GeistSans.variable};
            --font-mono: ${GeistMono.variable};
          }
        `}</style>
        <link rel="icon" href="/download.svg" />
      </head>
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  )
}
