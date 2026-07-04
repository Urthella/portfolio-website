"use client"

import { motion, useReducedMotion } from "framer-motion"
import { ArrowDown, ArrowRight, BookOpen, FileDown, Github, Instagram, Linkedin } from "lucide-react"

import ProfileCard from "@/components/ui/profile-card"
import { RotatingText } from "@/components/v2/rotating-text"
import { PHOTO, profile } from "@/data/content"
import { container, fadeUp } from "@/lib/motion"

const socialIcons = [
  { href: profile.socials.github, label: "GitHub", Icon: Github },
  { href: profile.socials.linkedin, label: "LinkedIn", Icon: Linkedin },
  { href: profile.socials.instagram, label: "Instagram", Icon: Instagram },
  { href: profile.socials.medium, label: "Medium", Icon: BookOpen },
]

export function Hero() {
  const reduce = useReducedMotion()

  return (
    <section id="home" className="relative flex min-h-[100svh] items-center px-4 pt-28 pb-16 sm:px-6">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
        {/* text */}
        <motion.div variants={container(0.1, 0.05)} initial="hidden" animate="show">
          <motion.p variants={fadeUp} className="mb-5 font-mono text-xs tracking-[0.25em] text-orange-500">
            <span className="text-orange-500/40">// </span>
            {profile.focus.toUpperCase()}
          </motion.p>

          <motion.h1 variants={fadeUp} className="text-balance text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
            {profile.name}
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-4 font-mono text-lg text-white/70 sm:text-xl">
            <span className="text-orange-500">&gt;</span>{" "}
            <RotatingText
              items={["Fullstack Developer", "Backend & DevOps", "Real-time systems", "Secure APIs"]}
              className="text-white"
            />
          </motion.p>

          <motion.p variants={fadeUp} className="mt-6 max-w-xl text-pretty leading-relaxed text-white/55">
            {profile.tagline}
          </motion.p>

          <motion.div variants={fadeUp} className="mt-6 flex flex-wrap gap-2">
            {profile.chips.map((chip) => (
              <span key={chip} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-xs text-white/60">
                {chip}
              </span>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="mt-9 flex flex-wrap items-center gap-3">
            <button
              onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
              className="group inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-3 text-sm font-medium text-white shadow-[0_0_30px_rgba(234,88,12,0.35)] transition-all hover:bg-orange-500 hover:shadow-[0_0_44px_rgba(234,88,12,0.55)]"
            >
              View projects
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <a
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-sm font-medium text-white/85 transition-colors hover:border-white/30 hover:text-white"
            >
              <FileDown className="h-4 w-4" />
              Résumé
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

        {/* photo — holographic tilt ProfileCard */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="relative mx-auto w-full max-w-[20rem]"
        >
          <ProfileCard
            name={profile.name}
            title={profile.focus}
            handle={profile.handle}
            status={profile.available ? "Available for work" : "Online"}
            contactText="Contact me"
            avatarUrl={PHOTO}
            miniAvatarUrl={PHOTO}
            showUserInfo
            enableTilt
            innerGradient="linear-gradient(145deg, rgba(249,115,22,0.35) 0%, rgba(244,63,94,0.26) 100%)"
            behindGlowColor="rgba(249, 130, 60, 0.55)"
            behindGlowSize="46%"
            onContactClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
          />
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
