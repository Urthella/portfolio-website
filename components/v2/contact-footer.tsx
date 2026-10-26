"use client"

import { ArrowUp, BookOpen, Check, Copy, FileDown, Github, Instagram, Linkedin, Loader2, Mail, Phone, Send } from "lucide-react"
import { useState } from "react"

import { Typewriter } from "@/components/ui/typewriter"
import { Reveal } from "@/components/v2/reveal"
import { VenomButton } from "@/components/venom-button"
import { fromLeft, scaleIn } from "@/lib/motion"
import { profile } from "@/data/content"
import { useContent } from "@/data/i18n"
import { usePerf } from "@/hooks/use-perf"

// The symbiote has the hand: the whole page flips (globals.css), except the venom's own stage.
// Mouse only: on a phone the goo still plays under your finger, but the page doesn't flip.
const onGrab = (grabbed: boolean) => {
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches
  document.documentElement.classList.toggle("venom-inverted", grabbed && fine)
}

const socials = [
  { href: profile.socials.linkedin, label: "LinkedIn", Icon: Linkedin },
  { href: profile.socials.github, label: "GitHub", Icon: Github },
  { href: profile.socials.instagram, label: "Instagram", Icon: Instagram },
  { href: profile.socials.medium, label: "Medium", Icon: BookOpen },
]

/**
 * Contact and footer as one compact section: heading and contact details on
 * the left, the form on the right, then the legal bar and the wordmark — all
 * on a space backdrop whose masked top lets the fixed fluid/aurora layers
 * show through, so the page flows in with no seam.
 */
export function ContactFooter() {
  const c = useContent()
  const { lite } = usePerf()
  const t = c.ui.contact
  const f = c.ui.footer
  const subtitle = c.ui.headings.contact.subtitle

  const [form, setForm] = useState({ name: "", email: "", message: "" })
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")
  const [copied, setCopied] = useState(false)

  // the Collaborate button lands you in the form
  const focusForm = () => {
    const name = document.getElementById("name")
    name?.scrollIntoView({ behavior: "smooth", block: "center" })
    name?.focus({ preventScroll: true })
  }

  const copyEmail = () => {
    navigator.clipboard?.writeText(profile.email)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("sending")
    try {
      const emailjs = (await import("@emailjs/browser")).default
      const publicKey = "lG13LwoQUrMXT7Igo"
      emailjs.init({ publicKey })
      await emailjs.send(
        "service_to6ga2c",
        "template_9ypkl6o",
        { from_name: form.name, from_email: form.email, message: form.message },
        publicKey,
      )
      setStatus("success")
      setForm({ name: "", email: "", message: "" })
    } catch {
      setStatus("error")
    } finally {
      setTimeout(() => setStatus("idle"), 5000)
    }
  }

  const field =
    "w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-orange-500/50 focus:bg-white/[0.05]"
  const tile = "grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/5 text-orange-500"

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

      <div className="relative">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-14 pt-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-14">
          {/* heading + contact details */}
          <Reveal variants={fromLeft}>
            <p className="font-mono text-xs tracking-[0.25em] text-orange-500">
              <span className="text-orange-500/40">{"//"}</span> {f.talk}
            </p>
            <h2 className="mt-4 text-[clamp(2.4rem,5.5vw,4.25rem)] font-bold leading-[0.95] tracking-tight text-white">
              {f.titleA} {f.titleB}
            </h2>
            <p className="mt-4 max-w-md text-pretty leading-relaxed text-white/60">{subtitle}</p>

            {lite ? (
              // lite mode skips the WebGL goo: just the button
              <button
                type="button"
                onClick={focusForm}
                className="mt-7 inline-flex h-12 items-center rounded-full bg-white px-7 text-base font-bold tracking-tight text-[#07070a] outline-none transition-colors hover:bg-white/85 focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07070a]"
              >
                {t.collaborate}
              </button>
            ) : (
              <div data-venom-stage className="mt-7">
                {/* Nexus UI's Venom Button, scaled to a 260px stage (its defaults suit 420px) */}
                <VenomButton label={t.collaborate} onClick={focusForm} onGrab={onGrab} height={260} sense={200} reach={100} release={150} />
              </div>
            )}

            <div data-colorize className="mt-8 space-y-3">
              <div className="flex items-center gap-2">
                <a href={`mailto:${profile.email}`} className="flex min-w-0 flex-1 items-center gap-3 text-white/75 transition-colors hover:text-white">
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
              <div className="flex gap-2 pt-2">
                {socials.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 text-white/60 transition-all hover:-translate-y-0.5 hover:border-orange-500/40 hover:text-white"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
                {/* the résumé, reachable from every page now that the link columns are gone */}
                <a
                  href={profile.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={c.ui.hero.resume}
                  title={c.ui.hero.resume}
                  className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 text-white/60 transition-all hover:-translate-y-0.5 hover:border-orange-500/40 hover:text-white"
                >
                  <FileDown className="h-5 w-5" />
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal variants={scaleIn}>
            <form
              data-colorize
              onSubmit={onSubmit}
              className="rounded-2xl border border-white/15 bg-neutral-950/30 p-6 shadow-[0_0_40px_color-mix(in_srgb,var(--color-orange-500)_14%,transparent)] backdrop-blur-sm sm:p-8"
            >
              <div className="grid gap-4">
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-xs text-white/50">
                    {t.name}
                  </label>
                  <input id="name" name="name" value={form.name} onChange={onChange} required className={field} placeholder="Jane Doe" />
                </div>
                <div>
                  <label htmlFor="email" className="mb-1.5 block text-xs text-white/50">
                    {t.email}
                  </label>
                  <input id="email" name="email" type="email" value={form.email} onChange={onChange} required className={field} placeholder="jane@example.com" />
                </div>
                <div>
                  <label htmlFor="message" className="mb-1.5 block text-xs text-white/50">
                    {t.message}
                  </label>
                  <textarea id="message" name="message" value={form.message} onChange={onChange} required rows={4} className={field} placeholder="Let's build something…" />
                </div>

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-3 text-sm font-medium text-white transition-all hover:bg-orange-500 disabled:opacity-60"
                >
                  {status === "sending" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> {t.sending}
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" /> {t.send}
                    </>
                  )}
                </button>

                <p aria-live="polite" className="min-h-[1.25rem] text-center text-sm">
                  {status === "success" && <span className="text-green-400">{t.success}</span>}
                  {/* literal red: error feedback must stay red under every theme */}
                  {status === "error" && <span className="text-[#f87171]">{t.error}</span>}
                </p>
              </div>
            </form>
          </Reveal>
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
    </footer>
  )
}
