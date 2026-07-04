"use client"

import { Boxes, Server, type LucideIcon } from "lucide-react"

import { Reveal } from "@/components/v2/reveal"
import { SectionHeading } from "@/components/v2/section-heading"
import { fromLeft } from "@/lib/motion"
import { aboutHero } from "@/data/content"

const ACCENT: Record<string, { text: string; ring: string; bar: string; tile: string }> = {
  lime: { text: "text-lime-400", ring: "border-lime-400/50", bar: "border-lime-400", tile: "border-lime-400" },
  pink: { text: "text-pink-400", ring: "border-pink-500/50", bar: "border-pink-500", tile: "border-pink-500" },
  cyan: { text: "text-cyan-400", ring: "border-cyan-400/50", bar: "border-cyan-400", tile: "border-cyan-400" },
  amber: { text: "text-amber-400", ring: "border-amber-400/50", bar: "border-amber-400", tile: "border-amber-400" },
}
const accent = (k: string) => ACCENT[k] ?? ACCENT.lime

const ICONS: Record<string, LucideIcon> = { server: Server, container: Boxes }

export function About() {
  return (
    <section id="about" className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <SectionHeading index="01" label="About" title={`${aboutHero.lead} × ${aboutHero.tail}`} />

      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        {/* left: intro + two sides + note */}
        <Reveal variants={fromLeft}>
          <div className="space-y-4 text-lg leading-relaxed text-white/60">
            {aboutHero.intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            {aboutHero.sides.map((s) => {
              const a = accent(s.accent)
              const Icon = ICONS[s.icon] ?? Server
              return (
                <div key={s.key} className={`rounded-xl border-2 ${a.ring} bg-white/[0.02] p-5`}>
                  <div className={`mb-3 flex items-center gap-2 ${a.text}`}>
                    <Icon className="h-5 w-5" />
                    <span className="font-mono text-sm font-bold tracking-wide">{s.title}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-white/55">{s.text}</p>
                </div>
              )
            })}
          </div>

          <div className="mt-4 rounded-xl border border-l-4 border-white/10 border-l-lime-400 bg-white/[0.02] px-4 py-3 font-mono text-xs leading-relaxed text-white/55">
            {aboutHero.note}
          </div>
        </Reveal>

        {/* right: stat tiles */}
        <Reveal delay={0.1}>
          <div className="grid grid-cols-2 gap-4">
            {aboutHero.stats.map((st) => {
              const a = accent(st.accent)
              return (
                <div
                  key={st.label}
                  className={`flex aspect-square flex-col justify-between rounded-xl border-b-4 border-l-4 ${a.tile} bg-[#efe9dd] p-5 transition-transform hover:-translate-y-1`}
                >
                  <span className="text-5xl font-black tracking-tight text-neutral-900">{st.value}</span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-600">{st.label}</span>
                </div>
              )
            })}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
