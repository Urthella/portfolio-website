"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ArrowUpRight, Loader2, X } from "lucide-react"
import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react"

import { useContent } from "@/data/i18n"
import { cn } from "@/lib/utils"

type Status = "idle" | "sending" | "success" | "error"

const field = "w-full bg-transparent text-[15px] text-white caret-white outline-none placeholder:text-white/30"
// the venom pill's own lettering, so the send slab reads as a sibling of the collaborate button
const pillText = "text-[17px] font-bold tracking-[-0.02em] text-[#f4f4f4] [text-shadow:0_1px_0_rgba(0,0,0,.75),0_-0.5px_0_rgba(255,255,255,.25)]"

/**
 * The contact form as four panels (name, mail, message, send) hanging under the
 * collaborate button, `top` px down the footer. With `goo` the Venom Button
 * bursts them out of its pill: a panel is only a frame for its fields, the goo
 * draws the glossy slab under it (it finds them by [data-goo-panel], see the
 * button's `burst`) and fades the content in through --goo once the slab is
 * full. Without it (lite mode, touch, reduced motion) they are plain dark
 * panels that pop in. Closes on Esc, the ×, a click outside or a successful
 * send; sends through EmailJS like the old footer form.
 */
export function ContactWindows({ open, onClose, top, goo }: { open: boolean; onClose: () => void; top: number; goo: boolean }) {
  const t = useContent().ui.contact
  const reduce = useReducedMotion()
  const [form, setForm] = useState({ name: "", email: "", message: "" })
  const [status, setStatus] = useState<Status>("idle")
  const rootRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  // which opening of the form a send belongs to, so a late reply never closes a reopened form
  const session = useRef(0)
  const openRef = useRef(open)
  useEffect(() => {
    openRef.current = open
  })

  const close = useCallback(() => {
    clearTimeout(closeTimer.current)
    setStatus((s) => (s === "sending" ? s : "idle"))
    onClose()
  }, [onClose])

  useEffect(() => {
    if (!open) return
    session.current++
    const root = rootRef.current
    // bring the panels into view (clear of the nav and the bottom blur, see scroll-mt / pb), then
    // the first field once it has started to appear
    root?.scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" })
    const id = window.setTimeout(() => nameRef.current?.focus({ preventScroll: true }), 150)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
      // it is modal: Tab and Shift+Tab go round the form's own fields and buttons
      else if (e.key === "Tab" && root) {
        const items = Array.from(root.querySelectorAll<HTMLElement>("input, textarea, button:not([disabled])"))
        const first = items[0], last = items[items.length - 1]
        const inside = root.contains(document.activeElement)
        if (e.shiftKey && (!inside || document.activeElement === first)) { e.preventDefault(); last?.focus() }
        else if (!e.shiftKey && (!inside || document.activeElement === last)) { e.preventDefault(); first?.focus() }
      }
    }
    // scrolled right away from it: close, rather than leave the page inverted around nothing
    let seen = false
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) seen = true
      else if (seen) close()
    })
    if (root) io.observe(root)
    window.addEventListener("keydown", onKey)
    return () => {
      window.clearTimeout(id)
      io.disconnect()
      window.removeEventListener("keydown", onKey)
    }
  }, [open, close, reduce])

  useEffect(() => () => clearTimeout(closeTimer.current), [])

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (status === "sending") return
    setStatus("sending")
    const mine = session.current
    try {
      const emailjs = (await import("@emailjs/browser")).default
      const publicKey = "lG13LwoQUrMXT7Igo"
      emailjs.init({ publicKey })
      await emailjs.send(
        "service_to6ga2c",
        "template_9ypkl6o",
        { from_name: form.name, from_email: form.email, message: form.message },
        publicKey,
      )
      setForm({ name: "", email: "", message: "" })
      // closed (or closed and reopened) while it was sending: nothing left to show
      if (!openRef.current || session.current !== mine) return setStatus("idle")
      setStatus("success")
      // let the thank-you show, then the panels go home
      closeTimer.current = setTimeout(close, 1800)
    } catch {
      setStatus(openRef.current && session.current === mine ? "error" : "idle")
    }
  }

  const panel = (i: number, body: ReactNode, className?: string) => (
    <motion.div
      data-goo-panel
      initial={goo ? false : reduce ? { opacity: 0 } : { opacity: 0, y: -14, scale: 0.97 }}
      animate={
        goo
          ? undefined
          : { opacity: 1, y: 0, scale: 1, transition: reduce ? { duration: 0.2 } : { type: "spring", stiffness: 260, damping: 22, delay: i * 0.06 } }
      }
      exit={goo ? undefined : { opacity: 0, transition: { duration: 0.15 } }}
      className={cn(
        "group rounded-[22px] px-5 py-3 focus-within:ring-1 focus-within:ring-white/25",
        !goo && "border border-white/12 bg-[#0c0c10]/95 shadow-[0_28px_70px_-12px_rgba(0,0,0,0.85)] backdrop-blur-md",
        className,
      )}
    >
      {/* the goo fades this in once its slab has filled */}
      <div style={goo ? { opacity: "var(--goo, 0)" } : undefined}>{body}</div>
    </motion.div>
  )

  const label = (htmlFor: string, text: string) => (
    <label htmlFor={htmlFor} className="mb-1 block truncate font-mono text-xs text-white/50 transition-colors group-focus-within:text-white/80">
      {text}
    </label>
  )

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="contact-windows"
          ref={rootRef}
          role="dialog"
          aria-modal="true"
          aria-label={t.formTitle}
          // keeps the panels (and their boxes) around while the goo reels them back into the pill,
          // without catching clicks meanwhile
          exit={{ opacity: 1, pointerEvents: "none", transition: { duration: goo ? 0.9 : 0.2 } }}
          // pb-28 / scroll-mt-24: scrolled into view, the panels stay clear of the bottom blur band and the nav
          className="absolute inset-x-0 z-[4] scroll-mt-24 px-4 pb-28"
          style={{ top }}
        >
          {/* a click anywhere outside the panels closes them */}
          <div aria-hidden onClick={close} className="fixed inset-0" />
          <form onSubmit={onSubmit} className="relative mx-auto grid w-full max-w-2xl gap-4 sm:grid-cols-2">
            {panel(0, <>
              {label("cw-name", t.name)}
              <input ref={nameRef} id="cw-name" name="name" value={form.name} onChange={onChange} required autoComplete="name" className={field} placeholder={t.namePlaceholder} />
            </>)}
            {panel(1, <>
              {label("cw-email", t.email)}
              <input id="cw-email" name="email" type="email" value={form.email} onChange={onChange} required autoComplete="email" className={field} placeholder={t.emailPlaceholder} />
            </>)}
            {panel(2, <>
              {label("cw-message", t.message)}
              <textarea id="cw-message" name="message" value={form.message} onChange={onChange} required rows={4} className={cn(field, "resize-none")} placeholder={t.messagePlaceholder} />
              <p aria-live="polite" className="text-xs">
                {status === "success" && <span className="text-green-400">{t.success}</span>}
                {/* literal red: error feedback must stay red under every theme */}
                {status === "error" && <span className="text-[#f87171]">{t.error}</span>}
              </p>
            </>, "sm:col-span-2")}
            {panel(3,
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={close}
                  aria-label={t.close}
                  className="grid h-10 w-10 place-items-center rounded-full text-white/55 outline-none transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white/50"
                >
                  <X aria-hidden className="h-4 w-4" />
                </button>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className={cn(
                    "inline-flex h-10 items-center gap-2 rounded-full px-4 outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-white/50 disabled:opacity-60",
                    pillText,
                  )}
                >
                  {status === "sending" ? (
                    <>
                      <Loader2 aria-hidden className="h-4 w-4 animate-spin" /> {t.sending}
                    </>
                  ) : (
                    <>
                      {t.send} <ArrowUpRight aria-hidden className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>,
              "justify-self-end rounded-[28px] px-2 py-2 sm:col-span-2",
            )}
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
