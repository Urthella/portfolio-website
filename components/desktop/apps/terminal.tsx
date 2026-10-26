"use client"

import { memo, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from "react"

import { APP_IDS, APPS } from "@/components/desktop/apps"
import { COMMANDS, complete, fakeHash, GROUPS, linkify, parseArgs, parseHex, suggestProject, tokenize, tree, type Seg } from "@/components/desktop/apps/terminal-lib/shell"
import { COFFEE, COMMITS, LOGO, STR, type Strings } from "@/components/desktop/apps/terminal-lib/strings"
import { displayPath, HOME, listDir, lookup, OS, parentPath, resolvePath, slug, type FsNode } from "@/components/desktop/fs"
import { useOS, useT } from "@/components/desktop/os"
import type { AppId, AppProps } from "@/components/desktop/types"
import { profile } from "@/data/content"
import { useContent, useLang } from "@/data/i18n"
import { ACCENT_PRESETS, getAccent, resetAccent, setAccent } from "@/lib/accent"

interface Line {
  id: number
  segs: Seg[]
}

const MAX_LINES = 500
const USER_HOST = `${OS.user}@${OS.hostname}`
const KERNEL = "6.10-backend"

let nextId = 0
const line = (...parts: (Seg | string)[]): Line => ({ id: ++nextId, segs: parts.map((p) => (typeof p === "string" ? { t: p } : p)) })

const DIM = "text-white/45"
const ERR = "text-red-400"
const KEY = "font-semibold text-orange-400"
const DIR = "font-semibold text-sky-400"
const LINK =
  "inline cursor-pointer rounded-sm underline decoration-white/20 underline-offset-[3px] hover:decoration-current focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-orange-400"

const err = (t: string) => line({ t, c: ERR })
const dim = (t: string) => line({ t, c: DIM })
const prompt = (cwd: string): Seg[] => [
  { t: USER_HOST, c: "font-semibold text-emerald-400" },
  { t: ":", c: "text-white/60" },
  { t: displayPath(cwd), c: "font-semibold text-orange-400" },
  { t: "$ ", c: "text-white/60" },
]
const join = (dir: string, name: string) => (dir === "/" ? `/${name}` : `${dir}/${name}`)

function nodeSeg(n: FsNode, abs: string, label?: string): Seg {
  const name = label ?? n.name + (n.kind === "dir" ? "/" : "")
  const c = n.kind === "dir" ? DIR : n.kind === "file" && n.href ? "text-cyan-300" : n.name.startsWith(".") ? "text-white/55" : "text-white/85"
  return { t: name, c, path: abs }
}

const motd = (t: Strings) => [
  line({ t: t.motd, c: "font-semibold text-white" }),
  line({ t: t.tip[0], c: DIM }, { t: "help", c: KEY, cmd: "help" }, { t: t.tip[1], c: DIM }),
  line(),
]

// What clicking a command in `help` runs: the command itself unless it needs arguments.
const HELP_RUN: Record<string, string> = {
  cat: "man cat", open: "man open", man: "man man", sudo: "man sudo", apt: "man apt", rm: "man rm", exit: "man exit",
  echo: "echo $CONTACT", git: "git log --oneline",
}

const SOCIAL_LABEL: Record<string, string> = { github: "GitHub", linkedin: "LinkedIn", instagram: "Instagram", medium: "Medium" }

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches

export default function Terminal({ windowId, args }: AppProps) {
  const os = useOS()
  const { lang, setLang } = useLang()
  const content = useContent()
  const t = useT(STR)

  const [lines, setLines] = useState<Line[]>(() => motd(t))
  const [cwd, setCwd] = useState(HOME)
  const [value, setValue] = useState("")
  const [busy, setBusy] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const history = useRef<string[]>([])
  const histIdx = useRef<number | null>(null)
  const draft = useRef("")
  const oldPwd = useRef(HOME)
  const lastWasTab = useRef(false)
  const task = useRef<object | null>(null) // the running async command (apt); null cancels it
  const latest = useRef({ os, run })

  // The language switch rebuilds the filesystem; fall back home if the folder vanished.
  const fs = os.fs
  const here = lookup(fs, cwd)?.kind === "dir" ? cwd : HOME
  const loc = lang === "tr" ? "tr-TR" : "en-US"

  const print = (...ls: Line[]) =>
    setLines((prev) => {
      const next = prev.concat(ls)
      return next.length > MAX_LINES ? next.slice(-MAX_LINES) : next
    })
  const replace = (id: number, segs: Seg[]) => setLines((prev) => prev.map((l) => (l.id === id ? { id, segs } : l)))

  const appByName = (a: string): AppId | undefined => {
    const q = a.toLocaleLowerCase(loc)
    return APP_IDS.find((id) => id === q || APPS[id].title.en.toLowerCase() === q || APPS[id].title.tr.toLocaleLowerCase("tr-TR") === q)
  }

  async function aptInstall(pkg: string) {
    const token = {}
    task.current = token
    setBusy(true)
    const fast = reducedMotion()
    const step = (ms: number) => new Promise<boolean>((r) => setTimeout(() => r(task.current === token), fast ? 0 : ms))
    for (const s of t.aptSteps) {
      if (!(await step(280))) return
      print(line(s))
    }
    const draw = (p: number): Seg[] => [{ t: t.aptGet(pkg) + "  ", c: DIM }, { t: `[${"#".repeat(p / 5).padEnd(20, ".")}] ${p}%`, c: "text-orange-400" }]
    const bar = line(...draw(0))
    print(bar)
    for (let p = 10; p <= 100; p += 10) {
      if (!(await step(90))) return
      replace(bar.id, draw(p))
    }
    if (!(await step(250))) return
    const p = suggestProject(pkg, content.projects)
    const abs = `${HOME}/projects/${slug(p.name)}`
    print(
      err(t.aptMissing(pkg)),
      line(t.aptBetter),
      line("  → ", { t: p.name, c: KEY, path: abs }, { t: `  ${displayPath(abs)}`, c: DIM }),
      dim(`    ${p.blurb}`),
    )
    task.current = null
    setBusy(false)
  }

  function neofetch(out: Line[]) {
    const months = (new Date().getFullYear() - 2019) * 12 + new Date().getMonth()
    const accent = getAccent()
    const kv = (k: string, v: Seg[]): Seg[] => [{ t: k, c: KEY }, { t: ": ", c: DIM }, ...v]
    const info: Seg[][] = [
      [{ t: OS.user, c: "font-semibold text-emerald-400" }, { t: "@", c: DIM }, { t: OS.hostname, c: "font-semibold text-emerald-400" }],
      [{ t: "-".repeat(USER_HOST.length), c: DIM }],
      kv(t.nf.os, [{ t: `${OS.name} ${OS.version} (${OS.codename}) x86_64` }]),
      kv(t.nf.host, [{ t: profile.site, href: `https://${profile.site}` }]),
      kv(t.nf.kernel, [{ t: KERNEL }]),
      kv(t.nf.uptime, [{ t: t.uptime(Math.floor(months / 12), months % 12) }]),
      kv(t.nf.packages, [{ t: t.packages(content.projects.length) }]),
      kv(t.nf.shell, [{ t: "bash 5.2.21" }]),
      kv(t.nf.de, [{ t: t.de }]),
      kv(t.nf.theme, [{ t: "■ ", color: accent }, { t: accent, cmd: "theme" }]),
      kv(t.nf.stack, [{ t: "Node · NestJS · Spring · Postgres · Redis · Docker" }]),
      kv(t.nf.contact, linkify(profile.email)),
      [],
      ["bg-neutral-700", "bg-red-500", "bg-emerald-500", "bg-yellow-400", "bg-sky-500", "bg-fuchsia-500", "bg-cyan-400", "bg-orange-500", "bg-white/80"].map(
        (c) => ({ t: "   ", c }),
      ),
    ]
    const logo = (s = "") => ({ t: s, c: "font-semibold text-orange-500" })
    const width = Math.max(...LOGO.map((l) => l.length)) + 3
    // Side by side when the longest info line fits next to the logo (~8.4px per char at text-sm), stacked otherwise.
    const infoW = Math.max(...info.map((segs) => segs.reduce((n, sg) => n + sg.t.length, 0)))
    if ((scrollRef.current?.clientWidth ?? 0) < (width + infoW + 2) * 8.4) {
      out.push(...LOGO.map((l) => line(logo(l))), line(), ...info.map((segs) => line(...segs)))
    } else {
      for (let i = 0; i < Math.max(LOGO.length, info.length); i++) out.push(line(logo((LOGO[i] ?? "").padEnd(width)), ...(info[i] ?? [])))
    }
  }

  function gitLog(oneline: boolean, out: Line[]) {
    const refs: Seg[] = [
      { t: " (", c: "text-yellow-300" },
      { t: "HEAD -> ", c: "font-semibold text-cyan-300" },
      { t: "main", c: "font-semibold text-emerald-400" },
      { t: ", ", c: "text-yellow-300" },
      { t: "origin/main", c: "font-semibold text-red-400" },
      { t: ")", c: "text-yellow-300" },
    ]
    COMMITS.forEach((c, i) => {
      const msg = t.commits[i]
      const hash = fakeHash(msg + c.date, 40)
      if (oneline) return out.push(line({ t: hash.slice(0, 7), c: "text-yellow-300" }, ...(c.ref ? refs : []), " ", msg))
      const date = new Date(c.date).toLocaleString(loc, { weekday: "short", year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
      out.push(
        line({ t: `commit ${hash}`, c: "text-yellow-300" }, ...(c.ref ? refs : [])),
        line(`${t.gitAuthor}: ${profile.name} <`, ...linkify(profile.email), ">"),
        line(`${t.gitDate}:   ${date}`),
        line(),
        line(`    ${msg}`),
        line(),
      )
    })
  }

  /** Run one command line, appending its output to `out`. Returns "clear" when the screen should be wiped. */
  function exec(input: string, out: Line[]): "clear" | void {
    const env = {
      USER: OS.user,
      HOME,
      PWD: here,
      OLDPWD: oldPwd.current,
      SHELL: "/bin/bash",
      HOSTNAME: OS.hostname,
      LANG: lang === "tr" ? "tr_TR.UTF-8" : "en_US.UTF-8",
      CONTACT: profile.email,
      EDITOR: "vim",
    }
    const words = tokenize(input, env)
    if (!words) return void out.push(err(t.quote))
    if (!words.length) return
    const [cmd, ...argv] = words
    const push = (...ls: Line[]) => {
      out.push(...ls)
    }
    const usage = (name: string) => push(err(t.usage(t.docs[name][0])))
    const projects = content.projects

    switch (cmd) {
      case "help": {
        const w = Math.max(...COMMANDS.map((c) => t.docs[c][0].length)) + 3
        for (const [key, names] of GROUPS) {
          push(line({ t: t.groups[key], c: KEY }))
          for (const name of names) {
            const [u, d] = t.docs[name]
            push(line("  ", { t: name, c: "text-white", cmd: HELP_RUN[name] ?? name }, { t: u.slice(name.length).padEnd(w - name.length), c: "text-white/70" }, { t: d, c: DIM }))
          }
        }
        push(line(), dim(t.helpFoot))
        return
      }
      case "man": {
        const name = argv[0]
        if (!name) return push(...t.manWhat.map((l) => line(l)))
        if (!Object.hasOwn(t.docs, name)) return push(err(t.manNone(name)))
        const [u, d] = t.docs[name]
        const head = `${name.toUpperCase()}(1)`
        return push(
          line({ t: head, c: "font-semibold" }, { t: `   ${t.manTitle}   `, c: DIM }, { t: head, c: "font-semibold" }),
          line(),
          line({ t: t.manName, c: "font-semibold text-white" }),
          line(`       ${name} - ${d}`),
          line(),
          line({ t: t.manSynopsis, c: "font-semibold text-white" }),
          line(`       ${u}`),
        )
      }
      case "ll":
      case "ls": {
        const { flags, args: paths } = parseArgs(argv)
        if (cmd === "ll") flags.add("l")
        const all = flags.has("a")
        const targets = paths.length ? paths : ["."]
        const stamp = (() => {
          const d = new Date()
          const hm = d.toLocaleTimeString(loc, { hour: "2-digit", minute: "2-digit", hour12: false })
          return `${d.toLocaleString(loc, { month: "short" }).padEnd(4)}${String(d.getDate()).padStart(2)} ${hm}`
        })()
        targets.forEach((a, i) => {
          const abs = resolvePath(here, a)
          const n = lookup(fs, abs)
          if (!n) return push(err(t.lsNoAccess(a)))
          if (targets.length > 1) push(line({ t: `${a}:`, c: "text-white/60" }))
          const parent = parentPath(abs)
          const entries: [FsNode, string, string?][] =
            n.kind === "dir"
              ? [
                  ...(all ? ([[n, abs, "./"], [lookup(fs, parent) ?? n, parent, "../"]] as [FsNode, string, string][]) : []),
                  ...listDir(n, all).map((c): [FsNode, string] => [c, join(abs, c.name)]),
                ]
              : [[n, abs, a]]
          if (flags.has("l")) {
            if (n.kind === "dir") push(line({ t: `${t.total} ${entries.length * 4}`, c: DIM }))
            for (const [e, p, label] of entries) {
              const f = e.kind === "file" ? e : null
              const mode = !f ? "drwxr-xr-x" : f.href ? "lrwxrwxrwx" : f.body === undefined ? "-r--r--r--" : "-rw-r--r--"
              const size = !f ? 4096 : f.href ? f.href.length : f.body === undefined ? 184320 : new TextEncoder().encode(f.body).length
              push(
                line(
                  { t: `${mode} ${f ? 1 : 2} ${OS.user} ${OS.user} ${String(size).padStart(6)} ${stamp} `, c: DIM },
                  nodeSeg(e, p, label),
                  ...(f?.href ? [{ t: " -> ", c: DIM }, { t: f.href, c: "text-cyan-300/80", href: f.href }] : []),
                ),
              )
            }
          } else if (entries.length) {
            push(line(...entries.flatMap(([e, p, label], j) => [{ t: j ? "  " : "" }, nodeSeg(e, p, label)])))
          }
          if (targets.length > 1 && i < targets.length - 1) push(line())
        })
        return
      }
      case "cd..":
      case "cd": {
        const a = cmd === "cd.." ? ".." : argv[0]
        const target = a === "-" ? oldPwd.current : resolvePath(here, a ?? "~")
        const n = lookup(fs, target)
        if (!n) return push(err(t.noSuch("cd", a ?? "~")))
        if (n.kind !== "dir") return push(err(t.notDir("cd", a ?? "~")))
        if (a === "-") push(line(target))
        oldPwd.current = here
        setCwd(target)
        return
      }
      case "pwd":
        return push(line(...linkify(here, undefined, fs)))
      case "cat": {
        if (!argv.length) return usage("cat")
        for (const a of argv) {
          const abs = resolvePath(here, a)
          const n = lookup(fs, abs)
          if (!n) push(err(t.noSuch("cat", a)))
          else if (n.kind === "dir") push(err(t.isDir("cat", a)))
          else if (n.body !== undefined) {
            for (const l of n.body.split("\n")) push(line(...linkify(l, l.startsWith("#") ? "font-semibold text-white" : "text-white/80", fs)))
          } else if (n.href) {
            push(line("→ ", { t: n.href, c: "text-cyan-300", href: n.href }, { t: `  ${t.newTab}`, c: DIM }))
            os.openPath(abs)
          } else if (n.open) {
            push(dim(t.binary(a, APPS[n.open.app].title[lang])))
            os.openPath(abs)
          }
        }
        return
      }
      case "xdg-open":
      case "open": {
        const a = argv[0]
        if (!a) return usage("open")
        const app = appByName(a)
        if (app) {
          os.open(app)
          return push(dim(t.openApp(APPS[app].title[lang])))
        }
        if (!os.openPath(a, here)) push(err(t.openNone(a)))
        return
      }
      case "tree": {
        const { flags, args: paths } = parseArgs(argv)
        const a = paths[0] ?? "."
        const abs = resolvePath(here, a)
        const n = lookup(fs, abs)
        if (!n) return push(err(t.noSuch("tree", a)))
        if (n.kind !== "dir") return push(line(nodeSeg(n, abs, a)))
        const rows = tree(n, abs, flags.has("a"))
        const dirs = rows.filter((r) => r.node.kind === "dir").length
        push(line({ t: a, c: DIR, path: abs }))
        for (const r of rows) push(line({ t: r.prefix, c: "text-white/30" }, nodeSeg(r.node, r.abs)))
        return push(line(), line(t.treeSummary(dirs, rows.length - dirs)))
      }
      case "whoami":
        return push(line(OS.user), dim(content.ui.terminal.whoami))
      case "neofetch":
      case "fastfetch":
        return neofetch(out)
      case "projects": {
        push(dim(t.projectsHead))
        for (const p of projects) {
          const s = slug(p.name) + "/"
          const tags = [p.featured && "★", p.wip && "wip", p.collab && "collab"].filter(Boolean).join(" ")
          push(line({ t: s, c: DIR, path: `${HOME}/projects/${slug(p.name)}` }, { t: " ".repeat(Math.max(2, 28 - s.length)) + p.category.padEnd(12), c: "text-white/60" }, { t: tags, c: "text-orange-400" }))
        }
        return push(line(), dim(t.projectsHint))
      }
      case "contact": {
        const row = (k: string, v: Seg[]) => line({ t: k.padEnd(10), c: KEY }, ...v)
        return push(
          row(t.contact.email, linkify(profile.email)),
          row(t.contact.phone, [{ t: profile.phone, href: `tel:${profile.phone.replace(/\s/g, "")}` }]),
          row(t.contact.web, linkify(`https://${profile.site}`)),
          row(t.contact.location, [{ t: profile.location }]),
          line(),
          line({ t: t.contactHint, c: DIM }, { t: "open mail", c: KEY, cmd: "open mail" }),
        )
      }
      case "socials":
        return push(
          ...Object.entries(profile.socials).map(([k, v]) => line({ t: (SOCIAL_LABEL[k] ?? k).padEnd(11), c: KEY }, ...linkify(v))),
        )
      case "theme": {
        const v = argv[0]
        if (!v) {
          const cur = getAccent()
          return push(
            line(t.themeNow, { t: "■ ", color: cur }, { t: cur, c: "font-semibold" }),
            line({ t: t.themePresets, c: DIM }),
            line(...ACCENT_PRESETS.flatMap((p) => [{ t: "  ■ ", color: p.hex }, { t: p.name.en.toLowerCase(), cmd: `theme ${p.name.en.toLowerCase()}`, c: "text-white/85" }])),
            line({ t: "  reset", cmd: "theme reset", c: "text-white/85" }, { t: "  #rrggbb", c: DIM }),
          )
        }
        if (v === "reset" || v === "default") {
          resetAccent()
          return push(line(t.themeReset))
        }
        const q = v.toLocaleLowerCase(loc)
        const hex = ACCENT_PRESETS.find((p) => p.name.en.toLowerCase() === q || p.name.tr.toLocaleLowerCase("tr-TR") === q)?.hex ?? parseHex(v)
        if (!hex || !setAccent(hex)) return push(err(t.themeBad(v)))
        return push(line(t.themeSet, { t: "■ ", color: hex }, { t: hex, c: "font-semibold" }))
      }
      case "lang": {
        const v = argv[0]
        if (!v) return push(line(t.langNow(lang)))
        if (v !== "en" && v !== "tr") return push(err(t.langBad))
        setLang(v)
        return push(line(STR[v].langSet))
      }
      case "echo":
        return push(line(...linkify(argv.join(" "), undefined, fs)))
      case "clear":
      case "cls":
        return "clear"
      case "history":
        return push(...history.current.map((h, i) => line({ t: String(i + 1).padStart(5) + "  ", c: DIM }, h)))
      case "date":
        return push(
          line(new Date().toLocaleString(loc, { weekday: "short", year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", timeZoneName: "short" })),
        )
      case "uname": {
        const { flags } = parseArgs(argv)
        if (flags.has("a") || flags.has("all")) return push(line(`${OS.name} ${OS.hostname} ${KERNEL} #${OS.version}-${OS.codename} SMP PREEMPT_DYNAMIC x86_64 GNU/Linux`))
        return push(line(flags.has("r") ? KERNEL : flags.has("n") ? OS.hostname : OS.name))
      }
      case "exit":
      case "logout":
        os.close(windowId)
        return
      case "sudo":
        if (!argv.length) return usage("sudo")
        return push(dim(t.sudoPw), line(t.sudo))
      case "rm": {
        const { args: paths } = parseArgs(argv)
        if (!paths.length) return usage("rm")
        const abs = paths.map((p) => resolvePath(here, p.replace(/\*$/, "") || "."))
        if (abs.includes("/")) return push(...t.rmRoot.map(err))
        if (abs.includes(HOME)) return push(err(t.rmHome))
        paths.forEach((p, i) => push(err(lookup(fs, abs[i]) ? t.rmRO(p) : t.noSuch("rm", p))))
        return push(dim(t.rmNote))
      }
      case "apt":
      case "apt-get": {
        const [sub, ...rest] = argv
        const pkg = rest.find((x) => !x.startsWith("-"))
        if (sub === "install" && pkg) return void aptInstall(pkg)
        if (sub === "update" || sub === "upgrade") return push(...t.aptUpdate.map((l) => line(l)))
        return usage("apt")
      }
      case "git": {
        const [sub, ...rest] = argv
        if (sub === "log") return gitLog(rest.includes("--oneline"), out)
        if (sub === "status") return push(...t.gitStatus.map((l) => line(l)))
        if (!sub) return usage("git")
        return push(err(t.gitReadOnly(sub)))
      }

      // ---- hidden easter eggs (not in help or completion) ----
      case "docker": {
        if (argv[0] !== "ps" && argv.join(" ") !== "container ls") return push(dim(t.dockerTry))
        push(line({ t: "CONTAINER ID   STATUS                          NAMES", c: DIM }))
        for (const p of projects.filter((p) => !p.collab).slice(0, 7)) {
          const status = p.wip ? "Up 3 hours (health: starting)" : p.featured ? "Up 11 months (healthy)" : "Up 7 weeks (healthy)"
          push(line({ t: fakeHash(p.name, 12), c: "text-yellow-300" }, `   ${status.padEnd(32)}`, { t: slug(p.name), c: DIR, path: `${HOME}/projects/${slug(p.name)}` }))
        }
        return push(dim(t.dockerNote))
      }
      case "kubectl":
      case "k": {
        if (argv[0] !== "get" || !/^(pods?|po)$/.test(argv[1] ?? "")) return push(dim(t.kubeTry))
        const pods = projects
          .filter((p) => !p.collab)
          .slice(0, 5)
          .map((p) => [`${slug(p.name)}-${fakeHash(p.name, 9)}-${fakeHash(p.blurb, 5)}`, "1/1", "Running", "0", p.featured ? "11mo" : "7w"])
        pods.push([`sleep-schedule-${fakeHash("zzz", 9)}-${fakeHash("coffee", 5)}`, "0/1", "CrashLoopBackOff", "127", "4y"])
        const w = Math.max(...pods.map((p) => p[0].length)) + 3
        push(line({ t: "NAME".padEnd(w) + "READY   STATUS             RESTARTS   AGE", c: DIM }))
        for (const [name, ready, status, restarts, age] of pods) {
          push(line(name.padEnd(w) + ready.padEnd(8), { t: status.padEnd(19), c: status === "Running" ? "text-emerald-400" : ERR }, restarts.padEnd(11) + age))
        }
        return push(dim(t.kubeNote))
      }
      case "fortune":
        return push(line({ t: t.fortunes[Math.floor(Math.random() * t.fortunes.length)], c: "text-amber-300" }))
      case "coffee":
      case "make":
        if (cmd === "make" && !argv.length) return push(err(t.makeNone))
        if (cmd === "make" && argv[0] !== "coffee") return push(err(t.makeRule(argv[0])))
        return push(...COFFEE.map((l) => line({ t: l, c: "text-amber-300" })), line(), line(t.coffee[0]), dim(t.coffee[1]), line(t.coffee[2]))
      case "vim":
      case "vi":
      case "nvim":
      case "nano":
      case "emacs":
      case "code": {
        const a = argv.find((x) => !x.startsWith("-"))
        if (a && !lookup(fs, resolvePath(here, a))) return push(err(t.noSuch(cmd, a)))
        push(dim(t.editor(APPS.text.title[lang])))
        if (a) os.openPath(a, here)
        else os.open("text")
        return
      }
      default:
        return push(err(t.notFound(cmd)), dim(t.tryHelp))
    }
  }

  function run(input: string) {
    const out = [line(...prompt(here), { t: input, c: "text-white/90" })]
    const cmd = input.trim()
    if (cmd && history.current.at(-1) !== cmd) history.current = [...history.current, cmd].slice(-MAX_LINES)
    if (exec(cmd, out) === "clear") setLines([])
    else print(...out)
  }

  function interrupt() {
    if (task.current || busy) {
      task.current = null
      setBusy(false)
      print(line("^C"))
    } else {
      print(line(...prompt(here), { t: value, c: "text-white/90" }, "^C"))
      setValue("")
      histIdx.current = null
    }
  }

  function onTab() {
    const res = complete(value, here, fs, COMMANDS, {
      open: APP_IDS,
      theme: [...ACCENT_PRESETS.map((p) => p.name.en.toLowerCase()), "reset"],
      lang: ["en", "tr"],
      man: COMMANDS,
      help: [],
      git: ["log", "status"],
      apt: ["install", "update"],
      "apt-get": ["install", "update"],
      sudo: COMMANDS,
    })
    if (res.value !== value) {
      setValue(res.value)
      lastWasTab.current = false
    } else if (res.matches.length > 1 && lastWasTab.current) {
      print(line(...prompt(here), { t: value, c: "text-white/90" }), line(...res.matches.map((m, i) => ({ t: (i ? "  " : "") + m, c: m.endsWith("/") ? DIR : "text-white/80" }))))
      lastWasTab.current = false
    } else {
      lastWasTab.current = res.matches.length > 1
    }
  }

  function walkHistory(dir: -1 | 1) {
    const h = history.current
    if (!h.length) return
    let i = histIdx.current
    if (i === null) {
      if (dir === 1) return
      draft.current = value
      i = h.length
    }
    i += dir
    if (i < 0) i = 0
    if (i >= h.length) {
      histIdx.current = null
      return setValue(draft.current)
    }
    histIdx.current = i
    setValue(h[i])
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.nativeEvent.isComposing) return
    const k = e.key.toLowerCase()
    const ctrl = e.ctrlKey && !e.metaKey && !e.altKey
    if (e.key !== "Tab") lastWasTab.current = false
    if (ctrl && k === "c") {
      const el = e.currentTarget
      if (!busy && el.selectionStart !== el.selectionEnd) return // a real copy
      e.preventDefault()
      return interrupt()
    }
    if (ctrl && k === "l") {
      e.preventDefault()
      return setLines([])
    }
    if (e.key === "Escape") return e.currentTarget.blur()
    if (busy) return
    if (ctrl && k === "d" && !value) {
      e.preventDefault()
      return os.close(windowId)
    }
    if (e.key === "Enter") {
      e.preventDefault()
      const v = value
      setValue("")
      histIdx.current = null
      return run(v)
    }
    if (e.key === "Tab" && !e.shiftKey) {
      e.preventDefault() // Shift+Tab and Esc still leave the terminal
      return onTab()
    }
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault()
      walkHistory(e.key === "ArrowUp" ? -1 : 1)
    }
  }

  function onClick(e: MouseEvent<HTMLDivElement>) {
    const target = e.target as HTMLElement
    const action = target.closest<HTMLElement>("[data-path],[data-cmd]")
    if (action?.dataset.path) {
      os.openPath(action.dataset.path)
      return
    }
    if (action?.dataset.cmd) {
      if (!busy) run(action.dataset.cmd)
      inputRef.current?.focus({ preventScroll: true })
      return
    }
    if (target.closest("a") || !window.getSelection()?.isCollapsed) return
    inputRef.current?.focus({ preventScroll: true })
  }

  useEffect(() => {
    latest.current = { os, run }
  })

  // GNOME-style window title: user@host: ~/path
  useEffect(() => {
    latest.current.os.setTitle(windowId, `${USER_HOST}: ${displayPath(here)}`)
  }, [here, windowId])

  // Keyboard follows window focus (not on phones, where focusing pops the keyboard).
  const focused = os.focusedId === windowId
  useEffect(() => {
    const el = inputRef.current
    if (!el) return
    if (focused && !os.isMobile) el.focus({ preventScroll: true })
    else if (!focused && document.activeElement === el) el.blur()
  }, [focused, os.isMobile])

  // `open terminal` with { run: "neofetch" } runs it once, right after the motd.
  const ranArgs = useRef(false)
  useEffect(() => {
    if (ranArgs.current || !args.run) return
    ranArgs.current = true
    latest.current.run(args.run)
  }, [args.run])

  // Cancel a running apt when the window closes.
  useEffect(() => () => void (task.current = null), [])

  useLayoutEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [lines, busy])

  return (
    <div
      onClick={onClick}
      className="h-full min-h-0 bg-[#08080c] font-mono text-sm leading-5 text-white/85 selection:bg-orange-500/30"
    >
      <div ref={scrollRef} className="h-full overflow-auto overscroll-contain px-3 py-2 [scrollbar-color:rgb(255_255_255/0.15)_transparent] [scrollbar-width:thin] sm:px-4 sm:py-3">
        <div role="log" aria-label={t.outputLabel}>
          {lines.map((l) => (
            <Row key={l.id} segs={l.segs} />
          ))}
        </div>
        <div className="flex min-h-5 flex-wrap items-baseline">
          <span aria-hidden className={`whitespace-pre-wrap [overflow-wrap:anywhere] ${busy ? "opacity-0" : ""}`}>
            {prompt(here).map((s, i) => (
              <span key={i} className={s.c}>
                {s.t}
              </span>
            ))}
          </span>
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              lastWasTab.current = false
            }}
            onKeyDown={onKeyDown}
            readOnly={busy}
            aria-label={t.inputLabel}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="send"
            className={`min-w-[10ch] flex-1 bg-transparent p-0 text-white/90 outline-none ${busy ? "caret-transparent" : "caret-orange-400"}`}
          />
        </div>
      </div>
    </div>
  )
}

const Row = memo(function Row({ segs }: { segs: Seg[] }) {
  return (
    <div className="min-h-5 whitespace-pre-wrap [overflow-wrap:anywhere]">
      {segs.map((s, i) => {
        const style = s.color ? { color: s.color } : undefined
        if (s.href) {
          const external = /^https?:/.test(s.href)
          return (
            <a key={i} href={s.href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} className={`${s.c ?? ""} ${LINK}`} style={style}>
              {s.t}
            </a>
          )
        }
        if (s.path || s.cmd) {
          return (
            <button key={i} type="button" data-path={s.path} data-cmd={s.cmd} className={`${s.c ?? ""} ${LINK} text-left`} style={style}>
              {s.t}
            </button>
          )
        }
        return (
          <span key={i} className={s.c} style={style}>
            {s.t}
          </span>
        )
      })}
    </div>
  )
})
