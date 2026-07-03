"use client"

import { motion, useReducedMotion } from "framer-motion"

/**
 * Fixed, fluid background: drifting colored blobs behind a faint grid, capped
 * with a radial vignette so foreground text stays legible. Drift pauses under
 * prefers-reduced-motion.
 */
export function AuroraBackground() {
  const reduce = useReducedMotion()

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#07070a]">
      {/* faint grid */}
      <div
        className="absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage:
            "linear-gradient(to right,#ffffff 1px,transparent 1px),linear-gradient(to bottom,#ffffff 1px,transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse at center, black 40%, transparent 85%)",
        }}
      />

      <motion.div
        className="absolute -top-40 left-1/4 h-[42rem] w-[42rem] rounded-full bg-blue-600/25 blur-[130px]"
        animate={reduce ? undefined : { x: [0, 60, -30, 0], y: [0, -40, 30, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 -right-40 h-[38rem] w-[38rem] rounded-full bg-indigo-500/20 blur-[130px]"
        animate={reduce ? undefined : { x: [0, -50, 20, 0], y: [0, 40, -25, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-40 left-1/3 h-[34rem] w-[34rem] rounded-full bg-sky-500/15 blur-[130px]"
        animate={reduce ? undefined : { x: [0, 40, -40, 0], y: [0, -20, 20, 0] }}
        transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* top glow + vignette */}
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-blue-500/10 to-transparent" />
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, transparent 30%, #07070a 100%)" }}
      />
    </div>
  )
}
