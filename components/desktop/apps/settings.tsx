"use client"

import { Check, ExternalLink, Gauge, Github, Globe, Info, Palette, RotateCcw, type LucideIcon } from "lucide-react"
import { useId, useState, useSyncExternalStore, type ReactNode } from "react"

import { OS } from "@/components/desktop/fs"
import { useT } from "@/components/desktop/os"
import type { AppProps } from "@/components/desktop/types"
import { profile } from "@/data/content"
import { useLang, type Lang } from "@/data/i18n"
import { usePerf } from "@/hooks/use-perf"
import { ACCENT_EVENT, ACCENT_PRESETS, DEFAULT_ACCENT, getAccent, resetAccent, setAccent } from "@/lib/accent"
import { cn } from "@/lib/utils"

const PANES = ["appearance", "language", "performance", "about"] as const
type Pane = (typeof PANES)[number]
const isPane = (p: string | undefined): p is Pane => PANES.includes(p as Pane)

const ICONS: Record<Pane, LucideIcon> = { appearance: Palette, language: Globe, performance: Gauge, about: Info }

const WALLPAPERS = ["aurora", "grid", "plain"] as const
type Wallpaper = (typeof WALLPAPERS)[number]
const WALLPAPER_KEY = "utkuos-wallpaper"
const WALLPAPER_EVENT = "utkuos:wallpaper"

const SOURCE = "https://github.com/Urthella/portfolio-website"
const SINCE = 2019

const focusRing = "outline-none focus-visible:ring-2 focus-visible:ring-orange-400/80"

const STR = {
  en: {
    panes: { appearance: "Appearance", language: "Region & Language", performance: "Performance", about: "About" },
    nav: "Settings sections",
    accent: "Accent color",
    accentDesc: "Every gradient, border and glow across utkuOS and the site re-derives from it.",
    presets: "Presets",
    custom: "Custom",
    pickCustom: "Pick a custom accent color",
    reset: "Reset",
    resetLabel: "Reset the accent to the default orange",
    preview: "Preview",
    previewButton: "Primary",
    wallpaper: "Wallpaper",
    wallpaperDesc: "The desktop background behind your windows.",
    wallpapers: { aurora: "Aurora", grid: "Grid", plain: "Plain" },
    language: "Language",
    languageDesc: "Switches utkuOS, its files and the whole site.",
    langs: { en: ["English", "English"], tr: ["Türkçe", "Turkish"] } as Record<Lang, [string, string]>,
    lite: "Lite mode",
    liteDesc: "Turns off the heavy visuals: aurora drift, the fluid simulation and word physics. Easier on older devices and batteries.",
    liteOn: "Animations are off",
    liteOff: "Animations are on",
    motionNote: "utkuOS also follows your system's reduced-motion setting.",
    info: {
      os: "OS Name",
      kernel: "Kernel",
      desktop: "Desktop",
      device: "Device Name",
      cpu: "Processor",
      mem: "Memory",
      uptime: "Uptime",
    },
    cpu: "Coffee-powered (8 cores)",
    mem: "enough",
    uptime: (n: number) => `${n} years (since ${SINCE})`,
    source: "Source code",
    website: "Website",
  },
  tr: {
    panes: { appearance: "Görünüm", language: "Bölge ve Dil", performance: "Performans", about: "Hakkında" },
    nav: "Ayar bölümleri",
    accent: "Vurgu rengi",
    accentDesc: "utkuOS'taki ve sitedeki tüm geçişler, kenarlıklar ve parıltılar bu renkten türetilir.",
    presets: "Hazır renkler",
    custom: "Özel",
    pickCustom: "Özel bir vurgu rengi seç",
    reset: "Sıfırla",
    resetLabel: "Vurgu rengini varsayılan turuncuya döndür",
    preview: "Önizleme",
    previewButton: "Birincil",
    wallpaper: "Duvar kâğıdı",
    wallpaperDesc: "Pencerelerin arkasındaki masaüstü arka planı.",
    wallpapers: { aurora: "Aurora", grid: "Izgara", plain: "Düz" },
    language: "Dil",
    languageDesc: "utkuOS'u, dosyalarını ve tüm siteyi değiştirir.",
    langs: { en: ["English", "İngilizce"], tr: ["Türkçe", "Türkçe"] } as Record<Lang, [string, string]>,
    lite: "Hafif mod",
    liteDesc: "Ağır görselleri kapatır: aurora akışı, akışkan simülasyonu ve kelime fiziği. Eski cihazları ve pili yormaz.",
    liteOn: "Animasyonlar kapalı",
    liteOff: "Animasyonlar açık",
    motionNote: "utkuOS, sisteminizin hareketi azaltma ayarına da uyar.",
    info: {
      os: "İşletim Sistemi",
      kernel: "Çekirdek",
      desktop: "Masaüstü",
      device: "Cihaz Adı",
      cpu: "İşlemci",
      mem: "Bellek",
      uptime: "Çalışma Süresi",
    },
    cpu: "Kahveyle çalışır (8 çekirdek)",
    mem: "yeterince",
    uptime: (n: number) => `${n} yıl (${SINCE}'dan beri)`,
    source: "Kaynak kodu",
    website: "Web sitesi",
  },
}

type Strings = (typeof STR)["en"]

// ---- external stores (localStorage + window events) ----

function subscribeAccent(cb: () => void) {
  window.addEventListener(ACCENT_EVENT, cb)
  return () => window.removeEventListener(ACCENT_EVENT, cb)
}

function subscribeWallpaper(cb: () => void) {
  window.addEventListener(WALLPAPER_EVENT, cb)
  return () => window.removeEventListener(WALLPAPER_EVENT, cb)
}

function readWallpaper(): Wallpaper {
  try {
    const v = localStorage.getItem(WALLPAPER_KEY)
    if (WALLPAPERS.includes(v as Wallpaper)) return v as Wallpaper
  } catch {}
  return "aurora"
}

function writeWallpaper(w: Wallpaper) {
  try {
    localStorage.setItem(WALLPAPER_KEY, w)
  } catch {}
  window.dispatchEvent(new Event(WALLPAPER_EVENT))
}

// ---- app ----

export default function Settings({ args }: AppProps) {
  const t = useT(STR)
  const [pane, setPane] = useState<Pane>(isPane(args.pane) ? args.pane : "appearance")

  // Re-opening the (single) window with a pane hands us new args: follow them.
  const [seenArgs, setSeenArgs] = useState(args)
  if (seenArgs !== args) {
    setSeenArgs(args)
    if (isPane(args.pane)) setPane(args.pane)
  }

  return (
    <div className="@container h-full min-h-0 text-white/90">
      <div className="flex h-full min-h-0 flex-col @xl:flex-row">
        <nav
          aria-label={t.nav}
          className="shrink-0 border-b border-white/10 bg-white/[0.02] @xl:w-52 @xl:border-b-0 @xl:border-r"
        >
          <ul className="flex gap-1 overflow-x-auto p-2 @xl:flex-col @xl:overflow-visible">
            {PANES.map((p) => {
              const Icon = ICONS[p]
              const active = p === pane
              return (
                <li key={p} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => setPane(p)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex w-full items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm transition-colors",
                      focusRing,
                      active ? "bg-white/[0.08] text-white" : "text-white/60 hover:bg-white/[0.04] hover:text-white/90",
                    )}
                  >
                    <Icon className={cn("h-4 w-4 shrink-0", active ? "text-orange-400" : "text-white/45")} aria-hidden />
                    {t.panes[p]}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* keyed so every pane starts scrolled to the top */}
        <div key={pane} className="min-h-0 flex-1 overflow-auto">
          <div className="mx-auto max-w-2xl space-y-6 p-4 @md:p-6">
            {pane !== "about" && <h2 className="text-lg font-semibold text-white">{t.panes[pane]}</h2>}
            {pane === "appearance" && <Appearance t={t} />}
            {pane === "language" && <Language t={t} />}
            {pane === "performance" && <Performance t={t} />}
            {pane === "about" && <About t={t} />}
          </div>
        </div>
      </div>
    </div>
  )
}

// ---- building blocks ----

function Group({ title, desc, action, children }: { title: string; desc?: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium text-white/90">{title}</h3>
          {desc && <p className="mt-0.5 text-xs leading-relaxed text-white/45">{desc}</p>}
        </div>
        {action}
      </div>
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 @md:p-4">{children}</div>
    </section>
  )
}

/** Card-style radio option; the native input keeps arrow-key navigation. */
function RadioCard({
  name,
  checked,
  onSelect,
  children,
}: {
  name: string
  checked: boolean
  onSelect: () => void
  children: ReactNode
}) {
  return (
    <label
      className={cn(
        "relative flex cursor-pointer flex-col gap-2 rounded-xl border p-2 transition-colors",
        "has-focus-visible:ring-2 has-focus-visible:ring-orange-400/80",
        checked ? "border-orange-500/60 bg-white/[0.05]" : "border-white/10 hover:border-white/25",
      )}
    >
      <input type="radio" name={name} checked={checked} onChange={onSelect} className="sr-only" />
      {children}
      {checked && (
        <span className="absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full bg-orange-500 text-white shadow">
          <Check className="h-3 w-3" strokeWidth={3} aria-hidden />
        </span>
      )}
    </label>
  )
}

// ---- panes ----

function Appearance({ t }: { t: Strings }) {
  const { lang } = useLang()
  const accent = useSyncExternalStore(subscribeAccent, getAccent, () => DEFAULT_ACCENT)
  const wallpaper = useSyncExternalStore(subscribeWallpaper, readWallpaper, () => "aurora" as Wallpaper)
  const name = useId()
  const isPreset = ACCENT_PRESETS.some((p) => p.hex === accent)

  return (
    <>
      <Group
        title={t.accent}
        desc={t.accentDesc}
        action={
          <button
            type="button"
            onClick={resetAccent}
            disabled={accent === DEFAULT_ACCENT}
            aria-label={t.resetLabel}
            className={cn(
              "flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1 text-xs text-white/60 transition-colors hover:border-white/25 hover:text-white disabled:pointer-events-none disabled:opacity-40",
              focusRing,
            )}
          >
            <RotateCcw className="h-3 w-3" aria-hidden /> {t.reset}
          </button>
        }
      >
        {/* live preview: everything here is drawn with the derived palette */}
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-lg border border-white/10 bg-[#07070a] p-3">
          <span className="text-[11px] uppercase tracking-wider text-white/40">{t.preview}</span>
          <span className="rounded-md bg-orange-500 px-3 py-1 text-xs font-medium text-white shadow-lg shadow-orange-500/40">
            {t.previewButton}
          </span>
          <span className="rounded-full border border-orange-500/40 bg-orange-500/10 px-2.5 py-0.5 font-mono text-[11px] text-orange-300">
            {OS.name}
          </span>
          <span aria-hidden className="h-1.5 min-w-16 flex-1 rounded-full bg-gradient-to-r from-orange-500 via-rose-500 to-amber-400" />
          <span className="font-mono text-xs text-white/60">{accent}</span>
        </div>

        <p className="mb-2 text-xs text-white/45">{t.presets}</p>
        <div role="group" aria-label={t.presets} className="flex flex-wrap gap-2.5">
          {ACCENT_PRESETS.map((p) => {
            const on = p.hex === accent
            return (
              <button
                key={p.hex}
                type="button"
                onClick={() => setAccent(p.hex)}
                aria-pressed={on}
                aria-label={`${p.name[lang]} ${p.hex}`}
                title={`${p.name[lang]} · ${p.hex}`}
                className={cn(
                  "grid h-8 w-8 place-items-center rounded-full border transition-transform motion-safe:hover:scale-110",
                  focusRing,
                  on ? "border-white ring-2 ring-white/30" : "border-white/15",
                )}
                style={{ backgroundColor: p.hex }}
              >
                {on && <Check className="h-4 w-4 text-white drop-shadow" strokeWidth={3} aria-hidden />}
              </button>
            )
          })}

          {/* custom: native color picker behind a swatch */}
          <label
            title={t.pickCustom}
            className={cn(
              "relative grid h-8 cursor-pointer grid-flow-col place-items-center gap-2 rounded-full border pl-1 pr-3 text-xs text-white/70 transition-colors hover:border-white/30",
              "has-focus-visible:ring-2 has-focus-visible:ring-orange-400/80",
              isPreset ? "border-white/15" : "border-white ring-2 ring-white/30",
            )}
          >
            <span aria-hidden className="h-6 w-6 rounded-full border border-white/20" style={{ backgroundColor: accent }} />
            {t.custom}
            <input
              type="color"
              value={accent}
              onChange={(e) => setAccent(e.target.value)}
              aria-label={t.pickCustom}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            />
          </label>
        </div>
      </Group>

      <Group title={t.wallpaper} desc={t.wallpaperDesc}>
        <div className="grid grid-cols-1 gap-3 @xs:grid-cols-3">
          {WALLPAPERS.map((w) => (
            <RadioCard key={w} name={name} checked={wallpaper === w} onSelect={() => writeWallpaper(w)}>
              <WallpaperThumb kind={w} />
              <span className="px-1 pb-0.5 text-sm text-white/80">{t.wallpapers[w]}</span>
            </RadioCard>
          ))}
        </div>
      </Group>
    </>
  )
}

function WallpaperThumb({ kind }: { kind: Wallpaper }) {
  const glow = (c: string, pct: number) => `color-mix(in oklab, var(${c}) ${pct}%, transparent)`
  const style =
    kind === "aurora"
      ? {
          background: `radial-gradient(circle at 20% 25%, ${glow("--color-orange-500", 60)}, transparent 55%), radial-gradient(circle at 85% 80%, ${glow("--color-rose-500", 50)}, transparent 55%), radial-gradient(circle at 60% 10%, ${glow("--color-amber-400", 30)}, transparent 45%), #07070a`,
        }
      : kind === "grid"
        ? {
            backgroundColor: "#07070a",
            backgroundImage: `radial-gradient(circle at 50% 120%, ${glow("--color-orange-500", 35)}, transparent 60%), linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)`,
            backgroundSize: "100% 100%, 10px 10px, 10px 10px",
          }
        : { background: "#07070a" }
  return <span aria-hidden className="block aspect-[16/10] w-full rounded-lg border border-white/10" style={style} />
}

function Language({ t }: { t: Strings }) {
  const { lang, setLang } = useLang()
  const name = useId()
  return (
    <Group title={t.language} desc={t.languageDesc}>
      <div className="grid grid-cols-1 gap-3 @xs:grid-cols-2">
        {(["en", "tr"] as const).map((l) => (
          <RadioCard key={l} name={name} checked={lang === l} onSelect={() => setLang(l)}>
            <span className="flex items-center gap-3 p-1.5 pr-8">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.04] font-mono text-xs uppercase text-orange-300">
                {l}
              </span>
              <span className="min-w-0">
                <span lang={l} className="block text-sm font-medium text-white">
                  {t.langs[l][0]}
                </span>
                <span className="block text-xs text-white/45">{t.langs[l][1]}</span>
              </span>
            </span>
          </RadioCard>
        ))}
      </div>
    </Group>
  )
}

function Performance({ t }: { t: Strings }) {
  const { lite, setLite } = usePerf()
  const id = useId()
  return (
    <Group title={t.lite} desc={t.motionNote}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p id={`${id}-label`} className="text-sm font-medium text-white">
            {lite ? t.liteOn : t.liteOff}
          </p>
          <p id={`${id}-desc`} className="mt-1 text-xs leading-relaxed text-white/50">
            {t.liteDesc}
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={lite}
          aria-labelledby={`${id}-label`}
          aria-describedby={`${id}-desc`}
          onClick={() => setLite(!lite)}
          className={cn(
            "relative mt-0.5 h-6 w-11 shrink-0 rounded-full border transition-colors",
            focusRing,
            lite ? "border-orange-500/60 bg-orange-500" : "border-white/15 bg-white/10",
          )}
        >
          <span
            aria-hidden
            className={cn(
              "absolute top-0.5 left-0.5 h-[18px] w-[18px] rounded-full bg-white shadow transition-transform motion-reduce:transition-none",
              lite && "translate-x-5",
            )}
          />
        </button>
      </div>
    </Group>
  )
}

function About({ t }: { t: Strings }) {
  const years = new Date().getFullYear() - SINCE
  const rows: [string, string][] = [
    [t.info.os, `${OS.name} ${OS.version} "${OS.codename}"`],
    [t.info.kernel, "6.10-backend"],
    [t.info.desktop, "utkuOS Shell"],
    [t.info.device, OS.hostname],
    [t.info.cpu, t.cpu],
    [t.info.mem, t.mem],
    [t.info.uptime, t.uptime(years)],
  ]
  const links: [string, string, string, LucideIcon][] = [
    [t.source, SOURCE, "github.com/Urthella/portfolio-website", Github],
    [t.website, "/", profile.site, Globe],
  ]

  return (
    <>
      <div className="flex flex-col items-center gap-3 pt-2 text-center">
        <Logo />
        <div>
          <h2 className="text-xl font-semibold text-white">{OS.name}</h2>
          <p className="font-mono text-xs text-white/45">
            {OS.version} · {OS.codename}
          </p>
        </div>
      </div>

      <dl className="divide-y divide-white/10 rounded-xl border border-white/10 bg-white/[0.03]">
        {rows.map(([k, v]) => (
          <div key={k} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 px-4 py-2.5">
            <dt className="text-sm text-white/60">{k}</dt>
            <dd className="text-sm text-white/90">{v}</dd>
          </div>
        ))}
      </dl>

      <ul className="divide-y divide-white/10 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
        {links.map(([label, href, shown, Icon]) => (
          <li key={label}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn("group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-white/[0.04]", focusRing, "focus-visible:ring-inset")}
            >
              <Icon className="h-4 w-4 shrink-0 text-orange-400" aria-hidden />
              <span className="text-sm text-white/90">{label}</span>
              <span className="ml-auto truncate font-mono text-xs text-white/45">{shown}</span>
              <ExternalLink className="h-3.5 w-3.5 shrink-0 text-white/35 transition-colors group-hover:text-white/70" aria-hidden />
            </a>
          </li>
        ))}
      </ul>
    </>
  )
}

/** utkuOS mark: an accent tile with a prompt chevron and cursor. */
function Logo() {
  return (
    <span className="grid h-20 w-20 place-items-center rounded-[22px] bg-gradient-to-br from-orange-400 via-orange-500 to-rose-600 shadow-2xl shadow-orange-500/30">
      <svg viewBox="0 0 48 48" className="h-11 w-11 text-white" fill="none" aria-hidden>
        <path d="M11 15l10 9-10 9" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M25 34h12" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" opacity="0.85" />
      </svg>
    </span>
  )
}
