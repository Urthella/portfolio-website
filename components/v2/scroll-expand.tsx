"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import { useRef } from "react"

import { useContent } from "@/data/i18n"

/**
 * Scroll-expansion hero: a small rounded media pinned to the viewport that
 * grows to fill the screen as you scroll through the section, with the title
 * fading out and a caption fading in once expanded.
 */
export function ScrollExpand() {
  const ref = useRef<HTMLElement>(null)
  const s = useContent().ui.scrollExpand
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] })

  const width = useTransform(scrollYProgress, [0, 0.6], ["46%", "100%"])
  const height = useTransform(scrollYProgress, [0, 0.6], ["48vh", "100vh"])
  const radius = useTransform(scrollYProgress, [0, 0.6], [28, 0])
  const titleOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0])
  const titleScale = useTransform(scrollYProgress, [0, 0.6], [1, 1.25])
  const capOpacity = useTransform(scrollYProgress, [0.5, 0.78], [0, 1])
  const capY = useTransform(scrollYProgress, [0.5, 0.78], [24, 0])

  return (
    <section ref={ref} className="relative h-[230vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-4">
        <motion.div
          style={{ width, height, borderRadius: radius }}
          className="relative max-w-[1400px] overflow-hidden border border-white/10 shadow-2xl shadow-black/60"
        >
          <Image src="/okutgitsin.png" alt="Okut Gitsin" fill priority={false} sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/30" />

          <motion.div style={{ opacity: capOpacity, y: capY }} className="absolute bottom-8 left-8 right-8 sm:left-12">
            <p className="font-mono text-xs tracking-[0.25em] text-orange-400">{s.kicker}</p>
            <h3 className="mt-2 text-2xl font-bold text-white sm:text-4xl">{s.caption}</h3>
          </motion.div>
        </motion.div>

        <motion.div
          style={{ opacity: titleOpacity, scale: titleScale }}
          className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center"
        >
          <p className="mb-3 font-mono text-xs tracking-[0.4em] text-orange-500">{s.scroll}</p>
          <h2 className="max-w-3xl text-balance px-6 text-4xl font-black tracking-tight text-white sm:text-6xl">{s.title}</h2>
        </motion.div>
      </div>
    </section>
  )
}
