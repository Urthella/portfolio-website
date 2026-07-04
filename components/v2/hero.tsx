"use client"

import { motion, useReducedMotion } from "framer-motion"
import { ArrowDown, ArrowRight, BookOpen, FileDown, Github, Instagram, Linkedin } from "lucide-react"

import { IdCard } from "@/components/v2/id-card"
import { RotatingText } from "@/components/v2/rotating-text"
import { profile } from "@/data/content"
import { useContent } from "@/data/i18n"
import { container, fadeUp } from "@/lib/motion"

const socialIcons = [
  { href: profile.socials.github, label: "GitHub", Icon: Github },
  { href: profile.socials.linkedin, label: "LinkedIn", Icon: Linkedin },
  { href: profile.socials.instagram, label: "Instagram", Icon: Instagram },
  { href: profile.socials.medium, label: "Medium", Icon: BookOpen },
]

export function Hero() {
  const reduce = useReducedMotion()
  const c = useContent()

  return (
    <section id="home" className="relative flex min-h-[100svh] items-center px-4 pt-28 pb-16 sm:px-6">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
        {/* text */}
        <motion.div variants={container(0.1, 0.05)} initial="hidden" animate="show">
          <motion.p variants={fadeUp} className="mb-5 font-mono text-xs tracking-[0.25em] text-orange-500">
            <span className="text-orange-500/40">// </span>
            {c.profile.focus.toUpperCase()}
          </motion.p>

          <motion.h1 variants={fadeUp} className="text-balance text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
            {profile.name}
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-4 font-mono text-lg text-white/70 sm:text-xl">
            <span className="text-orange-500">&gt;</span>{" "}
            <RotatingText items={c.ui.hero.rotating} className="text-white" />
          </motion.p>

          <motion.p variants={fadeUp} className="mt-6 max-w-xl text-pretty leading-relaxed text-white/55">
            {c.profile.tagline}
          </motion.p>

          <motion.div variants={fadeUp} className="mt-6 flex flex-wrap gap-2">
            {c.profile.chips.map((chip, ci) => (
              <span key={ci} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-xs text-white/60">
                {chip}
              </span>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="mt-9 flex flex-wrap items-center gap-3">
            <button
              onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
              className="group inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-3 text-sm font-medium text-white shadow-[0_0_30px_rgba(234,88,12,0.35)] transition-all hover:bg-orange-500 hover:shadow-[0_0_44px_rgba(234,88,12,0.55)]"
            >
              {c.ui.hero.viewProjects}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <a
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-sm font-medium text-white/85 transition-colors hover:border-white/30 hover:text-white"
            >
              <FileDown className="h-4 w-4" />
              {c.ui.hero.resume}
            </a>
            <div className="ml-1 flex items-center gap-1.5">
              {socialIcons.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-white/55 transition-all hover:-translate-y-0.5 hover:border-white/25 hover:text-white"
                >
                  <Icon className="h-[18px] w-[18px]" />
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* photo: click-to-flip ID card */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="group"
        >
          <IdCard />
        </motion.div>
      </div>

      {!reduce && (
        <motion.a
          href="#about"
          aria-label="Scroll down"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="h-5 w-5" />
        </motion.a>
      )}
    </section>
  )
}
