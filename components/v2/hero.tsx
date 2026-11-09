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
 * The landing: a field of dashes that turn toward the cursor, the name set
 * huge with a selection frame measuring the letter under the cursor, a line
 * of role and place on top, the pitch and the way in at the bottom.
 */
export function Hero() {
  const c = useContent()
  const time = useSyncExternalStore(subscribeClock, konyaTime, () => "")

  return (
    <section id="home" className="relative flex min-h-[100svh] flex-col overflow-hidden px-4 pb-8 pt-24 sm:px-8 sm:pb-10 sm:pt-28">
      <DashField className="pointer-events-none absolute inset-0 h-full w-full" />

      <motion.div
        variants={container(0.12, 0.05)}
        initial="hidden"
        animate="show"
        className="relative mx-auto flex w-full max-w-[96rem] flex-1 flex-col"
      >
        <motion.div variants={fadeUp} className="flex flex-wrap justify-between gap-x-6 gap-y-1 font-mono text-xs text-ink/55 sm:text-[13px]">
          <p>
            {c.profile.role} · {c.profile.focus}
          </p>
          <p>
            {profile.location}
            {time && <span className="text-ink/35"> · {time} GMT+3</span>}
          </p>
        </motion.div>

        <motion.div variants={fadeUp} className="flex flex-1 items-center py-10 sm:py-14">
          <MeasuredName text={profile.name} className="w-full" />
        </motion.div>

        <motion.div variants={fadeUp} className="flex flex-wrap items-end justify-between gap-6">
          <p className="max-w-xl text-pretty text-lg leading-snug text-ink/80 sm:text-[1.4rem]">{c.profile.tagline}</p>
          <div className="flex items-center gap-5">
            <a href="#intro" className="font-mono text-xs text-ink/50 transition-colors hover:text-ink">
              {c.ui.hero.scroll} ↓
            </a>
            <Link href="/projects" data-tentacles className={`group ${lacquer}`}>
              {c.ui.hero.viewProjects}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
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
