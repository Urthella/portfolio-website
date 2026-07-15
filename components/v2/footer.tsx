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

  const link = "text-sm text-white/55 transition-colors hover:text-white"
  const colTitle = "font-mono text-xs text-white/40"

  return (
    <footer className="relative overflow-hidden">
      {/* space backdrop: the top stays transparent (mask) so the fixed fluid and
          aurora layers keep showing through — Contact flows into the footer
          without a visible seam */}
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url(/footer-bg.png)",
          maskImage: "linear-gradient(to bottom, transparent, black 45%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, black 45%)",
        }}
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-transparent via-[#07070a]/45 to-[#07070a]/20" />

      {/* CTA */}
      <div className="relative z-10 px-4 pb-16 pt-24 text-center sm:px-6">
        <p className="font-mono text-xs tracking-[0.25em] text-orange-500">
          <span className="text-orange-500/40">//</span> {t.talk}
        </p>
        <h2 className="mt-7 text-[clamp(2.8rem,9vw,7.5rem)] font-bold leading-[0.95] tracking-tight text-white">
          {t.titleA}
          <br />
          {t.titleB}
        </h2>
        <a
          href={`mailto:${profile.email}`}
          className="mt-10 inline-block rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-black transition-colors hover:bg-orange-500 hover:text-white"
        >
          {t.cta}
        </a>
      </div>

      {/* link columns */}
      <div className="relative z-10 mx-auto grid max-w-6xl gap-10 px-4 pb-14 pt-16 sm:px-6 md:grid-cols-5">
        <div>
          <div className={colTitle}>// {t.colSections}</div>
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
          <div className={colTitle}>// {t.colWork}</div>
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
          <div className={colTitle}>// {t.colMore}</div>
          <ul className="mt-5 space-y-2.5">
            {more.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  {...(href.startsWith("mailto:") ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                  className={link}
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
        <span className="text-sm text-white/40">
          © {new Date().getFullYear()} Utku Demirtaş. {t.rights}
        </span>
        <div className="flex items-center gap-6">
          <span className="hidden text-sm text-white/35 sm:inline">{ct.built}</span>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-1.5 text-sm text-white/50 transition-colors hover:text-white"
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
