"use client"

import { motion } from "framer-motion"
import { Cloud, Code, Database, Layout, Server, Shield } from "lucide-react"

import { SectionHeading } from "@/components/v2/section-heading"
import { container, scaleIn } from "@/lib/motion"
import { skillGroups } from "@/data/content"

const icons = [Code, Layout, Server, Database, Cloud, Shield]

export function Skills() {
  return (
    <section id="skills" className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <SectionHeading index="03" label="Skills" title="Tech I build with" />

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
              key={group.label}
              variants={scaleIn}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-orange-500/30"
            >
              <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-orange-500/10 opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />
              <div className="mb-4 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-orange-500 transition-colors group-hover:border-orange-500/30">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="font-mono text-sm text-white/80">{group.label}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {group.items.map((s) => (
                  <span
                    key={s}
                    className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-xs text-white/60 transition-colors hover:border-white/25 hover:text-white"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}
