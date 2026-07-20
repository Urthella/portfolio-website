"use client"

import { useEffect, useState } from "react"

import SplashCursor from "@/components/ui/splash-cursor"
import { ErrorBoundary } from "@/components/v2/error-boundary"
import { usePerf } from "@/hooks/use-perf"

/**
 * Interactive fluid cursor behind the whole site (warm-tinted SplashCursor).
 * Only mounted on desktop with a fine pointer, so phones and touch devices
 * skip the heavy WebGL fluid simulation entirely; lite mode (manual or
 * FPS-detected) skips it too. ErrorBoundary-guarded.
 */
export function SceneFluid() {
  const [enabled, setEnabled] = useState(false)
  const { lite } = usePerf()

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px) and (pointer: fine)")
    const update = () => setEnabled(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  if (!enabled || lite) return null

  return (
    <ErrorBoundary fallback={null}>
      {/* DYE 720 (default 1440): quarters the dye framebuffer memory (~50MB
          GPU) with no visible difference on an abstract blurred background */}
      <SplashCursor SPLAT_RADIUS={0.18} DENSITY_DISSIPATION={4.2} VELOCITY_DISSIPATION={2.4} DYE_RESOLUTION={720} />
    </ErrorBoundary>
  )
}
