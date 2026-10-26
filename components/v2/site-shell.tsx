"use client"

import type { ReactNode } from "react"

import { AuroraBackground } from "@/components/v2/aurora-background"
import { CommandPalette } from "@/components/v2/command-palette"
import { ContactFooter } from "@/components/v2/contact-footer"
import { Nav } from "@/components/v2/nav"
import { SceneFluid } from "@/components/v2/scene-fluid"
import { ScrollProgress } from "@/components/v2/scroll-progress"
import GradualBlur from "@/components/ui/gradual-blur"
import { LangProvider } from "@/data/i18n"
import { PerfProvider } from "@/hooks/use-perf"

/**
 * Chrome shared by every site page. Lives in the (site) route-group layout, so
 * it persists across navigations: the fluid sim, providers and nav never remount.
 */
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <LangProvider>
      <PerfProvider>
        {/* .mono: the site is black and white; whatever you hover gets its color back (globals.css) */}
        <div className="mono">
        <AuroraBackground />
        <SceneFluid />
        <ScrollProgress />
        <CommandPalette />
        <Nav />
        <main className="relative z-10">
          {/* inside <main> so the marquee (z-40) can layer above it within the same stacking context */}
          {children}
          <ContactFooter />
        </main>
        {/* content melts into a soft blur at the bottom edge of the viewport (desktop only) */}
        <GradualBlur
          target="page"
          position="bottom"
          height="6rem"
          strength={2}
          divCount={5}
          curve="bezier"
          exponential
          opacity={1}
          style={{ zIndex: 30 }}
          className="hidden md:block"
        />
        </div>
      </PerfProvider>
    </LangProvider>
  )
}
