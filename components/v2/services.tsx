"use client"

import { motion } from "framer-motion"
import { Check, Dumbbell, Music, Salad } from "lucide-react"

import { SectionHeading } from "@/components/v2/section-heading"
import { container, fadeUp } from "@/lib/motion"
import { useContent } from "@/data/i18n"

const icons = [Music, Dumbbell, Salad]

export function Services() {
  const c = useContent()
  const services = c.services
  const head = c.ui.headings.services
  return (
    <section id="services" className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <SectionHeading index="07" label={head.label} title={head.title} subtitle={head.subtitle} />

      <motion.div
        variants={container(0.1)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="grid gap-5 md:grid-cols-3"
      >
        {services.map((s, i) => {
          const Icon = icons[i % icons.length]
          return (
            <motion.div
              key={i}
              variants={fadeUp}
              className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-orange-500/30"
            >
              <span className="mb-4 grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/5 text-orange-500">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="font-semibold text-white">{s.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-white/55">{s.text}</p>
              <ul className="mt-4 space-y-2 border-t border-white/10 pt-4 text-sm text-white/60">
                {s.includes.map((it) => (
                  <li key={it} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}
