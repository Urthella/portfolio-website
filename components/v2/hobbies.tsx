"use client"

import { motion } from "framer-motion"
import { BookOpen, Dumbbell, Music, PenTool } from "lucide-react"

import { SectionHeading } from "@/components/v2/section-heading"
import { container, scaleIn } from "@/lib/motion"
import { hobbies } from "@/data/content"

const iconMap: Record<string, typeof Music> = {
  music: Music,
  dumbbell: Dumbbell,
  book: BookOpen,
  pen: PenTool,
}

export function Hobbies() {
  return (
    <section id="hobbies" className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <SectionHeading
        index="06"
        label="Beyond code"
        title="Off the keyboard"
        subtitle="The disciplines that keep me sharp, creative and a little stubborn."
      />

      <motion.div
        variants={container(0.09)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="grid gap-5 sm:grid-cols-2"
      >
        {hobbies.map((h) => {
          const Icon = iconMap[h.icon] ?? Music
          return (
            <motion.div
              key={h.title}
              variants={scaleIn}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-orange-500/30"
            >
              <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-orange-500/10 opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />
              <div className="mb-3 flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-white/5 text-orange-500 transition-transform group-hover:scale-110">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="font-semibold text-white">{h.title}</h3>
              </div>
              <p className="text-sm leading-relaxed text-white/55">{h.text}</p>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}
