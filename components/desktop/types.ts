import type { LucideIcon } from "lucide-react"
import type { ComponentType } from "react"

import type { Lang } from "@/data/i18n"

export type AppId = "terminal" | "files" | "text" | "resume" | "mail" | "writing" | "settings" | "monitor" | "hobbies"

/** What an app was opened with, e.g. `{ path: "~/projects/okut-gitsin/README.md" }` for the text viewer. */
export type AppArgs = Record<string, string | undefined>

/** Props every app component receives. */
export interface AppProps {
  windowId: string
  args: AppArgs
}

export interface AppDef {
  id: AppId
  title: Record<Lang, string>
  icon: LucideIcon
  /** Tailwind gradient stops for the icon tile, e.g. "from-orange-500 to-rose-600". */
  tint: string
  load: () => Promise<{ default: ComponentType<AppProps> }>
  /** Preferred window size in px (clamped to the work area). */
  size: { w: number; h: number }
  /** Only one window: opening it again focuses that window and hands it the new args. */
  single?: boolean
  /** Pinned to the dock. */
  pinned?: boolean
}

export interface Rect {
  x: number
  y: number
  w: number
  h: number
}

/** A window; x/y are relative to the work area (below the top bar, right of the dock). */
export interface WindowState extends Rect {
  id: string
  app: AppId
  args: AppArgs
  /** Title override set by the app (e.g. the open file's name). */
  title?: string
  z: number
  minimized: boolean
  maximized: boolean
}
