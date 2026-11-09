"use client"

import { motion } from "framer-motion"
import { ArrowRight, BookOpen, Github, Instagram, Linkedin } from "lucide-react"
import Link from "next/link"
import { useSyncExternalStore } from "react"

import { DashField } from "@/components/v2/dash-field"
import { IdCard } from "@/components/v2/id-card"
import { MeasuredName } from "@/components/v2/measured-name"
import { Reveal } from "@/components/v2/reveal"
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

// Konya's clock, ticking by the minute (blank on the server, so it never mismatches)
const subscribeClock = (cb: () => void) => {
  const id = window.setInterval(cb, 10_000)
  return () => window.clearInterval(id)
}
const konyaTime = () =>
  new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Istanbul" }).format(new Date())

/**
 * The landing: a vector field that points at the cursor, the name set huge
 * with an inspector frame reading out the letter under the cursor, the pitch
 * and the way in tucked under its right end, and an editor-style status line
 * along the bottom (availability, place, Konya's clock).
 */
export function Hero() {
  const c = useContent()
  const time = useSyncExternalStore(subscribeClock, konyaTime, () => "")
  const seg = "flex items-center border-ink/10 px-3"

  return (
    <section id="home" className="relative flex min-h-[100svh] flex-col overflow-hidden px-4 pb-5 pt-20 sm:px-8 sm:pb-6">
      <DashField className="pointer-events-none absolute inset-0 h-full w-full" />

      <motion.div
        variants={container(0.12, 0.05)}
        initial="hidden"
        animate="show"
        className="relative mx-auto flex w-full max-w-[96rem] flex-1 flex-col"
      >
        <div className="flex flex-1 flex-col justify-center py-10">
          <motion.p variants={fadeUp} className="mb-3 font-mono text-xs text-ink/55 sm:mb-5 sm:text-sm">
            <span className="text-orange-500">▸</span> {c.profile.role} <span className="text-ink/30">/</span> {c.profile.focus}
          </motion.p>
          <motion.div variants={fadeUp}>
            <MeasuredName text={profile.name} className="w-full" />
          </motion.div>
          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-end justify-end gap-x-10 gap-y-5 sm:mt-12">
            <p className="max-w-md text-pretty text-lg leading-snug text-ink/80 sm:text-xl">{c.profile.tagline}</p>
            <Link href="/projects" data-tentacles className={`group shrink-0 ${lacquer}`}>
              {c.ui.hero.viewProjects}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </div>

        {/* a status line, like the bottom of an editor */}
        <motion.div
          variants={fadeUp}
          className="flex items-stretch overflow-hidden rounded-md border border-ink/12 bg-paper/75 font-mono text-[11px] text-ink/60 backdrop-blur-sm"
        >
          <span className="flex items-center gap-1.5 bg-orange-500 px-3 py-1.5 font-semibold text-ink">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink" /> {c.ui.hero.available}
          </span>
          <span className={`${seg} border-r`}>{profile.location}</span>
          {time && <span className={`${seg} hidden border-r sm:flex`}>{time} GMT+3</span>}
          <span className={`${seg} ml-auto hidden md:flex`}>utf-8 · lf · tr/en</span>
          <a href="#intro" className={`${seg} border-l transition-colors hover:text-ink max-md:ml-auto`}>
            {c.ui.hero.scroll} ↓
          </a>
        </motion.div>
      </motion.div>
    </section>
  )
}

/** Under the marquee: the flip-card ID with the photo, a few tags and the way to the about page. */
export function HomeIntro() {
  const c = useContent()
  return (
    <section id="intro" className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
      <Reveal className="group mx-auto w-full max-w-sm">
        <IdCard />
      </Reveal>
      <Reveal delay={0.1}>
        <p className="mb-4 font-mono text-xs tracking-[0.25em] text-orange-500">
          <span className="text-orange-500/60">{"// "}</span>
          {c.ui.hero.welcome}
        </p>
        <p className="text-pretty text-2xl font-semibold leading-snug tracking-tight text-ink sm:text-3xl">{c.about.focus}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {c.profile.chips.map((chip, ci) => (
            <span key={ci} className="rounded-full border border-ink/12 bg-paper-2/70 px-3 py-1 font-mono text-xs text-ink/65">
              {chip}
            </span>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/about"
            className="group inline-flex items-center gap-2 rounded-full border border-ink/15 px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-ink/40"
          >
            {c.ui.hero.moreAbout}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <div className="flex items-center gap-1.5">
            {socialIcons.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="grid h-10 w-10 place-items-center rounded-full border border-ink/12 text-ink/60 transition-all hover:-translate-y-0.5 hover:border-orange-500/60 hover:text-orange-500"
              >
                <Icon className="h-[18px] w-[18px]" />
              </a>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  )
}
