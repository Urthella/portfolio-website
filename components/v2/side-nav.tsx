"use client"

import { usePathname, useRouter } from "next/navigation"

import LineSidebar from "@/components/ui/line-sidebar"
import { PAGES, isActive } from "@/components/v2/routes"
import { useContent } from "@/data/i18n"

/**
 * Fixed left-edge page nav: same i18n labels as the header, the current route
 * highlighted via LineSidebar's controlled activeIndex, click navigates. Only
 * shown where the centered max-w-6xl content leaves room for it.
 */
export function SideNav() {
  const navLabels = useContent().ui.nav
  const pathname = usePathname()
  const router = useRouter()
  const active = PAGES.findIndex((p) => isActive(pathname, p.href))

  return (
    <aside className="fixed left-6 top-1/2 z-30 hidden -translate-y-1/2 2xl:block" aria-label="Page navigation">
      <LineSidebar
        items={PAGES.map((p) => navLabels[p.key])}
        accentColor="var(--color-orange-500)"
        textColor="#c6c6cc"
        markerColor="#77777f"
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
        onItemClick={(index: number) => router.push(PAGES[index].href)}
      />
    </aside>
  )
}
