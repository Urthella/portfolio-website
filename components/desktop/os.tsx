"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from "react"

import { APPS } from "@/components/desktop/apps"
import { buildFS, displayPath, HOME, lookup, resolvePath, type FsDir, type FsNode } from "@/components/desktop/fs"
import type { AppArgs, AppId, Rect, WindowState } from "@/components/desktop/types"
import { useContent, useLang, type Lang } from "@/data/i18n"

/**
 * utkuOS window manager state. The shell renders it; apps talk to it through
 * useOS() (open other apps, retitle their window, close themselves).
 * Window coordinates are relative to the work area the shell reports via
 * setBounds (below the top bar, beside the dock).
 */

type Size = { w: number; h: number }

interface State {
  windows: WindowState[]
  top: number // highest z handed out so far
  seq: number // window id counter
}

type Action =
  | { type: "open"; app: AppId; args: AppArgs; bounds: Size; reuse?: boolean }
  | { type: "close"; id: string }
  | { type: "focus"; id: string }
  | { type: "minimize"; id: string }
  | { type: "toggleMax"; id: string }
  | { type: "rect"; id: string; rect: Partial<Rect> }
  | { type: "title"; id: string; title: string }
  | { type: "fit"; bounds: Size }

const MARGIN = 8

function clampRect(r: Rect, b: Size): Rect {
  const w = Math.min(r.w, Math.max(240, b.w - MARGIN * 2))
  const h = Math.min(r.h, Math.max(160, b.h - MARGIN * 2))
  return {
    w,
    h,
    // keep at least the title bar reachable
    x: Math.min(Math.max(r.x, MARGIN - w + 120), b.w - 120),
    y: Math.min(Math.max(r.y, 0), b.h - 40),
  }
}

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "open": {
      const def = APPS[a.app]
      // single-window apps always reuse; `reuse` (e.g. opening a folder) retargets the topmost window of that app
      const same = s.windows.filter((w) => w.app === a.app)
      const existing = def.single || a.reuse ? same.reduce<WindowState | undefined>((t, w) => (!t || w.z > t.z ? w : t), undefined) : undefined
      if (existing) {
        return {
          ...s,
          top: s.top + 1,
          windows: s.windows.map((w) => (w.id === existing.id ? { ...w, args: a.args, minimized: false, z: s.top + 1 } : w)),
        }
      }
      const n = s.windows.length % 6
      const w = Math.min(def.size.w, a.bounds.w - MARGIN * 2)
      const h = Math.min(def.size.h, a.bounds.h - MARGIN * 2)
      const rect = clampRect(
        {
          w,
          h,
          x: Math.round((a.bounds.w - w) / 2) + (n - 2) * 28,
          y: Math.round((a.bounds.h - h) / 2) + (n - 2) * 24,
        },
        a.bounds,
      )
      const win: WindowState = {
        id: `${a.app}-${s.seq + 1}`,
        app: a.app,
        args: a.args,
        ...rect,
        x: Math.max(MARGIN, rect.x),
        y: Math.max(0, rect.y),
        z: s.top + 1,
        minimized: false,
        maximized: false,
      }
      return { windows: [...s.windows, win], top: s.top + 1, seq: s.seq + 1 }
    }
    case "close":
      return { ...s, windows: s.windows.filter((w) => w.id !== a.id) }
    case "focus":
      return {
        ...s,
        top: s.top + 1,
        windows: s.windows.map((w) => (w.id === a.id ? { ...w, minimized: false, z: s.top + 1 } : w)),
      }
    case "minimize":
      return { ...s, windows: s.windows.map((w) => (w.id === a.id ? { ...w, minimized: true } : w)) }
    case "toggleMax":
      return {
        ...s,
        top: s.top + 1,
        windows: s.windows.map((w) => (w.id === a.id ? { ...w, maximized: !w.maximized, minimized: false, z: s.top + 1 } : w)),
      }
    case "rect":
      return { ...s, windows: s.windows.map((w) => (w.id === a.id ? { ...w, ...a.rect } : w)) }
    case "title":
      if (s.windows.find((w) => w.id === a.id)?.title === a.title) return s
      return { ...s, windows: s.windows.map((w) => (w.id === a.id ? { ...w, title: a.title } : w)) }
    case "fit":
      return { ...s, windows: s.windows.map((w) => ({ ...w, ...clampRect(w, a.bounds) })) }
  }
}

export interface OS {
  windows: WindowState[]
  /** Topmost visible window, or null when the desktop itself has focus. */
  focusedId: string | null
  /**
   * Open an app (or focus it, if it is single-window). With `reuse`, an existing
   * window of that app is retargeted with the new args instead of a new one opening.
   */
  open: (app: AppId, args?: AppArgs, opts?: { reuse?: boolean }) => void
  close: (id: string) => void
  focus: (id: string) => void
  minimize: (id: string) => void
  toggleMaximize: (id: string) => void
  setRect: (id: string, rect: Partial<Rect>) => void
  setTitle: (id: string, title: string) => void
  /** Work-area size in px; the shell reports it. */
  bounds: Size
  setBounds: (b: Size) => void
  /** Phone-sized viewport: the shell shows one full-screen app at a time. */
  isMobile: boolean
  lang: Lang
  /** The virtual filesystem in the active language. */
  fs: FsDir
  /**
   * Open whatever lives at `path` (absolute, ~/..., or relative to cwd):
   * folders open in Files, .url shortcuts open the link, files with an app
   * hint open that app, any other file opens in the Text Editor.
   * Returns false when nothing exists at that path.
   */
  openPath: (path: string, cwd?: string) => boolean
}

const Ctx = createContext<OS | null>(null)

export function useOS(): OS {
  const os = useContext(Ctx)
  if (!os) throw new Error("useOS must be used inside <OSProvider>")
  return os
}

/** Pick the active language's strings: `const t = useT({ en: {...}, tr: {...} })`. */
export function useT<T>(dict: Record<Lang, T>): T {
  return dict[useLang().lang]
}

/** The FS node at an absolute path, in the active language (null if missing). */
export function useNode(abs: string): FsNode | null {
  const { fs } = useOS()
  return useMemo(() => lookup(fs, abs), [fs, abs])
}

export function OSProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { windows: [], top: 0, seq: 0 })
  const [bounds, setBoundsState] = useState<Size>({ w: 1200, h: 720 })
  const [isMobile, setIsMobile] = useState(false)
  const { lang } = useLang()
  const content = useContent()
  const fs = useMemo(() => buildFS(content, lang), [content, lang])

  useEffect(() => {
    // landscape phones too, so rotating never swaps the shell (which would remount every app)
    const mq = window.matchMedia("(max-width: 767px), (pointer: coarse) and (max-height: 500px)")
    const sync = () => setIsMobile(mq.matches)
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [])

  // open() reads the latest work area from a ref so it stays stable and never places windows with stale bounds
  const boundsRef = useRef(bounds)
  const open = useCallback(
    (app: AppId, args: AppArgs = {}, opts?: { reuse?: boolean }) =>
      dispatch({ type: "open", app, args, bounds: boundsRef.current, reuse: opts?.reuse }),
    [],
  )

  const setBounds = useCallback((b: Size) => {
    boundsRef.current = b
    setBoundsState((prev) => (prev.w === b.w && prev.h === b.h ? prev : b))
    dispatch({ type: "fit", bounds: b })
  }, [])

  const openPath = useCallback(
    (path: string, cwd: string = HOME) => {
      const abs = resolvePath(cwd, path)
      const node = lookup(fs, abs)
      if (!node) return false
      if (node.kind === "dir") open("files", { path: abs }, { reuse: true })
      else if (node.href) window.open(node.href, "_blank", "noopener,noreferrer")
      else if (node.open) open(node.open.app, { ...node.open.args, path: abs })
      else open("text", { path: abs })
      return true
    },
    [fs, open],
  )

  // Deep links: /desktop?app=terminal or /desktop?path=~/projects (once, even under StrictMode's double effects)
  const deepLinked = useRef(false)
  useEffect(() => {
    if (deepLinked.current) return
    deepLinked.current = true
    const q = new URLSearchParams(window.location.search)
    const app = q.get("app") as AppId | null
    const path = q.get("path")
    if (path) openPath(path)
    else if (app && Object.hasOwn(APPS, app)) open(app)
    // run once on mount, after the first bounds report
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const focusedId = useMemo(() => {
    const visible = state.windows.filter((w) => !w.minimized)
    return visible.length ? visible.reduce((a, b) => (b.z > a.z ? b : a)).id : null
  }, [state.windows])

  // dispatch is stable, so these never change identity: apps can safely list them as effect deps
  const actions = useMemo(
    () => ({
      close: (id: string) => dispatch({ type: "close", id }),
      focus: (id: string) => dispatch({ type: "focus", id }),
      minimize: (id: string) => dispatch({ type: "minimize", id }),
      toggleMaximize: (id: string) => dispatch({ type: "toggleMax", id }),
      setRect: (id: string, rect: Partial<Rect>) => dispatch({ type: "rect", id, rect }),
      setTitle: (id: string, title: string) => dispatch({ type: "title", id, title }),
    }),
    [],
  )

  const os = useMemo<OS>(
    () => ({ windows: state.windows, focusedId, open, ...actions, bounds, setBounds, isMobile, lang, fs, openPath }),
    [state.windows, focusedId, open, actions, bounds, setBounds, isMobile, lang, fs, openPath],
  )

  return <Ctx.Provider value={os}>{children}</Ctx.Provider>
}

export { displayPath }
