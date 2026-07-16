"use client"

import { RotateCcw } from "lucide-react"
import { useEffect, useState } from "react"

import { SectionHeading } from "@/components/v2/section-heading"
import { useContent } from "@/data/i18n"

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
  "#eab308", // yellow
  "#ec4899", // pink
]

// The derived palette rows shown as "source": the chips read the live CSS
// variables, so they repaint with every pick.
const DERIVED = [
  { name: "orange", cssVar: "--color-orange-500", formula: "oklch(from base 70.5% 0.213 h)" },
  { name: "rose", cssVar: "--color-rose-500", formula: "oklch(from base 64.5% 0.246 calc(h - 31.2))" },
  { name: "amber", cssVar: "--color-amber-500", formula: "oklch(from base 76.9% 0.188 calc(h + 22.5))" },
]

// Tailwind family names by HSL hue (boundaries are midpoints between the
// families' -500 hues) — used to re-label the derived rows after a pick.
const HUE_STOPS: Array<[number, string]> = [
  [12, "red"], [31, "orange"], [43, "amber"], [65, "yellow"], [112, "lime"],
  [151, "green"], [166, "emerald"], [181, "teal"], [194, "cyan"], [208, "sky"],
  [228, "blue"], [248, "indigo"], [264, "violet"], [281, "purple"],
  [311, "fuchsia"], [340, "pink"], [355, "rose"], [361, "red"],
]

// Resolve a palette variable to concrete sRGB by bouncing it through a probe
// element (var substitution) and a 1px canvas (normalizes oklch to sRGB),
// then name it by hue.
function liveName(cssVar: string, fallback: string): string {
  try {
    const probe = document.createElement("span")
    probe.style.color = `var(${cssVar})`
    document.body.appendChild(probe)
    const resolved = getComputedStyle(probe).color
    probe.remove()

    const canvas = document.createElement("canvas")
    canvas.width = canvas.height = 1
    const ctx = canvas.getContext("2d", { willReadFrequently: true })
    if (!ctx) return fallback
    ctx.fillStyle = resolved
    ctx.fillRect(0, 0, 1, 1)
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data

    const rn = r / 255
    const gn = g / 255
    const bn = b / 255
    const max = Math.max(rn, gn, bn)
    const d = max - Math.min(rn, gn, bn)
    if (d < 0.08) return "gray"
    let hue
    if (max === rn) hue = ((gn - bn) / d) % 6
    else if (max === gn) hue = (bn - rn) / d + 2
    else hue = (rn - gn) / d + 4
    hue = (hue * 60 + 360) % 360
    return HUE_STOPS.find(([bound]) => hue < bound)?.[1] ?? fallback
  } catch {
    return fallback
  }
}

/**
 * The theme picker as a section: a code-window that exposes --accent-base with
 * live color codes. Same storage/vars as the pre-paint script in layout.tsx.
 */
export function ThemeLab() {
  const c = useContent()
  const h = c.ui.headings.playground
  const p = c.ui.playground
  const [accent, setAccent] = useState<string | null>(null)
  const [names, setNames] = useState(DERIVED.map((d) => d.name))

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved && /^#[0-9a-f]{6}$/i.test(saved)) setAccent(saved)
    } catch {}
  }, [])

  // Re-label the derived rows from the live palette after every pick.
  useEffect(() => {
    setNames(DERIVED.map((d) => liveName(d.cssVar, d.name)))
  }, [accent])

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
    <section id="playground" className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <SectionHeading index="06" label={h.label} title={h.title} subtitle={h.subtitle} />

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-neutral-950/80 backdrop-blur-sm">
        {/* window chrome */}
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5" aria-hidden>
              <span className="h-3 w-3 rounded-full bg-white/10" />
              <span className="h-3 w-3 rounded-full bg-white/10" />
              <span className="h-3 w-3 rounded-full bg-white/10" />
            </div>
            <span className="font-mono text-xs text-white/40">theme.config.ts</span>
          </div>
          <button
            onClick={reset}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1 font-mono text-[11px] text-white/50 transition-colors hover:border-white/25 hover:text-white"
          >
            <RotateCcw className="h-3 w-3" /> {p.reset}
          </button>
        </div>

        <div className="grid gap-10 p-6 sm:p-8 lg:grid-cols-[1.15fr_1fr]">
          {/* live "source view" of the palette */}
          <div className="overflow-x-auto font-mono text-sm leading-8">
            <div className="whitespace-nowrap text-white/30">{`// ${p.comment}`}</div>
            <div className="whitespace-nowrap">
              <span className="text-rose-400">export const</span> <span className="text-orange-400">accent</span>{" "}
              <span className="text-white/50">= {"{"}</span>
            </div>
            <div className="flex items-center gap-3 whitespace-nowrap pl-6">
              <span className="text-white/70">base:</span>
              <label
                className="relative inline-flex h-5 w-5 shrink-0 cursor-pointer overflow-hidden rounded border border-white/25"
                style={{ backgroundColor: current }}
              >
                <input
                  type="color"
                  value={current}
                  onChange={(e) => apply(e.target.value)}
                  aria-label="Pick a custom accent color"
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
              </label>
              <span className="text-amber-300">{`"${current}"`},</span>
              <span className="text-white/25">{`// ${p.custom}`}</span>
            </div>
            {DERIVED.map((d, i) => (
              <div key={d.name} className="flex items-center gap-3 whitespace-nowrap pl-6">
                <span className="text-white/70">{names[i]}:</span>
                <span
                  aria-hidden
                  className="h-3.5 w-3.5 shrink-0 rounded border border-white/15"
                  style={{ background: `var(${d.cssVar})` }}
                />
                <span className="text-white/40">{d.formula},</span>
              </div>
            ))}
            <div className="text-white/50">{"}"}</div>
          </div>

          {/* presets, codes included */}
          <div>
            <p className="font-mono text-xs text-white/40">{`// ${p.presets}`}</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {PRESETS.map((hex) => (
                <button
                  key={hex}
                  onClick={() => apply(hex)}
                  className={`flex items-center gap-2.5 rounded-lg border px-3 py-2 text-left transition-colors ${
                    current.toLowerCase() === hex
                      ? "border-orange-500/60 bg-white/[0.05]"
                      : "border-white/10 hover:border-white/25"
                  }`}
                >
                  <span aria-hidden className="h-4 w-4 shrink-0 rounded" style={{ backgroundColor: hex }} />
                  <span className="font-mono text-xs text-white/70">{hex}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
