"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

type PerfMode = "auto" | "full" | "lite"

const MODE_KEY = "perf-mode" // explicit user choice via the toggle: "full" | "lite"
const AUTO_KEY = "perf-auto" // cached first-visit measurement verdict: "full" | "lite"

const SETTLE_MS = 1500
const SAMPLE_MS = 2500
const MIN_FPS = 40

const Ctx = createContext<{ lite: boolean; setLite: (lite: boolean) => void }>({
  lite: false,
  setLite: () => {},
})

/**
 * Decides whether the heavy visuals (fluid sim, aurora drift, word physics)
 * should run. Order of authority: the user's explicit toggle, then OS
 * reduced-motion, then a one-time FPS measurement cached across visits.
 */
export function PerfProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<PerfMode>("auto")
  const [autoLite, setAutoLite] = useState(false)

  useEffect(() => {
    let stored: string | null = null
    let verdict: string | null = null
    try {
      stored = localStorage.getItem(MODE_KEY)
      verdict = localStorage.getItem(AUTO_KEY)
    } catch {}

    if (stored === "full" || stored === "lite") {
      setMode(stored)
      return
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setAutoLite(true)
      return
    }
    if (verdict === "lite" || verdict === "full") {
      setAutoLite(verdict === "lite")
      return
    }

    // First visit: let the entrance animations settle, then count real frames
    // while everything heavy is running. A hidden tab throttles rAF and would
    // read as a slow machine, so bail without caching and re-measure next time.
    let cancelled = false
    let frames = 0
    let start = 0
    let raf = 0

    const tick = (now: number) => {
      if (cancelled || document.hidden) return
      if (!start) start = now
      frames++
      const elapsed = now - start
      if (elapsed < SAMPLE_MS) {
        raf = requestAnimationFrame(tick)
        return
      }
      const isLite = (frames * 1000) / elapsed < MIN_FPS
      setAutoLite(isLite)
      try {
        localStorage.setItem(AUTO_KEY, isLite ? "lite" : "full")
      } catch {}
    }

    const timer = window.setTimeout(() => {
      raf = requestAnimationFrame(tick)
    }, SETTLE_MS)

    return () => {
      cancelled = true
      clearTimeout(timer)
      cancelAnimationFrame(raf)
    }
  }, [])

  const setLite = (lite: boolean) => {
    const m: PerfMode = lite ? "lite" : "full"
    setMode(m)
    try {
      localStorage.setItem(MODE_KEY, m)
    } catch {}
  }

  const lite = mode === "lite" || (mode === "auto" && autoLite)

  return <Ctx.Provider value={{ lite, setLite }}>{children}</Ctx.Provider>
}

export const usePerf = () => useContext(Ctx)
