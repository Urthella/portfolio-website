"use client"

import { ArrowUpRight, BookOpen } from "lucide-react"
import { useState } from "react"

import { useT } from "@/components/desktop/os"
import { MEDIUM } from "@/data/content"
import { useContent } from "@/data/i18n"
import { cn } from "@/lib/utils"

const ring = "outline-none focus-visible:ring-2 focus-visible:ring-orange-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07070a]"
const handle = MEDIUM.split("/").pop() ?? "@urthella1"

const strings = {
  en: {
    heading: `${handle} on Medium`,
    profile: "Open profile",
    all: "All",
    filter: "Filter by topic",
    read: "Read on Medium",
    newTab: "(opens in a new tab)",
    count: (n: number) => `${n} ${n === 1 ? "article" : "articles"}`,
  },
  tr: {
    heading: `Medium'da ${handle}`,
    profile: "Profili aç",
    all: "Tümü",
    filter: "Konuya göre filtrele",
    read: "Medium'da oku",
    newTab: "(yeni sekmede açılır)",
    count: (n: number) => `${n} yazı`,
  },
}

export default function Writing() {
  const c = useContent()
  const t = useT(strings)
  const [picked, setPicked] = useState<string | null>(null)

  const tags = [...new Set(c.articles.map((a) => a.tag))]
  // tag names are translated: a pick from the other language falls back to "All"
  const active = picked && tags.includes(picked) ? picked : null
  const list = active ? c.articles.filter((a) => a.tag === active) : c.articles

  const chip = (label: string, value: string | null, n: number) => (
    <button
      key={label}
      type="button"
      onClick={() => setPicked(value)}
      aria-pressed={active === value}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors",
        active === value
          ? "border-orange-500/50 bg-orange-500/15 text-white"
          : "border-white/10 bg-white/[0.03] text-white/60 hover:border-white/20 hover:text-white",
        ring,
      )}
    >
      {label}
      <span className="font-mono text-[10px] text-white/40">{n}</span>
    </button>
  )

  return (
    <div className="@container h-full min-h-0 overflow-auto text-white">
      <div className="mx-auto max-w-3xl px-4 py-5 @lg:px-8 @lg:py-7">
        <header className="flex flex-col gap-4 @lg:flex-row @lg:items-center @lg:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg shadow-amber-500/20">
              <BookOpen aria-hidden className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold tracking-tight text-white">{t.heading}</h1>
              <p className="text-sm text-white/50">{c.ui.headings.articles.subtitle}</p>
            </div>
          </div>
          <a
            href={MEDIUM}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 self-start rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-white/75 transition-colors hover:border-orange-500/40 hover:text-white @lg:self-auto",
              ring,
            )}
          >
            {t.profile}
            <ArrowUpRight aria-hidden className="h-4 w-4" />
            <span className="sr-only">{t.newTab}</span>
          </a>
        </header>

        <div role="group" aria-label={t.filter} className="mt-5 flex flex-wrap gap-2">
          {chip(t.all, null, c.articles.length)}
          {tags.map((tag) => chip(tag, tag, c.articles.filter((a) => a.tag === tag).length))}
        </div>

        <p aria-live="polite" className="mt-5 font-mono text-[11px] text-white/40">
          {t.count(list.length)}
        </p>

        <ul className="mt-2 grid gap-3 @2xl:grid-cols-2">
          {list.map((a) => (
            <li key={a.title}>
              <a
                href={MEDIUM}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "group flex h-full flex-col rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-orange-500/30 hover:bg-white/[0.04] @lg:p-5",
                  ring,
                )}
              >
                <span className="self-start rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 font-mono text-[11px] text-white/50">
                  {a.tag}
                </span>
                <h2 className="mt-3 font-semibold leading-snug text-white/90 group-hover:text-white">{a.title}</h2>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-white/55">{a.blurb}</p>
                <span className="mt-4 inline-flex items-center gap-1 font-mono text-xs text-orange-400">
                  {t.read}
                  <ArrowUpRight
                    aria-hidden
                    className="h-3.5 w-3.5 transition-transform motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
                  />
                </span>
                <span className="sr-only">{t.newTab}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
