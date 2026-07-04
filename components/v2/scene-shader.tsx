"use client"

import { ErrorBoundary } from "@/components/v2/error-boundary"
import { ShaderBg } from "@/components/v2/shader-bg"

/**
 * Fixed, pointer-following WebGL shader behind the whole site (replaces the
 * Spline robot). ErrorBoundary-guarded so a WebGL failure degrades to the
 * aurora base instead of crashing.
 */
export function SceneShader() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-[5]">
      <ErrorBoundary fallback={null}>
        <ShaderBg className="absolute inset-0 h-full w-full opacity-50" />
      </ErrorBoundary>
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(130% 100% at 50% 25%, transparent 18%, #07070a 78%)" }}
      />
    </div>
  )
}
