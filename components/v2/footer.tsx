"use client"

import { ArrowUp } from "lucide-react"

import { profile } from "@/data/content"
import { useContent } from "@/data/i18n"

/**
 * Turion-style closing footer: big CTA over the space backdrop
 * (public/footer-bg.jpg), mono link columns, a legal bar, and a giant
 * wordmark bleeding off the bottom. Content is ours and localized.
 */
export function Footer() {
  const c = useContent()
  const t = c.ui.footer
  const nav = c.ui.nav
  const ct = c.ui.contact

  const sections = ["about", "experience", "projects", "contact"] as const

  const work = [
    { label: "Okut Gitsin", href: "https://okutgitsin.com" },
    { label: "Penpick", href: "https://penpick.vercel.app" },
    { label: "GitHub", href: profile.socials.github },
  ]

  const more = [
    { label: c.ui.hero.resume, href: "/Utku%20Demirtas%20CV.pdf" },
    { label: "Medium", href: profile.socials.medium },
    { label: profile.email, href: `mailto:${profile.email}` },
  ]

  const socials = [
    { label: "GitHub", href: profile.socials.github },
    { label: "LinkedIn", href: profile.socials.linkedin },
    { label: "Instagram", href: profile.socials.instagram },
    { label: "Medium", href: profile.socials.medium },
  ]

  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })

  const link = "font-mono text-xs uppercase tracking-wide text-white/85 transition-colors hover:text-orange-400"
  const colTitle = "font-mono text-xs uppercase tracking-widest text-white/40"

  return (
    <footer className="relative overflow-hidden">
      {/* space backdrop, fading in from the page background */}
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/footer-bg.jpg)" }}
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-[#07070a] via-[#07070a]/70 to-[#07070a]/25" />

      {/* CTA */}
      <div className="relative z-10 px-4 pb-16 pt-36 text-center sm:px-6">
        <span className="inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.3em] text-white/55">
          <span className="h-1.5 w-1.5 bg-orange-500" aria-hidden /> {t.talk}
        </span>
        <h2 className="mt-7 text-[clamp(2.8rem,9vw,7.5rem)] font-bold leading-[0.95] tracking-tight text-white">
          {t.titleA}
          <br />
          {t.titleB}
        </h2>
        <a
          href={`mailto:${profile.email}`}
          className="mt-10 inline-block bg-white px-6 py-4 font-mono text-xs font-bold uppercase tracking-widest text-black transition-colors hover:bg-orange-500"
        >
          {t.cta}
        </a>
      </div>

      {/* link columns */}
      <div className="relative z-10 mx-auto grid max-w-6xl gap-10 px-4 pb-14 pt-16 sm:px-6 md:grid-cols-5">
        <div>
          <div className={colTitle}>{t.colSections}</div>
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
          <div className={colTitle}>{t.colWork}</div>
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
          <div className={colTitle}>{t.colMore}</div>
          <ul className="mt-5 space-y-2.5">
            {more.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  {...(href.startsWith("mailto:") ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                  className={`${link} normal-case`}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2 md:justify-self-end">
          <div className="flex flex-wrap gap-6 md:justify-end">
            {socials.map(({ label, href }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" className={link}>
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* legal bar */}
      <div className="relative z-10 mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 border-t border-white/15 px-4 py-6 sm:px-6">
        <span className="font-mono text-[11px] uppercase tracking-wide text-white/45">
          © {new Date().getFullYear()} Utku Demirtaş. {t.rights}
        </span>
        <div className="flex items-center gap-6">
          <span className="hidden font-mono text-[11px] text-white/35 sm:inline">{ct.built}</span>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wide text-white/60 transition-colors hover:text-white"
          >
            {ct.backToTop} <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* giant wordmark */}
      <div className="relative z-10 overflow-hidden px-2 pb-2">
        <div
          className="select-none text-center font-bold leading-[0.8] text-white"
          style={{ fontSize: "clamp(6rem, 24vw, 24rem)", letterSpacing: "-0.05em" }}
          aria-hidden
        >
          UTKU
        </div>
      </div>
    </footer>
  )
}
