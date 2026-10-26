"use client"

import { LayoutGrid } from "lucide-react"
import type { CSSProperties, ReactNode } from "react"

import { APP_IDS, APPS } from "@/components/desktop/apps"
import { useOS, useT } from "@/components/desktop/os"
import type { AppId } from "@/components/desktop/types"
import { AppTile, focusRing } from "@/components/desktop/ui"
import { useLang } from "@/data/i18n"
import { cn } from "@/lib/utils"

const STR = {
  en: { dock: "Dock", apps: "Show applications", running: "running" },
  tr: { dock: "Rıhtım", apps: "Uygulamaları göster", running: "açık" },
}

const PINNED = APP_IDS.filter((id) => APPS[id].pinned)

// Tile size shrinks on short screens so every item (8 pinned + 1 running + show-apps) still fits.
const TILE = { "--tile": "clamp(14px, calc((100dvh - 120px) / 10 - 10px), 44px)" } as CSSProperties

function DockButton({
  label,
  tooltip,
  active,
  onClick,
  expanded,
  children,
}: {
  label: string
  tooltip: string
  active?: boolean
  onClick: () => void
  expanded?: boolean
  children: ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-expanded={expanded}
      className={cn(
        "group relative grid place-items-center rounded-xl p-1 transition-colors hover:bg-white/10",
        active && "bg-white/[0.13]",
        focusRing,
      )}
    >
      {children}
      <span
        aria-hidden
        className="pointer-events-none absolute left-full top-1/2 ml-3 -translate-y-1/2 translate-x-[-4px] whitespace-nowrap rounded-md border border-white/10 bg-neutral-900/95 px-2.5 py-1 text-xs font-medium text-white/90 opacity-0 shadow-lg shadow-black/50 transition-[opacity,transform] duration-150 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 motion-reduce:transition-none"
      >
        {tooltip}
      </span>
    </button>
  )
}

/** Ubuntu-style vertical dock: pinned apps, then running unpinned ones, then "Show applications". */
export function Dock({ onShowApps, appsOpen }: { onShowApps: () => void; appsOpen: boolean }) {
  const os = useOS()
  const { lang } = useLang()
  const t = useT(STR)

  const count = (id: AppId) => os.windows.filter((w) => w.app === id).length
  const extra = APP_IDS.filter((id) => !APPS[id].pinned && count(id) > 0)
  const focusedApp = os.windows.find((w) => w.id === os.focusedId)?.app

  const activate = (id: AppId) => {
    const wins = os.windows.filter((w) => w.app === id)
    if (!wins.length) return os.open(id)
    const top = wins.reduce((a, b) => (b.z > a.z ? b : a))
    if (top.id === os.focusedId) os.minimize(top.id)
    else os.focus(top.id)
  }

  const item = (id: AppId) => {
    const n = count(id)
    const title = APPS[id].title[lang]
    return (
      <li key={id} className="relative">
        <DockButton label={n ? `${title} (${t.running})` : title} tooltip={title} active={focusedApp === id} onClick={() => activate(id)}>
          <AppTile id={id} className="h-(--tile) w-(--tile) rounded-[10px]" />
        </DockButton>
        {n > 0 && (
          <span aria-hidden className="absolute -left-1 top-1/2 flex -translate-y-1/2 flex-col gap-[3px]">
            {Array.from({ length: Math.min(n, 3) }, (_, i) => (
              <span key={i} className="h-1 w-1 rounded-full bg-orange-400" />
            ))}
          </span>
        )}
      </li>
    )
  }

  return (
    <nav
      aria-label={t.dock}
      style={TILE}
      className="absolute bottom-0 left-0 top-8 z-20 flex w-16 flex-col items-center border-r border-white/[0.06] bg-black/45 py-2 backdrop-blur-xl"
    >
      <ul className="flex flex-col items-center gap-1.5">
        {PINNED.map(item)}
        {extra.length > 0 && <li aria-hidden className="my-0.5 h-px w-8 bg-white/10" />}
        {extra.map(item)}
      </ul>
      <div className="mt-auto pt-2">
        <DockButton label={t.apps} tooltip={t.apps} active={appsOpen} expanded={appsOpen} onClick={onShowApps}>
          <span aria-hidden className="grid h-(--tile) w-(--tile) place-items-center rounded-[10px] text-white/80">
            <LayoutGrid className="h-[50%] w-[50%]" strokeWidth={1.75} />
          </span>
        </DockButton>
      </div>
    </nav>
  )
}
