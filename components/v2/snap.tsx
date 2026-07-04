"use client"

import { motion, useReducedMotion } from "framer-motion"
import { RotateCcw } from "lucide-react"
import { useState } from "react"

import { Reveal } from "@/components/v2/reveal"

const LINE = "Your next design is just a snap away."

export function Snap() {
  const [snapped, setSnapped] = useState(false)
  const reduce = useReducedMotion()
  const chars = LINE.split("")

  return (
    <section className="relative mx-auto max-w-3xl px-4 py-28 text-center sm:px-6">
      <Reveal>
        <p className="mb-6 font-mono text-xs tracking-[0.25em] text-orange-500">// perfectly balanced</p>

        <p className="text-3xl font-bold leading-tight text-white sm:text-4xl">
          {chars.map((c, i) => {
            const isDust = c !== " " && i % 2 === 0
            const gone = snapped && isDust
            return (
              <motion.span
                key={i}
                className="inline-block whitespace-pre"
                animate={
                  gone
                    ? reduce
                      ? { opacity: 0 }
                      : {
                          opacity: 0,
                          y: -32 - (i % 5) * 8,
                          x: (i % 3) * 16 - 16,
                          rotate: (i % 2 ? 1 : -1) * (30 + (i % 4) * 12),
                          filter: "blur(10px)",
                        }
                    : { opacity: 1, y: 0, x: 0, rotate: 0, filter: "blur(0px)" }
                }
                transition={{ duration: 0.9, delay: (i % 11) * 0.035, ease: "easeOut" }}
              >
                {c === " " ? " " : c}
              </motion.span>
            )
          })}
        </p>

        <button
          onClick={() => setSnapped((s) => !s)}
          className="mt-10 inline-flex items-center gap-2 rounded-xl border border-orange-500/30 bg-orange-500/10 px-5 py-3 text-sm font-medium text-orange-200 transition-all hover:border-orange-500/50 hover:bg-orange-500/20"
        >
          {snapped ? (
            <>
              <RotateCcw className="h-4 w-4" /> restore the universe
            </>
          ) : (
            <>
              <span className="text-lg leading-none">🫰</span> snap your fingers
            </>
          )}
        </button>
      </Reveal>
    </section>
  )
}
