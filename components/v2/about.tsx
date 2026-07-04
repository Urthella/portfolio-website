"use client"

import { Languages, Sparkles } from "lucide-react"

import { SpotlightCard } from "@/components/ui/spotlight-card"
import { Reveal } from "@/components/v2/reveal"
import { SectionHeading } from "@/components/v2/section-heading"
import { fromLeft } from "@/lib/motion"
import { about } from "@/data/content"

export function About() {
  return (
    <section id="about" className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <SectionHeading
        index="01"
        label="About"
        title="About me"
        subtitle="Backend &amp; DevOps-leaning fullstack engineer — with a security mindset."
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <Reveal variants={fromLeft} className="lg:col-span-3">
          <SpotlightCard className="h-full">
            <div className="space-y-4 p-6 leading-relaxed text-white/60 sm:p-8">
              {about.bio.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </SpotlightCard>
        </Reveal>

        <div className="grid gap-6 lg:col-span-2">
          <Reveal delay={0.05}>
            <SpotlightCard className="h-full !border-orange-500/20 !bg-orange-500/[0.06]" spotlightColor="rgba(249, 115, 22, 0.28)">
              <div className="p-6">
                <h3 className="mb-3 flex items-center gap-2 font-mono text-sm text-orange-300">
                  <Sparkles className="h-4 w-4" /> // current-focus
                </h3>
                <p className="text-sm leading-relaxed text-white/60">{about.focus}</p>
              </div>
            </SpotlightCard>
          </Reveal>

          <Reveal delay={0.1}>
            <SpotlightCard className="h-full">
              <div className="p-6">
                <h3 className="mb-4 flex items-center gap-2 font-mono text-sm text-white/70">
                  <Languages className="h-4 w-4 text-orange-500" /> // languages
                </h3>
                <ul className="space-y-2.5 text-sm">
                  {about.languages.map((l) => (
                    <li key={l.name} className="flex items-center justify-between">
                      <span className="text-white/70">{l.name}</span>
                      <span className="font-mono text-xs text-white/40">{l.level}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </SpotlightCard>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
