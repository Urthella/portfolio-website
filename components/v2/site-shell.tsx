"use client"

import type { ReactNode } from "react"

import { AuroraBackground } from "@/components/v2/aurora-background"
import { CommandPalette } from "@/components/v2/command-palette"
import { ContactFooter } from "@/components/v2/contact-footer"
import { Nav } from "@/components/v2/nav"
import { SceneFluid } from "@/components/v2/scene-fluid"
import { ScrollProgress } from "@/components/v2/scroll-progress"
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
        {/* .site: warm paper, ink and the red-orange accent, with the glove cursor (globals.css) */}
        <div className="site text-ink">
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
        </div>
      </PerfProvider>
    </LangProvider>
  )
}
