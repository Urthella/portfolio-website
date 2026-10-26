"use client"

import { AnimatePresence, motion, MotionConfig, useReducedMotion } from "framer-motion"
import { ContactRound, File, Folder, Trash2, type LucideIcon } from "lucide-react"
import { useCallback, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react"

import { Boot } from "@/components/desktop/boot"
import { Dock } from "@/components/desktop/dock"
import { TRASH } from "@/components/desktop/fs"
import { MobileShell } from "@/components/desktop/mobile"
import { OSProvider, useOS, useT } from "@/components/desktop/os"
import { Overview } from "@/components/desktop/overview"
import { TopBar } from "@/components/desktop/top-bar"
import { focusRing } from "@/components/desktop/ui"
import { Wallpaper } from "@/components/desktop/wallpaper"
import { Window } from "@/components/desktop/window"
import { LangProvider } from "@/data/i18n"
import { PerfProvider } from "@/hooks/use-perf"
import { cn } from "@/lib/utils"

const BOOTED_KEY = "utkuos-booted" // sessionStorage: boot log already shown this session

type Phase = "pending" | "boot" | "done"

const STR = {
  en: { desktop: "Desktop", icons: "Desktop icons", trash: "Trash" },
  tr: { desktop: "Masaüstü", icons: "Masaüstü simgeleri", trash: "Çöp Kutusu" },
}

/** utkuOS: the portfolio as a small GNOME-flavoured Linux desktop. */
export function Desktop() {
  return (
    <LangProvider>
      <PerfProvider measure={false}>
        <OSProvider>
          <MotionConfig reducedMotion="user">
            <Shell />
          </MotionConfig>
        </OSProvider>
      </PerfProvider>
    </LangProvider>
  )
}

function Shell() {
  const os = useOS()
  const t = useT(STR)
  const reduce = useReducedMotion()
  const [phase, setPhase] = useState<Phase>("pending")
  const [overview, setOverview] = useState(false)
  const workRef = useRef<HTMLElement>(null)
  const { open, setBounds, isMobile } = os

  // Boot log once per browser session, never under reduced motion.
  useEffect(() => {
    let booted = false
    try {
      booted = sessionStorage.getItem(BOOTED_KEY) === "1"
    } catch {}
    setPhase(booted || window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "done" : "boot")
  }, [])

  const finishBoot = useCallback(() => {
    try {
      sessionStorage.setItem(BOOTED_KEY, "1")
    } catch {}
    setPhase("done")
  }, [])

  // First impression: an empty desktop opens the README, so visitors see who this is.
  // A deep link (?app= / ?path=) has already opened a window by now.
  const greet = () => !os.isMobile && os.windows.length === 0 && os.openPath("~/README.md")
  useEffect(() => {
    if (phase === "done") greet()
    // only on the transition into "done"
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  const restart = () => {
    for (const w of os.windows) os.close(w.id)
    setOverview(false)
    if (!reduce) setPhase("boot")
    else if (!os.isMobile) os.openPath("~/README.md")
  }

  const closeOverview = useCallback(() => setOverview(false), [])
  const toggleOverview = useCallback(() => setOverview((v) => !v), [])

  // Report the work area (right of the dock, below the top bar) to the window manager.
  useEffect(() => {
    const el = workRef.current
    if (!el) return
    const report = () => setBounds({ w: el.clientWidth, h: el.clientHeight })
    report() // now, so the first window (README / deep link) is placed for the real screen
    const ro = new ResizeObserver(report)
    ro.observe(el)
    return () => ro.disconnect()
  }, [setBounds, isMobile])

  // Ctrl+Alt+T: terminal (the classic Linux shortcut). Alt+F1: overview, as in GNOME.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // AltGr reports as Ctrl+Alt on Windows and AltGr+T types the lira sign on the Turkish Q layout: leave it alone
      if (e.ctrlKey && e.altKey && e.code === "KeyT" && !e.getModifierState("AltGraph")) {
        e.preventDefault()
        setOverview(false)
        open("terminal")
      } else if (e.altKey && e.key === "F1" && !isMobile) {
        e.preventDefault()
        setOverview((v) => !v)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, isMobile])

  return (
    <div lang={os.lang} className="fixed inset-x-0 top-0 z-[200] h-dvh overflow-hidden overscroll-none bg-[#07070a] text-white">
      <Wallpaper />

      {isMobile ? (
        <MobileShell />
      ) : (
        <>
          <TopBar overview={overview} onActivities={toggleOverview} onRestart={restart} />
          <Dock onShowApps={toggleOverview} appsOpen={overview} />
          <main ref={workRef} aria-label={t.desktop} className="absolute bottom-0 left-16 right-0 top-8 isolate">
            <DesktopIcons />
            <AnimatePresence>
              {os.windows.map((w) => (
                <Window key={w.id} win={w} focused={w.id === os.focusedId} />
              ))}
            </AnimatePresence>
          </main>
          <AnimatePresence>{overview && <Overview onClose={closeOverview} />}</AnimatePresence>
        </>
      )}

      <AnimatePresence>
        {phase === "boot" && <Boot key="boot" onDone={finishBoot} />}
        {phase === "pending" && (
          <motion.div key="pending" exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 z-[300] bg-[#050507]" />
        )}
      </AnimatePresence>
    </div>
  )
}

interface Icon {
  id: string
  label: string
  Glyph: LucideIcon
  glyph: string
  /** File-type badge on the page glyph. */
  badge?: [text: string, cls: string]
  path?: string
}

function DesktopIcons() {
  const os = useOS()
  const t = useT(STR)
  const [sel, setSel] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  const icons: Icon[] = [
    { id: "readme", label: "README.md", path: "~/README.md", Glyph: File, glyph: "text-white/85 fill-white/[0.07]", badge: ["MD", "bg-orange-500"] },
    { id: "projects", label: "projects", path: "~/projects", Glyph: Folder, glyph: "text-orange-400 fill-orange-400/25" },
    { id: "resume", label: "resume.pdf", path: "~/resume.pdf", Glyph: File, glyph: "text-white/85 fill-white/[0.07]", badge: ["PDF", "bg-rose-500"] },
    { id: "contact", label: "contact.vcf", path: "~/contact.vcf", Glyph: ContactRound, glyph: "text-amber-400 fill-amber-400/15" },
    { id: "trash", label: t.trash, Glyph: Trash2, glyph: "text-white/70 fill-white/[0.05]" },
  ]

  // A click anywhere else clears the selection.
  useEffect(() => {
    if (!sel) return
    const off = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setSel(null)
    document.addEventListener("pointerdown", off)
    return () => document.removeEventListener("pointerdown", off)
  }, [sel])

  const launch = (icon: Icon) => {
    if (icon.path) os.openPath(icon.path)
    else os.open("files", { path: `${TRASH}/files` })
  }

  const onKey = (e: ReactKeyboardEvent<HTMLButtonElement>, i: number) => {
    if (e.key === "Enter") {
      e.preventDefault()
      launch(icons[i])
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault()
      const next = (i + (e.key === "ArrowDown" ? 1 : icons.length - 1)) % icons.length
      ref.current?.querySelectorAll<HTMLElement>("button")[next]?.focus()
      setSel(icons[next].id)
    }
  }

  return (
    <div ref={ref} role="group" aria-label={t.icons} className="absolute left-3 top-3 flex flex-col gap-1">
      {icons.map((icon, i) => {
        const selected = sel === icon.id
        return (
          <button
            key={icon.id}
            type="button"
            onClick={() => setSel(icon.id)}
            onDoubleClick={() => launch(icon)}
            onKeyDown={(e) => onKey(e, i)}
            onFocus={() => setSel(icon.id)}
            className={cn(
              "flex w-[92px] flex-col items-center gap-1 rounded-lg p-1.5 select-none",
              selected ? "bg-orange-500/20" : "hover:bg-white/[0.07]",
              focusRing,
            )}
          >
            <span className="relative grid h-12 w-12 place-items-center">
              <icon.Glyph aria-hidden className={cn("h-11 w-11 drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]", icon.glyph)} strokeWidth={1.25} />
              {icon.badge && (
                <span
                  aria-hidden
                  className={cn("absolute bottom-2 left-1/2 -translate-x-1/2 rounded-[3px] px-1 text-[8px] font-bold leading-3 text-white", icon.badge[1])}
                >
                  {icon.badge[0]}
                </span>
              )}
            </span>
            <span
              className={cn(
                "max-w-full break-words rounded px-1 text-center text-xs leading-tight text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.9)]",
                selected && "bg-orange-500/35 [text-shadow:none]",
              )}
            >
              {icon.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
