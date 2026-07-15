"use client"

import LineSidebar from "@/components/ui/line-sidebar"
import { useContent } from "@/data/i18n"

/**
 * Fixed left-edge section nav mirroring the header items: same labels (i18n),
 * same smooth-scroll on click, and it follows the page's scroll spy via
 * LineSidebar's controlled activeIndex. Only shown where the centered
 * max-w-6xl content leaves room for it.
 */
export function SideNav({ items, activeSection }: { items: string[]; activeSection: string }) {
  const navLabels = useContent().ui.nav
  const labels = items.map((id) => navLabels[id as keyof typeof navLabels] ?? id)
  const active = items.indexOf(activeSection)

  return (
    <aside className="fixed left-6 top-1/2 z-30 hidden -translate-y-1/2 2xl:block" aria-label="Section navigation">
      <LineSidebar
        items={labels}
        accentColor="var(--color-orange-500)"
        textColor="#8b8b92"
        markerColor="#52525b"
        showIndex
        showMarker
        proximityRadius={90}
        maxShift={14}
        falloff="smooth"
        markerLength={36}
        markerGap={12}
        tickScale={0.5}
        scaleTick
        itemGap={16}
        fontSize={0.8}
        smoothing={100}
        activeIndex={active >= 0 ? active : null}
        onItemClick={(index: number) => {
          document.getElementById(items[index])?.scrollIntoView({ behavior: "smooth" })
        }}
      />
    </aside>
  )
}
