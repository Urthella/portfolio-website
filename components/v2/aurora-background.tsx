"use client"

import { motion, useReducedMotion } from "framer-motion"

import { usePerf } from "@/hooks/use-perf"

/**
 * Fixed paper background: a faint ink grid with a couple of warm washes
 * drifting across it, like light moving over a desk. Drift pauses under
 * prefers-reduced-motion and in lite mode — the washes stay put.
 */
export function AuroraBackground() {
  const reduce = useReducedMotion()
  const { lite } = usePerf()
  const still = reduce || lite

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-paper">
      {/* faint grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(to right,#151413 1px,transparent 1px),linear-gradient(to bottom,#151413 1px,transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        }}
      />

      <motion.div
        className="absolute -top-48 left-1/4 h-[40rem] w-[40rem] rounded-full bg-orange-500/[0.08] blur-[140px]"
        animate={still ? undefined : { x: [0, 60, -30, 0], y: [0, -40, 30, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-48 -right-40 h-[36rem] w-[36rem] rounded-full bg-amber-500/[0.10] blur-[140px]"
        animate={still ? undefined : { x: [0, -50, 20, 0], y: [0, 40, -25, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  )
}
