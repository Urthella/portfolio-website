"use client"

import { motion, useReducedMotion } from "framer-motion"
import { ArrowDown, ArrowRight, BookOpen, FileDown, Github, Instagram, Linkedin, SquareTerminal } from "lucide-react"
import Link from "next/link"

import { IdCard } from "@/components/v2/id-card"
import { profile } from "@/data/content"
import { useContent } from "@/data/i18n"
import { container, fadeUp } from "@/lib/motion"

const socialIcons = [
  { href: profile.socials.github, label: "GitHub", Icon: Github },
  { href: profile.socials.linkedin, label: "LinkedIn", Icon: Linkedin },
  { href: profile.socials.instagram, label: "Instagram", Icon: Instagram },
  { href: profile.socials.medium, label: "Medium", Icon: BookOpen },
]

// The Venom Button's glossy black lacquer pill; on the home page the tentacle layer grows goo from
// the edges of everything marked data-tentacles.
const lacquer =
  "inline-flex items-center gap-2 rounded-full bg-[linear-gradient(180deg,#1c1c1e_0%,#0a0a0a_42%,#020202_100%)] px-5 py-3 text-sm font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,.14),inset_0_-1.5px_0_rgba(255,255,255,.22),0_18px_28px_-14px_rgba(0,0,0,.55),0_0_0_1px_rgba(255,255,255,.1)] transition hover:brightness-125"

export function Hero() {
  const reduce = useReducedMotion()
  const c = useContent()

  return (
    <section id="home" className="relative flex min-h-[100svh] items-center px-4 pt-28 pb-16 sm:px-6">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
        {/* text */}
        <motion.div variants={container(0.1, 0.05)} initial="hidden" animate="show">
          <motion.p variants={fadeUp} className="mb-5 font-mono text-xs tracking-[0.25em] text-orange-300">
            {/* transform lives on the inner span so the beat never fights framer's entrance */}
            <span className="animate-heartbeat inline-block">
              <span className="text-orange-500/60">{"// "}</span>
              {c.ui.hero.welcome}
            </span>
          </motion.p>

          <motion.h1 variants={fadeUp} className="text-balance text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
            {profile.name}
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-4 font-mono text-lg text-white sm:text-xl">
            <span className="text-orange-500">&gt;</span> {c.profile.role}
          </motion.p>
          <motion.p variants={fadeUp} className="mt-2 font-mono text-sm tracking-wide text-white/55 sm:text-base">
            {c.profile.focus}
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
            <Link href="/projects" data-tentacles className={`group ${lacquer}`}>
              {c.ui.hero.viewProjects}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a href={profile.resume} target="_blank" rel="noopener noreferrer" data-tentacles className={lacquer}>
              <FileDown className="h-4 w-4" />
              {c.ui.hero.resume}
            </a>
            <Link href="/desktop" data-tentacles className={lacquer}>
              <SquareTerminal className="h-4 w-4" />
              {c.ui.nav.desktop}
            </Link>
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
          href="#contact"
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
