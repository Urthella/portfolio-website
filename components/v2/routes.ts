"use client"

import { usePathname, useRouter } from "next/navigation"

/** Site pages in nav order; `key` indexes ui.nav for the label. */
export const PAGES = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "projects", href: "/projects" },
  { key: "writing", href: "/writing" },
  { key: "beyond", href: "/beyond" },
] as const

export const isActive = (pathname: string, href: string) =>
  href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`)

/**
 * Go to "/page", "/page#section" or "#section": smooth-scrolls when the target
 * is on the current page, otherwise navigates (Next scrolls to the hash).
 */
export function useGoto() {
  const router = useRouter()
  const pathname = usePathname()
  return (href: string) => {
    const [path, hash] = href.split("#")
    if (path && path !== pathname) return router.push(href)
    if (hash) document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" })
    else window.scrollTo({ top: 0, behavior: "smooth" })
  }
}
