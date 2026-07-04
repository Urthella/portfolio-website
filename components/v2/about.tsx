"use client"

import { animate, useInView } from "framer-motion"
import { Boxes, Server, type LucideIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { Reveal } from "@/components/v2/reveal"
import { SectionHeading } from "@/components/v2/section-heading"
import { fromLeft } from "@/lib/motion"
import { useContent } from "@/data/i18n"

// Counts a numeric value up from 0 when it scrolls into view (keeps any suffix like "+").
function CountUp({ value }: { value: string }) {
  const m = value.match(/^(\d+)(.*)$/)
  const target = m ? parseInt(m[1], 10) : 0
  const suffix = m ? m[2] : value
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!inView || !target) return
    const controls = animate(0, target, { duration: 1.1, ease: "easeOut", onUpdate: (v) => setN(Math.round(v)) })
    return () => controls.stop()
  }, [inView, target])

  return (
    <span ref={ref}>
      {target ? n : ""}
      {suffix}
    </span>
  )
}

// Warm, on-brand accents (mapped from the old lime/pink/cyan/amber keys).
const ACCENT: Record<string, { text: string; ring: string; bar: string; tile: string }> = {
  lime: { text: "text-orange-400", ring: "border-orange-500/50", bar: "border-orange-500", tile: "border-orange-500" },
  pink: { text: "text-rose-400", ring: "border-rose-500/50", bar: "border-rose-500", tile: "border-rose-500" },
  cyan: { text: "text-red-400", ring: "border-red-500/50", bar: "border-red-500", tile: "border-red-500" },
  amber: { text: "text-amber-400", ring: "border-amber-500/50", bar: "border-amber-500", tile: "border-amber-500" },
}
const accent = (k: string) => ACCENT[k] ?? ACCENT.lime

const ICONS: Record<string, LucideIcon> = { server: Server, container: Boxes }

export function About() {
  const c = useContent()
  const aboutHero = c.aboutHero
  return (
    <section id="about" className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <SectionHeading index="01" label={c.ui.headings.about.label} title={`${aboutHero.lead} × ${aboutHero.tail}`} />

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

          <div className="mt-4 rounded-xl border border-l-4 border-white/10 border-l-orange-400 bg-white/[0.02] px-4 py-3 font-mono text-xs leading-relaxed text-white/55">
            {aboutHero.note}
          </div>
        </Reveal>

        {/* right: stat tiles */}
        <Reveal delay={0.1}>
          <div className="grid grid-cols-2 gap-4">
            {aboutHero.stats.map((st, i) => {
              const a = accent(st.accent)
              return (
                <div
                  key={i}
                  className={`flex aspect-square flex-col justify-between rounded-xl border-b-4 border-l-4 ${a.tile} bg-[#efe9dd] p-5 transition-transform hover:-translate-y-1`}
                >
                  <span className="text-5xl font-black tracking-tight text-neutral-900">
                    <CountUp value={st.value} />
                  </span>
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
