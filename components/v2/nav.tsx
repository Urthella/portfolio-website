"use client"

import { AnimatePresence, motion } from "framer-motion"
import { ArrowUpRight, Menu, X, Zap, ZapOff } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

import { PAGES, isActive, useGoto } from "@/components/v2/routes"
import { profile } from "@/data/content"
import { useContent, useLang } from "@/data/i18n"
import { usePerf } from "@/hooks/use-perf"

// the logo is home; the pill lists the rest
const ITEMS = PAGES.filter((p) => p.href !== "/")

const ring = "outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
// a small round button inside the ink pill
const dot = `grid h-9 min-w-9 place-items-center rounded-full border border-paper/20 px-2 font-mono text-xs text-paper/75 transition-colors hover:border-paper/50 hover:text-paper ${ring}`

/**
 * The header: an orange "ud." tile set askew on the left, and on the right one
 * ink pill holding the pages, the résumé, utkuOS, the command menu, the lite
 * and language toggles and the accent "contact" button. On phones the pill
 * keeps contact and a menu button; the menu drops down as a second ink panel.
 */
export function Nav() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  // Nav persists across pages (site layout): close the mobile menu on any route change, however it happened
  const [menuPath, setMenuPath] = useState(pathname)
  if (menuPath !== pathname) {
    setMenuPath(pathname)
    setOpen(false)
  }
  const goto = useGoto()
  const c = useContent()
  const { lang, setLang } = useLang()
  const { lite, setLite } = usePerf()
  const navLabels = c.ui.nav
  const perfLabel = lite ? c.ui.perf.enableFull : c.ui.perf.enableLite

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-8 sm:pt-5"
    >
      <div className="mx-auto flex max-w-[96rem] items-start justify-between gap-3">
        <Link
          href="/"
          onClick={(e) => {
            // already home: Next won't scroll a same-URL navigation, so do it ourselves
            if (pathname === "/") {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: "smooth" })
            }
          }}
          className={`group pointer-events-auto rounded-md ${ring}`}
          aria-label={navLabels.home}
        >
          {/* askew like a sticker, straightening under the pointer */}
          <span className="grid h-12 w-12 -rotate-[5deg] place-items-center rounded-md border-2 border-ink bg-orange-500 text-lg font-black tracking-tight text-ink shadow-[3px_3px_0_#151413] transition-transform duration-300 group-hover:rotate-0">
            ud.
          </span>
        </Link>

        <div
          className={`pointer-events-auto flex items-center gap-1 rounded-full bg-ink p-1.5 text-paper transition-shadow duration-300 ${
            scrolled ? "shadow-[0_14px_34px_-14px_rgba(21,20,19,.7)]" : "shadow-[0_8px_24px_-16px_rgba(21,20,19,.6)]"
          }`}
        >
          <nav className="hidden items-center md:flex" aria-label="Main">
            {ITEMS.map(({ key, href }) => {
              const active = isActive(pathname, href)
              return (
                <Link
                  key={key}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`relative whitespace-nowrap rounded-full px-3 py-2 font-mono text-[13px] lowercase transition-colors ${ring} ${
                    active ? "text-paper" : "text-paper/65 hover:text-paper"
                  }`}
                >
                  {navLabels[key]}
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-full bg-paper/12"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          <a href={profile.resume} target="_blank" rel="noopener noreferrer" aria-label={c.ui.hero.resume} title={c.ui.hero.resume} className={`hidden sm:grid ${dot}`}>
            cv
          </a>
          <Link href="/desktop" aria-label={navLabels.desktop} title={navLabels.desktop} className={`hidden lg:flex lg:items-center lg:gap-1 ${dot}`}>
            <span className="lowercase">{navLabels.desktop}</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
          <button
            onClick={() => window.dispatchEvent(new Event("cmdk:open"))}
            className={`hidden lg:grid ${dot}`}
            aria-label="Open command menu"
          >
            ⌘K
          </button>
          {/* heavy-visuals toggle: lightning on = full experience, off = lite */}
          <button onClick={() => setLite(!lite)} title={perfLabel} aria-label={perfLabel} aria-pressed={lite} className={`hidden sm:grid ${dot}`}>
            {lite ? <ZapOff className="h-4 w-4" /> : <Zap className="h-4 w-4 text-orange-500" />}
          </button>
          <button onClick={() => setLang(lang === "en" ? "tr" : "en")} className={dot} aria-label="Toggle language" title="EN / TR">
            {lang === "en" ? "en" : "tr"}
          </button>
          {/* the contact form is the footer, on every page */}
          <button
            onClick={() => goto("#contact")}
            className={`whitespace-nowrap rounded-full bg-orange-500 px-4 py-2 font-mono text-[13px] font-medium lowercase text-ink transition-colors hover:bg-orange-600 ${ring}`}
          >
            {navLabels.contact}
          </button>
          <button
            onClick={() => setOpen((v) => !v)}
            className={`md:hidden ${dot}`}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto ml-auto mt-2 grid max-w-xs gap-1 rounded-3xl bg-ink p-2 text-paper shadow-[0_14px_34px_-14px_rgba(21,20,19,.7)] md:hidden"
          >
            {ITEMS.map(({ key, href }) => {
              const active = isActive(pathname, href)
              return (
                <Link
                  key={key}
                  href={href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-2xl px-4 py-2.5 font-mono text-sm lowercase ${ring} ${active ? "bg-paper/12 text-paper" : "text-paper/70"}`}
                >
                  {navLabels[key]}
                </Link>
              )
            })}
            <a href={profile.resume} target="_blank" rel="noopener noreferrer" className={`rounded-2xl px-4 py-2.5 font-mono text-sm text-paper/70 sm:hidden ${ring}`}>
              cv
            </a>
            <Link
              href="/desktop"
              onClick={() => setOpen(false)}
              className={`mt-1 flex items-center justify-between rounded-2xl border border-orange-500/40 px-4 py-2.5 font-mono text-sm lowercase text-orange-500 ${ring}`}
            >
              {navLabels.desktop}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
