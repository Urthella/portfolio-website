"use client"

import { motion, useReducedMotion } from "framer-motion"

import { marqueeTech } from "@/data/content"

export function TechMarquee() {
  const reduce = useReducedMotion()
  const row = [...marqueeTech, ...marqueeTech]

  return (
    <div className="relative w-full overflow-hidden border-y border-white/[0.06] bg-black/20 py-5">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#07070a] to-transparent sm:w-32" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#07070a] to-transparent sm:w-32" />
      <motion.div
        className="flex w-max gap-10 whitespace-nowrap pr-10"
        animate={reduce ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
      >
        {row.map((tech, i) => (
          <span key={i} className="flex items-center gap-2.5 font-mono text-sm text-white/40">
            <span className="text-orange-500/60">◆</span>
            {tech}
          </span>
        ))}
      </motion.div>
    </div>
  )
}
