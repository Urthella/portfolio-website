"use client"

import { useEffect, useMemo, useRef, useState } from "react"

import { Reveal } from "@/components/v2/reveal"
import { profile } from "@/data/content"
import { useContent } from "@/data/i18n"

interface Seg {
  type: "cmd" | "out"
  text: string
}

const toSegs = (c: { cmd: string; out: string[] }): Seg[] => [
  { type: "cmd", text: c.cmd },
  ...c.out.map((o) => ({ type: "out" as const, text: o })),
]

function Transcript({ segs, typing }: { segs: Seg[]; typing: string }) {
  return (
    <>
      {segs.map((s, i) =>
        s.type === "cmd" ? (
          <div key={i} className="text-white/90">
            <span className="text-orange-500">➜</span> <span className="text-emerald-400">~</span> {s.text}
          </div>
        ) : (
          <div key={i} className="pl-4 text-white/50">
            {s.text}
          </div>
        ),
      )}
      <div className="text-white/90">
        <span className="text-orange-500">➜</span> <span className="text-emerald-400">~</span> {typing}
        <span className="ml-0.5 inline-block h-4 w-[7px] animate-pulse bg-white/70 align-middle" />
      </div>
    </>
  )
}

export function Terminal() {
  const whoami = useContent().ui.terminal.whoami
  const [segs, setSegs] = useState<Seg[]>([])
  const [typing, setTyping] = useState("")
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  const SCRIPT = useMemo<{ cmd: string; out: string[] }[]>(
    () => [
      { cmd: "whoami", out: [whoami] },
      { cmd: "cat stack.txt", out: ["Node.js · NestJS · Spring Boot · PostgreSQL · Redis · Docker · CI/CD"] },
      { cmd: "ls projects/", out: ["okut-gitsin  reveil  costsight  penpick  mips16  used-car-platform"] },
      { cmd: "echo $CONTACT", out: [profile.email] },
    ],
    [whoami],
  )
  const finished = useMemo(() => SCRIPT.flatMap(toSegs), [SCRIPT])

  useEffect(() => {
    let cancelled = false
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        const t = setTimeout(resolve, ms)
        timers.current.push(t)
      })

    const run = async () => {
      while (!cancelled) {
        setSegs([])
        setTyping("")
        for (const c of SCRIPT) {
          for (let i = 1; i <= c.cmd.length; i++) {
            if (cancelled) return
            setTyping(c.cmd.slice(0, i))
            await wait(45)
          }
          if (cancelled) return
          await wait(280)
          setSegs((s) => [...s, ...toSegs(c)])
          setTyping("")
          await wait(650)
        }
        await wait(2400)
      }
    }
    void run()

    return () => {
      cancelled = true
      timers.current.forEach(clearTimeout)
      timers.current = []
    }
  }, [SCRIPT])

  return (
    <section className="relative mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Reveal>
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/60 backdrop-blur-sm">
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#f87171]/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
            <span className="ml-2 font-mono text-xs text-white/40">utku@utkudem1rtas : zsh</span>
          </div>
          {/* The finished transcript sits invisibly in the same grid cell, so the box is always its final size and never grows while typing. */}
          <div className="grid p-5 font-mono text-sm leading-relaxed">
            <div aria-hidden className="invisible col-start-1 row-start-1">
              <Transcript segs={finished} typing="" />
            </div>
            <div className="col-start-1 row-start-1">
              <Transcript segs={segs} typing={typing} />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
