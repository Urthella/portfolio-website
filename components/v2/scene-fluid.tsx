"use client"

import SplashCursor from "@/components/ui/splash-cursor"
import { ErrorBoundary } from "@/components/v2/error-boundary"

/**
 * Interactive fluid cursor behind the whole site (reactbits SplashCursor,
 * warm-tinted). ErrorBoundary-guarded so a WebGL2 failure degrades to the
 * aurora base instead of crashing.
 */
export function SceneFluid() {
  return (
    <ErrorBoundary fallback={null}>
      <SplashCursor SPLAT_RADIUS={0.18} DENSITY_DISSIPATION={4.2} VELOCITY_DISSIPATION={2.4} />
    </ErrorBoundary>
  )
}
