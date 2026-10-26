"use client"

import { useReducedMotion } from "framer-motion"
import {
  Activity,
  ChevronDown,
  ChevronUp,
  Cpu,
  ExternalLink,
  Github,
  ListTree,
  MemoryStick,
  RefreshCw,
  type LucideIcon,
} from "lucide-react"
import { useEffect, useId, useMemo, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react"

import { slug } from "@/components/desktop/fs"
import { useOS, useT } from "@/components/desktop/os"
import type { AppProps } from "@/components/desktop/types"
import { profile } from "@/data/content"
import { useContent } from "@/data/i18n"
import { cn } from "@/lib/utils"

const TABS = ["processes", "resources", "github"] as const
type Tab = (typeof TABS)[number]
const TAB_ICONS: Record<Tab, LucideIcon> = { processes: ListTree, resources: Activity, github: Github }

const focusRing = "outline-none focus-visible:ring-2 focus-visible:ring-orange-400/80"

const STR = {
  en: {
    tabs: { processes: "Processes", resources: "Resources", github: "GitHub" },
    tablist: "System Monitor views",
    cols: { name: "Process Name", status: "Status", cpu: "% CPU", mem: "Memory", group: "Group", pid: "PID" },
    running: "active (running)",
    summary: (n: number) => `${n} processes · all active`,
    cpuSub: "Coffee-powered (8 cores)",
    memTitle: "Memory",
    memSub: "Total: enough",
    ago: "60 s ago",
    now: "now",
    live: "live",
    paused: "paused",
    loading: "Loading contributions…",
    failed: "Couldn't reach GitHub right now.",
    retry: "Retry",
    less: "Less",
    more: "More",
  },
  tr: {
    tabs: { processes: "İşlemler", resources: "Kaynaklar", github: "GitHub" },
    tablist: "Sistem İzleyicisi görünümleri",
    cols: { name: "İşlem Adı", status: "Durum", cpu: "% CPU", mem: "Bellek", group: "Grup", pid: "PID" },
    running: "etkin (çalışıyor)",
    summary: (n: number) => `${n} işlem · hepsi etkin`,
    cpuSub: "Kahveyle çalışır (8 çekirdek)",
    memTitle: "Bellek",
    memSub: "Toplam: yeterince",
    ago: "60 sn önce",
    now: "şimdi",
    live: "canlı",
    paused: "duraklatıldı",
    loading: "Katkılar yükleniyor…",
    failed: "Şu an GitHub'a ulaşılamıyor.",
    retry: "Tekrar dene",
    less: "Az",
    more: "Çok",
  },
}

type Strings = (typeof STR)["en"]

// ---- liveness: tick only while the window is actually on screen ----

function subscribeVisibility(cb: () => void) {
  document.addEventListener("visibilitychange", cb)
  return () => document.removeEventListener("visibilitychange", cb)
}

function useLive(windowId: string) {
  const { windows, isMobile, focusedId } = useOS()
  const reduce = useReducedMotion()
  const pageVisible = useSyncExternalStore(subscribeVisibility, () => !document.hidden, () => false)
  const win = windows.find((w) => w.id === windowId)
  // phones show one full-screen app at a time: only the focused one is visible
  const onScreen = !!win && !win.minimized && (!isMobile || focusedId === windowId)
  return onScreen && pageVisible && !reduce
}

// ---- app ----

export default function Monitor({ windowId }: AppProps) {
  const t = useT(STR)
  const live = useLive(windowId)
  const [tab, setTab] = useState<Tab>("processes")
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const base = useId()

  const onKey = (e: KeyboardEvent) => {
    const i = TABS.indexOf(tab)
    const n = TABS.length
    const next =
      e.key === "ArrowRight" ? (i + 1) % n : e.key === "ArrowLeft" ? (i + n - 1) % n : e.key === "Home" ? 0 : e.key === "End" ? n - 1 : -1
    if (next < 0) return
    e.preventDefault()
    setTab(TABS[next])
    tabRefs.current[next]?.focus()
  }

  return (
    <div className="@container flex h-full min-h-0 flex-col text-white/90">
      <div className="flex shrink-0 justify-center border-b border-white/10 bg-white/[0.02] p-2">
        <div
          role="tablist"
          aria-label={t.tablist}
          onKeyDown={onKey}
          className="flex w-full gap-1 rounded-lg border border-white/10 bg-black/20 p-1 @lg:w-auto"
        >
          {TABS.map((id, i) => {
            const Icon = TAB_ICONS[id]
            const on = id === tab
            return (
              <button
                key={id}
                ref={(el) => {
                  tabRefs.current[i] = el
                }}
                type="button"
                role="tab"
                id={`${base}-tab-${id}`}
                aria-selected={on}
                aria-controls={`${base}-panel`}
                tabIndex={on ? 0 : -1}
                onClick={() => setTab(id)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors @lg:flex-none @lg:px-4",
                  focusRing,
                  on ? "bg-white/[0.09] text-white" : "text-white/55 hover:text-white/90",
                )}
              >
                <Icon className={cn("h-3.5 w-3.5 shrink-0", on ? "text-orange-400" : "text-white/40")} aria-hidden />
                {t.tabs[id]}
              </button>
            )
          })}
        </div>
      </div>

      <div
        role="tabpanel"
        id={`${base}-panel`}
        aria-labelledby={`${base}-tab-${tab}`}
        className="min-h-0 flex-1 overflow-auto"
      >
        {tab === "processes" && <Processes t={t} live={live} />}
        {tab === "resources" && <Resources t={t} live={live} />}
        {tab === "github" && <GitHubTab t={t} />}
      </div>
    </div>
  )
}

// ---- processes: the skill set as running services ----

/** FNV-1a: a stable 32-bit seed per name. */
function hash(s: string) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619)
  return h >>> 0
}

const DAEMONS: Record<string, string> = {
  redis: "redis-server",
  postgresql: "postgres",
  mongodb: "mongod",
  mysql: "mysqld",
  linux: "systemd",
}

// "NestJS" -> nestjs.service, "Node.js" -> nodejs.service, "Redis" -> redis-server
const unitName = (item: string) => {
  const s = slug(item.replace(/\./g, ""))
  return DAEMONS[s] ?? `${s}.service`
}

interface Proc {
  name: string
  group: string
  pid: number
  cpu0: number
  mem0: number
  phase: number
  speed: number
}

function buildProcs(groups: { label: string; items: string[] }[]): Proc[] {
  const seen = new Set<string>()
  const out: Proc[] = []
  for (const g of groups) {
    for (const item of g.items) {
      const name = unitName(item)
      if (seen.has(name)) continue
      seen.add(name)
      const h = hash(name)
      const a = (h & 0xffff) / 0xffff
      const b = (h >>> 16) / 0xffff
      out.push({
        name,
        group: g.label,
        pid: 300 + (h % 9700),
        cpu0: 0.3 + a * a * 11, // most services idle, a few busy
        mem0: 18 + b * 520, // MiB
        phase: a * Math.PI * 2,
        speed: 0.2 + b * 0.5,
      })
    }
  }
  return out
}

// gentle drift around each service's own baseline
const cpuAt = (p: Proc, tick: number) => Math.max(0.1, p.cpu0 * (1 + 0.4 * Math.sin(tick * p.speed + p.phase)))
const memAt = (p: Proc, tick: number) => p.mem0 * (1 + 0.03 * Math.sin(tick * p.speed * 0.5 + p.phase))

type SortKey = "name" | "group" | "cpu" | "mem" | "pid"

function Processes({ t, live }: { t: Strings; live: boolean }) {
  const groups = useContent().skillGroups
  const procs = useMemo(() => buildProcs(groups), [groups])
  const [tick, setTick] = useState(0)
  const [sort, setSort] = useState<{ key: SortKey; desc: boolean }>({ key: "cpu", desc: true })

  useEffect(() => {
    if (!live) return
    const id = window.setInterval(() => setTick((x) => x + 1), 2000)
    return () => window.clearInterval(id)
  }, [live])

  const rows = procs.map((p) => ({ ...p, cpu: cpuAt(p, tick), mem: memAt(p, tick) }))
  rows.sort((a, b) => {
    const k = sort.key
    const d = k === "name" || k === "group" ? a[k].localeCompare(b[k]) : a[k] - b[k]
    return sort.desc ? -d : d
  })

  const onSort = (key: SortKey) =>
    setSort((s) => (s.key === key ? { key, desc: !s.desc } : { key, desc: key !== "name" && key !== "group" }))

  const th = (key: SortKey, label: string, className = "", numeric = false) => {
    const on = sort.key === key
    const Arrow = sort.desc ? ChevronDown : ChevronUp
    return (
      <th
        scope="col"
        aria-sort={on ? (sort.desc ? "descending" : "ascending") : undefined}
        className={cn("px-3 py-2 font-medium", numeric ? "text-right" : "text-left", className)}
      >
        <button
          type="button"
          onClick={() => onSort(key)}
          className={cn(
            "inline-flex items-center gap-1 rounded transition-colors hover:text-white",
            focusRing,
            on ? "text-white/90" : "text-white/50",
            numeric && "flex-row-reverse",
          )}
        >
          {label}
          <Arrow className={cn("h-3 w-3", on ? "text-orange-400" : "invisible")} aria-hidden />
        </button>
      </th>
    )
  }

  return (
    <div className="min-w-0">
      <p className="flex items-center gap-2 px-3 pb-1 pt-3 text-xs text-white/45 @md:px-4">
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        {t.summary(rows.length)}
      </p>
      <table className="w-full table-fixed border-separate border-spacing-0 text-sm">
        <thead className="sticky top-0 z-10 bg-[#0b0b0f]/95 text-xs backdrop-blur">
          <tr className="[&>th]:border-b [&>th]:border-white/10">
            {th("name", t.cols.name, "@md:pl-4")}
            <th scope="col" className="hidden w-40 px-3 py-2 text-left font-medium text-white/50 @lg:table-cell">
              {t.cols.status}
            </th>
            {th("group", t.cols.group, "hidden w-36 @3xl:table-cell")}
            {th("cpu", t.cols.cpu, "w-20", true)}
            {th("mem", t.cols.mem, "w-28", true)}
            {th("pid", t.cols.pid, "hidden w-20 @2xl:table-cell @md:pr-4", true)}
          </tr>
        </thead>
        <tbody className="font-mono text-xs">
          {rows.map((p) => (
            <tr key={p.name} className="transition-colors hover:bg-white/[0.04]">
              <td className="truncate px-3 py-1.5 text-white/85 @md:pl-4" title={p.name}>
                {p.name}
              </td>
              <td className="hidden truncate px-3 py-1.5 text-emerald-300/80 @lg:table-cell">{t.running}</td>
              <td className="hidden truncate px-3 py-1.5 font-sans text-white/45 @3xl:table-cell">{p.group}</td>
              <td className="px-3 py-1.5 text-right tabular-nums text-white/75">{p.cpu.toFixed(1)}</td>
              <td className="whitespace-nowrap px-3 py-1.5 text-right tabular-nums text-white/75">{p.mem.toFixed(1)} MiB</td>
              <td className="hidden px-3 py-1.5 text-right tabular-nums text-white/40 @2xl:table-cell @md:pr-4">{p.pid}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ---- resources: fake CPU / memory history ----

const SAMPLES = 60

/** Mulberry32: deterministic history so the first paint is always the same. */
function prng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let r = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

// a mean-reverting random walk: smooth, never runs off the chart
const CPU = { mean: 28, vol: 14, lo: 3, hi: 96 }
const MEM = { mean: 61, vol: 1.4, lo: 40, hi: 88 }
const step = (v: number, m: typeof CPU, r: number) => Math.min(m.hi, Math.max(m.lo, v + (r - 0.5) * m.vol + (m.mean - v) * 0.08))

function history(m: typeof CPU, seed: number) {
  const rand = prng(seed)
  const out = [m.mean]
  while (out.length < SAMPLES) out.push(step(out[out.length - 1], m, rand()))
  return out
}

function Resources({ t, live }: { t: Strings; live: boolean }) {
  const [s, setS] = useState(() => ({ cpu: history(CPU, 7), mem: history(MEM, 11) }))

  useEffect(() => {
    if (!live) return
    const id = window.setInterval(() => {
      const r1 = Math.random()
      const r2 = Math.random()
      setS((p) => ({
        cpu: [...p.cpu.slice(1), step(p.cpu[p.cpu.length - 1], CPU, r1)],
        mem: [...p.mem.slice(1), step(p.mem[p.mem.length - 1], MEM, r2)],
      }))
    }, 1000)
    return () => window.clearInterval(id)
  }, [live])

  return (
    <div className="space-y-4 p-3 @md:p-4">
      <p className="flex items-center justify-end gap-2 text-xs text-white/45">
        <span
          aria-hidden
          className={cn("h-1.5 w-1.5 rounded-full", live ? "bg-emerald-400 motion-safe:animate-pulse" : "bg-white/30")}
        />
        {live ? t.live : t.paused}
      </p>
      <Graph t={t} icon={Cpu} title="CPU" sub={t.cpuSub} data={s.cpu} tone="text-orange-500" />
      <Graph t={t} icon={MemoryStick} title={t.memTitle} sub={t.memSub} data={s.mem} tone="text-rose-400" />
    </div>
  )
}

function Graph({
  t,
  icon: Icon,
  title,
  sub,
  data,
  tone,
}: {
  t: Strings
  icon: LucideIcon
  title: string
  sub: string
  data: number[]
  tone: string
}) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.03] p-3 @md:p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="flex items-center gap-2 text-sm font-medium text-white/90">
            <Icon className={cn("h-4 w-4", tone)} aria-hidden /> {title}
          </h3>
          <p className="mt-0.5 truncate text-xs text-white/45">{sub}</p>
        </div>
        <span className="font-mono text-2xl tabular-nums text-white">{Math.round(data[data.length - 1])}%</span>
      </div>
      <div className={cn("mt-3 h-24 @md:h-28", tone)}>
        <Sparkline data={data} />
      </div>
      <div className="mt-1 flex justify-between font-mono text-[10px] text-white/35">
        <span>{t.ago}</span>
        <span>{t.now}</span>
      </div>
    </section>
  )
}

function Sparkline({ data }: { data: number[] }) {
  const gid = `spark${useId().replace(/[^a-zA-Z0-9]/g, "")}`
  const w = data.length - 1
  const y = (v: number) => 100 - v
  // quadratic segments through the midpoints: smooth without overshoot
  let d = `M0,${y(data[0])}`
  for (let i = 1; i < w; i++) d += ` Q${i},${y(data[i])} ${i + 0.5},${(y(data[i]) + y(data[i + 1])) / 2}`
  d += ` L${w},${y(data[w])}`

  return (
    <svg viewBox={`0 0 ${w} 100`} preserveAspectRatio="none" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.32" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[25, 50, 75].map((g) => (
        <line key={g} x1="0" x2={w} y1={g} y2={g} stroke="white" strokeOpacity="0.07" vectorEffect="non-scaling-stroke" />
      ))}
      <path d={`${d} L${w},100 L0,100 Z`} fill={`url(#${gid})`} />
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

// ---- github: stats + contribution heatmap ----

interface Day {
  date: string
  count: number
  level: number
}
interface Heat {
  days: Day[]
  total: number
}

const HEAT_URL = "https://github-contributions-api.jogruber.de/v4/Urthella?y=last"
const LEVELS = ["bg-white/[0.05]", "bg-orange-500/25", "bg-orange-500/45", "bg-orange-500/70", "bg-orange-400"]

// one request per page load, shared by every visit to the tab; a failure clears it so Retry refetches
let heatCache: Promise<Heat> | null = null
let heatData: Heat | null = null

function loadHeat(): Promise<Heat> {
  heatCache ??= fetch(HEAT_URL)
    .then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
      return r.json() as Promise<{ total?: Record<string, number>; contributions?: Day[] }>
    })
    .then((d) => {
      if (!d?.contributions?.length) throw new Error("empty")
      heatData = {
        days: d.contributions,
        total: d.total?.lastYear ?? d.contributions.reduce((sum, c) => sum + c.count, 0),
      }
      return heatData
    })
    .catch((err: unknown) => {
      heatCache = null
      throw err
    })
  return heatCache
}

/** Sunday-aligned week columns, padded with nulls. */
function toWeeks(days: Day[]) {
  const weeks: (Day | null)[][] = []
  let week: (Day | null)[] = Array(new Date(days[0].date).getDay()).fill(null)
  for (const d of days) {
    week.push(d)
    if (week.length === 7) {
      weeks.push(week)
      week = []
    }
  }
  if (week.length) weeks.push([...week, ...Array(7 - week.length).fill(null)])
  return weeks
}

function GitHubTab({ t }: { t: Strings }) {
  const g = useContent().ui.github
  const [heat, setHeat] = useState<Heat | null>(heatData)
  const [failed, setFailed] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const scroller = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (heatData) return
    let cancelled = false
    loadHeat()
      .then((h) => !cancelled && setHeat(h))
      .catch(() => !cancelled && setFailed(true))
    return () => {
      cancelled = true
    }
  }, [attempt])

  // newest weeks sit on the right: start there on narrow windows
  useEffect(() => {
    const el = scroller.current
    if (el) el.scrollLeft = el.scrollWidth
  }, [heat])

  const weeks = useMemo(() => (heat ? toWeeks(heat.days) : []), [heat])

  return (
    <div className="space-y-4 p-3 @md:p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 font-mono text-sm text-white/70">
          <Github className="h-4 w-4 text-orange-500" aria-hidden /> {g.title}
        </h3>
        <a
          href={profile.socials.github}
          target="_blank"
          rel="noopener noreferrer"
          className={cn("rounded font-mono text-xs text-orange-400 transition-colors hover:text-orange-300", focusRing)}
        >
          {g.viewProfile}
        </a>
      </div>

      <dl className="grid grid-cols-3 gap-2 @md:gap-3">
        {g.stats.map((s) => (
          <div key={s.label} className="flex flex-col-reverse rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center">
            <dt className="mt-1 text-[11px] leading-tight text-white/50">{s.label}</dt>
            <dd className="font-mono text-xl font-semibold text-white @md:text-2xl">{s.value}</dd>
          </div>
        ))}
      </dl>

      <section className="rounded-xl border border-white/10 bg-white/[0.03] p-3 @md:p-4" aria-busy={!heat && !failed}>
        {heat ? (
          <>
            <h4 className="mb-3 font-mono text-xs text-white/70">
              <span className="text-orange-500">{"//"}</span> {heat.total}&nbsp;{g.heatmap}
            </h4>
            <div ref={scroller} className="overflow-x-auto pb-1">
              <div role="img" aria-label={`${heat.total} ${g.heatmap}`} className="flex w-max gap-[3px]">
                {weeks.map((w, wi) => (
                  <div key={wi} className="flex flex-col gap-[3px]">
                    {w.map((d, di) => (
                      <div
                        key={di}
                        title={d ? `${d.count} · ${d.date}` : undefined}
                        className={cn("h-[10px] w-[10px] rounded-[2px]", d ? LEVELS[d.level] ?? LEVELS[0] : "bg-transparent")}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div aria-hidden className="mt-3 flex items-center justify-end gap-1.5 font-mono text-[10px] text-white/40">
              <span>{t.less}</span>
              {LEVELS.map((c) => (
                <span key={c} className={cn("h-[10px] w-[10px] rounded-[2px]", c)} />
              ))}
              <span>{t.more}</span>
            </div>
          </>
        ) : failed ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <p className="text-sm text-white/60">{t.failed}</p>
            <button
              type="button"
              onClick={() => {
                setFailed(false)
                setAttempt((a) => a + 1)
              }}
              className={cn(
                "flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/70 transition-colors hover:border-white/25 hover:text-white",
                focusRing,
              )}
            >
              <RefreshCw className="h-3.5 w-3.5" aria-hidden /> {t.retry}
            </button>
            <a
              href={profile.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className={cn("flex items-center gap-1 rounded text-xs text-orange-400 hover:text-orange-300", focusRing)}
            >
              github.com/Urthella <ExternalLink className="h-3 w-3" aria-hidden />
            </a>
          </div>
        ) : (
          <div role="status">
            <span className="sr-only">{t.loading}</span>
            <div aria-hidden className="mb-3 h-3 w-48 max-w-full rounded bg-white/[0.06] motion-safe:animate-pulse" />
            <div aria-hidden className="h-[88px] rounded-lg bg-white/[0.04] motion-safe:animate-pulse" />
          </div>
        )}
      </section>
    </div>
  )
}
