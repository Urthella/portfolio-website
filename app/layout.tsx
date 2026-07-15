import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/react'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const personLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Utku Demirtaş',
  url: 'https://utkuwankenobi.tech',
  jobTitle: 'Backend & DevOps Engineer',
  image: 'https://utkuwankenobi.tech/PP.jpg',
  sameAs: [
    'https://github.com/Urthella',
    'https://www.linkedin.com/in/utkudemirtas/',
    'https://www.instagram.com/utkudem1rtas/',
    'https://medium.com/@urthella1',
  ],
  knowsAbout: ['Backend', 'DevOps', 'Node.js', 'NestJS', 'Spring Boot', 'Docker', 'Kubernetes', 'Cybersecurity'],
}

export const metadata: Metadata = {
  metadataBase: new URL('https://utkuwankenobi.tech'),
  title: 'Utku Demirtaş | Fullstack Developer',
  description: 'Portfolio and projects by Utku Demirtaş, Fullstack Developer specializing in React, Next.js, Node.js, Spring Boot, and modern web development. Computer Engineer, guitarist, and fitness enthusiast.',
  keywords: ['Utku Demirtaş', 'Fullstack Developer', 'Software Engineer', 'React', 'Next.js', 'Node.js', 'Spring Boot', 'TypeScript', 'JavaScript', 'Portfolio'],
  authors: [{ name: 'Utku Demirtaş', url: 'https://utkuwankenobi.tech' }],
  creator: 'Utku Demirtaş',
  publisher: 'Utku Demirtaş',
  generator: 'Next.js',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://utkuwankenobi.tech',
    siteName: 'Utku Demirtaş Portfolio',
    title: 'Utku Demirtaş | Fullstack Developer',
    description: 'Portfolio and projects by Utku Demirtaş, Fullstack Developer specializing in React, Next.js, Node.js, Spring Boot, and modern web development.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Utku Demirtaş | Fullstack Developer',
    description: 'Portfolio and projects by Utku Demirtaş, Fullstack Developer specializing in React, Next.js, Node.js, Spring Boot, and modern web development.',
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
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <style>{`
          html {
            font-family: ${GeistSans.style.fontFamily};
            --font-sans: ${GeistSans.variable};
            --font-mono: ${GeistMono.variable};
          }
        `}</style>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://prod.spline.design" />
        <link rel="dns-prefetch" href="https://prod.spline.design" />
        <meta name="theme-color" content="#000000" />
        <meta name="format-detection" content="telephone=no" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }} />
        {/* apply the saved accent color before first paint so a custom theme doesn't flash orange */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var a=localStorage.getItem('accent-base');if(a&&/^#[0-9a-f]{6}$/i.test(a))document.documentElement.style.setProperty('--accent-base',a)}catch(e){}",
          }}
        />
      </head>
      <body suppressHydrationWarning={true} className="bg-[#07070a] text-white antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
