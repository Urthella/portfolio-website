"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ArrowLeft, ArrowUpRight, BatteryFull, Wifi } from "lucide-react"
import Link from "next/link"

import { APP_IDS, APPS } from "@/components/desktop/apps"
import { OS } from "@/components/desktop/fs"
import { useOS, useT } from "@/components/desktop/os"
import { AppTile, focusRing, LOCALE, useNow } from "@/components/desktop/ui"
import { AppBody } from "@/components/desktop/window"
import { useLang } from "@/data/i18n"
import { EASE } from "@/lib/motion"
import { cn } from "@/lib/utils"

const STR = {
  en: { apps: "Applications", back: "Back", site: "Back to site", lang: "Türkçe'ye geç" },
  tr: { apps: "Uygulamalar", back: "Geri", site: "Siteye dön", lang: "Switch to English" },
}

const LAUNCHER = APP_IDS.filter((id) => id !== "text")

/** Phone layout: a home screen of app icons; the topmost window runs full-screen over it. */
export function MobileShell() {
  const os = useOS()
  const { lang, setLang } = useLang()
  const t = useT(STR)
  const now = useNow()
  const reduce = useReducedMotion()
  const loc = LOCALE[lang]

  const visible = os.windows.filter((w) => !w.minimized)
  const top = visible.length ? visible.reduce((a, b) => (b.z > a.z ? b : a)) : null

  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="relative z-30 flex h-7 shrink-0 items-center justify-between bg-black/40 px-4 text-xs font-medium text-white/85 backdrop-blur-md">
        <span className="tabular-nums">{now?.toLocaleTimeString(loc, { hour: "2-digit", minute: "2-digit" })}</span>
        <span className="flex items-center gap-1.5">
          {OS.name}
          <Wifi aria-hidden className="h-3.5 w-3.5" />
          <BatteryFull aria-hidden className="h-3.5 w-3.5" />
        </span>
      </div>

      <main inert={!!top} className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-6">
        <div className="pb-8 pt-10 text-center">
          <p className="text-6xl font-light tabular-nums tracking-tight text-white/95">
            {now ? now.toLocaleTimeString(loc, { hour: "2-digit", minute: "2-digit" }) : " "}
          </p>
          <p className="mt-1 text-sm capitalize text-white/60">
            {now ? now.toLocaleDateString(loc, { weekday: "long", day: "numeric", month: "long" }) : " "}
          </p>
        </div>

        <h2 className="sr-only">{t.apps}</h2>
        <ul className="grid grid-cols-4 gap-x-2 gap-y-6">
          {LAUNCHER.map((id) => (
            <li key={id}>
              <button
                type="button"
                onClick={() => os.open(id)}
                className={cn("flex w-full flex-col items-center gap-1.5 rounded-2xl p-1 active:scale-95 motion-reduce:active:scale-100", focusRing)}
              >
                <AppTile id={id} className="h-14 w-14 rounded-2xl" />
                <span className="line-clamp-2 text-center text-[11px] leading-tight text-white/85 [text-shadow:0_1px_2px_rgba(0,0,0,0.8)]">
                  {APPS[id].title[lang]}
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-center justify-center gap-2 pt-10">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-4 py-2 text-sm text-white/85 backdrop-blur-md transition-colors hover:bg-white/10",
              focusRing,
            )}
          >
            {t.site}
            <ArrowUpRight aria-hidden className="h-4 w-4 text-orange-400" />
          </Link>
          <button
            type="button"
            onClick={() => setLang(lang === "en" ? "tr" : "en")}
            aria-label={t.lang}
            className={cn("flex items-center gap-1 rounded-full border border-white/15 bg-black/40 px-3 py-2 font-mono text-xs backdrop-blur-md", focusRing)}
          >
            <span className={lang === "en" ? "text-orange-400" : "text-white/40"}>EN</span>
            <span className="text-white/25">/</span>
            <span className={lang === "tr" ? "text-orange-400" : "text-white/40"}>TR</span>
          </button>
        </div>
      </main>

      <AnimatePresence>
        {os.windows.map((w) => {
          const title = w.title ?? APPS[w.app].title[lang]
          const shown = w.id === top?.id
          return (
            <motion.section
              key={w.id}
              role="dialog"
              aria-label={title}
              initial={reduce ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 28 }}
              transition={reduce ? { duration: 0 } : { duration: 0.22, ease: EASE }}
              // hidden, not unmounted: windows below the top one keep their state
              style={{ zIndex: w.z, display: shown ? undefined : "none" }}
              className="absolute inset-x-0 bottom-0 top-7 flex flex-col bg-[#0c0c10]"
            >
              <div className="flex h-12 shrink-0 items-center gap-2 border-b border-white/10 bg-[#16161b] px-1.5">
                <button
                  type="button"
                  onClick={() => os.close(w.id)}
                  aria-label={t.back}
                  className={cn("grid h-10 w-10 place-items-center rounded-full text-white/85 hover:bg-white/10", focusRing)}
                >
                  <ArrowLeft aria-hidden className="h-5 w-5" />
                </button>
                <AppTile id={w.app} className="h-6 w-6 rounded-md" />
                <h1 className="min-w-0 truncate text-[15px] font-medium text-white/90">{title}</h1>
              </div>
              <div className="relative min-h-0 flex-1 overflow-hidden">
                <AppBody app={w.app} windowId={w.id} args={w.args} />
              </div>
            </motion.section>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
