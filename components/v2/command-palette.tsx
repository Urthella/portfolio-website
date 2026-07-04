"use client"

import { Command } from "cmdk"
import { ArrowUp, BookOpen, Copy, CornerDownLeft, Download, Github, Instagram, Languages, Linkedin } from "lucide-react"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

import { profile } from "@/data/content"
import { useContent, useLang } from "@/data/i18n"

const SECTIONS = ["about", "experience", "skills", "projects", "hobbies", "contact"] as const

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const c = useContent()
  const { lang, setLang } = useLang()
  const nav = c.ui.nav

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpen((o) => !o)
      } else if (e.key === "Escape") {
        setOpen(false)
      }
    }
    const openEvt = () => setOpen(true)
    document.addEventListener("keydown", down)
    window.addEventListener("cmdk:open", openEvt)
    return () => {
      document.removeEventListener("keydown", down)
      window.removeEventListener("cmdk:open", openEvt)
    }
  }, [])

  const run = (fn: () => void) => {
    setOpen(false)
    fn()
  }
  const goto = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  const openUrl = (url: string) => window.open(url, "_blank", "noopener,noreferrer")

  if (!mounted || !open) return null

  const itemCls =
    "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/70 data-[selected=true]:bg-white/10 data-[selected=true]:text-white"
  const groupCls =
    "[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-white/30"

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 p-4 pt-[14vh] backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <Command
        label="Command Menu"
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-neutral-950 shadow-2xl shadow-black/60"
        onClick={(e) => e.stopPropagation()}
      >
        <Command.Input
          autoFocus
          placeholder="Type a command or search..."
          className="w-full border-b border-white/10 bg-transparent px-4 py-3.5 text-sm text-white outline-none placeholder:text-white/30"
        />
        <Command.List className="max-h-[340px] overflow-y-auto p-2">
          <Command.Empty className="py-6 text-center text-sm text-white/40">No results.</Command.Empty>

          <Command.Group heading="Navigate" className={groupCls}>
            <Command.Item value="top home" className={itemCls} onSelect={() => run(() => window.scrollTo({ top: 0, behavior: "smooth" }))}>
              <ArrowUp className="h-4 w-4 text-orange-400" /> Top
            </Command.Item>
            {SECTIONS.map((id) => (
              <Command.Item key={id} value={`${id} ${nav[id]}`} className={itemCls} onSelect={() => run(() => goto(id))}>
                <CornerDownLeft className="h-4 w-4 text-orange-400" /> {nav[id]}
              </Command.Item>
            ))}
          </Command.Group>

          <Command.Group heading="Links" className={groupCls}>
            <Command.Item value="github code" className={itemCls} onSelect={() => run(() => openUrl(profile.socials.github))}>
              <Github className="h-4 w-4 text-orange-400" /> GitHub
            </Command.Item>
            <Command.Item value="linkedin" className={itemCls} onSelect={() => run(() => openUrl(profile.socials.linkedin))}>
              <Linkedin className="h-4 w-4 text-orange-400" /> LinkedIn
            </Command.Item>
            <Command.Item value="medium blog writing" className={itemCls} onSelect={() => run(() => openUrl(profile.socials.medium))}>
              <BookOpen className="h-4 w-4 text-orange-400" /> Medium
            </Command.Item>
            <Command.Item value="instagram" className={itemCls} onSelect={() => run(() => openUrl(profile.socials.instagram))}>
              <Instagram className="h-4 w-4 text-orange-400" /> Instagram
            </Command.Item>
          </Command.Group>

          <Command.Group heading="Actions" className={groupCls}>
            <Command.Item value="copy email mail" className={itemCls} onSelect={() => run(() => navigator.clipboard?.writeText(profile.email))}>
              <Copy className="h-4 w-4 text-orange-400" /> Copy email
            </Command.Item>
            <Command.Item value="download cv resume" className={itemCls} onSelect={() => run(() => openUrl(profile.resume))}>
              <Download className="h-4 w-4 text-orange-400" /> Download CV
            </Command.Item>
            <Command.Item value="language toggle tr en dil" className={itemCls} onSelect={() => run(() => setLang(lang === "en" ? "tr" : "en"))}>
              <Languages className="h-4 w-4 text-orange-400" /> {lang === "en" ? "Türkçe'ye geç" : "Switch to English"}
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
    </div>,
    document.body,
  )
}
