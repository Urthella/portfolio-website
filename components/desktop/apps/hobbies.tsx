"use client"

import { BookOpen, Check, Dumbbell, Mail, Music, PenTool, type LucideIcon } from "lucide-react"
import { useId } from "react"

import { useOS, useT } from "@/components/desktop/os"
import { useContent } from "@/data/i18n"
import { cn } from "@/lib/utils"

const ICONS: Record<string, LucideIcon> = { music: Music, dumbbell: Dumbbell, book: BookOpen, pen: PenTool }
const TINTS = ["from-orange-400 to-rose-500", "from-rose-400 to-orange-500", "from-amber-300 to-orange-500", "from-orange-300 to-amber-500"]

const STR = {
  en: { title: "Off the keyboard", ask: "Ask about it" },
  tr: { title: "Klavye dışında", ask: "Bilgi al" },
}

export default function Hobbies() {
  const t = useT(STR)
  const c = useContent()
  const { open } = useOS()
  const head = c.ui.headings.hobbies
  const coach = c.ui.headings.services
  const coachId = useId()

  return (
    <div className="@container h-full min-h-0 overflow-auto text-white/90">
      <div className="relative isolate mx-auto max-w-4xl space-y-8 p-4 @md:p-6 @2xl:p-8">
        {/* warm glow behind the header */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64 overflow-hidden">
          <div className="absolute -left-10 -top-16 h-56 w-56 rounded-full bg-orange-500/15 blur-3xl" />
          <div className="absolute right-0 -top-10 h-48 w-48 rounded-full bg-rose-500/10 blur-3xl" />
        </div>

        <header>
          <p className="font-mono text-xs text-orange-400">{`// ${head.label}`}</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white @md:text-3xl">{t.title}</h1>
          <p className="mt-2 max-w-prose text-sm leading-relaxed text-white/55">{head.subtitle}</p>
        </header>

        <ul className="grid gap-3 @xl:grid-cols-2 @xl:gap-4">
          {c.hobbies.map((h, i) => {
            const Icon = ICONS[h.icon] ?? Music
            return (
              <li
                key={h.icon}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-orange-500/30 @md:p-5"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-orange-500/10 opacity-0 blur-2xl transition-opacity group-hover:opacity-100"
                />
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br text-white shadow-lg shadow-orange-500/20 transition-transform motion-safe:group-hover:scale-105",
                      TINTS[i % TINTS.length],
                    )}
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h2 className="font-semibold text-white">{h.title}</h2>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-white/60">{h.text}</p>
              </li>
            )
          })}
        </ul>

        <section aria-labelledby={coachId} className="space-y-4">
          <div>
            <p className="font-mono text-xs text-orange-400">{`// ${coach.label}`}</p>
            <h2 id={coachId} className="mt-1 text-xl font-semibold tracking-tight text-white">
              {coach.title}
            </h2>
            <p className="mt-1.5 max-w-prose text-sm leading-relaxed text-white/55">{coach.subtitle}</p>
          </div>

          <ul className="grid gap-3 @3xl:grid-cols-3 @xl:grid-cols-2 @xl:gap-4">
            {c.services.map((s) => (
              <li
                key={s.title}
                className="flex flex-col rounded-2xl border border-white/10 bg-gradient-to-b from-orange-500/[0.06] to-white/[0.02] p-4 @md:p-5"
              >
                <h3 className="font-semibold text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{s.text}</p>
                <ul className="mt-4 space-y-2">
                  {s.includes.map((inc) => (
                    <li key={inc} className="flex items-start gap-2 text-sm text-white/75">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" aria-hidden />
                      {inc}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-5">
                  <button
                    type="button"
                    onClick={() => open("mail", { subject: s.title })}
                    aria-label={`${t.ask}: ${s.title}`}
                    className="inline-flex items-center gap-2 rounded-lg border border-orange-500/30 bg-orange-500/10 px-3 py-1.5 text-xs font-medium text-orange-200 outline-none transition-colors hover:border-orange-500/60 hover:bg-orange-500/20 focus-visible:ring-2 focus-visible:ring-orange-400/80"
                  >
                    <Mail className="h-3.5 w-3.5" aria-hidden /> {t.ask}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
