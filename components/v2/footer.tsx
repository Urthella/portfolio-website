"use client"

import { ArrowUp } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 text-center sm:flex-row sm:justify-between sm:px-6 sm:text-left">
        <p className="text-sm text-white/40">
          © {new Date().getFullYear()} Utku Demirtaş — built with Next.js &amp; Framer Motion.
        </p>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="inline-flex items-center gap-1.5 text-sm text-white/50 transition-colors hover:text-white"
        >
          Back to top
          <ArrowUp className="h-3.5 w-3.5" />
        </button>
      </div>
    </footer>
  )
}
