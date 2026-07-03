"use client"

import { motion, useReducedMotion, type Variants } from "framer-motion"
import type { ReactNode } from "react"

import { fadeUp } from "@/lib/motion"

interface RevealProps {
  children: ReactNode
  variants?: Variants
  className?: string
  delay?: number
  once?: boolean
  amount?: number
}

/**
 * Scroll-triggered reveal. Honors prefers-reduced-motion by rendering the
 * content statically (no transform / opacity animation) when requested.
 */
export function Reveal({
  children,
  variants = fadeUp,
  className,
  delay = 0,
  once = true,
  amount = 0.3,
}: RevealProps) {
  const reduce = useReducedMotion()

  if (reduce) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      transition={delay ? { delay } : undefined}
    >
      {children}
    </motion.div>
  )
}
