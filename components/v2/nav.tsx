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

// the mark is home; the bar lists the rest
const ITEMS = PAGES.filter((p) => p.href !== "/")

const ring = "outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
// a keycap: the small controls sit on the bar like keys (⌘K is one already)
const key = `grid h-8 min-w-8 place-items-center rounded-md border border-ink/15 bg-paper/70 px-2 font-mono text-[11px] text-ink/65 shadow-[0_1.5px_0_rgba(21,20,19,.18)] transition-colors hover:border-ink/35 hover:text-ink ${ring}`

/**
 * The header as a shell prompt: the "ud" mark and the page you are on as a
 * path (utku@portfolio:~/projects▍), the pages as plain mono words with an
 * accent underline under the current one, and the controls (résumé, utkuOS,
 * command menu, lite and language toggles, contact) as keycaps. It picks up a
 * paper backdrop once the page scrolls. On phones the pages fold into a menu.
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
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div className={`border-b transition-colors duration-300 ${scrolled ? "border-ink/10 bg-paper/80 backdrop-blur-md" : "border-transparent"}`}>
        <div className="mx-auto flex h-14 max-w-[96rem] items-center gap-3 px-4 sm:px-8">
          <Link
            href="/"
            onClick={(e) => {
              // already home: Next won't scroll a same-URL navigation, so do it ourselves
              if (pathname === "/") {
                e.preventDefault()
                window.scrollTo({ top: 0, behavior: "smooth" })
              }
            }}
            className={`group flex items-center gap-2.5 rounded-md font-mono text-[13px] ${ring}`}
            aria-label={navLabels.home}
          >
            <span className="grid h-8 w-8 place-items-center rounded-full bg-orange-500 text-xs font-black tracking-tight text-ink transition-transform duration-300 group-hover:-rotate-12">
              ud
            </span>
            {/* the page you are on, as a prompt */}
            <span className="hidden text-ink/45 sm:inline">
              <span className="text-ink">utku</span>@portfolio:<span className="text-orange-500">~{pathname === "/" ? "" : pathname}</span>
              <span className="animate-cursor-blink text-ink/60">▍</span>
            </span>
          </Link>

          <nav className="ml-auto hidden items-center md:flex" aria-label="Main">
            {ITEMS.map(({ key: k, href }) => {
              const active = isActive(pathname, href)
              return (
                <Link
                  key={k}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`relative whitespace-nowrap rounded-md px-3 py-1.5 font-mono text-[13px] lowercase transition-colors ${ring} ${
                    active ? "text-ink" : "text-ink/55 hover:text-ink"
                  }`}
                >
                  {navLabels[k]}
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-orange-500"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          <div className="ml-auto flex items-center gap-1.5 md:ml-3">
            <a href={profile.resume} target="_blank" rel="noopener noreferrer" aria-label={c.ui.hero.resume} title={c.ui.hero.resume} className={`hidden sm:grid ${key}`}>
              cv
            </a>
            <Link href="/desktop" aria-label={navLabels.desktop} title={navLabels.desktop} className={`hidden lg:flex lg:items-center lg:gap-1 ${key}`}>
              <span className="lowercase">{navLabels.desktop}</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
            <button onClick={() => window.dispatchEvent(new Event("cmdk:open"))} className={`hidden lg:grid ${key}`} aria-label="Open command menu">
              ⌘K
            </button>
            {/* heavy-visuals toggle: lightning on = full experience, off = lite */}
            <button onClick={() => setLite(!lite)} title={perfLabel} aria-label={perfLabel} aria-pressed={lite} className={`hidden sm:grid ${key}`}>
              {lite ? <ZapOff className="h-3.5 w-3.5" /> : <Zap className="h-3.5 w-3.5 text-orange-500" />}
            </button>
            <button onClick={() => setLang(lang === "en" ? "tr" : "en")} className={key} aria-label="Toggle language" title="EN / TR">
              {lang}
            </button>
            {/* the contact form is the footer, on every page */}
            <button
              onClick={() => goto("#contact")}
              className={`whitespace-nowrap rounded-md border border-ink bg-orange-500 px-3 py-1.5 font-mono text-[12px] font-semibold lowercase text-ink shadow-[0_2px_0_#151413] transition-transform hover:-translate-y-px active:translate-y-px active:shadow-none ${ring}`}
            >
              {navLabels.contact}
            </button>
            <button onClick={() => setOpen((v) => !v)} className={`md:hidden ${key}`} aria-label="Toggle menu" aria-expanded={open}>
              {open ? <X className="h-3.5 w-3.5" /> : <Menu className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mx-4 mt-2 grid gap-0.5 rounded-xl border border-ink/12 bg-paper/95 p-2 shadow-[0_16px_40px_-20px_rgba(21,20,19,.5)] backdrop-blur-md md:hidden"
          >
            {ITEMS.map(({ key: k, href }) => {
              const active = isActive(pathname, href)
              return (
                <Link
                  key={k}
                  href={href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-lg px-3 py-2.5 font-mono text-sm lowercase ${ring} ${active ? "bg-ink/[0.06] text-ink" : "text-ink/65"}`}
                >
                  <span className="text-orange-500">{active ? "▸ " : "  "}</span>
                  {navLabels[k]}
                </Link>
              )
            })}
            <a href={profile.resume} target="_blank" rel="noopener noreferrer" className={`rounded-lg px-3 py-2.5 font-mono text-sm text-ink/65 sm:hidden ${ring}`}>
              cv
            </a>
            <Link
              href="/desktop"
              onClick={() => setOpen(false)}
              className={`mt-1 flex items-center justify-between rounded-lg border border-orange-500/40 px-3 py-2.5 font-mono text-sm lowercase text-orange-500 ${ring}`}
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
