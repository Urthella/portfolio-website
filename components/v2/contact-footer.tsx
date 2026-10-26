"use client"

import { useReducedMotion } from "framer-motion"
import { ArrowUp, BookOpen, Check, Copy, FileDown, Github, Instagram, Linkedin, Mail, Phone } from "lucide-react"
import { useCallback, useRef, useState, useSyncExternalStore } from "react"

import { Typewriter } from "@/components/ui/typewriter"
import { VenomButton } from "@/components/venom-button"
import { ContactWindows } from "@/components/v2/contact-windows"
import { Reveal } from "@/components/v2/reveal"
import { profile } from "@/data/content"
import { useContent } from "@/data/i18n"
import { usePerf } from "@/hooks/use-perf"

const socials = [
  { href: profile.socials.linkedin, label: "LinkedIn", Icon: Linkedin },
  { href: profile.socials.github, label: "GitHub", Icon: Github },
  { href: profile.socials.instagram, label: "Instagram", Icon: Instagram },
  { href: profile.socials.medium, label: "Medium", Icon: BookOpen },
]

// Only a real mouse gets the page-wide takeover; touch plays the goo without flipping the page.
const FINE = "(hover: hover) and (pointer: fine)"
const subscribeFine = (cb: () => void) => {
  const mq = window.matchMedia(FINE)
  mq.addEventListener("change", cb)
  return () => mq.removeEventListener("change", cb)
}
const isFine = () => window.matchMedia(FINE).matches

/**
 * Contact and footer as one compact section: a line of intro, the Venom
 * Button (its click flies the contact form in as windows), the contact
 * details, then the legal bar and the wordmark — on a space backdrop whose
 * masked top lets the fixed fluid/aurora layers show through.
 *
 * The takeover: once the venom has fully swallowed the glove, and while the
 * form is open, an ink layer spreads out of the pill and inverts the page
 * behind it (globals.css .venom-ink); the venom's stage and the form windows
 * sit above the ink, so the symbiote stays black on the whitened page.
 */
export function ContactFooter() {
  const c = useContent()
  const { lite } = usePerf()
  const reduce = useReducedMotion()
  const fine = useSyncExternalStore(subscribeFine, isFine, () => false)
  const t = c.ui.contact
  const f = c.ui.footer
  const subtitle = c.ui.headings.contact.subtitle

  const [copied, setCopied] = useState(false)
  const [taken, setTaken] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)
  const liteRef = useRef<HTMLButtonElement>(null)
  const inkRef = useRef<HTMLDivElement>(null)

  const trigger = () => stageRef.current?.querySelector("button") ?? liteRef.current

  // the ink spreads from the pill: aim it there whenever a takeover starts
  const aimInk = () => {
    const b = trigger()?.getBoundingClientRect()
    if (!b || !inkRef.current) return
    inkRef.current.style.setProperty("--venom-x", `${b.left + b.width / 2}px`)
    inkRef.current.style.setProperty("--venom-y", `${b.top + b.height / 2}px`)
  }
  const onTakeover = (on: boolean) => {
    if (on) aimInk()
    setTaken(on)
  }
  const openForm = () => {
    aimInk()
    setFormOpen(true)
  }
  const closeForm = useCallback(() => {
    setFormOpen(false)
    ;(stageRef.current?.querySelector("button") ?? liteRef.current)?.focus({ preventScroll: true })
  }, [])

  const inverted = fine && !reduce && !lite && (taken || formOpen)

  const copyEmail = () => {
    navigator.clipboard?.writeText(profile.email)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const tile = "grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-orange-500"
  const iconLink =
    "grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-white/60 transition-all hover:-translate-y-0.5 hover:border-orange-500/40 hover:text-white"

  return (
    <footer id="contact" className="relative overflow-hidden">
      {/* space backdrop: masked top keeps the fixed fluid/aurora layers visible */}
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center grayscale"
        style={{
          backgroundImage: "url(/footer-bg.jpg)",
          maskImage: "linear-gradient(to bottom, transparent, black 50%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black 50%)",
        }}
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-transparent via-[#07070a]/45 to-[#07070a]/45" />

      {/* the venom's ink: inverts everything under it, spreading out of the pill */}
      <div ref={inkRef} aria-hidden data-on={inverted} className="venom-ink" />

      <div className="relative">
        <div className="mx-auto max-w-6xl px-4 pb-12 pt-16 sm:px-6">
          <Reveal>
            <p className="mx-auto max-w-xl text-center text-pretty leading-relaxed text-white/60">{subtitle}</p>
          </Reveal>

          {lite ? (
            // lite mode skips the WebGL goo: just the button
            <div className="mt-8 flex justify-center">
              <button
                ref={liteRef}
                type="button"
                onClick={openForm}
                aria-haspopup="dialog"
                className="inline-flex h-12 items-center rounded-full bg-white px-7 text-base font-bold tracking-tight text-[#07070a] outline-none transition-colors hover:bg-white/85 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07070a]"
              >
                {t.collaborate}
              </button>
            </div>
          ) : (
            // above the ink (z-2), so the symbiote keeps its colors when the page inverts
            <div ref={stageRef} data-venom-stage className="relative z-[2] mt-2">
              {/* Nexus UI's Venom Button; its defaults suit a 420px boxed stage */}
              <VenomButton label={t.collaborate} onClick={openForm} onTakeover={onTakeover} height={360} sense={220} reach={110} release={160} />
            </div>
          )}

          {/* contact details */}
          <div data-colorize className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            <div className="flex items-center gap-2">
              <a href={`mailto:${profile.email}`} className="flex min-w-0 items-center gap-3 text-white/75 transition-colors hover:text-white">
                <span className={tile}>
                  <Mail className="h-5 w-5" />
                </span>
                <span className="truncate">{profile.email}</span>
              </a>
              <button
                onClick={copyEmail}
                aria-label="Copy email"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 text-white/50 transition-colors hover:border-orange-500/40 hover:text-white"
              >
                {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
            <div className="flex items-center gap-3 text-white/75">
              <span className={tile}>
                <Phone className="h-5 w-5" />
              </span>
              {profile.phone}
            </div>
            <div className="flex gap-2">
              {socials.map(({ href, label, Icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={iconLink}>
                  <Icon className="h-5 w-5" />
                </a>
              ))}
              {/* the résumé, reachable from every page */}
              <a href={profile.resume} target="_blank" rel="noopener noreferrer" aria-label={c.ui.hero.resume} title={c.ui.hero.resume} className={iconLink}>
                <FileDown className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* legal bar */}
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 border-t border-white/15 px-4 py-6 sm:px-6">
          <span className="text-sm text-white/60">
            © {new Date().getFullYear()} Utku Demirtaş. {f.rights}
          </span>
          <div className="flex items-center gap-6">
            <span className="hidden min-w-[16rem] text-sm text-white/60 sm:inline">
              {f.builtWith}{" "}
              <Typewriter
                text={f.builtItems}
                speed={55}
                deleteSpeed={28}
                waitTime={1700}
                className="font-medium text-orange-400 [text-shadow:0_0_14px_color-mix(in_srgb,var(--color-orange-400)_80%,transparent)]"
                cursorClassName="text-orange-400"
              />
            </span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center gap-1.5 text-sm text-white/70 transition-colors hover:text-white"
            >
              {t.backToTop} <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* giant wordmark (12 chars — sized to span the viewport like TURION's 6 at 26vw) */}
        <div className="overflow-hidden px-2 pb-2">
          <div
            className="select-none whitespace-nowrap text-center font-bold leading-[0.8] text-white"
            style={{ fontSize: "clamp(2.4rem, 11.4vw, 11.4rem)", letterSpacing: "-0.05em" }}
            aria-hidden
          >
            UTKUDEMIRTAS
          </div>
        </div>
      </div>

      {/* the contact form, as windows flying in from the edges; above the ink too */}
      <ContactWindows open={formOpen} onClose={closeForm} />
    </footer>
  )
}
