import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://utkuwankenobi.tech'),
  title: 'Utku Demirtaş | Frontend Developer & Software Engineer',
  description: 'Portfolio and projects by Utku Demirtaş, specializing in React, Next.js, Spring Boot, and modern web development. Computer Engineer, guitarist, and fitness enthusiast.',
  keywords: ['Utku Demirtaş', 'Frontend Developer', 'Software Engineer', 'React', 'Next.js', 'Spring Boot', 'TypeScript', 'JavaScript', 'Portfolio'],
  authors: [{ name: 'Utku Demirtaş', url: 'https://utkuwankenobi.tech' }],
  creator: 'Utku Demirtaş',
  publisher: 'Utku Demirtaş',
  generator: 'Next.js',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://utkuwankenobi.tech',
    siteName: 'Utku Demirtaş Portfolio',
    title: 'Utku Demirtaş | Frontend Developer & Software Engineer',
    description: 'Portfolio and projects by Utku Demirtaş, specializing in React, Next.js, Spring Boot, and modern web development.',
    images: [
      {
        url: '/placeholder-logo.png',
        width: 1200,
        height: 630,
        alt: 'Utku Demirtaş Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Utku Demirtaş | Frontend Developer & Software Engineer',
    description: 'Portfolio and projects by Utku Demirtaş, specializing in React, Next.js, Spring Boot, and modern web development.',
    images: ['/placeholder-logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export function generateViewport() {
  return {
    width: 'device-width',
    initialScale: 1,
    themeColor: '#000000',
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`
          html {
            font-family: ${GeistSans.style.fontFamily};
            --font-sans: ${GeistSans.variable};
            --font-mono: ${GeistMono.variable};
          }
        `}</style>
        <link rel="icon" href="/download.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#000000" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body suppressHydrationWarning={true}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
