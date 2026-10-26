import { Activity, Briefcase, FileText, Folder, Mail, Music, Newspaper, Settings, SquareTerminal } from "lucide-react"

import type { AppDef, AppId } from "@/components/desktop/types"

/**
 * Every utkuOS app. Components load lazily, so the desktop shell ships
 * without any app code until a window opens. Dock order = object order.
 */
export const APPS: Record<AppId, AppDef> = {
  terminal: {
    id: "terminal",
    title: { en: "Terminal", tr: "Terminal" },
    icon: SquareTerminal,
    tint: "from-neutral-700 to-neutral-900",
    load: () => import("./terminal"),
    size: { w: 760, h: 480 },
    pinned: true,
  },
  files: {
    id: "files",
    title: { en: "Files", tr: "Dosyalar" },
    icon: Folder,
    tint: "from-orange-400 to-orange-600",
    load: () => import("./files"),
    size: { w: 900, h: 560 },
    pinned: true,
  },
  resume: {
    id: "resume",
    title: { en: "Résumé", tr: "Özgeçmiş" },
    icon: Briefcase,
    tint: "from-rose-500 to-rose-700",
    load: () => import("./resume"),
    size: { w: 820, h: 620 },
    single: true,
    pinned: true,
  },
  writing: {
    id: "writing",
    title: { en: "Writing", tr: "Yazılar" },
    icon: Newspaper,
    tint: "from-amber-400 to-amber-600",
    load: () => import("./writing"),
    size: { w: 700, h: 560 },
    single: true,
    pinned: true,
  },
  mail: {
    id: "mail",
    title: { en: "Mail", tr: "Posta" },
    icon: Mail,
    tint: "from-sky-500 to-blue-700",
    load: () => import("./mail"),
    size: { w: 660, h: 580 },
    single: true,
    pinned: true,
  },
  monitor: {
    id: "monitor",
    title: { en: "System Monitor", tr: "Sistem İzleyicisi" },
    icon: Activity,
    tint: "from-emerald-500 to-emerald-700",
    load: () => import("./monitor"),
    size: { w: 860, h: 580 },
    single: true,
    pinned: true,
  },
  hobbies: {
    id: "hobbies",
    title: { en: "Off the Keyboard", tr: "Klavye Dışında" },
    icon: Music,
    tint: "from-fuchsia-500 to-purple-700",
    load: () => import("./hobbies"),
    size: { w: 760, h: 560 },
    single: true,
    pinned: true,
  },
  settings: {
    id: "settings",
    title: { en: "Settings", tr: "Ayarlar" },
    icon: Settings,
    tint: "from-neutral-500 to-neutral-700",
    load: () => import("./settings"),
    size: { w: 780, h: 560 },
    single: true,
    pinned: true,
  },
  text: {
    id: "text",
    title: { en: "Text Editor", tr: "Metin Düzenleyici" },
    icon: FileText,
    tint: "from-slate-400 to-slate-600",
    load: () => import("./text"),
    size: { w: 740, h: 560 },
  },
}

export const APP_IDS = Object.keys(APPS) as AppId[]
