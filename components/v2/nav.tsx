"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Languages, Menu, X } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

import { useContent, useLang } from "@/data/i18n"

export function Nav({ items, activeSection }: { items: string[]; activeSection: string }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const c = useContent()
  const { lang, setLang } = useLang()
  const navLabels = c.ui.nav

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    setOpen(false)
  }

  const label = (id: string) => navLabels[id as keyof typeof navLabels] ?? id

  const LangToggle = () => (
    <button
      onClick={() => setLang(lang === "en" ? "tr" : "en")}
      className="flex items-center gap-1.5 rounded-lg border border-white/15 px-2.5 py-1.5 font-mono text-xs text-white/70 transition-colors hover:border-white/30 hover:text-white"
      aria-label="Toggle language"
    >
      <Languages className="h-3.5 w-3.5" />
      <span className={lang === "en" ? "text-orange-400" : "text-white/40"}>EN</span>
      <span className="text-white/25">/</span>
      <span className={lang === "tr" ? "text-orange-400" : "text-white/40"}>TR</span>
    </button>
  )

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div
        className={`mx-auto flex h-16 max-w-6xl items-center justify-between px-4 transition-all duration-300 sm:px-6 ${
          scrolled ? "mt-2 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl sm:mt-3" : "border border-transparent"
        }`}
      >
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="group flex items-center gap-2.5 font-mono text-sm font-semibold text-white"
          aria-label="Back to top"
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-orange-600 text-white shadow-[0_0_20px_rgba(234,88,12,0.5)] transition-transform group-hover:scale-105">
            UD
          </span>
          <span className="hidden text-white/70 transition-colors group-hover:text-white sm:inline">~/utkudem1rtas</span>
        </button>

        <nav className="hidden items-center gap-1 md:flex">
          {items.map((id) => (
            <button
              key={id}
              onClick={() => go(id)}
              className={`relative rounded-lg px-3 py-2 text-sm transition-colors ${
                activeSection === id ? "text-white" : "text-white/55 hover:text-white"
              }`}
            >
              {label(id)}
              {activeSection === id && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 -z-10 rounded-lg bg-white/10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LangToggle />
          <Link
            href="/blog"
            className="hidden rounded-lg border border-white/15 px-3 py-1.5 text-sm text-white/80 transition-colors hover:border-white/30 hover:text-white sm:inline-block"
          >
            {navLabels.blog}
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-lg border border-white/15 text-white md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
            className="mx-4 mt-2 grid gap-1 rounded-2xl border border-white/10 bg-black/80 p-2 backdrop-blur-xl md:hidden"
          >
            {items.map((id) => (
              <button
                key={id}
                onClick={() => go(id)}
                className={`rounded-lg px-3 py-2.5 text-left text-sm ${
                  activeSection === id ? "bg-white/10 text-white" : "text-white/60"
                }`}
              >
                {label(id)}
              </button>
            ))}
            <Link href="/blog" className="rounded-lg px-3 py-2.5 text-left text-sm text-white/60" onClick={() => setOpen(false)}>
              {navLabels.blog}
            </Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
