"use client"

/**
 * Fixed paper background: a faint ink grid and two warm washes, like light
 * falling on a desk. The washes are plain radial gradients and stand still: a
 * moving 140px blur over the whole viewport was a steady GPU cost for a drift
 * nobody could see.
 */
export function AuroraBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-paper">
      {/* faint grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(to right,#151413 1px,transparent 1px),linear-gradient(to bottom,#151413 1px,transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(40rem 40rem at 35% -8rem, rgb(255 90 31 / 0.10), transparent 70%), radial-gradient(36rem 36rem at 105% 110%, rgb(245 158 11 / 0.10), transparent 70%)",
        }}
      />
    </div>
  )
}
