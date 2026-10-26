"use client"

import { motion, useReducedMotion } from "framer-motion"
import { Search } from "lucide-react"
import { useState } from "react"

import { APP_IDS, APPS } from "@/components/desktop/apps"
import { slug } from "@/components/desktop/fs"
import { useOS, useT } from "@/components/desktop/os"
import type { AppId } from "@/components/desktop/types"
import { AppTile, focusRing } from "@/components/desktop/ui"
import { useLang } from "@/data/i18n"
import { EASE } from "@/lib/motion"
import { cn } from "@/lib/utils"

const STR = {
  en: { title: "Applications", search: "Type to search", empty: "No applications match." },
  tr: { title: "Uygulamalar", search: "Aramak için yazın", empty: "Eşleşen uygulama yok." },
}

/** Activities overview: dimmed full-screen app grid with type-to-search. */
export function Overview({ onClose }: { onClose: () => void }) {
  const os = useOS()
  const { lang } = useLang()
  const t = useT(STR)
  const reduce = useReducedMotion()
  const [q, setQ] = useState("")
  // whatever opened us (Activities, the dock, a shortcut) gets focus back on dismiss
  const [opener] = useState(() => document.activeElement as HTMLElement | null)

  // slug() folds Turkish letters, so "ozgecmis" finds "Özgeçmiş"; both languages' titles match.
  const needle = slug(q)
  const matches = APP_IDS.filter((id) => !needle || [id, APPS[id].title.en, APPS[id].title.tr].some((s) => slug(s).includes(needle)))

  const launch = (id: AppId) => {
    os.open(id) // the new window takes focus
    onClose()
  }

  const dismiss = () => {
    onClose()
    if (opener?.isConnected) opener.focus({ preventScroll: true })
  }

  return (
    <motion.div
      role="dialog"
      aria-label={t.title}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduce ? 0 : 0.18 }}
      onPointerDown={(e) => {
        if ((e.target as HTMLElement).closest("button, input")) return
        e.preventDefault() // keep the mousedown from blurring the opener we refocus
        dismiss()
      }}
      onKeyDown={(e) => e.key === "Escape" && dismiss()}
      className="absolute inset-x-0 bottom-0 top-8 z-40 flex flex-col items-center overflow-y-auto bg-black/60 px-6 pb-10 pt-[9vh] backdrop-blur-2xl"
    >
      <div className="relative w-full max-w-md">
        <Search aria-hidden className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/45" />
        <input
          autoFocus
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && matches[0] && launch(matches[0])}
          placeholder={t.search}
          aria-label={t.search}
          spellCheck={false}
          autoComplete="off"
          className="h-11 w-full rounded-full border border-white/10 bg-white/[0.07] pl-11 pr-4 text-sm text-white outline-none transition-colors placeholder:text-white/35 focus:border-orange-400/60 focus:bg-white/[0.09] [&::-webkit-search-cancel-button]:hidden"
        />
      </div>

      <motion.ul
        initial={reduce ? false : { scale: 0.96, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.24, ease: EASE }}
        className="mt-12 grid w-full max-w-4xl grid-cols-[repeat(auto-fill,minmax(104px,1fr))] gap-2 sm:gap-4"
      >
        {matches.map((id, i) => (
          <li key={id}>
            <button
              type="button"
              onClick={() => launch(id)}
              className={cn(
                "flex w-full flex-col items-center gap-2.5 rounded-2xl p-3 transition-colors hover:bg-white/[0.08]",
                needle && i === 0 && "bg-white/[0.08] ring-1 ring-orange-400/40",
                focusRing,
              )}
            >
              <AppTile id={id} className="h-16 w-16 rounded-2xl" />
              <span className="line-clamp-2 text-center text-[13px] leading-tight text-white/85">{APPS[id].title[lang]}</span>
            </button>
          </li>
        ))}
      </motion.ul>
      {matches.length === 0 && <p className="mt-12 text-sm text-white/45">{t.empty}</p>}
    </motion.div>
  )
}
