"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"

const SplineScene = dynamic(
  () => import("@/components/ui/splite").then((m) => ({ default: m.SplineScene })),
  { ssr: false },
)

/**
 * Desktop-only 3D scene behind the content, dimmed with scrims so text stays
 * readable. Non-interactive (pointer-events-none) and never loaded on mobile.
 */
export function SplineBg() {
  const [desktop, setDesktop] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)")
    setDesktop(mql.matches)
    const handler = (e: MediaQueryListEvent) => setDesktop(e.matches)
    mql.addEventListener("change", handler)
    return () => mql.removeEventListener("change", handler)
  }, [])

  if (!desktop) return null

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <div className="absolute inset-0 opacity-60">
        <SplineScene
          scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
          className="h-full w-full"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#07070a]/50 via-[#07070a]/45 to-[#07070a]" />
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, transparent 25%, #07070a 92%)" }}
      />
    </div>
  )
}
