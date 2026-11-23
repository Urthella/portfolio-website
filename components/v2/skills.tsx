"use client"

import { motion } from "framer-motion"
import { Cloud, Code, Database, Layout, Server, Shield } from "lucide-react"

import { Reveal } from "@/components/v2/reveal"
import { SectionHeading } from "@/components/v2/section-heading"
import { container, scaleIn } from "@/lib/motion"
import { certifications } from "@/data/content"
import { useContent, useLang } from "@/data/i18n"

const icons = [Code, Layout, Server, Database, Cloud, Shield]

export function Skills() {
  const c = useContent()
  const { lang } = useLang()
  const skillGroups = c.skillGroups
  const h = c.ui.headings.skills
  const month = new Intl.DateTimeFormat(lang === "tr" ? "tr-TR" : "en-GB", { month: "short", year: "numeric", timeZone: "UTC" })
  return (
    <section id="skills" className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <SectionHeading index="03" label={h.label} title={h.title} />

      <motion.div
        variants={container(0.07)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {skillGroups.map((group, i) => {
          const Icon = icons[i % icons.length]
          return (
            <motion.div
              key={i}
              variants={scaleIn}
              data-colorize
              className="group relative overflow-hidden rounded-2xl border border-ink/10 bg-ink/[0.02] p-6 transition-colors hover:border-orange-500/30"
            >
              <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-orange-500/10 opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />
              <div className="mb-4 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl border border-ink/10 bg-ink/5 text-orange-500 transition-colors group-hover:border-orange-500/30">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="font-mono text-sm text-ink/80">{group.label}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {group.items.map((s) => (
                  <span
                    key={s}
                    className="rounded-lg border border-ink/10 bg-ink/[0.03] px-2.5 py-1 font-mono text-xs text-ink/60 transition-colors hover:border-ink/25 hover:text-ink"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* certifications: a plain list, issuer · courses · date */}
      <Reveal className="mt-16">
        <h3 className="text-xl font-semibold tracking-tight text-ink">{h.certs}</h3>
        <ul className="mt-4 divide-y divide-ink/10 border-y border-ink/10">
          {certifications.map((cert) => (
            <li key={cert.issuer} className="grid gap-x-8 gap-y-1 py-4 sm:grid-cols-[13rem_1fr_auto] sm:items-baseline">
              <span className="font-semibold text-ink">{cert.issuer}</span>
              <span className="text-pretty text-ink/70">{cert.names.join(" · ")}</span>
              <time dateTime={cert.date} className="font-mono text-xs tabular-nums text-ink/50">
                {month.format(new Date(`${cert.date}-01T00:00:00Z`))}
              </time>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  )
}
