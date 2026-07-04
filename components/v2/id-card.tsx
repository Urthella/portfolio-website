"use client"

import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion"
import { BookOpen, Github, Instagram, Linkedin, Mail, MapPin, Phone, RefreshCw } from "lucide-react"
import Image from "next/image"
import { useState, type MouseEvent } from "react"

import { PHOTO, profile } from "@/data/content"
import { useContent } from "@/data/i18n"

const socials = [
  { href: profile.socials.github, label: "GitHub", Icon: Github },
  { href: profile.socials.linkedin, label: "LinkedIn", Icon: Linkedin },
  { href: profile.socials.instagram, label: "Instagram", Icon: Instagram },
  { href: profile.socials.medium, label: "Medium", Icon: BookOpen },
]

/**
 * Access-badge ID card. It tilts in 3D toward the cursor and carries a
 * holographic sheen (a specular highlight plus a shifting iridescent band).
 * Click anywhere except the back's links to flip between photo and contact.
 */
export function IdCard() {
  const [flipped, setFlipped] = useState(false)
  const t = useContent().ui.idcard
  const focus = useContent().profile.focus

  // Pointer position 0..1, springed into tilt + holo positions.
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const spr = { stiffness: 200, damping: 20, mass: 0.5 }
  const rotateY = useSpring(useTransform(px, [0, 1], [16, -16]), spr)
  const rotateX = useSpring(useTransform(py, [0, 1], [-13, 13]), spr)
  const gx = useSpring(useTransform(px, [0, 1], [0, 100]), spr)
  const gy = useSpring(useTransform(py, [0, 1], [0, 100]), spr)
  const holoPos = useSpring(useTransform(px, [0, 1], [0, 100]), spr)

  const glare = useMotionTemplate`radial-gradient(circle 220px at ${gx}% ${gy}%, rgba(255,255,255,0.5), transparent 55%)`
  const holoPosition = useMotionTemplate`${holoPos}% 50%`

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
  }
  const onLeave = () => {
    px.set(0.5)
    py.set(0.5)
  }

  const faceBase =
    "absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-500 via-rose-500 to-amber-400 p-[1.5px] shadow-2xl shadow-black/50 [backface-visibility:hidden]"

  return (
    <div className="relative mx-auto w-full max-w-[20rem]">
      {/* warm glow */}
      <div className="absolute -inset-4 -z-10 rounded-[32px] bg-orange-600/25 blur-3xl" />

      <div className="[perspective:1200px]" onMouseMove={onMove} onMouseLeave={onLeave}>
        <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}>
          <motion.button
            type="button"
            onClick={() => setFlipped((f) => !f)}
            aria-label="Flip ID card"
            className="relative block w-full cursor-pointer"
            style={{ transformStyle: "preserve-3d", aspectRatio: "0.72" }}
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* FRONT */}
            <div className={faceBase}>
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(1.5rem-1.5px)] bg-neutral-950">
                <div className="flex items-center justify-between bg-orange-500/90 px-4 py-2 font-mono text-[11px] font-semibold tracking-wider text-black">
                  <span>{t.access}</span>
                  <span>{t.allAreas}</span>
                </div>

                <div className="relative mx-4 mt-4 aspect-square overflow-hidden rounded-xl border border-white/10">
                  <Image
                    src={PHOTO}
                    alt={profile.name}
                    fill
                    priority
                    sizes="20rem"
                    className="object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                  />
                  <span className="absolute left-0 top-0 h-8 w-8 rounded-br-xl bg-orange-500" />
                </div>

                <div className="px-4 pt-4">
                  <h3 className="text-xl font-bold leading-tight text-white">{profile.name}</h3>
                  <span className="mt-2 inline-block rounded bg-rose-500 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide text-white">
                    {focus}
                  </span>
                </div>

                <div className="mt-auto px-4 pb-4">
                  <div className="mb-2 mt-3 border-t border-dashed border-white/15" />
                  <div className="flex items-end justify-between gap-3">
                    <div className="flex h-8 items-stretch gap-[2px]" aria-hidden>
                      {[2, 1, 3, 1, 2, 1, 1, 3, 2, 1, 2, 3, 1, 1, 2, 1, 3, 1, 2, 1, 1, 2].map((w, i) => (
                        <span key={i} className="bg-white" style={{ width: w }} />
                      ))}
                    </div>
                    <span className="font-mono text-[10px] text-white/45">ID 2026 CS 0042</span>
                  </div>
                  <p className="mt-2 font-mono text-[10px] text-white/35">{profile.site}</p>
                </div>

                {/* holographic sheen (follows the cursor) */}
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 z-20 mix-blend-color-dodge opacity-40"
                  style={{
                    backgroundImage:
                      "linear-gradient(115deg, transparent 18%, rgba(249,115,22,0.55) 38%, rgba(251,113,133,0.55) 48%, rgba(245,158,11,0.55) 58%, transparent 82%)",
                    backgroundSize: "220% 220%",
                    backgroundPosition: holoPosition,
                  }}
                />
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 z-20 mix-blend-overlay opacity-70"
                  style={{ background: glare }}
                />
              </div>
            </div>

            {/* BACK */}
            <div className={faceBase} style={{ transform: "rotateY(180deg)" }}>
              <div className="flex h-full flex-col rounded-[calc(1.5rem-1.5px)] bg-neutral-950 p-5">
                <p className="font-mono text-xs tracking-[0.25em] text-orange-500">{t.contact}</p>

                <div className="mt-5 space-y-3">
                  <a
                    href={`mailto:${profile.email}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-3 text-sm text-white/75 transition-colors hover:text-white"
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-orange-400">
                      <Mail className="h-4 w-4" />
                    </span>
                    <span className="truncate">{profile.email}</span>
                  </a>
                  <div className="flex items-center gap-3 text-sm text-white/75">
                    <span className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-orange-400">
                      <Phone className="h-4 w-4" />
                    </span>
                    {profile.phone}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-white/75">
                    <span className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/5 text-orange-400">
                      <MapPin className="h-4 w-4" />
                    </span>
                    {profile.location}
                  </div>
                </div>

                <div className="mt-6">
                  <p className="mb-2 font-mono text-[10px] text-white/35">{t.findOnline}</p>
                  <div className="flex gap-2">
                    {socials.map(({ href, label, Icon }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        onClick={(e) => e.stopPropagation()}
                        className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 text-white/65 transition-all hover:-translate-y-0.5 hover:border-orange-500/50 hover:text-white"
                      >
                        <Icon className="h-[18px] w-[18px]" />
                      </a>
                    ))}
                  </div>
                </div>

                <p className="mt-auto flex items-center gap-1.5 font-mono text-[10px] text-white/30">
                  <RefreshCw className="h-3 w-3" /> {t.flipBack}
                </p>
              </div>
            </div>
          </motion.button>
        </motion.div>
      </div>

      <p className="mt-4 text-center font-mono text-[11px] text-white/35">{t.clickFlip}</p>
    </div>
  )
}
