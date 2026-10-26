"use client"

import { Briefcase, Download, ExternalLink, FileText, GraduationCap, MapPin, Users } from "lucide-react"
import { useState } from "react"

import { useOS, useT } from "@/components/desktop/os"
import { profile } from "@/data/content"
import { useContent } from "@/data/i18n"
import { cn } from "@/lib/utils"

const kindIcon = { work: Briefcase, volunteer: Users, education: GraduationCap }

const ring = "outline-none focus-visible:ring-2 focus-visible:ring-orange-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07070a]"
const pdfUrl = encodeURI(profile.resume)

const strings = {
  en: {
    experience: "Experience",
    skills: "Skills",
    languages: "Languages",
    download: "Download PDF",
    viewPdf: "View PDF",
    pdfTitle: "Résumé (PDF)",
    noPdf: "This browser can't show PDFs inside the page.",
    pdfHint: "PDF not showing?",
    openPdf: "Open it in a new tab",
    newTab: "(opens in a new tab)",
    kinds: { work: "Work", volunteer: "Volunteer", education: "Education" },
  },
  tr: {
    experience: "Deneyim",
    skills: "Yetkinlikler",
    languages: "Diller",
    download: "PDF'i indir",
    viewPdf: "PDF'i görüntüle",
    pdfTitle: "Özgeçmiş (PDF)",
    noPdf: "Bu tarayıcı PDF'leri sayfa içinde gösteremiyor.",
    pdfHint: "PDF görünmüyor mu?",
    openPdf: "Yeni sekmede aç",
    newTab: "(yeni sekmede açılır)",
    kinds: { work: "İş", volunteer: "Gönüllü", education: "Eğitim" },
  },
}

function SectionTitle({ children }: { children: string }) {
  return (
    <h2 className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-orange-400">
      {children}
      <span aria-hidden className="h-px flex-1 bg-white/10" />
    </h2>
  )
}

export default function Resume() {
  const os = useOS()
  const c = useContent()
  const t = useT(strings)
  const [pdf, setPdf] = useState(false)
  // null until the PDF view is first opened; read from navigator then, never during render
  const [pdfInline, setPdfInline] = useState<boolean | null>(null)
  const showPdf = pdf && !os.isMobile

  const togglePdf = () => {
    if (pdfInline === null) setPdfInline(navigator.pdfViewerEnabled !== false)
    setPdf((v) => !v)
  }

  return (
    <div className={cn("@container h-full min-h-0 text-white", showPdf ? "flex flex-col" : "overflow-auto")}>
      {/* header stays mounted across the page/PDF switch so the toggle keeps focus */}
      <header className="shrink-0 border-b border-white/10 bg-white/[0.02]">
        <div className="mx-auto flex max-w-3xl flex-col gap-4 px-5 py-5 @lg:flex-row @lg:items-end @lg:justify-between @lg:px-10 @lg:py-7">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold tracking-tight text-white @lg:text-3xl">{profile.name}</h1>
            <p className="mt-1 text-sm text-orange-400">
              {c.profile.role} <span className="text-white/25">·</span> {c.profile.focus}
            </p>
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-white/45">
              <MapPin aria-hidden className="h-3.5 w-3.5" />
              {profile.location}
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center gap-2 rounded-lg bg-orange-600 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-500",
                ring,
              )}
            >
              <Download aria-hidden className="h-4 w-4" />
              {t.download}
              <span className="sr-only">{t.newTab}</span>
            </a>
            {!os.isMobile && (
              <button
                type="button"
                onClick={togglePdf}
                aria-pressed={pdf}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm transition-colors",
                  pdf
                    ? "border-orange-500/50 bg-orange-500/15 text-white"
                    : "border-white/10 bg-white/[0.03] text-white/75 hover:border-white/20 hover:text-white",
                  ring,
                )}
              >
                <FileText aria-hidden className="h-4 w-4" />
                {t.viewPdf}
              </button>
            )}
          </div>
        </div>
      </header>

      {showPdf ? (
        pdfInline ? (
          <div className="flex min-h-0 flex-1 flex-col">
            <p className="shrink-0 border-b border-white/10 px-4 py-1.5 text-xs text-white/45">
              {t.pdfHint}{" "}
              <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className={cn("rounded text-orange-400 underline-offset-2 hover:underline", ring)}>
                {t.openPdf}
              </a>
            </p>
            <iframe src={pdfUrl} title={t.pdfTitle} className="min-h-0 w-full flex-1 bg-neutral-800" />
          </div>
        ) : (
          <div className="grid flex-1 place-items-center p-6 text-center">
            <div>
              <FileText aria-hidden className="mx-auto h-8 w-8 text-white/30" />
              <p className="mt-3 text-sm text-white/60">{t.noPdf}</p>
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn("mt-3 inline-flex items-center gap-1.5 rounded text-sm text-orange-400 hover:underline", ring)}
              >
                {t.openPdf} <ExternalLink aria-hidden className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        )
      ) : (
        <article className="mx-auto max-w-3xl space-y-9 px-5 py-7 @lg:px-10 @lg:py-9">
          <section aria-label={t.experience}>
            <SectionTitle>{t.experience}</SectionTitle>
            <ol className="relative mt-5 space-y-7 before:absolute before:bottom-2 before:left-[13px] before:top-2 before:w-px before:bg-gradient-to-b before:from-orange-500/50 before:via-white/10 before:to-transparent">
              {c.experiences.map((e, i) => {
                const Icon = kindIcon[e.kind]
                return (
                  <li key={i} className="relative pl-10">
                    <span
                      title={t.kinds[e.kind]}
                      className="absolute left-0 top-0.5 grid h-7 w-7 place-items-center rounded-full border border-white/15 bg-[#0b0b10] text-orange-400"
                    >
                      <Icon aria-hidden className="h-3.5 w-3.5" />
                      <span className="sr-only">{t.kinds[e.kind]}</span>
                    </span>
                    <div className="flex flex-col gap-0.5 @lg:flex-row @lg:items-baseline @lg:justify-between @lg:gap-4">
                      <h3 className="font-medium text-white/90">{e.role}</h3>
                      <span className="shrink-0 font-mono text-xs text-white/45 @lg:order-last">{e.date}</span>
                    </div>
                    <p className="text-sm text-orange-400/90">{e.org}</p>
                    <ul className="mt-2.5 space-y-1.5 text-sm leading-relaxed text-white/60">
                      {e.points.map((p, pi) => (
                        <li key={pi} className="flex gap-2.5">
                          <span aria-hidden className="mt-[0.6rem] h-1 w-1 shrink-0 rounded-full bg-white/30" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                    {e.stack && (
                      <ul className="mt-3 flex flex-wrap gap-1.5">
                        {e.stack.map((s) => (
                          <li key={s} className="rounded-md border border-white/[0.06] bg-white/[0.04] px-2 py-0.5 font-mono text-[11px] text-white/50">
                            {s}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                )
              })}
            </ol>
          </section>

          <section aria-label={t.skills}>
            <SectionTitle>{t.skills}</SectionTitle>
            <dl className="mt-5 space-y-3.5">
              {c.skillGroups.map((g) => (
                <div key={g.label} className="grid gap-1.5 @lg:grid-cols-[10rem_1fr] @lg:gap-4">
                  <dt className="pt-0.5 text-xs font-medium text-white/45">{g.label}</dt>
                  <dd className="flex flex-wrap gap-1.5">
                    {g.items.map((s) => (
                      <span key={s} className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 text-xs text-white/75">
                        {s}
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-label={t.languages}>
            <SectionTitle>{t.languages}</SectionTitle>
            <ul className="mt-5 flex flex-wrap gap-2">
              {c.about.languages.map((l) => (
                <li key={l.name} className="flex items-baseline gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-white/85">
                  {l.name}
                  <span className="font-mono text-xs text-orange-400">{l.level}</span>
                </li>
              ))}
            </ul>
          </section>
        </article>
      )}
    </div>
  )
}
