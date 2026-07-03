"use client"

import { motion } from "framer-motion"
import { Briefcase } from "lucide-react"

import { Reveal } from "@/components/v2/reveal"
import { SectionHeading } from "@/components/v2/section-heading"
import { container, fadeUp } from "@/lib/motion"
import { translations } from "@/data/translations"

export function Experience({ language }: { language: "en" | "tr" }) {
  const t = translations[language]
  const entries = [
    t.experience.extramus,
    t.experience.telenity,
    t.experience.anticverseTech,
    t.experience.redpill,
    t.experience.teknofest,
    t.experience.education,
  ]

  return (
    <section id="experience" className="relative mx-auto max-w-4xl px-4 py-24 sm:px-6">
      <SectionHeading eyebrow="02 — Experience" title={t.experience.title} subtitle={t.experience.subtitle} />

      <div className="relative">
        {/* vertical line */}
        <div className="absolute left-[13px] top-2 bottom-2 w-px bg-gradient-to-b from-blue-500/60 via-white/15 to-transparent sm:left-[15px]" />

        <div className="space-y-8">
          {entries.map((e, i) => (
            <Reveal key={`${e.company}-${i}`} delay={i * 0.02} className="relative pl-10 sm:pl-12">
              {/* dot */}
              <span className="absolute left-0 top-1.5 grid h-7 w-7 place-items-center rounded-full border border-white/15 bg-[#0b0b10] sm:h-8 sm:w-8">
                <span className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(37,99,235,0.8)]" />
              </span>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-white/20 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-white">{e.role}</h3>
                    <p className="flex items-center gap-1.5 text-sm text-blue-400">
                      <Briefcase className="h-3.5 w-3.5" />
                      {e.company}
                    </p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-xs text-white/50">
                    {e.date}
                  </span>
                </div>

                <motion.ul
                  variants={container(0.05)}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.3 }}
                  className="mt-4 grid gap-2 text-sm text-white/55"
                >
                  {e.items.map((item) => (
                    <motion.li key={item} variants={fadeUp} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-white/30" />
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
