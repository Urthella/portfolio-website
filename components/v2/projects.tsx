"use client"

import { AnimatePresence, motion } from "framer-motion"
import { ArrowUpRight, Github, Star } from "lucide-react"
import { useState } from "react"

import { SectionHeading } from "@/components/v2/section-heading"
import { categories, projects, type Category } from "@/data/content"

export function Projects() {
  const [filter, setFilter] = useState<"All" | Category>("All")
  const shown = projects.filter((p) => filter === "All" || p.category === filter)

  return (
    <section id="projects" className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <SectionHeading
        index="04"
        label="Projects"
        title="Selected work"
        subtitle="Auction engines, ML detectors, CPU simulators and security tooling — a spread across the stack."
      />

      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`rounded-full border px-3.5 py-1.5 font-mono text-xs transition-colors ${
              filter === c
                ? "border-blue-500/50 bg-blue-500/15 text-blue-200"
                : "border-white/10 text-white/50 hover:border-white/25 hover:text-white"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {shown.map((p) => (
            <motion.a
              key={p.name}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -5 }}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-white/[0.02] p-6 transition-colors ${
                p.featured ? "border-blue-500/25 hover:border-blue-500/50" : "border-white/10 hover:border-white/25"
              }`}
            >
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/[0.07] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

              <div className="relative flex items-center justify-between">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] text-white/50">
                    {p.category}
                  </span>
                  {p.featured && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/25 bg-blue-500/10 px-2 py-1 font-mono text-[11px] text-blue-300">
                      <Star className="h-3 w-3" /> featured
                    </span>
                  )}
                </div>
                <span className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-white/40 transition-all group-hover:border-white/25 group-hover:text-white">
                  {p.privateRepo ? <ArrowUpRight className="h-4 w-4" /> : <Github className="h-4 w-4" />}
                </span>
              </div>

              <h3 className="relative mt-4 flex items-center gap-2 text-lg font-semibold text-white">
                {p.name}
                {p.wip && (
                  <span className="rounded bg-amber-500/15 px-1.5 py-0.5 font-mono text-[10px] uppercase text-amber-300">
                    WIP
                  </span>
                )}
              </h3>

              <p className="relative mt-2 flex-1 text-sm leading-relaxed text-white/55">{p.blurb}</p>

              {p.live && (
                <p className="relative mt-3 font-mono text-xs text-blue-400">{p.live.replace("https://", "")} ↗</p>
              )}

              <div className="relative mt-4 flex flex-wrap gap-1.5">
                {p.stack.map((s) => (
                  <span key={s} className="rounded-md bg-white/[0.04] px-2 py-0.5 font-mono text-[11px] text-white/45">
                    {s}
                  </span>
                ))}
              </div>
            </motion.a>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}
