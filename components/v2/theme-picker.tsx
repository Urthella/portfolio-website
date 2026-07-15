"use client"

import { AnimatePresence, motion } from "framer-motion"
import { Palette, RotateCcw } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const STORAGE_KEY = "accent-base"
const DEFAULT_ACCENT = "#f97316" // orange-500, the stock palette

const PRESETS = [
  "#f97316", // orange (default)
  "#f43f5e", // rose
  "#ef4444", // red
  "#a855f7", // purple
  "#8b5cf6", // violet
  "#3b82f6", // blue
  "#06b6d4", // cyan
  "#10b981", // emerald
]

/**
 * Header popover that re-themes the whole site from one accent color: it sets
 * --accent-base on <html>, which globals.css expands into the orange/rose/amber
 * palette via OKLCH relative colors. Persisted in localStorage and re-applied
 * before first paint by the inline script in layout.tsx.
 */
export function ThemePicker() {
  const [open, setOpen] = useState(false)
  const [accent, setAccent] = useState<string | null>(null)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved && /^#[0-9a-f]{6}$/i.test(saved)) setAccent(saved)
    } catch {}
  }, [])

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onDown)
    return () => document.removeEventListener("mousedown", onDown)
  }, [open])

  const apply = (hex: string) => {
    setAccent(hex)
    document.documentElement.style.setProperty("--accent-base", hex)
    try {
      localStorage.setItem(STORAGE_KEY, hex)
    } catch {}
  }

  const reset = () => {
    setAccent(null)
    document.documentElement.style.removeProperty("--accent-base")
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {}
  }

  const current = accent ?? DEFAULT_ACCENT

  return (
    <div ref={rootRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="grid h-9 w-9 place-items-center rounded-lg border border-white/15 text-white/70 transition-colors hover:border-white/30 hover:text-white"
        aria-label="Change accent color"
        aria-expanded={open}
      >
        <Palette className="h-[18px] w-[18px]" style={{ color: "var(--color-orange-400)" }} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-white/10 bg-black/85 p-3 shadow-2xl shadow-black/60 backdrop-blur-xl"
          >
            <div className="mb-2.5 flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Accent</span>
              <button
                onClick={reset}
                className="flex items-center gap-1 rounded px-1.5 py-0.5 font-mono text-[10px] text-white/40 transition-colors hover:text-white"
                aria-label="Reset accent color"
              >
                <RotateCcw className="h-3 w-3" /> RESET
              </button>
            </div>

            <div className="grid grid-cols-8 gap-1.5">
              {PRESETS.map((hex) => (
                <button
                  key={hex}
                  onClick={() => apply(hex)}
                  aria-label={`Accent ${hex}`}
                  className={`h-5 w-5 rounded-md transition-transform hover:scale-110 ${
                    current.toLowerCase() === hex ? "ring-2 ring-white/80 ring-offset-2 ring-offset-black" : ""
                  }`}
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>

            <label className="mt-3 flex cursor-pointer items-center justify-between rounded-lg border border-white/10 px-2.5 py-1.5">
              <span className="font-mono text-[11px] text-white/55">Custom</span>
              <span className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-white/40">{current}</span>
                <input
                  type="color"
                  value={current}
                  onChange={(e) => apply(e.target.value)}
                  className="h-6 w-6 cursor-pointer appearance-none rounded-md border-0 bg-transparent p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-md [&::-webkit-color-swatch]:border-0"
                  aria-label="Pick a custom accent color"
                />
              </span>
            </label>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
