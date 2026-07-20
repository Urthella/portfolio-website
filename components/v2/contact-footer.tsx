"use client"

import { ArrowUp, BookOpen, Check, Copy, Github, Instagram, Linkedin, Loader2, Mail, Phone, Send } from "lucide-react"
import { useState } from "react"

import { FallingText } from "@/components/ui/falling-text"
import { Typewriter } from "@/components/ui/typewriter"
import { Reveal } from "@/components/v2/reveal"
import { fromLeft, scaleIn } from "@/lib/motion"
import { profile } from "@/data/content"
import { useContent } from "@/data/i18n"
import { usePerf } from "@/hooks/use-perf"

const socials = [
  { href: profile.socials.linkedin, label: "LinkedIn", Icon: Linkedin },
  { href: profile.socials.github, label: "GitHub", Icon: Github },
  { href: profile.socials.instagram, label: "Instagram", Icon: Instagram },
  { href: profile.socials.medium, label: "Medium", Icon: BookOpen },
]

/**
 * Contact and footer as one section: the big display title opens it, the
 * form + info card follow, then link columns, the legal bar and the giant
 * wordmark — all on a single space backdrop whose masked top lets the fixed
 * fluid/aurora layers show through, so the page flows in with no seam.
 */
export function ContactFooter() {
  const c = useContent()
  const { lite } = usePerf()
  const t = c.ui.contact
  const f = c.ui.footer
  const nav = c.ui.nav
  const subtitle = c.ui.headings.contact.subtitle

  const [form, setForm] = useState({ name: "", email: "", message: "" })
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")
  const [copied, setCopied] = useState(false)

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
  // Higher opacities than the site norm: these sit on the busy rock backdrop.
  const link = "text-sm text-white/80 transition-colors hover:text-white"
  const colTitle = "font-mono text-xs text-white/60"

  const sections = ["about", "experience", "projects", "hobbies"] as const

  const work = [
    { label: "Okut Gitsin", href: "https://okutgitsin.com" },
    { label: "Penpick", href: "https://penpick.vercel.app" },
    { label: "GitHub", href: profile.socials.github },
  ]

  const more = [
    { label: c.ui.hero.resume, href: "/Utku%20Demirtas%20CV.pdf" },
    { label: "Medium", href: profile.socials.medium },
    { label: c.ui.headings.playground.label, href: "#playground" },
  ]

  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })

  return (
    <footer id="contact" className="relative overflow-hidden">
      {/* space backdrop: masked top keeps the fixed fluid/aurora layers visible */}
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url(/footer-bg.jpg)",
          maskImage: "linear-gradient(to bottom, transparent, black 50%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black 50%)",
        }}
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-transparent via-[#07070a]/45 to-[#07070a]/45" />

      <div className="relative">
        {/* display heading opens the section */}
        <Reveal className="mx-auto max-w-6xl px-4 pt-24 text-center sm:px-6">
          <p className="font-mono text-xs tracking-[0.25em] text-orange-500">
            <span className="text-orange-500/40">//</span> {f.talk}
          </p>
          <h2 className="mt-6 text-[clamp(2.8rem,9vw,7.5rem)] font-bold leading-[0.95] tracking-tight text-white">
            {f.titleA}
            <br />
            {f.titleB}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-pretty leading-relaxed text-white/50">{subtitle}</p>
        </Reveal>

        {/* falling words — desktop only: the physics sim is too heavy for phones,
            and while hidden the scroll trigger never fires, so matter-js never boots.
            Lite mode keeps the words but skips matter-js entirely. */}
        <Reveal className="mx-auto mt-14 hidden max-w-6xl px-4 sm:px-6 md:block">
          <div className="relative h-64 w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.015] sm:h-72">
            {lite ? (
              <p
                className="flex h-full flex-wrap content-center justify-center gap-x-2.5 gap-y-1 px-10 text-center text-white"
                style={{ fontSize: "clamp(1rem, 2.6vw, 1.7rem)" }}
              >
                {t.falling.split(" ").map((word, i) => (
                  <span
                    key={i}
                    className={
                      t.fallingHl.some((hw) => word.replace(/[^\p{L}\p{N}']/gu, "").toLowerCase() === hw.toLowerCase())
                        ? "font-semibold text-orange-400"
                        : undefined
                    }
                  >
                    {word}
                  </span>
                ))}
              </p>
            ) : (
              <>
                <FallingText text={t.falling} highlightWords={t.fallingHl} trigger="scroll" gravity={0} fontSize="clamp(1rem, 2.6vw, 1.7rem)" />
                <span className="pointer-events-none absolute bottom-3 right-4 font-mono text-[11px] text-white/25">{t.dragWords}</span>
              </>
            )}
          </div>
        </Reveal>

        {/* info card + form */}
        <div className="mx-auto mt-6 grid max-w-6xl gap-6 px-4 sm:px-6 lg:grid-cols-2">
          <Reveal variants={fromLeft}>
            <div className="flex h-full flex-col justify-between rounded-2xl border border-white/15 bg-neutral-950/30 p-6 shadow-[0_0_40px_color-mix(in_srgb,var(--color-orange-500)_14%,transparent)] backdrop-blur-sm sm:p-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${profile.email}`}
                    className="flex flex-1 items-center gap-3 text-white/70 transition-colors hover:text-white"
                  >
                    <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-orange-500">
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
                <div className="flex items-center gap-3 text-white/70">
                  <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-orange-500">
                    <Phone className="h-5 w-5" />
                  </span>
                  {profile.phone}
                </div>
              </div>

              <div className="mt-8">
                <p className="mb-3 font-mono text-xs text-white/40">{t.findMe}</p>
                <div className="flex gap-2">
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
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal variants={scaleIn}>
            <form onSubmit={onSubmit} className="rounded-2xl border border-white/15 bg-neutral-950/30 p-6 shadow-[0_0_40px_color-mix(in_srgb,var(--color-orange-500)_14%,transparent)] backdrop-blur-sm sm:p-8">
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

        {/* link columns (socials live as icons in the info card above) */}
        <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-14 pt-20 sm:grid-cols-3 sm:px-6">
          <div>
            <div className={colTitle}>// {f.colSections}</div>
            <ul className="mt-5 space-y-2.5">
              {sections.map((id) => (
                <li key={id}>
                  <button onClick={() => go(id)} className={link}>
                    {nav[id]}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className={colTitle}>// {f.colWork}</div>
            <ul className="mt-5 space-y-2.5">
              {work.map(({ label, href }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className={link}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className={colTitle}>// {f.colMore}</div>
            <ul className="mt-5 space-y-2.5">
              {more.map(({ label, href }) => (
                <li key={label}>
                  {href.startsWith("#") ? (
                    <button onClick={() => go(href.slice(1))} className={link}>
                      {label}
                    </button>
                  ) : (
                    <a href={href} target="_blank" rel="noopener noreferrer" className={link}>
                      {label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
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

        {/* giant wordmark (13 chars — sized to span the viewport like TURION's 6 at 26vw) */}
        <div className="overflow-hidden px-2 pb-2">
          <div
            className="select-none whitespace-nowrap text-center font-bold leading-[0.8] text-white"
            style={{ fontSize: "clamp(2.25rem, 10.5vw, 10.5rem)", letterSpacing: "-0.05em" }}
            aria-hidden
          >
            UTKUWANKENOBI
          </div>
        </div>
      </div>
    </footer>
  )
}
