"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Globe, Menu, X } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface NavItem {
  id: string
  label: string
}

interface NavProps {
  items: NavItem[]
  activeSection: string
  language: "en" | "tr"
  onToggleLanguage: () => void
  blogLabel: string
}

export function Nav({ items, activeSection, language, onToggleLanguage, blogLabel }: NavProps) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

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

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div
        className={`mx-auto flex h-16 max-w-6xl items-center justify-between px-4 transition-all duration-300 sm:px-6 ${
          scrolled
            ? "mt-2 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl sm:mt-3"
            : "border border-transparent bg-transparent"
        }`}
      >
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="group flex items-center gap-2 font-mono text-sm font-semibold tracking-tight text-white"
          aria-label="Back to top"
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.5)] transition-transform group-hover:scale-105">
            UD
          </span>
          <span className="hidden text-white/70 transition-colors group-hover:text-white sm:inline">
            utkudemirtas
          </span>
        </button>

        {/* desktop links */}
        <nav className="hidden items-center gap-1 md:flex">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => go(item.id)}
              className={`relative rounded-lg px-3 py-2 text-sm transition-colors ${
                activeSection === item.id ? "text-white" : "text-white/55 hover:text-white"
              }`}
            >
              {item.label}
              {activeSection === item.id && (
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
          <Link
            href="/blog"
            className="hidden rounded-lg border border-white/15 px-3 py-1.5 text-sm text-white/80 transition-colors hover:border-white/30 hover:text-white sm:inline-block"
          >
            {blogLabel}
          </Link>
          <button
            onClick={onToggleLanguage}
            className="flex items-center gap-1.5 rounded-lg border border-white/15 px-2.5 py-1.5 text-sm text-white/80 transition-colors hover:border-white/30 hover:text-white"
            aria-label="Toggle language"
          >
            <Globe className="h-4 w-4" />
            <span className="font-mono">{language.toUpperCase()}</span>
          </button>
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

      {/* mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="mx-4 mt-2 grid gap-1 rounded-2xl border border-white/10 bg-black/80 p-2 backdrop-blur-xl md:hidden"
          >
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => go(item.id)}
                className={`rounded-lg px-3 py-2.5 text-left text-sm ${
                  activeSection === item.id ? "bg-white/10 text-white" : "text-white/60"
                }`}
              >
                {item.label}
              </button>
            ))}
            <Link
              href="/blog"
              className="rounded-lg px-3 py-2.5 text-left text-sm text-white/60"
              onClick={() => setOpen(false)}
            >
              {blogLabel}
            </Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
