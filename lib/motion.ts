import type { Variants } from "framer-motion"

// Shared easing — a soft "out-expo"-ish curve for fluid, natural motion.
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 44 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: EASE } },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 28 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
}

export const fromLeft: Variants = {
  hidden: { opacity: 0, x: -44 },
  show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } },
}

// Staggered parent — children animate in sequence.
export function container(stagger = 0.09, delayChildren = 0): Variants {
  return {
    hidden: {},
    show: { transition: { staggerChildren: stagger, delayChildren } },
  }
}
