"use client"

import { motion, useReducedMotion } from "framer-motion"
import { Copy, Minus, Square, X } from "lucide-react"
import {
  lazy,
  memo,
  Suspense,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type LazyExoticComponent,
  type PointerEvent as ReactPointerEvent,
} from "react"

import { APP_IDS, APPS } from "@/components/desktop/apps"
import { useOS, useT } from "@/components/desktop/os"
import type { AppId, AppProps, Rect, WindowState } from "@/components/desktop/types"
import { AppTile, focusRing } from "@/components/desktop/ui"
import { ErrorBoundary } from "@/components/v2/error-boundary"
import { useLang } from "@/data/i18n"
import { EASE } from "@/lib/motion"
import { cn } from "@/lib/utils"

const MIN_W = 360
const MIN_H = 220
const HEADER = 40
/** Pixels of header that must stay inside the work area horizontally. */
const GRIP = 120

// One lazy component per app, made once at module scope: lazy() during render would remount the app every render.
const LAZY = Object.fromEntries(APP_IDS.map((id) => [id, lazy(APPS[id].load)])) as Record<
  AppId,
  LazyExoticComponent<ComponentType<AppProps>>
>

const STR = {
  en: {
    loading: "Loading",
    crashed: "This app crashed.",
    crashedHint: "The rest of utkuOS is fine. Close the window and open it again.",
    minimize: "Minimize",
    maximize: "Maximize",
    restore: "Restore",
    close: "Close",
  },
  tr: {
    loading: "Yükleniyor",
    crashed: "Bu uygulama çöktü.",
    crashedHint: "utkuOS'un geri kalanı sağlam. Pencereyi kapatıp yeniden açabilirsiniz.",
    minimize: "Küçült",
    maximize: "Büyüt",
    restore: "Eski boyutuna getir",
    close: "Kapat",
  },
}

function Spinner() {
  const t = useT(STR)
  return (
    <div role="status" aria-label={t.loading} className="grid h-full place-items-center">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/15 border-t-orange-400 motion-reduce:animate-none" />
    </div>
  )
}

function Crashed({ windowId }: { windowId: string }) {
  const t = useT(STR)
  const { close } = useOS()
  return (
    <div role="alert" className="grid h-full place-items-center p-6 text-center">
      <div className="max-w-xs space-y-3">
        <p className="text-sm font-medium text-white/90">{t.crashed}</p>
        <p className="text-xs leading-relaxed text-white/50">{t.crashedHint}</p>
        <button
          type="button"
          onClick={() => close(windowId)}
          className={cn("rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/80 transition-colors hover:bg-white/10", focusRing)}
        >
          {t.close}
        </button>
      </div>
    </div>
  )
}

/**
 * An app's content: lazily loaded, behind its own error boundary so one
 * crashing app can't take the desktop down. Memoised so dragging a window
 * (local state in the frame) doesn't re-render the app inside it.
 */
export const AppBody = memo(function AppBody({ app, windowId, args }: AppProps & { app: AppId }) {
  const App = LAZY[app]
  return (
    <ErrorBoundary fallback={<Crashed windowId={windowId} />}>
      <Suspense fallback={<Spinner />}>
        <App windowId={windowId} args={args} />
      </Suspense>
    </ErrorBoundary>
  )
})

type Dir = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw"

interface Gesture {
  kind: "move" | Dir
  px: number
  py: number
  start: Rect
  area: DOMRect
  /** The rect currently shown; committed to the OS on release. */
  rect: Rect | null
  /** The window was maximized when the drag began (and hasn't been torn off yet). */
  fromMax: boolean
  snap: boolean
}

const HANDLES: [Dir, string][] = [
  ["n", "-top-1 inset-x-3 h-2 cursor-ns-resize"],
  ["s", "-bottom-1 inset-x-3 h-2 cursor-ns-resize"],
  ["e", "-right-1 inset-y-3 w-2 cursor-ew-resize"],
  ["w", "-left-1 inset-y-3 w-2 cursor-ew-resize"],
  ["nw", "-left-1 -top-1 h-3.5 w-3.5 cursor-nwse-resize"],
  ["se", "-bottom-1 -right-1 h-3.5 w-3.5 cursor-nwse-resize"],
  ["ne", "-right-1 -top-1 h-3.5 w-3.5 cursor-nesw-resize"],
  ["sw", "-bottom-1 -left-1 h-3.5 w-3.5 cursor-nesw-resize"],
]

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), Math.max(lo, hi))

export function Window({ win, focused }: { win: WindowState; focused: boolean }) {
  const os = useOS()
  const { lang } = useLang()
  const t = useT(STR)
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const gesture = useRef<Gesture | null>(null)
  const [live, setLive] = useState<Rect | null>(null)
  const [snap, setSnap] = useState(false)

  const title = win.title ?? APPS[win.app].title[lang]
  const max = win.maximized && !live
  const rect = live ?? win

  // Keyboard focus follows window focus (new windows, dock clicks, the next window after a close),
  // unless focus is already inside, e.g. an app that focused its own input.
  useEffect(() => {
    const el = ref.current
    if (focused && el && !el.contains(document.activeElement)) el.focus({ preventScroll: true })
  }, [focused, win.z])

  const begin = (kind: Gesture["kind"]) => (e: ReactPointerEvent<HTMLElement>) => {
    if (e.button !== 0 || (kind === "move" && (e.target as HTMLElement).closest("button"))) return
    if (kind !== "move" && win.maximized) return
    const area = ref.current?.parentElement?.getBoundingClientRect()
    if (!area) return
    e.currentTarget.setPointerCapture(e.pointerId)
    gesture.current = {
      kind,
      px: e.clientX,
      py: e.clientY,
      start: { x: win.x, y: win.y, w: win.w, h: win.h },
      area,
      rect: null,
      fromMax: win.maximized,
      snap: false,
    }
  }

  const move = (e: ReactPointerEvent<HTMLElement>) => {
    const g = gesture.current
    if (!g) return
    const dx = e.clientX - g.px
    const dy = e.clientY - g.py
    let r: Rect

    if (g.kind === "move") {
      if (g.fromMax) {
        if (Math.hypot(dx, dy) < 8) return
        // Tear the window off the maximized layout, keeping the grab point under the pointer.
        const ratio = (g.px - g.area.left) / g.area.width
        g.start = { ...g.start, x: Math.round(g.px - g.area.left - ratio * g.start.w), y: 0 }
        g.fromMax = false
        os.toggleMaximize(win.id)
      }
      r = {
        ...g.start,
        x: Math.round(clamp(g.start.x + dx, GRIP - g.start.w, g.area.width - GRIP)),
        y: Math.round(clamp(g.start.y + dy, 0, g.area.height - HEADER)),
      }
      const touchesTop = e.clientY <= g.area.top + 1
      if (touchesTop !== g.snap) {
        g.snap = touchesTop
        setSnap(touchesTop)
      }
    } else {
      const o = g.start
      let { x, y, w, h } = o
      if (g.kind.includes("e")) w = Math.max(MIN_W, o.w + dx)
      if (g.kind.includes("s")) h = Math.max(MIN_H, o.h + dy)
      if (g.kind.includes("w")) {
        w = Math.max(MIN_W, o.w - dx)
        x = o.x + o.w - w
      }
      if (g.kind.includes("n")) {
        y = clamp(o.y + dy, 0, o.y + o.h - MIN_H)
        h = o.y + o.h - y
      }
      r = { x: Math.round(x), y: Math.round(y), w: Math.round(w), h: Math.round(h) }
    }
    g.rect = r
    setLive(r)
  }

  const end = () => {
    const g = gesture.current
    if (!g) return
    gesture.current = null
    if (g.rect) {
      if (g.snap) {
        // Dropped on the top edge: maximize, and restore to where the drag began.
        os.setRect(win.id, g.start)
        os.toggleMaximize(win.id)
      } else os.setRect(win.id, g.rect)
    }
    setLive(null)
    setSnap(false)
  }

  const handlers = (kind: Gesture["kind"]) => ({
    onPointerDown: begin(kind),
    onPointerMove: move,
    onPointerUp: end,
    onPointerCancel: end,
  })

  const btn = cn(
    "grid h-6 w-6 place-items-center rounded-full transition-colors",
    focused ? "text-white/75 hover:bg-white/15 hover:text-white" : "text-white/40 hover:bg-white/10 hover:text-white/80",
    focusRing,
  )

  const geometry = max ? { left: 0, top: 0, width: "100%", height: "100%" } : { left: rect.x, top: rect.y, width: rect.w, height: rect.h }

  return (
    <>
      {snap && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-1.5 rounded-xl border border-orange-400/50 bg-orange-500/10"
          style={{ zIndex: win.z }}
        />
      )}
      <motion.div
        ref={ref}
        role="dialog"
        aria-label={title}
        tabIndex={-1}
        inert={win.minimized}
        onPointerDownCapture={() => !focused && os.focus(win.id)}
        onFocusCapture={() => !focused && !win.minimized && os.focus(win.id)}
        initial={reduce ? false : { opacity: 0, scale: 0.94 }}
        animate={
          win.minimized
            ? { opacity: 0, scale: 0.8, y: 40, transitionEnd: { visibility: "hidden" } }
            : { opacity: 1, scale: 1, y: 0, visibility: "visible" }
        }
        exit={{ opacity: 0, scale: 0.94 }}
        transition={reduce ? { duration: 0 } : { duration: 0.2, ease: EASE }}
        style={{
          ...geometry,
          zIndex: win.z,
          // animate maximize/restore/snap, but never lag behind a drag
          transition: live || reduce ? "none" : "left .2s, top .2s, width .2s, height .2s",
        }}
        className="absolute outline-none"
      >
        <div
          className={cn(
            "flex h-full flex-col overflow-hidden border bg-[#0c0c10] transition-[border-color,box-shadow] duration-150",
            max ? "rounded-none border-transparent" : "rounded-xl",
            focused
              ? "border-white/[0.14] shadow-[0_28px_70px_-12px_rgba(0,0,0,0.85),0_0_0_1px_rgba(0,0,0,0.4)]"
              : "border-white/[0.07] shadow-[0_14px_36px_-14px_rgba(0,0,0,0.7)]",
          )}
        >
          <div
            {...handlers("move")}
            onDoubleClick={(e) => !(e.target as HTMLElement).closest("button") && os.toggleMaximize(win.id)}
            className={cn(
              "grid h-10 shrink-0 touch-none select-none grid-cols-[88px_minmax(0,1fr)_88px] items-center border-b px-2.5 transition-colors",
              focused ? "border-white/10 bg-[#1b1b21]" : "border-white/[0.05] bg-[#131317]",
            )}
          >
            <AppTile id={win.app} className={cn("h-5 w-5 rounded-md transition-opacity", !focused && "opacity-50")} />
            <span className={cn("truncate text-center text-[13px] font-medium", focused ? "text-white/90" : "text-white/45")}>
              {title}
            </span>
            <div className="flex items-center justify-end gap-1.5">
              <button type="button" onClick={() => os.minimize(win.id)} aria-label={t.minimize} title={t.minimize} className={btn}>
                <Minus aria-hidden className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => os.toggleMaximize(win.id)}
                aria-label={win.maximized ? t.restore : t.maximize}
                title={win.maximized ? t.restore : t.maximize}
                className={btn}
              >
                {win.maximized ? <Copy aria-hidden className="h-3 w-3" /> : <Square aria-hidden className="h-3 w-3" />}
              </button>
              <button
                type="button"
                onClick={() => os.close(win.id)}
                aria-label={t.close}
                title={t.close}
                className={cn(btn, "bg-white/10 hover:bg-orange-500 hover:text-white")}
              >
                <X aria-hidden className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="relative min-h-0 flex-1 overflow-hidden">
            <AppBody app={win.app} windowId={win.id} args={win.args} />
          </div>
        </div>

        {!win.maximized &&
          HANDLES.map(([dir, cls]) => <div key={dir} aria-hidden {...handlers(dir)} className={cn("absolute z-10 touch-none", cls)} />)}
      </motion.div>
    </>
  )
}
