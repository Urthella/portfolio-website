import { MEDIUM, articles as articlesEN, experiences as experiencesEN, profile } from "@/data/content"
import type { en, Lang } from "@/data/i18n"
import type { AppArgs, AppId } from "@/components/desktop/types"

/**
 * utkuOS's virtual filesystem, generated from the site content so the
 * Terminal, Files and Text Editor all browse the same real data in the
 * active language. Pure data + path helpers, no React.
 */

export type Content = typeof en

export interface FsDir {
  kind: "dir"
  name: string
  children: FsNode[]
}

export interface FsFile {
  kind: "file"
  name: string
  /** Text shown by the Text Editor and `cat` (light markdown: #, ##, - lists, blank-line paragraphs, bare URLs). */
  body?: string
  /** Opening this file launches that app instead of the Text Editor. */
  open?: { app: AppId; args?: AppArgs }
  /** A `.url` shortcut: opening it opens this link in a new tab. */
  href?: string
  /** Extra facts for UIs, e.g. { category: "Full-stack", featured: "true" } on a project README. */
  meta?: Record<string, string>
}

export type FsNode = FsDir | FsFile

export const OS = { name: "utkuOS", version: "26.10", codename: "Konya", hostname: "utkudem1rtas", user: "utku" }
export const HOME = "/home/utku"
export const TRASH = `${HOME}/.local/share/Trash`

const L = {
  en: {
    about: "About",
    languages: "Languages",
    contact: "Contact",
    stack: "Stack",
    links: "Links",
    live: "Live",
    waitlist: "Waitlist",
    source: "Source",
    privateRepo: "Private repository",
    category: "Category",
    collab: "collaboration with thefcan",
    read: "Read on Medium",
    kind: { work: "Work", volunteer: "Volunteer", education: "Education" },
    hobbiesTitle: "Off the keyboard",
    skillsTitle: "Tech I build with",
  },
  tr: {
    about: "Hakkımda",
    languages: "Diller",
    contact: "İletişim",
    stack: "Teknolojiler",
    links: "Bağlantılar",
    live: "Canlı",
    waitlist: "Bekleme listesi",
    source: "Kaynak kod",
    privateRepo: "Gizli repo",
    category: "Kategori",
    collab: "thefcan ile ortak çalışma",
    read: "Medium'da oku",
    kind: { work: "İş", volunteer: "Gönüllü", education: "Eğitim" },
    hobbiesTitle: "Klavye dışında",
    skillsTitle: "Kullandığım teknolojiler",
  },
}

/** "Okut Gitsin" -> "okut-gitsin", folding Turkish letters so paths stay typeable. */
export function slug(s: string): string {
  const fold: Record<string, string> = { ç: "c", ğ: "g", ı: "i", İ: "i", ö: "o", ş: "s", ü: "u", Ç: "c", Ğ: "g", Ö: "o", Ş: "s", Ü: "u" }
  return s
    .replace(/[çğıİöşüÇĞÖŞÜ]/g, (ch) => fold[ch] ?? ch)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

const dir = (name: string, children: FsNode[]): FsDir => ({ kind: "dir", name, children })
const file = (name: string, rest: Omit<FsFile, "kind" | "name">): FsFile => ({ kind: "file", name, ...rest })

export function buildFS(c: Content, lang: Lang): FsDir {
  const t = L[lang]
  const s = profile.socials

  const readme = [
    `# ${profile.name}`,
    `${c.profile.role} · ${c.profile.focus}`,
    `📍 ${profile.location}`,
    "",
    c.profile.tagline,
    "",
    `## ${t.about}`,
    ...c.aboutHero.intro.flatMap((p) => [p, ""]),
    ...c.about.bio.flatMap((p) => [p, ""]),
    `## ${t.languages}`,
    ...c.about.languages.map((l) => `- ${l.name}: ${l.level}`),
    "",
    `## ${t.contact}`,
    `- ${profile.email}`,
    `- ${s.github}`,
    `- ${s.linkedin}`,
    `- ${s.medium}`,
    `- https://${profile.site}`,
  ].join("\n")

  const projects = c.projects.map((p) => {
    const lines = [
      `# ${p.name}`,
      p.blurb,
      "",
      `${t.category}: ${p.category}${p.wip ? " · WIP" : ""}${p.collab ? ` · ${t.collab}` : ""}`,
      `${t.stack}: ${p.stack.join(", ")}`,
      "",
      `## ${t.links}`,
      ...(p.live ? [`- ${p.wip ? t.waitlist : t.live}: ${p.live}`] : []),
      p.privateRepo ? `- ${t.source}: ${t.privateRepo}` : `- ${t.source}: ${p.href}`,
    ]
    const children: FsNode[] = [
      file("README.md", {
        body: lines.join("\n"),
        meta: { category: p.category, featured: String(!!p.featured), blurb: p.blurb, stack: p.stack.join(", ") },
      }),
    ]
    if (p.live) children.push(file(p.wip ? "waitlist.url" : "live.url", { href: p.live }))
    if (!p.privateRepo && p.href !== p.live) children.push(file("source.url", { href: p.href }))
    return dir(slug(p.name), children)
  })

  const experience = c.experiences.map((e, i) =>
    // names come from the English data (same order in TR), so a path stays valid when the language changes
    file(`${String(i + 1).padStart(2, "0")}-${slug(experiencesEN[i]?.org ?? e.org)}.md`, {
      body: [
        `# ${e.role} @ ${e.org}`,
        `${e.date} · ${t.kind[e.kind]}`,
        "",
        ...e.points.map((pt) => `- ${pt}`),
        ...(e.stack ? ["", `${t.stack}: ${e.stack.join(", ")}`] : []),
      ].join("\n"),
      meta: { role: e.role, org: e.org, date: e.date, kind: e.kind },
    }),
  )

  const writing = c.articles.map((a, i) =>
    file(`${slug(articlesEN[i]?.title ?? a.title)}.md`, {
      body: [`# ${a.title}`, a.tag, "", a.blurb, "", `${t.read}: ${MEDIUM}`].join("\n"),
      meta: { title: a.title, tag: a.tag },
    }),
  )

  const stack = [`# ${t.skillsTitle}`, "", ...c.skillGroups.map((g) => `${g.label}: ${g.items.join(" · ")}`)].join("\n")

  const hobbies = [`# ${t.hobbiesTitle}`, "", ...c.hobbies.flatMap((h) => [`## ${h.title}`, h.text, ""])].join("\n")

  const vcard = [
    "BEGIN:VCARD",
    "VERSION:4.0",
    `FN:${profile.name}`,
    `TITLE:${c.profile.focus}`,
    `EMAIL:${profile.email}`,
    `TEL:${profile.phone}`,
    `URL:https://${profile.site}`,
    `ADR:;;;${profile.location}`,
    "END:VCARD",
  ].join("\n")

  const trash = dir("Trash", [
    dir("files", [
      dir("my-first-website-2019", [
        file("index.html", { body: '<marquee>Welcome to my homepage!!!</marquee>\n<img src="under-construction.gif">' }),
      ]),
      file("jquery-spaghetti.js", { body: "$(document).ready(function () {\n  // 2,000 lines of nested callbacks\n})" }),
      file("TODO_final_v3_REAL.txt", { body: "- learn rust\n- learn rust (for real this time)\n- stop rewriting the portfolio" }),
    ]),
  ])

  const home = dir("utku", [
    file("README.md", { body: readme }),
    file("resume.pdf", { open: { app: "resume" } }),
    file("contact.vcf", { body: vcard, open: { app: "mail" } }),
    file("stack.txt", { body: stack }),
    file("hobbies.md", { body: hobbies }),
    dir("projects", projects),
    dir("experience", experience),
    dir("writing", writing),
    dir(".config", [dir("utkuos", [file("accent", { body: "accent color lives in Settings → Appearance", open: { app: "settings" } })])]),
    dir(".local", [dir("share", [trash])]),
    file(".bash_history", {
      body: [
        'git commit -m "fix: final fix"',
        'git commit -m "fix: final final fix"',
        "docker compose up --build   # works on my machine",
        "kubectl get pods -A",
        "sudo rm -rf node_modules && npm i",
        "npm run dev",
      ].join("\n"),
    }),
  ])

  const osRelease = [
    `NAME="${OS.name}"`,
    `VERSION="${OS.version} (${OS.codename})"`,
    "ID=utkuos",
    "ID_LIKE=debian",
    `PRETTY_NAME="${OS.name} ${OS.version}"`,
    `HOME_URL="https://${profile.site}"`,
  ].join("\n")

  return dir("", [
    dir("etc", [file("os-release", { body: osRelease }), file("hostname", { body: OS.hostname })]),
    dir("home", [home]),
    dir("tmp", []),
  ])
}

// ---------- path helpers (all paths absolute, "/"-separated) ----------

/** Resolve `input` against `cwd`: handles ~, ., .., absolute and relative paths. */
export function resolvePath(cwd: string, input: string): string {
  const raw = input.trim() || "~"
  const start = raw === "~" || raw.startsWith("~/") ? HOME + raw.slice(1) : raw.startsWith("/") ? raw : `${cwd}/${raw}`
  const out: string[] = []
  for (const part of start.split("/")) {
    if (!part || part === ".") continue
    if (part === "..") out.pop()
    else out.push(part)
  }
  return "/" + out.join("/")
}

export function lookup(root: FsDir, abs: string): FsNode | null {
  let node: FsNode = root
  for (const part of abs.split("/").filter(Boolean)) {
    if (node.kind !== "dir") return null
    const next: FsNode | undefined = node.children.find((ch) => ch.name === part)
    if (!next) return null
    node = next
  }
  return node
}

/** "/home/utku/projects" -> "~/projects" */
export const displayPath = (abs: string) => (abs === HOME ? "~" : abs.startsWith(HOME + "/") ? "~" + abs.slice(HOME.length) : abs)

export const basename = (abs: string) => abs.split("/").filter(Boolean).pop() ?? "/"

export const parentPath = (abs: string) => resolvePath(abs, "..")

export const isHidden = (n: FsNode) => n.name.startsWith(".")

/** Directory entries: folders first, then files, alphabetical; dotfiles only when asked. */
export function listDir(d: FsDir, showHidden = false): FsNode[] {
  return d.children
    .filter((n) => showHidden || !isHidden(n))
    .sort((a, b) => (a.kind === b.kind ? a.name.localeCompare(b.name) : a.kind === "dir" ? -1 : 1))
}
