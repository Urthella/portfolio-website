"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

import { OS } from "@/components/desktop/fs"
import { useT } from "@/components/desktop/os"
import { UtkuMark } from "@/components/desktop/ui"

// [ok, text]: ok lines get the green systemd "[  OK  ]" prefix. A log, so English only.
const LINES: [boolean, string][] = [
  [false, `[    0.000000] Linux version 6.11.0-utkuos (utku@${OS.codename.toLowerCase()}) #${OS.version} SMP PREEMPT_DYNAMIC`],
  [false, "[    0.412893] systemd[1]: Detected architecture x86-64."],
  [false, `[    0.418201] systemd[1]: Hostname set to <${OS.hostname}>.`],
  [true, "Started systemd-journald.service - Journal Service."],
  [true, `Mounted home-${OS.user}.mount - /home/${OS.user}.`],
  [true, "Started docker.service - Docker Application Container Engine."],
  [true, "Started postgresql@16-main.service - PostgreSQL Cluster 16-main."],
  [true, "Started redis-server.service - Advanced key-value store."],
  [true, "Started nestjs.service - NestJS API."],
  [true, "Started spring-boot.service - Spring Boot API."],
  [true, "Started nginx.service - A high performance web server and a reverse proxy server."],
  [true, "Started actions-runner.service - GitHub Actions Runner."],
  [true, "Reached target network-online.target - Network is Online."],
  [true, "Started utkuos-shell.service - utkuOS Desktop."],
  [true, "Reached target Portfolio."],
]

const TICKS = LINES.length + 3 // a short beat on the last line before the desktop appears
const STEP = 1600 / TICKS

const STR = {
  en: { starting: "utkuOS is starting", skip: "Press any key to skip" },
  tr: { starting: "utkuOS başlatılıyor", skip: "Geçmek için herhangi bir tuşa basın" },
}

/** Fake systemd boot log. Any key or pointer press skips it. */
export function Boot({ onDone }: { onDone: () => void }) {
  const [n, setN] = useState(0)
  const t = useT(STR)

  useEffect(() => {
    const timer = window.setInterval(() => setN((v) => v + 1), STEP)
    // Armed a beat later, so the Enter that picked "Restart" doesn't skip the boot it started.
    const arm = window.setTimeout(() => {
      window.addEventListener("keydown", onDone)
      window.addEventListener("pointerdown", onDone)
    }, 250)
    return () => {
      clearInterval(timer)
      clearTimeout(arm)
      window.removeEventListener("keydown", onDone)
      window.removeEventListener("pointerdown", onDone)
    }
  }, [onDone])

  useEffect(() => {
    if (n >= TICKS) onDone()
  }, [n, onDone])

  const progress = Math.min(1, n / LINES.length)

  return (
    <motion.div
      key="boot"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      aria-busy="true"
      className="fixed inset-0 z-[300] cursor-default select-none overflow-hidden bg-[#050507] font-mono text-[10px] leading-[1.7] text-white/70 sm:text-xs"
    >
      <p className="sr-only" role="status">
        {t.starting}. {t.skip}.
      </p>

      <div aria-hidden className="p-4 sm:p-6">
        {LINES.slice(0, n).map(([ok, text], i) => (
          <div key={i} className="truncate whitespace-pre">
            {ok && (
              <>
                [<span className="text-emerald-400">{"  OK  "}</span>]{" "}
              </>
            )}
            {text}
          </div>
        ))}
        {n < LINES.length && <span className="inline-block h-3.5 w-2 animate-pulse bg-white/70 align-middle" />}
      </div>

      <div aria-hidden className="absolute inset-x-0 bottom-[14%] flex flex-col items-center gap-4">
        <UtkuMark className="h-14 w-14" />
        <div className="font-sans text-sm font-medium text-white/80">
          {OS.name} <span className="font-normal text-white/40">{OS.version} {OS.codename}</span>
        </div>
        <div className="h-1 w-40 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-orange-400 transition-[width] duration-100 ease-linear" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>

      <p aria-hidden className="absolute inset-x-0 bottom-5 text-center font-sans text-[11px] text-white/30">
        {t.skip}
      </p>
    </motion.div>
  )
}
