import type { Metadata } from "next"

/**
 * The one host the site is served from: the bare domain 301s to www, so every
 * canonical, sitemap entry and share card must point at www. Pointing them at
 * the bare domain sends Google to a redirect and splits the page's signals.
 */
export const SITE_URL = "https://www.utkudemirtas.tech"

/**
 * Metadata for one page: its own <title>, description, canonical URL and
 * share cards. Without this every page inherits the home page's og:url and
 * og:title from app/layout.tsx, so shared links would point at the home page.
 */
export function pageMeta(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: "Utku Demirtaş Portfolio", locale: "en_US", url: path, title, description },
    twitter: { card: "summary_large_image", title, description },
  }
}
