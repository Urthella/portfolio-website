"use client"

import { motion, useReducedMotion } from "framer-motion"
import { ArrowDown, ArrowRight, BookOpen, FileDown, Github, Instagram, Linkedin } from "lucide-react"

import { container, fadeUp } from "@/lib/motion"
import { translations } from "@/data/translations"

const socials = [
  { href: "https://github.com/Urthella", label: "GitHub", Icon: Github },
  { href: "https://www.linkedin.com/in/utkudemirtas/", label: "LinkedIn", Icon: Linkedin },
  { href: "https://www.instagram.com/urthella_/", label: "Instagram", Icon: Instagram },
  { href: "https://medium.com/@utkudemirtas0", label: "Medium", Icon: BookOpen },
]

export function Hero({ language }: { language: "en" | "tr" }) {
  const t = translations[language]
  const reduce = useReducedMotion()
  const chips = [t.hero.computerEngineer, t.hero.guitarist, t.hero.fitnessEnthusiast]

  return (
    <section id="home" className="relative flex min-h-[100svh] items-center px-4 pt-24 pb-16 sm:px-6">
      <motion.div
        variants={container(0.12, 0.05)}
        initial="hidden"
        animate="show"
        className="mx-auto w-full max-w-4xl text-center"
      >
        <motion.div variants={fadeUp} className="mb-6 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-white/70 backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
            </span>
            Open to opportunities
          </span>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="text-balance text-5xl font-bold tracking-tight text-white sm:text-7xl"
        >
          {t.hero.title}
        </motion.h1>

        <motion.div variants={fadeUp} className="mt-4 flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-blue-500" />
          <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text font-mono text-lg text-transparent sm:text-xl">
            {t.hero.subtitle}
          </span>
          <span className="h-px w-8 bg-gradient-to-l from-transparent to-indigo-500" />
        </motion.div>

        <motion.p
          variants={fadeUp}
          className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-white/60 sm:text-lg"
        >
          {t.hero.description}
        </motion.p>

        <motion.div variants={fadeUp} className="mt-6 flex flex-wrap justify-center gap-2">
          {chips.map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-xs text-white/60"
            >
              {chip}
            </span>
          ))}
        </motion.div>

        <motion.div variants={fadeUp} className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
            className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow-[0_0_30px_rgba(37,99,235,0.35)] transition-all hover:bg-blue-500 hover:shadow-[0_0_40px_rgba(37,99,235,0.55)]"
          >
            {t.nav.projects}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
          <a
            href="/Utku Demirtas CV.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-sm font-medium text-white/85 transition-colors hover:border-white/30 hover:text-white"
          >
            <FileDown className="h-4 w-4" />
            CV
          </a>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-8 flex items-center justify-center gap-2">
          {socials.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-white/60 transition-all hover:-translate-y-0.5 hover:border-white/25 hover:text-white"
            >
              <Icon className="h-[18px] w-[18px]" />
            </a>
          ))}
        </motion.div>
      </motion.div>

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
