"use client"

import { DottedGlowBackground } from "@/components/ui/dotted-glow-background"

/**
 * Fixed, full-viewport dotted-glow layer that sits over the aurora base.
 * Canvas-based (no WebGL / no external fetch) so it degrades gracefully.
 */
export function DottedBg() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <DottedGlowBackground
        gap={28}
        radius={1.3}
        opacity={0.45}
        color="rgba(255,255,255,0.30)"
        darkColor="rgba(255,255,255,0.32)"
        glowColor="rgba(59,130,246,0.9)"
        darkGlowColor="rgba(59,130,246,0.9)"
        speedMin={0.15}
        speedMax={0.8}
      />
    </div>
  )
}
