"use client"

import { motion } from "framer-motion"
import { Briefcase, GraduationCap, Users } from "lucide-react"

import { Reveal } from "@/components/v2/reveal"
import { SectionHeading } from "@/components/v2/section-heading"
import { container, fadeUp } from "@/lib/motion"
import { experiences } from "@/data/content"

const kindIcon = { work: Briefcase, volunteer: Users, education: GraduationCap }

export function Experience() {
  return (
    <section id="experience" className="relative mx-auto max-w-4xl px-4 py-24 sm:px-6">
      <SectionHeading index="02" label="Experience" title="Where I've been" />

      <div className="relative">
        <div className="absolute left-[13px] top-2 bottom-2 w-px bg-gradient-to-b from-orange-500/60 via-white/15 to-transparent sm:left-[15px]" />

        <div className="space-y-8">
          {experiences.map((e, i) => {
            const Icon = kindIcon[e.kind]
            return (
              <Reveal key={`${e.org}-${i}`} delay={i * 0.02} className="relative pl-10 sm:pl-12">
                <span className="absolute left-0 top-1.5 grid h-7 w-7 place-items-center rounded-full border border-white/15 bg-[#0b0b10] text-orange-500 sm:h-8 sm:w-8">
                  <Icon className="h-3.5 w-3.5" />
                </span>

                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-white/20 sm:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-white">{e.role}</h3>
                      <p className="text-sm text-orange-500">{e.org}</p>
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
                    {e.points.map((p) => (
                      <motion.li key={p} variants={fadeUp} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-white/30" />
                        <span>{p}</span>
                      </motion.li>
                    ))}
                  </motion.ul>

                  {e.stack && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {e.stack.map((s) => (
                        <span key={s} className="rounded-md bg-white/[0.04] px-2 py-0.5 font-mono text-[11px] text-white/45">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
