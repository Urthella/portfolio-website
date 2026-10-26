"use client"

import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Briefcase,
  ChevronRight,
  Contact,
  Eye,
  File,
  FileBadge2,
  FileCode2,
  FileText,
  Folder,
  FolderGit2,
  FolderOpen,
  FolderX,
  Globe,
  House,
  LayoutGrid,
  List,
  Newspaper,
  Star,
  Tag,
  Trash2,
  type LucideIcon,
} from "lucide-react"
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react"

import { APPS } from "@/components/desktop/apps"
import { basename, HOME, listDir, lookup, resolvePath, TRASH, type FsDir, type FsNode } from "@/components/desktop/fs"
import { useOS, useT } from "@/components/desktop/os"
import type { AppProps } from "@/components/desktop/types"
import { categories, type Category } from "@/data/content"
import type { Lang } from "@/data/i18n"

/**
 * Files: a Nautilus-style browser over the utkuOS virtual filesystem.
 * Folders navigate in place; everything else goes through os.openPath.
 */

const PROJECTS = `${HOME}/projects`
const CATS = categories.filter((c): c is Category => c !== "All")
const FOCUS = "outline-none focus-visible:ring-2 focus-visible:ring-orange-400/70"

const en = {
  home: "Home",
  projects: "Projects",
  experience: "Experience",
  writing: "Writing",
  trash: "Trash",
  places: "Places",
  categories: "Categories",
  back: "Back",
  forward: "Forward",
  up: "Parent folder",
  location: "Location",
  viewMode: "View",
  grid: "Grid view",
  list: "List view",
  showHidden: "Show hidden files",
  name: "Name",
  kind: "Kind",
  info: "Info",
  featured: "Featured",
  empty: "This folder is empty",
  missing: "This folder doesn't exist",
  goHome: "Go to Home",
  items: (n: number) => `${n} ${n === 1 ? "item" : "items"}`,
  selected: (name: string) => `“${name}” selected`,
  filtered: (cat: string) => `filtered by ${cat}`,
  opensIn: (app: string) => `Opens in ${app}`,
  size: (b: number) => (b < 1024 ? `${b} bytes` : `${(b / 1024).toFixed(1)} kB`),
  kinds: {
    dir: "Folder",
    md: "Markdown document",
    txt: "Plain text",
    url: "Web link",
    pdf: "PDF document",
    vcf: "Contact card",
    html: "HTML page",
    js: "JavaScript",
    file: "File",
  },
  cats: { "Full-stack": "Full-stack", "AI/ML": "AI/ML", Systems: "Systems", Security: "Security", Web: "Web" } as Record<Category, string>,
}

const STR: Record<Lang, typeof en> = {
  en,
  tr: {
    home: "Ev",
    projects: "Projeler",
    experience: "Deneyim",
    writing: "Yazılar",
    trash: "Çöp",
    places: "Konumlar",
    categories: "Kategoriler",
    back: "Geri",
    forward: "İleri",
    up: "Üst klasör",
    location: "Konum",
    viewMode: "Görünüm",
    grid: "Izgara görünümü",
    list: "Liste görünümü",
    showHidden: "Gizli dosyaları göster",
    name: "Ad",
    kind: "Tür",
    info: "Bilgi",
    featured: "Öne çıkan",
    empty: "Bu klasör boş",
    missing: "Bu klasör bulunamadı",
    goHome: "Ev dizinine dön",
    items: (n) => `${n} öğe`,
    selected: (name) => `“${name}” seçildi`,
    filtered: (cat) => `${cat} filtresi`,
    opensIn: (app) => `${app} ile açılır`,
    size: (b) => (b < 1024 ? `${b} bayt` : `${(b / 1024).toFixed(1).replace(".", ",")} kB`),
    kinds: {
      dir: "Klasör",
      md: "Markdown belgesi",
      txt: "Düz metin",
      url: "Web bağlantısı",
      pdf: "PDF belgesi",
      vcf: "Kişi kartı",
      html: "HTML sayfası",
      js: "JavaScript",
      file: "Dosya",
    },
    cats: { "Full-stack": "Full-stack", "AI/ML": "Yapay zekâ / ML", Systems: "Sistemler", Security: "Güvenlik", Web: "Web" },
  },
}

type Kind = keyof typeof en.kinds
type Loc = { path: string; cat?: Category }

const ICONS: Record<Kind, [LucideIcon, string]> = {
  dir: [Folder, "text-orange-400 fill-orange-500/20"],
  md: [FileText, "text-white/70"],
  txt: [FileText, "text-white/55"],
  url: [Globe, "text-amber-300"],
  pdf: [FileBadge2, "text-rose-400"],
  vcf: [Contact, "text-orange-300"],
  html: [FileCode2, "text-white/60"],
  js: [FileCode2, "text-amber-200/80"],
  file: [File, "text-white/45"],
}

const CAT_DOT: Record<Category, string> = {
  "Full-stack": "bg-orange-500",
  "AI/ML": "bg-amber-400",
  Systems: "bg-amber-600",
  Security: "bg-rose-500",
  Web: "bg-orange-300",
}

function kindOf(n: FsNode): Kind {
  if (n.kind === "dir") return "dir"
  const i = n.name.lastIndexOf(".")
  const ext = i > 0 ? n.name.slice(i + 1).toLowerCase() : ""
  return ext in ICONS && ext !== "dir" && ext !== "file" ? (ext as Kind) : "file"
}

/** A project folder's README meta (category, featured, blurb, stack). */
function projectMeta(n: FsNode) {
  if (n.kind !== "dir") return undefined
  const r = n.children.find((c) => c.name === "README.md")
  return r?.kind === "file" ? r.meta : undefined
}

const join = (dir: string, name: string) => (dir === "/" ? `/${name}` : `${dir}/${name}`)

/** The absolute path of `p` if it is a directory, else null. */
function dirPath(fs: FsDir, p?: string) {
  if (!p) return null
  const abs = resolvePath(HOME, p)
  return lookup(fs, abs)?.kind === "dir" ? abs : null
}

/** First segment of `from` below `to`, so going up/back re-selects the folder you came from. */
function childOf(from: string, to: string) {
  const base = to === "/" ? "/" : `${to}/`
  return from.startsWith(base) ? from.slice(base.length).split("/")[0] || null : null
}

/** Breadcrumb segments: "~" for home, "/" otherwise. */
function crumbs(path: string) {
  const inHome = path === HOME || path.startsWith(`${HOME}/`)
  const root = inHome ? HOME : ""
  const parts = path.slice(root.length).split("/").filter(Boolean)
  return [
    { label: inHome ? "~" : "/", path: inHome ? HOME : "/" },
    ...parts.map((p, i) => ({ label: p, path: `${root}/${parts.slice(0, i + 1).join("/")}` })),
  ]
}

function IconBtn({
  label,
  onClick,
  disabled,
  pressed,
  children,
}: {
  label: string
  onClick: () => void
  disabled?: boolean
  pressed?: boolean
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onClick}
      className={`${FOCUS} grid h-7 w-7 shrink-0 place-items-center rounded-md transition-colors disabled:pointer-events-none disabled:opacity-30 [&_svg]:h-4 [&_svg]:w-4 ${
        pressed ? "bg-white/10 text-white" : "text-white/65 hover:bg-white/[0.07] hover:text-white"
      }`}
    >
      {children}
    </button>
  )
}

export default function Files({ windowId, args }: AppProps) {
  const os = useOS()
  const t = useT(STR)
  const uid = useId()
  const listRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const crumbRef = useRef<HTMLOListElement>(null)

  const [hist, setHist] = useState<{ stack: Loc[]; i: number }>(() => ({ stack: [{ path: dirPath(os.fs, args.path) ?? HOME }], i: 0 }))
  const [seenArgs, setSeenArgs] = useState(args)
  const [sel, setSel] = useState<string | null>(null)
  const [view, setView] = useState<"grid" | "list">("grid")
  const [showHidden, setShowHidden] = useState(false)
  const loc = hist.stack[hist.i]

  const go = (next: Loc) => {
    if (next.path === loc.path && next.cat === loc.cat) return
    setHist((h) => ({ stack: [...h.stack.slice(0, h.i + 1), next], i: h.i + 1 }))
    setSel(childOf(loc.path, next.path))
  }
  const step = (d: -1 | 1) => {
    const next = hist.stack[hist.i + d]
    if (!next) return
    setHist((h) => ({ ...h, i: h.i + d }))
    setSel(childOf(loc.path, next.path))
  }
  const up = () => {
    if (loc.path !== "/") go({ path: resolvePath(loc.path, "..") })
  }

  // A relaunch into this window hands us a new args object: follow it, even back to the same folder.
  if (args !== seenArgs) {
    setSeenArgs(args)
    const p = dirPath(os.fs, args.path)
    if (p) go({ path: p })
  }

  const node = useMemo(() => lookup(os.fs, loc.path), [os.fs, loc.path])
  const dir = node?.kind === "dir" ? node : null
  const entries = useMemo(
    () => (dir ? listDir(dir, showHidden).filter((n) => !loc.cat || projectMeta(n)?.category === loc.cat) : []),
    [dir, showHidden, loc.cat],
  )
  const selIdx = sel === null ? -1 : entries.findIndex((n) => n.name === sel)
  const selNode = selIdx >= 0 ? entries[selIdx] : null
  const projectsView = loc.path === PROJECTS
  const catLabel = (c: string) => t.cats[c as Category] ?? c

  const title = loc.cat ? catLabel(loc.cat) : loc.path === HOME ? t.home : basename(loc.path)
  // setTitle is stable (dispatch-backed) and a no-op when unchanged, so this can't loop
  const { setTitle } = os
  useEffect(() => setTitle(windowId, title), [setTitle, windowId, title])

  // Focus the item list on open so the keyboard works right away.
  useEffect(() => listRef.current?.focus({ preventScroll: true }), [])

  // New location: back to the top, breadcrumb scrolled to its end.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 })
    const ol = crumbRef.current
    if (ol) ol.scrollLeft = ol.scrollWidth
  }, [loc.path, loc.cat])

  useEffect(() => {
    if (selIdx >= 0) document.getElementById(`${uid}-${selIdx}`)?.scrollIntoView({ block: "nearest" })
  }, [uid, selIdx, loc.path])

  const open = (n: FsNode) => {
    const abs = join(loc.path, n.name)
    if (n.kind === "dir") go({ path: abs })
    else os.openPath(abs)
  }

  const info = (n: FsNode) => {
    if (n.kind === "dir") return t.items(listDir(n, showHidden).length)
    if (n.open) return t.opensIn(APPS[n.open.app].title[os.lang])
    if (n.href) {
      try {
        return new URL(n.href).hostname
      } catch {
        return n.href
      }
    }
    return n.body ? t.size(new TextEncoder().encode(n.body).length) : ""
  }

  const onRootKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.ctrlKey || e.metaKey) return
    const act = (
      {
        "Alt+ArrowLeft": () => step(-1),
        "Alt+ArrowRight": () => step(1),
        "Alt+ArrowUp": up,
        Backspace: () => step(-1),
      } as Record<string, (() => void) | undefined>
    )[e.altKey ? `Alt+${e.key}` : e.key]
    if (!act) return
    e.preventDefault()
    act()
  }

  const onListKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return
    if (e.key === "Enter") {
      if (selNode) {
        e.preventDefault()
        open(selNode)
      }
      return
    }
    const last = entries.length - 1
    if (last < 0) return
    const grid = view === "grid"
    const cols = grid && listRef.current ? getComputedStyle(listRef.current).gridTemplateColumns.split(" ").length : 1
    const delta = ({ ArrowDown: cols, ArrowUp: -cols, ArrowRight: grid ? 1 : 0, ArrowLeft: grid ? -1 : 0 } as Record<string, number>)[e.key]
    let next: number
    if (e.key === "Home") next = 0
    else if (e.key === "End") next = last
    else if (delta) next = selIdx < 0 ? 0 : Math.min(last, Math.max(0, selIdx + delta))
    else return
    e.preventDefault()
    setSel(entries[next].name)
  }

  const places: { key: string; label: string; icon: ReactNode; active: boolean; onClick: () => void }[] = [
    { label: t.home, path: HOME, Icon: House },
    { label: t.projects, path: PROJECTS, Icon: FolderGit2 },
    { label: t.experience, path: `${HOME}/experience`, Icon: Briefcase },
    { label: t.writing, path: `${HOME}/writing`, Icon: Newspaper },
    { label: t.trash, path: `${TRASH}/files`, Icon: Trash2 },
  ].map(({ label, path, Icon }) => ({
    key: path,
    label,
    icon: <Icon aria-hidden className="h-4 w-4 shrink-0" />,
    active: !loc.cat && loc.path === path,
    onClick: () => go({ path }),
  }))
  const cats = CATS.map((c) => ({
    key: c,
    label: t.cats[c],
    icon: <span aria-hidden className={`h-2 w-2 shrink-0 rounded-full ${CAT_DOT[c]}`} />,
    active: loc.cat === c,
    onClick: () => go({ path: PROJECTS, cat: c }),
  }))

  const sideBtn = (p: (typeof places)[number]) => (
    <button
      key={p.key}
      type="button"
      onClick={p.onClick}
      aria-current={p.active ? "page" : undefined}
      className={`${FOCUS} flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left text-[13px] transition-colors ${
        p.active ? "bg-orange-500/15 text-white" : "text-white/60 hover:bg-white/[0.05] hover:text-white/90"
      }`}
    >
      {p.icon}
      <span className="truncate">{p.label}</span>
    </button>
  )
  const chip = (p: (typeof places)[number]) => (
    <button
      key={p.key}
      type="button"
      onClick={p.onClick}
      aria-current={p.active ? "page" : undefined}
      className={`${FOCUS} inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-colors [&_svg]:h-3.5 [&_svg]:w-3.5 ${
        p.active ? "border-orange-500/45 bg-orange-500/15 text-white" : "border-white/10 text-white/60 hover:border-white/25 hover:text-white"
      }`}
    >
      {p.icon}
      {p.label}
    </button>
  )

  const listCols = "grid-cols-[minmax(0,1fr)_7.5rem] @xl:grid-cols-[minmax(0,1.1fr)_9rem_minmax(0,1fr)]"

  const item = (n: FsNode, i: number) => {
    const selected = i === selIdx
    const meta = projectsView ? projectMeta(n) : undefined
    const featured = meta?.featured === "true"
    const kind = kindOf(n)
    const [Icon, tint] = ICONS[kind]
    const star = featured && (
      <>
        <Star aria-hidden className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" />
        <span className="sr-only">{t.featured}</span>
      </>
    )
    const base = {
      id: `${uid}-${i}`,
      role: "option",
      "aria-selected": selected,
      onClick: () => (os.isMobile ? open(n) : setSel(n.name)),
      onDoubleClick: () => open(n),
    } as const
    const state = selected
      ? "bg-orange-500/15 text-white group-focus-visible:ring-2 group-focus-visible:ring-orange-400/70"
      : "text-white/75 hover:bg-white/[0.05]"
    const dim = n.name.startsWith(".") ? "opacity-55" : ""

    if (view === "list")
      return (
        <div key={n.name} {...base} className={`grid cursor-default select-none items-center gap-3 rounded-md px-2.5 py-1.5 text-[13px] ${listCols} ${state} ${dim}`}>
          <span className="flex min-w-0 items-center gap-2.5">
            <Icon aria-hidden strokeWidth={1.6} className={`h-4 w-4 shrink-0 ${tint}`} />
            <span className="truncate">{n.name}</span>
            {star}
          </span>
          <span className="truncate text-white/45">{meta?.category ? catLabel(meta.category) : t.kinds[kind]}</span>
          <span className="hidden truncate text-white/40 @xl:block">{meta?.blurb ?? info(n)}</span>
        </div>
      )

    if (projectsView)
      return (
        <div
          key={n.name}
          {...base}
          className={`flex cursor-default select-none items-start gap-3 rounded-xl border p-3 text-left transition-colors ${
            selected
              ? "border-orange-500/45 bg-orange-500/[0.12] group-focus-visible:ring-2 group-focus-visible:ring-orange-400/70"
              : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
          } ${dim}`}
        >
          <FolderGit2 aria-hidden strokeWidth={1.4} className="mt-0.5 h-9 w-9 shrink-0 fill-orange-500/15 text-orange-400" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="truncate font-mono text-[13px] text-white/90">{n.name}</span>
              {star}
            </div>
            {meta?.category && (
              <span className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[11px] text-white/60">
                <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${CAT_DOT[meta.category as Category] ?? "bg-white/40"}`} />
                {catLabel(meta.category)}
              </span>
            )}
            {meta?.blurb && <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-white/50">{meta.blurb}</p>}
          </div>
        </div>
      )

    return (
      <div key={n.name} {...base} className={`flex cursor-default select-none flex-col items-center gap-1.5 rounded-lg px-1.5 py-2.5 text-center ${state} ${dim}`}>
        <Icon aria-hidden strokeWidth={1.3} className={`h-11 w-11 ${tint}`} />
        <span className="line-clamp-2 text-xs leading-snug [overflow-wrap:anywhere]">{n.name}</span>
      </div>
    )
  }

  return (
    <div className="@container flex h-full min-h-0 flex-col text-white" onKeyDown={onRootKey}>
      {/* toolbar */}
      <div className="flex shrink-0 items-center gap-1 border-b border-white/10 bg-white/[0.02] px-2 py-1.5">
        <IconBtn label={t.back} onClick={() => step(-1)} disabled={hist.i === 0}>
          <ArrowLeft />
        </IconBtn>
        <IconBtn label={t.forward} onClick={() => step(1)} disabled={hist.i === hist.stack.length - 1}>
          <ArrowRight />
        </IconBtn>
        <IconBtn label={t.up} onClick={up} disabled={loc.path === "/"}>
          <ArrowUp />
        </IconBtn>

        <nav aria-label={t.location} className="mx-1 min-w-0 flex-1">
          <ol
            ref={crumbRef}
            className="flex items-center overflow-x-auto rounded-md border border-white/10 bg-black/20 px-1 py-0.5 [scrollbar-width:none]"
          >
            {crumbs(loc.path).map((c, i, all) => {
              const current = i === all.length - 1 && !loc.cat
              return (
                <li key={c.path} className="flex shrink-0 items-center">
                  {i > 0 && <ChevronRight aria-hidden className="h-3.5 w-3.5 text-white/25" />}
                  <button
                    type="button"
                    onClick={() => go({ path: c.path })}
                    aria-current={current ? "location" : undefined}
                    title={c.path === HOME ? t.home : undefined}
                    className={`${FOCUS} rounded px-1.5 py-0.5 font-mono text-xs transition-colors ${
                      current ? "text-white" : "text-white/55 hover:bg-white/[0.06] hover:text-white"
                    }`}
                  >
                    <span aria-hidden={c.path === HOME}>{c.label}</span>
                    {c.path === HOME && <span className="sr-only">{t.home}</span>}
                  </button>
                </li>
              )
            })}
            {loc.cat && (
              <li className="flex shrink-0 items-center">
                <ChevronRight aria-hidden className="h-3.5 w-3.5 text-white/25" />
                <span aria-current="location" className="ml-0.5 inline-flex items-center gap-1 rounded-full bg-orange-500/15 px-2 py-0.5 text-xs text-orange-200">
                  <Tag aria-hidden className="h-3 w-3" />
                  {catLabel(loc.cat)}
                </span>
              </li>
            )}
          </ol>
        </nav>

        <IconBtn label={t.showHidden} pressed={showHidden} onClick={() => setShowHidden((v) => !v)}>
          <Eye />
        </IconBtn>
        <div role="group" aria-label={t.viewMode} className="flex shrink-0 gap-0.5">
          <IconBtn label={t.grid} pressed={view === "grid"} onClick={() => setView("grid")}>
            <LayoutGrid />
          </IconBtn>
          <IconBtn label={t.list} pressed={view === "list"} onClick={() => setView("list")}>
            <List />
          </IconBtn>
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* sidebar (wide windows) */}
        <nav aria-label={t.places} className="hidden w-48 shrink-0 flex-col gap-0.5 overflow-y-auto border-r border-white/10 bg-white/[0.015] p-2 @2xl:flex">
          {places.map(sideBtn)}
          <div role="group" aria-labelledby={`${uid}-cats`} className="mt-4 flex flex-col gap-0.5">
            <p id={`${uid}-cats`} className="mb-1 px-2.5 text-[11px] font-medium uppercase tracking-wider text-white/35">
              {t.categories}
            </p>
            {cats.map(sideBtn)}
          </div>
        </nav>

        <div className="flex min-w-0 flex-1 flex-col">
          {/* places as a chip row (narrow windows) */}
          <nav aria-label={t.places} className="flex shrink-0 gap-1.5 overflow-x-auto border-b border-white/10 px-2 py-1.5 [scrollbar-width:none] @2xl:hidden">
            {places.map(chip)}
            <span aria-hidden className="mx-0.5 w-px shrink-0 self-stretch bg-white/10" />
            {cats.map(chip)}
          </nav>

          {dir && view === "list" && (
            <div
              aria-hidden
              className={`mx-2 mt-2 grid shrink-0 gap-3 overflow-y-hidden border-b border-white/10 px-2.5 pb-1.5 text-[11px] font-medium uppercase tracking-wider text-white/35 [scrollbar-gutter:stable] ${listCols}`}
            >
              <span>{t.name}</span>
              <span>{t.kind}</span>
              <span className="hidden @xl:block">{t.info}</span>
            </div>
          )}

          <div ref={scrollRef} className="relative min-h-0 flex-1 overflow-auto [scrollbar-gutter:stable]">
            {dir ? (
              <>
                <div
                  ref={listRef}
                  role="listbox"
                  aria-label={title}
                  aria-activedescendant={selIdx >= 0 ? `${uid}-${selIdx}` : undefined}
                  tabIndex={0}
                  onKeyDown={onListKey}
                  onClick={(e) => e.target === e.currentTarget && setSel(null)}
                  className={`group min-h-full outline-none ${selIdx < 0 ? "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-orange-400/50" : ""} ${
                    view === "list"
                      ? "flex flex-col gap-px p-2"
                      : projectsView
                        ? "grid grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] content-start gap-2 p-3"
                        : "grid grid-cols-[repeat(auto-fill,minmax(6.5rem,1fr))] content-start gap-1 p-3"
                  }`}
                >
                  {entries.map(item)}
                </div>
                {entries.length === 0 && (
                  <div className="pointer-events-none absolute inset-0 grid place-items-center p-6 text-center">
                    <div>
                      <FolderOpen aria-hidden strokeWidth={1.2} className="mx-auto h-12 w-12 text-white/20" />
                      <p className="mt-3 text-sm text-white/50">{t.empty}</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="grid h-full place-items-center p-6 text-center">
                <div>
                  <FolderX aria-hidden strokeWidth={1.2} className="mx-auto h-12 w-12 text-white/25" />
                  <p className="mt-3 text-sm text-white/70">{t.missing}</p>
                  <p className="mt-1 font-mono text-xs text-white/40 [overflow-wrap:anywhere]">{loc.path}</p>
                  <button
                    type="button"
                    onClick={() => go({ path: HOME })}
                    className={`${FOCUS} mt-4 inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/80 transition-colors hover:border-white/30 hover:text-white`}
                  >
                    <House aria-hidden className="h-3.5 w-3.5" />
                    {t.goHome}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* status bar */}
          <div className="flex shrink-0 items-center gap-3 border-t border-white/10 bg-white/[0.02] px-3 py-1 text-[11px] text-white/45">
            <span className="shrink-0">
              {t.items(entries.length)}
              {loc.cat ? ` · ${t.filtered(catLabel(loc.cat))}` : ""}
            </span>
            {selNode && (
              <span className="ml-auto min-w-0 truncate">
                {t.selected(selNode.name)}
                {info(selNode) ? ` · ${info(selNode)}` : ""}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
