"use client"

import { AnimatePresence, motion } from "framer-motion"
import { ArrowUpRight, Github, Lock, Star, Zap } from "lucide-react"
import { useState } from "react"

import { SectionHeading } from "@/components/v2/section-heading"
import { categories, type Category } from "@/data/content"
import { useContent } from "@/data/i18n"

// Warm, on-brand category accents.
const ACCENT: Record<string, { bar: string; border: string; text: string }> = {
  "Full-stack": { bar: "bg-orange-500", border: "border-orange-500/45", text: "text-orange-400" },
  "AI/ML": { bar: "bg-rose-500", border: "border-rose-500/45", text: "text-rose-400" },
  Systems: { bar: "bg-amber-500", border: "border-amber-500/45", text: "text-amber-400" },
  Security: { bar: "bg-red-500", border: "border-red-500/45", text: "text-red-400" },
  Web: { bar: "bg-orange-400", border: "border-orange-400/45", text: "text-orange-300" },
}
const accent = (c: string) => ACCENT[c] ?? ACCENT.Web

export function Projects() {
  const c = useContent()
  const h = c.ui.headings.projects
  const [filter, setFilter] = useState<"All" | Category>("All")
  const shown = c.projects.filter((p) => filter === "All" || p.category === filter)

  return (
    <section id="projects" className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <SectionHeading index="05" label={h.label} title={h.title} subtitle={h.subtitle} />

      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`rounded-full border px-3.5 py-1.5 font-mono text-xs transition-colors ${
              filter === c
                ? "border-orange-500/50 bg-orange-500/15 text-orange-200"
                : "border-white/10 text-white/50 hover:border-white/25 hover:text-white"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {shown.map((p, i) => {
            const a = accent(p.category)
            return (
              <motion.div
                key={p.name}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -4 }}
                className={`group flex flex-col overflow-hidden rounded-2xl border-2 ${a.border} bg-neutral-950/70 backdrop-blur-sm transition-colors hover:bg-neutral-950`}
              >
                {/* top bar */}
                <div className={`flex items-center justify-between ${a.bar} px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-wide text-black`}>
                  <span className="truncate">
                    {String(i + 1).padStart(2, "0")} · {p.category}
                    {p.live ? (p.wip ? " · PREVIEW" : " · LIVE") : ""}
                  </span>
                  <span className="flex shrink-0 items-center gap-1.5">
                    {p.featured && (
                      <span className="inline-flex items-center gap-1">
                        <Star className="h-3 w-3 fill-black" /> FEATURED
                      </span>
                    )}
                    {p.collab && (
                      <span className="inline-flex items-center gap-1">
                        <Zap className="h-3 w-3 fill-black" /> COLLAB
                      </span>
                    )}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="flex items-center gap-2 text-lg font-bold text-white">
                    {p.name}
                    {p.wip && (
                      <span className="rounded bg-amber-500/15 px-1.5 py-0.5 font-mono text-[10px] uppercase text-amber-300">WIP</span>
                    )}
                  </h3>
                  {p.collab && (
                    <p className="mt-1 font-mono text-[11px] text-white/35">{h.collab} · thefcan</p>
                  )}

                  <p className="mt-2 flex-1 text-sm leading-relaxed text-white/55">{p.blurb}</p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.stack.map((s) => (
                      <span key={s} className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 font-mono text-[11px] text-white/50">
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    {p.live && (
                      <a
                        href={p.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-1.5 rounded-lg ${a.bar} px-3 py-1.5 font-mono text-xs font-bold text-black transition-transform hover:-translate-y-0.5`}
                      >
                        <ArrowUpRight className="h-3.5 w-3.5" /> {p.wip ? "PREVIEW" : "LIVE"}
                      </a>
                    )}
                    {p.privateRepo ? (
                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-white/20 px-3 py-1.5 font-mono text-xs text-white/40">
                        <Lock className="h-3.5 w-3.5" /> PRIVATE REPO
                      </span>
                    ) : (
                      <a
                        href={p.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 font-mono text-xs text-white/75 transition-colors hover:border-white/35 hover:text-white"
                      >
                        <Github className="h-3.5 w-3.5" /> CODE
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}
