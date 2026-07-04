"use client"

import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"

import { SectionHeading } from "@/components/v2/section-heading"
import { container, fadeUp } from "@/lib/motion"
import { MEDIUM, articles } from "@/data/content"

export function Articles() {
  return (
    <section id="articles" className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <SectionHeading
        index="07"
        label="Writing"
        title="On Medium"
        subtitle="Notes on security, networking and the craft."
      />

      <motion.div
        variants={container(0.08)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="grid gap-5 sm:grid-cols-2"
      >
        {articles.map((a) => (
          <motion.a
            key={a.title}
            variants={fadeUp}
            href={a.href}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -4 }}
            className="group flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-orange-500/30"
          >
            <div>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] text-white/50">
                {a.tag}
              </span>
              <h3 className="mt-3 font-semibold text-white">{a.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{a.blurb}</p>
              <span className="mt-3 inline-block font-mono text-xs text-orange-500">Read on Medium →</span>
            </div>
            <ArrowUpRight className="h-5 w-5 shrink-0 text-white/30 transition-all group-hover:text-white" />
          </motion.a>
        ))}
      </motion.div>

      <div className="mt-8 text-center">
        <a
          href={MEDIUM}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-sm text-white/50 transition-colors hover:text-white"
        >
          @utkudemirtas0 on Medium →
        </a>
      </div>
    </section>
  )
}
