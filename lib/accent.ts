import type { Lang } from "@/data/i18n"

/**
 * Accent color helpers. Same storage key and CSS variable as the pre-paint
 * script in app/layout.tsx: app/globals.css derives the orange/rose/amber
 * palettes from --accent-base (utkuOS Settings and the terminal's `theme`).
 */

export const ACCENT_KEY = "accent-base"
export const DEFAULT_ACCENT = "#f97316" // orange-500, the stock palette
/** Fired on window after every setAccent/resetAccent so open UIs can re-read. */
export const ACCENT_EVENT = "accent-change"

export const ACCENT_PRESETS: { hex: string; name: Record<Lang, string> }[] = [
  { hex: "#f97316", name: { en: "Orange", tr: "Turuncu" } },
  { hex: "#f43f5e", name: { en: "Rose", tr: "Gül" } },
  { hex: "#ef4444", name: { en: "Red", tr: "Kırmızı" } },
  { hex: "#a855f7", name: { en: "Purple", tr: "Mor" } },
  { hex: "#8b5cf6", name: { en: "Violet", tr: "Menekşe" } },
  { hex: "#3b82f6", name: { en: "Blue", tr: "Mavi" } },
  { hex: "#06b6d4", name: { en: "Cyan", tr: "Camgöbeği" } },
  { hex: "#10b981", name: { en: "Emerald", tr: "Zümrüt" } },
  { hex: "#eab308", name: { en: "Yellow", tr: "Sarı" } },
  { hex: "#ec4899", name: { en: "Pink", tr: "Pembe" } },
]

const HEX = /^#[0-9a-f]{6}$/i

export const isAccentHex = (s: string) => HEX.test(s)

/** The accent currently applied (lowercase #rrggbb), or DEFAULT_ACCENT. */
export function getAccent(): string {
  if (typeof document === "undefined") return DEFAULT_ACCENT
  const v = document.documentElement.style.getPropertyValue("--accent-base").trim()
  return HEX.test(v) ? v.toLowerCase() : DEFAULT_ACCENT
}

/** Apply and persist an accent. Returns false (and does nothing) for anything but #rrggbb. */
export function setAccent(hex: string): boolean {
  if (!HEX.test(hex)) return false
  document.documentElement.style.setProperty("--accent-base", hex.toLowerCase())
  try {
    localStorage.setItem(ACCENT_KEY, hex.toLowerCase())
  } catch {}
  window.dispatchEvent(new Event(ACCENT_EVENT))
  return true
}

export function resetAccent(): void {
  document.documentElement.style.removeProperty("--accent-base")
  try {
    localStorage.removeItem(ACCENT_KEY)
  } catch {}
  window.dispatchEvent(new Event(ACCENT_EVENT))
}
