"use client"

import { motion, useReducedMotion } from "framer-motion"
import { useSyncExternalStore } from "react"

import { usePerf } from "@/hooks/use-perf"

type Style = "aurora" | "grid" | "plain"

const KEY = "utkuos-wallpaper"
const EVENT = "utkuos:wallpaper"

function read(): Style {
  try {
    const v = localStorage.getItem(KEY)
    return v === "grid" || v === "plain" ? v : "aurora"
  } catch {
    return "aurora"
  }
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb)
  window.addEventListener("storage", cb) // another tab changed it
  return () => {
    window.removeEventListener(EVENT, cb)
    window.removeEventListener("storage", cb)
  }
}

const VIGNETTE = { background: "radial-gradient(ellipse at center, transparent 35%, rgba(4,4,6,0.85) 100%)" }

/**
 * utkuOS wallpaper, pure CSS. Every color comes from the orange/rose/amber
 * palettes, so it follows the user's accent. Style is chosen in Settings
 * (localStorage "utkuos-wallpaper") and re-read on the "utkuos:wallpaper" event.
 */
export function Wallpaper() {
  const style = useSyncExternalStore(subscribe, read, () => "aurora" as const)
  const reduce = useReducedMotion()
  const { lite } = usePerf()
  const still = reduce || lite

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden bg-[#07070a]">
      {style === "aurora" && (
        <>
          <motion.div
            className="absolute -left-[10%] -top-[25%] h-[75vmax] w-[75vmax] rounded-full bg-orange-600/25 blur-[140px]"
            animate={still ? undefined : { x: [0, 80, -40, 0], y: [0, -50, 40, 0] }}
            transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -right-[15%] top-[15%] h-[65vmax] w-[65vmax] rounded-full bg-rose-500/20 blur-[140px]"
            animate={still ? undefined : { x: [0, -70, 30, 0], y: [0, 50, -30, 0] }}
            transition={{ duration: 36, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-[35%] left-[25%] h-[60vmax] w-[60vmax] rounded-full bg-amber-500/15 blur-[140px]"
            animate={still ? undefined : { x: [0, 50, -50, 0], y: [0, -30, 20, 0] }}
            transition={{ duration: 42, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="absolute inset-0" style={VIGNETTE} />
        </>
      )}

      {style === "grid" && (
        <>
          <div className="absolute inset-x-0 -top-1/3 mx-auto h-[80vh] w-[90vw] rounded-full bg-orange-500/[0.14] blur-[120px]" />
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)",
              backgroundSize: "48px 48px",
              maskImage: "radial-gradient(ellipse at 50% 30%, black 30%, transparent 80%)",
              WebkitMaskImage: "radial-gradient(ellipse at 50% 30%, black 30%, transparent 80%)",
            }}
          />
          <div className="absolute inset-0" style={VIGNETTE} />
        </>
      )}

      {style === "plain" && (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-[#121218] via-[#09090c] to-[#050507]" />
          <div className="absolute inset-0 bg-gradient-to-tl from-orange-500/[0.07] via-transparent to-transparent" />
        </>
      )}

      {/* faint wordmark */}
      <div className="absolute bottom-[4%] right-[3%] select-none text-[clamp(4rem,13vw,13rem)] font-semibold leading-none tracking-tighter text-orange-300/[0.06]">
        utkuOS
      </div>
    </div>
  )
}
