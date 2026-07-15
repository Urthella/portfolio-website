"use client"

import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion"
import { BookOpen, Github, Instagram, Linkedin, Mail, MapPin, Phone, RefreshCw } from "lucide-react"
import Image from "next/image"
import { useState, type MouseEvent } from "react"

import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card"
import { PHOTO, profile } from "@/data/content"
import { useContent } from "@/data/i18n"

const socials = [
  { href: profile.socials.github, label: "GitHub", Icon: Github },
  { href: profile.socials.linkedin, label: "LinkedIn", Icon: Linkedin },
  { href: profile.socials.instagram, label: "Instagram", Icon: Instagram },
  { href: profile.socials.medium, label: "Medium", Icon: BookOpen },
]

// Every direct 3D child of a flipping face must hide its own backface —
// preserve-3d lifts it out of the face's plane, so the face's
// [backface-visibility:hidden] no longer hides it.
const faceItem = "[backface-visibility:hidden]"

/**
 * Access-badge ID card built on the 3d-card primitives: the whole card tilts
 * toward the cursor (CardContainer) while its layers float out in Z on hover
 * (CardItem). It keeps the holographic sheen (a specular highlight plus a
 * shifting iridescent band) and the click-to-flip between photo and contact.
 */
export function IdCard() {
  const [flipped, setFlipped] = useState(false)
  const t = useContent().ui.idcard
  const focus = useContent().profile.focus

  // Pointer position 0..1, springed into the holo + glare positions.
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const spr = { stiffness: 200, damping: 20, mass: 0.5 }
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
    "absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-500 via-rose-500 to-amber-400 p-[1.5px] shadow-2xl shadow-black/50 [backface-visibility:hidden] [transform-style:preserve-3d]"

  return (
    <div className="relative mx-auto w-full max-w-[20rem]">
      {/* warm glow */}
      <div className="absolute -inset-4 -z-10 rounded-[32px] bg-orange-600/25 blur-3xl" />

      <div onMouseMove={onMove} onMouseLeave={onLeave}>
        <CardContainer containerClassName="py-0" className="w-full">
          <CardBody className="h-auto w-full">
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
                <div className="relative flex h-full flex-col rounded-[calc(1.5rem-1.5px)] bg-neutral-950 [backface-visibility:hidden] [transform-style:preserve-3d]">
                  <CardItem
                    translateZ={25}
                    className={`flex w-full items-center justify-between rounded-t-[calc(1.5rem-1.5px)] bg-orange-500/90 px-4 py-2 font-mono text-[11px] font-semibold tracking-wider text-black ${faceItem}`}
                  >
                    <span>{t.access}</span>
                    <span>{t.allAreas}</span>
                  </CardItem>

                  <CardItem translateZ={70} className={`mx-4 mt-4 w-auto ${faceItem}`}>
                    <div className="relative aspect-square overflow-hidden rounded-xl border border-white/10">
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
                  </CardItem>

                  <CardItem translateZ={55} className={`w-full px-4 pt-4 ${faceItem}`}>
                    <h3 className="text-xl font-bold leading-tight text-white">{profile.name}</h3>
                    <span className="mt-2 inline-block rounded bg-rose-500 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide text-white">
                      {focus}
                    </span>
                  </CardItem>

                  <CardItem translateZ={35} className={`mt-auto w-full px-4 pb-4 ${faceItem}`}>
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
                  </CardItem>

                  {/* holographic sheen (follows the cursor, floats above the layers) */}
                  <CardItem
                    translateZ={80}
                    className={`pointer-events-none absolute inset-0 z-20 w-auto overflow-hidden rounded-[calc(1.5rem-1.5px)] ${faceItem}`}
                  >
                    <motion.div
                      aria-hidden
                      className="absolute inset-0 mix-blend-color-dodge opacity-40"
                      style={{
                        backgroundImage:
                          "linear-gradient(115deg, transparent 18%, rgba(249,115,22,0.55) 38%, rgba(251,113,133,0.55) 48%, rgba(245,158,11,0.55) 58%, transparent 82%)",
                        backgroundSize: "220% 220%",
                        backgroundPosition: holoPosition,
                      }}
                    />
                    <motion.div
                      aria-hidden
                      className="absolute inset-0 mix-blend-overlay opacity-70"
                      style={{ background: glare }}
                    />
                  </CardItem>
                </div>
              </div>

              {/* BACK */}
              <div className={faceBase} style={{ transform: "rotateY(180deg)" }}>
                <div className="flex h-full flex-col rounded-[calc(1.5rem-1.5px)] bg-neutral-950 p-5 [backface-visibility:hidden] [transform-style:preserve-3d]">
                  <CardItem
                    as="p"
                    translateZ={30}
                    className={`font-mono text-xs tracking-[0.25em] text-orange-500 ${faceItem}`}
                  >
                    {t.contact}
                  </CardItem>

                  <CardItem translateZ={50} className={`mt-5 w-full space-y-3 ${faceItem}`}>
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
                  </CardItem>

                  <CardItem translateZ={60} className={`mt-6 w-full ${faceItem}`}>
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
                  </CardItem>

                  <CardItem
                    as="p"
                    translateZ={20}
                    className={`mt-auto flex items-center gap-1.5 font-mono text-[10px] text-white/30 ${faceItem}`}
                  >
                    <RefreshCw className="h-3 w-3" /> {t.flipBack}
                  </CardItem>
                </div>
              </div>
            </motion.button>
          </CardBody>
        </CardContainer>
      </div>

      <p className="mt-4 text-center font-mono text-[11px] text-white/35">{t.clickFlip}</p>
    </div>
  )
}
