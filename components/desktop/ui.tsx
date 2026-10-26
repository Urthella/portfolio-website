"use client"

import { useEffect, useState } from "react"

import { APPS } from "@/components/desktop/apps"
import type { AppId } from "@/components/desktop/types"
import type { Lang } from "@/data/i18n"
import { cn } from "@/lib/utils"

/** Locale for dates/times in each UI language (en-GB: 24h clock, day before month). */
export const LOCALE: Record<Lang, string> = { en: "en-GB", tr: "tr-TR" }

export const focusRing = "outline-none focus-visible:ring-2 focus-visible:ring-orange-400/80"

/** An app's icon on its registry gradient. The caller sizes and rounds it via className. */
export function AppTile({ id, className }: { id: AppId; className?: string }) {
  const { icon: Icon, tint } = APPS[id]
  return (
    <span
      aria-hidden
      className={cn(
        "grid shrink-0 place-items-center bg-gradient-to-br text-white shadow-md shadow-black/40 ring-1 ring-inset ring-white/15",
        tint,
        className,
      )}
    >
      <Icon className="h-[55%] w-[55%]" strokeWidth={1.75} />
    </span>
  )
}

/** The utkuOS mark: a "u" and a prompt cursor on an accent gradient. */
export function UtkuMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid shrink-0 place-items-center rounded-[28%] bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 shadow-lg shadow-orange-500/25",
        className,
      )}
    >
      <svg viewBox="0 0 32 32" className="h-[62%] w-[62%]" fill="none" stroke="#0b0b0f" strokeWidth={3.6} strokeLinecap="round">
        <path d="M6 8v9a6 6 0 0 0 12 0V8" />
        <path d="M22.5 23.5h4.5" />
      </svg>
    </span>
  )
}

/** The current time, refreshed on each minute boundary; null until mounted (no SSR mismatch). */
export function useNow(): Date | null {
  const [now, setNow] = useState<Date | null>(null)
  useEffect(() => {
    let timer = 0
    const tick = () => {
      const d = new Date()
      setNow(d)
      timer = window.setTimeout(tick, 60_000 - (d.getTime() % 60_000) + 50)
    }
    timer = window.setTimeout(tick, 0)
    return () => clearTimeout(timer)
  }, [])
  return now
}
