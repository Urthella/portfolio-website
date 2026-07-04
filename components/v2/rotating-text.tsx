"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { useEffect, useState } from "react"

export function RotatingText({
  items,
  interval = 2200,
  className,
}: {
  items: string[]
  interval?: number
  className?: string
}) {
  const [i, setI] = useState(0)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return
    const id = setInterval(() => setI((v) => (v + 1) % items.length), interval)
    return () => clearInterval(id)
  }, [items.length, interval, reduce])

  return (
    <span className={`relative inline-block align-baseline ${className ?? ""}`}>
      {/* reserve width with the longest phrase so layout doesn't jump */}
      <span className="invisible" aria-hidden>
        {items.reduce((a, b) => (b.length > a.length ? b : a), "")}
      </span>
      <AnimatePresence mode="wait">
        <motion.span
          key={items[i]}
          initial={{ y: "0.55em", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-0.55em", opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 inline-block"
        >
          {items[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
