"use client"

import { useEffect, useRef, useState } from "react"

import { Reveal } from "@/components/v2/reveal"
import { profile } from "@/data/content"

interface Seg {
  type: "cmd" | "out"
  text: string
}

const SCRIPT: { cmd: string; out: string[] }[] = [
  { cmd: "whoami", out: ["Halil Utku Demirtaş — backend & devops-leaning fullstack engineer"] },
  { cmd: "cat stack.txt", out: ["Node.js · NestJS · Spring Boot · PostgreSQL · Redis · Docker · CI/CD"] },
  { cmd: "ls projects/", out: ["okut-gitsin  reveil  costsight  penpick  mips16  used-car-platform"] },
  { cmd: "echo $CONTACT", out: [profile.email] },
]

export function Terminal() {
  const [segs, setSegs] = useState<Seg[]>([])
  const [typing, setTyping] = useState("")
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

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
          setSegs((s) => [
            ...s,
            { type: "cmd" as const, text: c.cmd },
            ...c.out.map((o) => ({ type: "out" as const, text: o })),
          ])
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
  }, [])

  return (
    <section className="relative mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Reveal>
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/60 backdrop-blur-sm">
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
            <span className="ml-2 font-mono text-xs text-white/40">utku@urthella — zsh</span>
          </div>
          <div className="min-h-[13rem] p-5 font-mono text-sm leading-relaxed">
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
          </div>
        </div>
      </Reveal>
    </section>
  )
}
