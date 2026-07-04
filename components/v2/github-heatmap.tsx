"use client"

import { useEffect, useState } from "react"

import { Reveal } from "@/components/v2/reveal"
import { useContent } from "@/data/i18n"

interface Day {
  date: string
  count: number
  level: number
}

// Warm intensity scale (level 0..4).
const LEVELS = ["bg-white/[0.05]", "bg-orange-500/25", "bg-orange-500/45", "bg-orange-500/70", "bg-orange-400"]

/**
 * GitHub contributions heatmap. Pulls the last year of contributions from the
 * public (no-auth) jogruber API and renders it warm-tinted. If the API is
 * unreachable the section simply renders nothing.
 */
export function GithubHeatmap() {
  const g = useContent().ui.github
  const [days, setDays] = useState<Day[]>([])
  const [total, setTotal] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch("https://github-contributions-api.jogruber.de/v4/Urthella?y=last")
      .then((r) => r.json())
      .then((d: { total?: Record<string, number>; contributions?: Day[] }) => {
        if (cancelled || !d?.contributions?.length) return
        setDays(d.contributions)
        const t = d.total?.lastYear ?? d.contributions.reduce((sum, c) => sum + c.count, 0)
        setTotal(t)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  if (!days.length) return null

  // Group the flat day list into Sunday-aligned week columns.
  const weeks: (Day | null)[][] = []
  let week: (Day | null)[] = []
  const firstDow = new Date(days[0].date).getDay()
  for (let i = 0; i < firstDow; i++) week.push(null)
  for (const d of days) {
    week.push(d)
    if (week.length === 7) {
      weeks.push(week)
      week = []
    }
  }
  if (week.length) {
    while (week.length < 7) week.push(null)
    weeks.push(week)
  }

  return (
    <section className="relative mx-auto max-w-5xl px-4 pb-12 sm:px-6">
      <Reveal className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
        <h3 className="mb-5 font-mono text-sm text-white/70">
          <span className="text-orange-500">//</span> {total}&nbsp;{g.heatmap}
        </h3>

        <div className="overflow-x-auto pb-1">
          <div className="flex gap-[3px]">
            {weeks.map((w, wi) => (
              <div key={wi} className="flex flex-col gap-[3px]">
                {w.map((d, di) => (
                  <div
                    key={di}
                    title={d ? `${d.count} · ${d.date}` : undefined}
                    className={`h-[11px] w-[11px] rounded-[2px] ${d ? LEVELS[d.level] : "bg-transparent"}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-end gap-1.5 font-mono text-[11px] text-white/40">
          <span>Less</span>
          {LEVELS.map((c, i) => (
            <span key={i} className={`h-[10px] w-[10px] rounded-[2px] ${c}`} />
          ))}
          <span>More</span>
        </div>
      </Reveal>
    </section>
  )
}
