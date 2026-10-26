import { HOME, listDir, lookup, resolvePath, type FsDir, type FsNode } from "@/components/desktop/fs"

/**
 * The Terminal's pure parts: word splitting, flag parsing, Tab completion,
 * tree layout and output linkifying. No React, so selfcheck.ts can run them.
 */

/** One run of styled output text. `path` (absolute) opens via openPath, `cmd` runs a command, `href` is a link. */
export interface Seg {
  t: string
  c?: string
  color?: string
  href?: string
  path?: string
  cmd?: string
}

/** Every command `help` lists, in completion order. Hidden easter eggs are not here. */
export const COMMANDS = [
  "help", "man", "ls", "cd", "pwd", "cat", "open", "tree",
  "whoami", "neofetch", "projects", "contact", "socials",
  "theme", "lang", "echo", "clear", "history", "date", "uname", "exit",
  "git", "apt", "sudo", "rm",
]

export const GROUPS: [key: "explore" | "about" | "system" | "tooling", names: string[]][] = [
  ["explore", ["ls", "cd", "pwd", "cat", "tree", "open"]],
  ["about", ["whoami", "neofetch", "projects", "contact", "socials"]],
  ["system", ["theme", "lang", "echo", "clear", "history", "date", "uname", "man", "help", "exit"]],
  ["tooling", ["git", "apt", "sudo", "rm"]],
]

/**
 * Split a command line into words like bash: "double" and 'single' quotes,
 * backslash escapes, $VAR expansion (not inside single quotes) and a leading
 * ~ expanded to HOME. Returns null on an unclosed quote.
 */
export function tokenize(line: string, env: Record<string, string> = {}): string[] | null {
  const out: string[] = []
  let cur = ""
  let inWord = false
  let quote: '"' | "'" | null = null
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (quote === "'") {
      if (ch === "'") quote = null
      else cur += ch
      continue
    }
    if (ch === "\\" && i + 1 < line.length) {
      cur += line[++i]
      inWord = true
    } else if (quote && ch === quote) {
      quote = null
    } else if (!quote && (ch === '"' || ch === "'")) {
      quote = ch
      inWord = true
    } else if (ch === "$" && /[A-Za-z_]/.test(line[i + 1] ?? "")) {
      const name = /^[A-Za-z_]\w*/.exec(line.slice(i + 1))![0]
      cur += env[name] ?? ""
      i += name.length
      inWord = true
    } else if (!quote && /\s/.test(ch)) {
      if (inWord) out.push(cur)
      cur = ""
      inWord = false
    } else if (!quote && !inWord && ch === "~" && /^(\/|\s|$)/.test(line.slice(i + 1, i + 2))) {
      cur += HOME
      inWord = true
    } else {
      cur += ch
      inWord = true
    }
  }
  if (quote) return null
  if (inWord) out.push(cur)
  return out
}

/** `-la --oneline x` -> flags {l, a, oneline}, args [x]. A lone "-" is an argument; "--" ends the flags. */
export function parseArgs(argv: string[]): { flags: Set<string>; args: string[] } {
  const flags = new Set<string>()
  const args: string[] = []
  let done = false
  for (const a of argv) {
    if (done || a === "-" || !a.startsWith("-")) args.push(a)
    else if (a === "--") done = true
    else if (a.startsWith("--")) flags.add(a.slice(2))
    else for (const f of a.slice(1)) flags.add(f)
  }
  return { flags, args }
}

/** "#abc", "abc", "#F97316" -> "#aabbcc" / "#f97316"; anything else -> null. */
export function parseHex(v: string): string | null {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(v.trim())
  if (!m) return null
  const h = m[1].length === 3 ? [...m[1]].map((c) => c + c).join("") : m[1]
  return "#" + h.toLowerCase()
}

export function commonPrefix(words: string[]): string {
  if (!words.length) return ""
  let p = words[0]
  for (const w of words) while (!w.startsWith(p)) p = p.slice(0, -1)
  return p
}

interface Candidate {
  full: string // replacement for the word being completed
  label: string // what a double Tab lists
}

function completePath(word: string, cwd: string, root: FsDir, dirsOnly: boolean): Candidate[] {
  if (word === "~") return [{ full: "~/", label: "~/" }]
  const slash = word.lastIndexOf("/")
  const dirPart = word.slice(0, slash + 1)
  const base = word.slice(slash + 1)
  if (base === "..") return [{ full: dirPart + "../", label: "../" }]
  const dir = lookup(root, resolvePath(cwd, dirPart || "."))
  if (!dir || dir.kind !== "dir") return []
  return listDir(dir, base.startsWith("."))
    .filter((n) => n.name.startsWith(base) && (!dirsOnly || n.kind === "dir"))
    .map((n) => {
      const label = n.name + (n.kind === "dir" ? "/" : "")
      return { full: dirPart + label, label }
    })
}

export interface Completion {
  /** The new input line. */
  value: string
  /** Listed by a double Tab when the completion is ambiguous (empty otherwise). */
  matches: string[]
}

/**
 * Bash-style Tab completion of the last word of `input`: command names for the
 * first word; afterwards `argWords[cmd]` (subcommands, presets, app ids) and,
 * unless the command only takes words (open takes both), paths. A unique match
 * is completed (plus a space, or "/" for folders); several complete to their
 * common prefix and come back in `matches`.
 */
export function complete(
  input: string,
  cwd: string,
  root: FsDir,
  commands: string[],
  argWords: Record<string, string[]> = {},
): Completion {
  const at = input.lastIndexOf(" ") + 1
  const head = input.slice(0, at)
  const word = input.slice(at)
  const cmd = head.trim().split(/\s+/)[0]
  let cands: Candidate[]
  if (!head.trim()) {
    cands = commands.filter((c) => c.startsWith(word)).map((c) => ({ full: c, label: c }))
  } else {
    const words = argWords[cmd]
    cands = (words ?? []).filter((w) => w.startsWith(word)).map((w) => ({ full: w, label: w }))
    if (!words || cmd === "open") cands = cands.concat(completePath(word, cwd, root, cmd === "cd"))
  }
  if (!cands.length) return { value: input, matches: [] }
  if (cands.length === 1) {
    const f = cands[0].full
    return { value: head + f + (f.endsWith("/") ? "" : " "), matches: [] }
  }
  return { value: head + commonPrefix(cands.map((c) => c.full)), matches: cands.map((c) => c.label) }
}

export interface TreeRow {
  prefix: string
  node: FsNode
  abs: string
}

/** `tree` layout: one row per entry with its ├── / └── prefix, folders first. */
export function tree(dir: FsDir, abs: string, showHidden = false, prefix = ""): TreeRow[] {
  const kids = listDir(dir, showHidden)
  return kids.flatMap((node, i) => {
    const last = i === kids.length - 1
    const row = { prefix: prefix + (last ? "└── " : "├── "), node, abs: `${abs === "/" ? "" : abs}/${node.name}` }
    return node.kind === "dir" ? [row, ...tree(node, row.abs, showHidden, prefix + (last ? "    " : "│   "))] : [row]
  })
}

const LINK = /(https?:\/\/[^\s<>"'()]*[^\s<>"'().,;:!?])|([\w.+-]+@[\w-]+(?:\.[\w-]+)+)|((?:~|\/[\w.-]+)\/[\w./-]*[\w/])/g

/** Split text into segments with clickable URLs, emails and ~/ or absolute paths (paths only when they exist in `root`). */
export function linkify(text: string, c?: string, root?: FsDir): Seg[] {
  const segs: Seg[] = []
  let last = 0
  for (const m of text.matchAll(LINK)) {
    const [tok, url, mail, path] = m
    const i = m.index ?? 0
    const abs = path ? resolvePath(HOME, path) : ""
    if (path && (!root || !lookup(root, abs))) continue
    if (i > last) segs.push({ t: text.slice(last, i), c })
    segs.push(url ? { t: tok, c, href: url } : mail ? { t: tok, c, href: `mailto:${mail}` } : { t: tok, c, path: abs })
    last = i + tok.length
  }
  if (last < text.length || !segs.length) segs.push({ t: text.slice(last), c })
  return segs
}

// apt install <pkg> -> the project that "provides" it.
const PKG_ALIAS: Record<string, string> = {
  k8s: "kubernetes", kubectl: "kubernetes", helm: "kubernetes", minikube: "kubernetes", kind: "kubernetes",
  celery: "queue", bullmq: "queue", sidekiq: "queue", nmap: "port", masscan: "port", netcat: "port",
  nginx: "rate", envoy: "rate", kong: "rate", langchain: "rag", llamaindex: "rag", llm: "rag", ollama: "rag",
  crdt: "yjs", postgres: "postgresql", psql: "postgresql", node: "node.js", nodejs: "node.js", npm: "node.js",
  golang: "go", cargo: "rust", rustc: "rust", sklearn: "scikit-learn", pandas: "scikit-learn", numpy: "scikit-learn",
  "redis-server": "redis", "rabbitmq-server": "rabbitmq", "docker.io": "docker", "docker-ce": "docker",
}

/** The project whose stack (or name, or blurb) best matches a package name; the first project otherwise. */
export function suggestProject<P extends { name: string; stack: string[]; blurb: string }>(pkg: string, projects: P[]): P {
  const k = pkg.toLowerCase()
  const q = (Object.hasOwn(PKG_ALIAS, k) ? PKG_ALIAS[k] : pkg).toLowerCase()
  return (
    projects.find((p) => p.stack.some((s) => s.toLowerCase() === q)) ??
    projects.find((p) => [p.name, ...p.stack].join(" ").toLowerCase().includes(q)) ??
    projects.find((p) => q.length > 2 && p.blurb.toLowerCase().includes(q)) ??
    projects[0]
  )
}

/** Deterministic fake hex id (git hashes, container ids). */
export function fakeHash(s: string, n = 7): string {
  let out = ""
  let h = 2166136261
  while (out.length < n) {
    for (const ch of s + out.length) h = Math.imul(h ^ ch.charCodeAt(0), 16777619)
    out += (h >>> 0).toString(16).padStart(8, "0")
  }
  return out.slice(0, n)
}
