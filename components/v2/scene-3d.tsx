"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"

import { ErrorBoundary } from "@/components/v2/error-boundary"

const SplineScene = dynamic(
  () => import("@/components/ui/splite").then((m) => ({ default: m.SplineScene })),
  { ssr: false },
)

/**
 * Fixed, ambient 3D scene behind the whole site. Desktop-only, dimmed with
 * scrims, non-interactive, and wrapped in an ErrorBoundary so a load failure
 * silently degrades to the aurora/dotted background instead of crashing.
 */
export function Scene3D() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)")
    setEnabled(mql.matches)
    const handler = (e: MediaQueryListEvent) => setEnabled(e.matches)
    mql.addEventListener("change", handler)
    return () => mql.removeEventListener("change", handler)
  }, [])

  if (!enabled) return null

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-[5]">
      <ErrorBoundary fallback={null}>
        <div className="absolute inset-0 opacity-[0.65]">
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="h-full w-full"
          />
        </div>
      </ErrorBoundary>

      {/* legibility scrims */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(115% 80% at 65% 35%, transparent 28%, #07070a 86%)" }}
      />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#07070a] to-transparent" />
    </div>
  )
}
