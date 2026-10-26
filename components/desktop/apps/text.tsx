"use client"

import { BookOpen, Code, FileQuestion, FileText, FolderOpen, Lock, type LucideIcon } from "lucide-react"
import { useEffect, useState, type ReactNode } from "react"

import { APPS } from "@/components/desktop/apps"
import { basename, displayPath, HOME, lookup, resolvePath, type FsDir } from "@/components/desktop/fs"
import { useNode, useOS, useT } from "@/components/desktop/os"
import type { AppProps } from "@/components/desktop/types"
import type { Lang } from "@/data/i18n"

/** Text Editor: a read-only viewer. Markdown renders lightly; everything else shows as numbered source. */

const FOCUS = "outline-none focus-visible:ring-2 focus-visible:ring-orange-400/70"

const en = {
  untitled: "Text Editor",
  readOnly: "Read-only",
  viewMode: "View",
  rendered: "Rendered",
  source: "Source",
  noFile: "No file open",
  noFileHint: "Open a file from Files or the Terminal to read it here.",
  missing: "File not found",
  missingHint: (p: string) => `Nothing exists at ${p}.`,
  isDir: "That's a folder",
  isDirHint: "Folders open in Files.",
  binary: "Can't show this file as text",
  binaryHint: "It isn't a text file, but another app can open it.",
  openWith: (app: string) => `Open with ${app}`,
  browse: "Browse files",
  openFolder: "Open in Files",
}

const STR: Record<Lang, typeof en> = {
  en,
  tr: {
    untitled: "Metin Düzenleyici",
    readOnly: "Salt okunur",
    viewMode: "Görünüm",
    rendered: "Önizleme",
    source: "Kaynak",
    noFile: "Açık dosya yok",
    noFileHint: "Burada okumak için Dosyalar'dan ya da Terminal'den bir dosya aç.",
    missing: "Dosya bulunamadı",
    missingHint: (p) => `${p} konumunda bir şey yok.`,
    isDir: "Bu bir klasör",
    isDirHint: "Klasörler Dosyalar'da açılır.",
    binary: "Bu dosya metin olarak gösterilemiyor",
    binaryHint: "Metin dosyası değil ama başka bir uygulama açabilir.",
    openWith: (app) => `${app} ile aç`,
    browse: "Dosyalara göz at",
    openFolder: "Dosyalar'da aç",
  },
}

// ---------- light markdown ----------

type Block = { type: "h1" | "h2" | "p" | "ul"; lines: string[] }

function parseMarkdown(md: string): Block[] {
  const blocks: Block[] = []
  let cur = null as Block | null
  for (const line of md.split("\n")) {
    if (!line.trim()) {
      cur = null
      continue
    }
    const h = /^(#{1,2}) (.*)$/.exec(line)
    if (h) {
      blocks.push({ type: h[1].length === 1 ? "h1" : "h2", lines: [h[2]] })
      cur = null
      continue
    }
    const li = /^- (.*)$/.exec(line)
    const type = li ? "ul" : "p"
    if (cur?.type !== type) {
      cur = { type, lines: [] }
      blocks.push(cur)
    }
    cur.lines.push(li ? li[1] : line)
  }
  return blocks
}

// `code` | bare URL | a ~/ or / path standing on its own (not the "/ML" in "AI/ML")
const INLINE = /`([^`]+)`|(https?:\/\/[^\s<>"]+)|(?<=^|[\s(])(~\/[\w./-]*|\/[\w.-][\w./-]*)/g
const LINK = "text-orange-300 underline decoration-orange-500/40 underline-offset-2 transition-colors hover:decoration-orange-300 [overflow-wrap:anywhere]"

function inline(text: string, fs: FsDir, openPath: (abs: string) => void): ReactNode[] {
  const out: ReactNode[] = []
  let last = 0
  for (const m of text.matchAll(INLINE)) {
    const at = m.index
    out.push(text.slice(last, at))
    last = at + m[0].length
    if (m[1]) {
      out.push(
        <code key={at} className="rounded bg-white/[0.07] px-1.5 py-0.5 font-mono text-[0.85em] text-orange-200">
          {m[1]}
        </code>,
      )
      continue
    }
    // keep sentence punctuation out of the link
    const tail = /[.,;:!?)]+$/.exec(m[0])?.[0] ?? ""
    const tok = m[0].slice(0, m[0].length - tail.length)
    const abs = m[3] ? resolvePath(HOME, tok) : ""
    if (m[2] && tok.length > "https://".length)
      out.push(
        <a key={at} href={tok} target="_blank" rel="noopener noreferrer" className={LINK}>
          {tok}
        </a>,
      )
    else if (m[3] && tok && lookup(fs, abs))
      out.push(
        <button key={at} type="button" onClick={() => openPath(abs)} className={`${FOCUS} rounded-sm font-mono text-[0.92em] ${LINK}`}>
          {tok}
        </button>,
      )
    else out.push(tok)
    out.push(tail)
  }
  out.push(text.slice(last))
  return out
}

function Markdown({ text, fs, openPath }: { text: string; fs: FsDir; openPath: (abs: string) => void }) {
  const lines = (b: Block) =>
    b.lines.map((l, i) => (
      <span key={i}>
        {i > 0 && <br />}
        {inline(l, fs, openPath)}
      </span>
    ))
  return (
    <article className="mx-auto max-w-[68ch] px-5 py-7 text-[15px] leading-7 text-white/70 sm:px-8">
      {parseMarkdown(text).map((b, i) => {
        if (b.type === "h1")
          return (
            <h1 key={i} className="mb-3 text-2xl font-semibold tracking-tight text-white first:mt-0 sm:text-[1.7rem]">
              {lines(b)}
            </h1>
          )
        if (b.type === "h2")
          return (
            <h2 key={i} className="mt-8 mb-2 flex items-center gap-2.5 text-base font-semibold text-white/90">
              <span aria-hidden className="h-4 w-1 rounded-full bg-orange-500" />
              <span>{lines(b)}</span>
            </h2>
          )
        if (b.type === "ul")
          return (
            <ul key={i} className="my-3 space-y-1.5">
              {b.lines.map((l, j) => (
                <li key={j} className="relative pl-5 before:absolute before:top-[0.7em] before:left-1 before:h-1.5 before:w-1.5 before:rounded-full before:bg-orange-400/80">
                  {inline(l, fs, openPath)}
                </li>
              ))}
            </ul>
          )
        return (
          <p key={i} className="my-3">
            {lines(b)}
          </p>
        )
      })}
    </article>
  )
}

function Source({ text }: { text: string }) {
  const lines = text.replace(/\n$/, "").split("\n")
  const gutter = `${String(lines.length).length + 2.5}ch`
  return (
    <div className="min-h-full py-3 font-mono text-[13px] leading-6">
      {lines.map((l, i) => (
        <div key={i} className="flex">
          <span aria-hidden style={{ width: gutter }} className="shrink-0 pr-3 text-right text-white/25 select-none">
            {i + 1}
          </span>
          <span className="min-w-0 flex-1 pr-4 pl-3 whitespace-pre-wrap text-white/80 [overflow-wrap:anywhere]">{l || " "}</span>
        </div>
      ))}
    </div>
  )
}

function Notice({ icon: Icon, title, hint, action }: { icon: LucideIcon; title: string; hint: string; action?: { label: string; onClick: () => void } }) {
  return (
    <div className="grid h-full place-items-center p-6 text-center">
      <div className="max-w-xs">
        <Icon aria-hidden strokeWidth={1.2} className="mx-auto h-12 w-12 text-white/25" />
        <p className="mt-3 text-sm font-medium text-white/80">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-white/45 [overflow-wrap:anywhere]">{hint}</p>
        {action && (
          <button
            type="button"
            onClick={action.onClick}
            className={`${FOCUS} mt-4 rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/80 transition-colors hover:border-white/30 hover:text-white`}
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  )
}

export default function TextEditor({ windowId, args }: AppProps) {
  const os = useOS()
  const t = useT(STR)
  const path = args.path ? resolvePath(HOME, args.path) : null
  const node = useNode(path ?? "/")
  const [mode, setMode] = useState<"rendered" | "source">("rendered")

  const title = path ? basename(path) : t.untitled
  // setTitle is stable (dispatch-backed) and a no-op when unchanged, so this can't loop
  const { setTitle } = os
  useEffect(() => setTitle(windowId, title), [setTitle, windowId, title])

  const file = path && node?.kind === "file" ? node : null
  // .url shortcuts have no body; show them the way they'd look on disk
  const text = file ? (file.body ?? (file.href ? `[InternetShortcut]\nURL=${file.href}` : null)) : null
  const isMd = !!path && /\.md$/i.test(path)
  const openPath = (abs: string) => os.openPath(abs)

  let body: ReactNode
  if (!path) body = <Notice icon={FileText} title={t.noFile} hint={t.noFileHint} action={{ label: t.browse, onClick: () => os.open("files") }} />
  else if (!node)
    body = <Notice icon={FileQuestion} title={t.missing} hint={t.missingHint(displayPath(path))} action={{ label: t.browse, onClick: () => os.open("files") }} />
  else if (node.kind === "dir") body = <Notice icon={FolderOpen} title={t.isDir} hint={t.isDirHint} action={{ label: t.openFolder, onClick: () => openPath(path) }} />
  else if (text === null) {
    const app = node.open?.app
    body = (
      <Notice
        icon={FileQuestion}
        title={t.binary}
        hint={t.binaryHint}
        action={app ? { label: t.openWith(APPS[app].title[os.lang]), onClick: () => os.open(app, { ...node.open?.args, path }) } : undefined}
      />
    )
  } else body = isMd && mode === "rendered" ? <Markdown text={text} fs={os.fs} openPath={openPath} /> : <Source text={text} />

  const seg = (m: typeof mode, label: string, Icon: LucideIcon) => (
    <button
      type="button"
      aria-pressed={mode === m}
      onClick={() => setMode(m)}
      className={`${FOCUS} inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs transition-colors ${
        mode === m ? "bg-white/10 text-white" : "text-white/50 hover:text-white/85"
      }`}
    >
      <Icon aria-hidden className="h-3.5 w-3.5" />
      <span className="sr-only @sm:not-sr-only">{label}</span>
    </button>
  )

  return (
    <div className="@container flex h-full min-h-0 flex-col text-white">
      {path && (
        <div className="flex shrink-0 items-center gap-2 border-b border-white/10 bg-white/[0.02] px-3 py-1.5">
          <FileText aria-hidden className="h-4 w-4 shrink-0 text-white/40" />
          <span title={path} className="min-w-0 flex-1 truncate font-mono text-xs text-white/60">
            {displayPath(path)}
          </span>
          {file && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[11px] text-white/55">
              <Lock aria-hidden className="h-3 w-3" />
              {t.readOnly}
            </span>
          )}
          {isMd && text !== null && (
            <div role="group" aria-label={t.viewMode} className="flex shrink-0 gap-0.5 rounded-lg border border-white/10 p-0.5">
              {seg("rendered", t.rendered, BookOpen)}
              {seg("source", t.source, Code)}
            </div>
          )}
        </div>
      )}
      <div className="min-h-0 flex-1 overflow-auto">{body}</div>
    </div>
  )
}
