"use client"

import { motion } from "framer-motion"
import { Award, Sparkles } from "lucide-react"

import { Reveal } from "@/components/v2/reveal"
import { SectionHeading } from "@/components/v2/section-heading"
import { container, fadeUp, fromLeft } from "@/lib/motion"
import { translations } from "@/data/translations"

const stats = [
  { value: "5+", label: "Years coding" },
  { value: "8+", label: "Projects shipped" },
  { value: "3", label: "Internships" },
]

export function About({ language }: { language: "en" | "tr" }) {
  const t = translations[language]

  return (
    <section id="about" className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <SectionHeading eyebrow="01 — About" title={t.about.title} subtitle={t.about.subtitle} />

      <div className="grid gap-8 lg:grid-cols-5">
        {/* journey */}
        <Reveal variants={fromLeft} className="lg:col-span-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
            <h3 className="mb-5 flex items-center gap-2 text-lg font-semibold text-white">
              <span className="h-4 w-1 rounded-full bg-blue-500" />
              {t.about.journey}
            </h3>
            <div className="space-y-4 text-pretty leading-relaxed text-white/60">
              <p>{t.about.description1}</p>
              <p>{t.about.description2}</p>
              <p>{t.about.description3}</p>
            </div>

            <motion.div
              variants={container(0.08)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              className="mt-8 grid grid-cols-3 gap-4 border-t border-white/10 pt-6"
            >
              {stats.map((s) => (
                <motion.div key={s.label} variants={fadeUp} className="text-center">
                  <div className="bg-gradient-to-br from-white to-white/50 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
                    {s.value}
                  </div>
                  <div className="mt-1 text-xs text-white/45">{s.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </Reveal>

        {/* focus + achievements */}
        <div className="grid gap-6 lg:col-span-2">
          <Reveal delay={0.05}>
            <div className="h-full rounded-2xl border border-blue-500/20 bg-blue-500/[0.06] p-6">
              <h3 className="mb-3 flex items-center gap-2 font-semibold text-white">
                <Sparkles className="h-4 w-4 text-blue-400" />
                {t.about.currentFocus}
              </h3>
              <p className="text-sm leading-relaxed text-white/60">{t.about.focusDescription}</p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="h-full rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <h3 className="mb-4 flex items-center gap-2 font-semibold text-white">
                <Award className="h-4 w-4 text-blue-400" />
                {t.about.achievements}
              </h3>
              <ul className="space-y-3 text-sm text-white/60">
                {t.about.achievementsList.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                    <span>{item.replace(/^•\s*/, "")}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
