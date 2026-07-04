"use client"

import { useEffect, useState } from "react"

import SplashCursor from "@/components/ui/splash-cursor"
import { ErrorBoundary } from "@/components/v2/error-boundary"

/**
 * Interactive fluid cursor behind the whole site (warm-tinted SplashCursor).
 * Only mounted on desktop with a fine pointer, so phones and touch devices
 * skip the heavy WebGL fluid simulation entirely. ErrorBoundary-guarded.
 */
export function SceneFluid() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px) and (pointer: fine)")
    const update = () => setEnabled(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  if (!enabled) return null

  return (
    <ErrorBoundary fallback={null}>
      <SplashCursor SPLAT_RADIUS={0.18} DENSITY_DISSIPATION={4.2} VELOCITY_DISSIPATION={2.4} />
    </ErrorBoundary>
  )
}
