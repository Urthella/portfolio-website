"use client"

import { motion } from "framer-motion"
import { GitPullRequest, Github, Star, Users } from "lucide-react"

import { Reveal } from "@/components/v2/reveal"
import { container, fadeUp } from "@/lib/motion"
import { profile } from "@/data/content"

const STATS = [
  { icon: Users, value: "10+", label: "Public repos" },
  { icon: GitPullRequest, value: "8", label: "Merged PRs (2026)" },
  { icon: Star, value: "6", label: "Languages shipped" },
]

// Rough share of the languages across the public repos.
const LANGS = [
  { name: "TypeScript", pct: 46, color: "#f97316" },
  { name: "Python", pct: 20, color: "#fb7185" },
  { name: "Java", pct: 14, color: "#f59e0b" },
  { name: "Go", pct: 9, color: "#fbbf24" },
  { name: "Rust", pct: 6, color: "#fda4af" },
  { name: "C++ / Shell", pct: 5, color: "#fdba74" },
]

export function GithubStats() {
  return (
    <section className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <Reveal className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-mono text-sm text-white/70">
            <Github className="h-4 w-4 text-orange-500" /> // github @Urthella
          </h3>
          <a
            href={profile.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-orange-400 transition-colors hover:text-orange-300"
          >
            view profile →
          </a>
        </div>

        <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          {/* stat tiles */}
          <motion.div
            variants={container(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            className="grid grid-cols-3 gap-3"
          >
            {STATS.map((s) => (
              <motion.div
                key={s.label}
                variants={fadeUp}
                className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-center"
              >
                <s.icon className="mx-auto mb-2 h-5 w-5 text-orange-500" />
                <div className="bg-gradient-to-br from-white to-white/50 bg-clip-text text-2xl font-bold text-transparent">
                  {s.value}
                </div>
                <div className="mt-1 text-[11px] leading-tight text-white/45">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* language bar */}
          <div>
            <div className="flex h-3 w-full overflow-hidden rounded-full">
              {LANGS.map((l) => (
                <div key={l.name} style={{ width: `${l.pct}%`, backgroundColor: l.color }} />
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
              {LANGS.map((l) => (
                <div key={l.name} className="flex items-center gap-2 text-xs text-white/60">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: l.color }} />
                  {l.name}
                  <span className="ml-auto font-mono text-white/35">{l.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
