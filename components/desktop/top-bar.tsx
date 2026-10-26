"use client"

import { BatteryFull, ChevronLeft, ChevronRight, Info, LogOut, Power, RotateCcw, Volume2, Wifi } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react"

import { APPS } from "@/components/desktop/apps"
import { OS } from "@/components/desktop/fs"
import { useOS, useT } from "@/components/desktop/os"
import { AppTile, focusRing, LOCALE, useNow } from "@/components/desktop/ui"
import { profile } from "@/data/content"
import { useLang } from "@/data/i18n"
import { cn } from "@/lib/utils"

const STR = {
  en: {
    activities: "Activities",
    calendar: "Calendar",
    prev: "Previous month",
    next: "Next month",
    today: "Today",
    lang: "Türkçe'ye geç",
    system: "System menu",
    about: "About utkuOS",
    restart: "Restart",
    logout: "Log out",
    logoutHint: "Back to the website",
  },
  tr: {
    activities: "Etkinlikler",
    calendar: "Takvim",
    prev: "Önceki ay",
    next: "Sonraki ay",
    today: "Bugün",
    lang: "Switch to English",
    system: "Sistem menüsü",
    about: "utkuOS hakkında",
    restart: "Yeniden başlat",
    logout: "Oturumu kapat",
    logoutHint: "Web sitesine dön",
  },
}

const pill = cn("flex h-6 items-center gap-1.5 rounded-full px-3 transition-colors hover:bg-white/10", focusRing)

type Menu = "calendar" | "power" | null

/** Arrow keys move between a menu's items. */
function menuKeys(e: ReactKeyboardEvent<HTMLElement>) {
  if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return
  e.preventDefault()
  const items = Array.from(e.currentTarget.querySelectorAll<HTMLElement>("[role=menuitem]"))
  const i = items.indexOf(document.activeElement as HTMLElement)
  items[(i + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length]?.focus()
}

function Calendar({ now }: { now: Date }) {
  const { lang } = useLang()
  const t = useT(STR)
  const [offset, setOffset] = useState(0)
  const loc = LOCALE[lang]

  const first = new Date(now.getFullYear(), now.getMonth() + offset, 1)
  const days = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate()
  const lead = (first.getDay() + 6) % 7 // Monday first
  // 1 Jan 2024 was a Monday
  const weekdays = Array.from({ length: 7 }, (_, i) => new Date(2024, 0, 1 + i).toLocaleDateString(loc, { weekday: "narrow" }))
  const isToday = (d: number) => offset === 0 && d === now.getDate()

  return (
    <div
      role="dialog"
      aria-label={t.calendar}
      className="absolute left-1/2 top-full mt-1.5 w-72 -translate-x-1/2 rounded-2xl border border-white/10 bg-neutral-900/95 p-4 text-white shadow-2xl shadow-black/60 backdrop-blur-xl"
    >
      <p className="text-xs font-medium text-white/50">{now.toLocaleDateString(loc, { weekday: "long" })}</p>
      <p className="mt-0.5 text-lg font-semibold">{now.toLocaleDateString(loc, { day: "numeric", month: "long", year: "numeric" })}</p>

      <div className="mt-4 flex items-center justify-between">
        <button type="button" onClick={() => setOffset((o) => o - 1)} aria-label={t.prev} className={cn("grid h-7 w-7 place-items-center rounded-full hover:bg-white/10", focusRing)}>
          <ChevronLeft aria-hidden className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => setOffset(0)}
          title={t.today}
          className={cn("rounded-full px-3 py-1 text-sm font-medium capitalize hover:bg-white/10", focusRing)}
        >
          {first.toLocaleDateString(loc, { month: "long", year: "numeric" })}
        </button>
        <button type="button" onClick={() => setOffset((o) => o + 1)} aria-label={t.next} className={cn("grid h-7 w-7 place-items-center rounded-full hover:bg-white/10", focusRing)}>
          <ChevronRight aria-hidden className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-2 grid grid-cols-7 gap-y-0.5 text-center text-xs tabular-nums">
        {weekdays.map((d, i) => (
          <span key={i} aria-hidden className="py-1 text-white/40">
            {d}
          </span>
        ))}
        {Array.from({ length: lead }, (_, i) => (
          <span key={`l${i}`} />
        ))}
        {Array.from({ length: days }, (_, i) => i + 1).map((d) => (
          <span
            key={d}
            aria-current={isToday(d) ? "date" : undefined}
            className={cn(
              "mx-auto grid h-8 w-8 place-items-center rounded-full",
              isToday(d) ? "bg-orange-500 font-semibold text-white" : "text-white/80",
            )}
          >
            {d}
          </span>
        ))}
      </div>
    </div>
  )
}

function PowerMenu({ onAbout, onRestart }: { onAbout: () => void; onRestart: () => void }) {
  const t = useT(STR)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    ref.current?.querySelector<HTMLElement>("[role=menuitem]")?.focus()
  }, [])

  const item = cn("flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-white/85 transition-colors hover:bg-white/10", focusRing)

  return (
    <div
      ref={ref}
      role="menu"
      aria-label={t.system}
      onKeyDown={menuKeys}
      className="absolute right-0 top-full mt-1.5 w-64 rounded-2xl border border-white/10 bg-neutral-900/95 p-2 text-white shadow-2xl shadow-black/60 backdrop-blur-xl"
    >
      <div className="flex items-center gap-3 px-2 pb-3 pt-1.5">
        <Image src="/PP.jpg" alt="" width={36} height={36} className="h-9 w-9 rounded-full object-cover ring-1 ring-white/15" />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{profile.name}</p>
          <p className="truncate font-mono text-[11px] text-white/45">
            {OS.user}@{OS.hostname}
          </p>
        </div>
      </div>
      <div className="mb-1 h-px bg-white/10" />
      <button type="button" role="menuitem" onClick={onAbout} className={item}>
        <Info aria-hidden className="h-4 w-4 text-white/60" />
        {t.about}
      </button>
      <button type="button" role="menuitem" onClick={onRestart} className={item}>
        <RotateCcw aria-hidden className="h-4 w-4 text-white/60" />
        {t.restart}
      </button>
      <Link href="/" role="menuitem" className={item}>
        <LogOut aria-hidden className="h-4 w-4 text-white/60" />
        <span className="flex-1">{t.logout}</span>
        <span className="text-[11px] text-white/35">{t.logoutHint}</span>
      </Link>
    </div>
  )
}

/** GNOME-style top bar: Activities + focused app, clock/calendar, language and system menu. */
export function TopBar({ overview, onActivities, onRestart }: { overview: boolean; onActivities: () => void; onRestart: () => void }) {
  const os = useOS()
  const { lang, setLang } = useLang()
  const t = useT(STR)
  const now = useNow()
  const [menu, setMenu] = useState<Menu>(null)
  const barRef = useRef<HTMLElement>(null)
  const triggers = useRef<Partial<Record<Exclude<Menu, null>, HTMLButtonElement | null>>>({})

  const focused = os.windows.find((w) => w.id === os.focusedId)
  const loc = LOCALE[lang]

  useEffect(() => {
    if (!menu) return
    const onDown = (e: PointerEvent) => !barRef.current?.contains(e.target as Node) && setMenu(null)
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      setMenu(null)
      triggers.current[menu]?.focus()
    }
    document.addEventListener("pointerdown", onDown)
    window.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("pointerdown", onDown)
      window.removeEventListener("keydown", onKey)
    }
  }, [menu])

  const toggle = (m: Exclude<Menu, null>) => setMenu((cur) => (cur === m ? null : m))

  return (
    <header
      ref={barRef}
      className="absolute inset-x-0 top-0 z-50 grid h-8 select-none grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center bg-black/80 px-1.5 text-[13px] font-medium text-white/90 backdrop-blur-xl"
    >
      <div className="flex min-w-0 items-center gap-1">
        <button type="button" onClick={onActivities} aria-pressed={overview} className={cn(pill, overview && "bg-white/15")}>
          {t.activities}
        </button>
        {focused && (
          <span className="flex min-w-0 items-center gap-2 px-2 text-white/75">
            <AppTile id={focused.app} className="h-4 w-4 rounded-[5px]" />
            <span className="truncate">{APPS[focused.app].title[lang]}</span>
          </span>
        )}
      </div>

      <div className="relative">
        <button
          type="button"
          ref={(el) => {
            triggers.current.calendar = el
          }}
          onClick={() => toggle("calendar")}
          aria-haspopup="dialog"
          aria-expanded={menu === "calendar"}
          className={cn(pill, "tabular-nums", menu === "calendar" && "bg-white/15")}
        >
          {now ? (
            <>
              <span className="hidden sm:inline">{now.toLocaleDateString(loc, { weekday: "short", day: "numeric", month: "short" })}</span>
              <span>{now.toLocaleTimeString(loc, { hour: "2-digit", minute: "2-digit" })}</span>
            </>
          ) : (
            <span className="invisible">00:00</span>
          )}
        </button>
        {menu === "calendar" && now && <Calendar now={now} />}
      </div>

      <div className="flex items-center justify-end gap-1">
        <button type="button" onClick={() => setLang(lang === "en" ? "tr" : "en")} aria-label={t.lang} title={t.lang} className={cn(pill, "px-2.5 font-mono text-xs")}>
          <span className={lang === "en" ? "text-orange-400" : "text-white/40"}>EN</span>
          <span className="text-white/25">/</span>
          <span className={lang === "tr" ? "text-orange-400" : "text-white/40"}>TR</span>
        </button>
        <div className="relative">
          <button
            type="button"
            ref={(el) => {
              triggers.current.power = el
            }}
            onClick={() => toggle("power")}
            aria-label={t.system}
            aria-haspopup="menu"
            aria-expanded={menu === "power"}
            className={cn(pill, "gap-2.5 text-white/85", menu === "power" && "bg-white/15")}
          >
            <Wifi aria-hidden className="h-3.5 w-3.5" />
            <Volume2 aria-hidden className="h-3.5 w-3.5" />
            <BatteryFull aria-hidden className="h-3.5 w-3.5" />
            <Power aria-hidden className="h-3.5 w-3.5" />
          </button>
          {menu === "power" && (
            <PowerMenu
              onAbout={() => {
                setMenu(null)
                os.open("settings", { pane: "about" })
              }}
              onRestart={() => {
                setMenu(null)
                onRestart()
              }}
            />
          )}
        </div>
      </div>
    </header>
  )
}
