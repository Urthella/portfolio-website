"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Loader2, Send, X } from "lucide-react"
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react"

import { useContent } from "@/data/i18n"
import { cn } from "@/lib/utils"

type Status = "idle" | "sending" | "success" | "error"
type Key = "name" | "email" | "message" | "send"

// Each window flies in from (and back out to) its own edge of the screen.
const EDGE: Record<Key, { x: string | number; y: string | number }> = {
  name: { x: "-110vw", y: 0 },
  email: { x: "110vw", y: 0 },
  message: { x: 0, y: "110vh" },
  send: { x: "110vw", y: "30vh" },
}
const ORDER: Key[] = ["name", "email", "message", "send"]

const field =
  "w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-orange-500/50 focus:bg-white/[0.06]"

/**
 * The contact form as four little utkuOS-style windows (name, mail, message,
 * send) that fly in from the screen edges when the Venom Button is clicked
 * and fly back out on close (Esc, any title-bar ×, a click outside) or after
 * a successful send. Sends through EmailJS exactly like the old footer form.
 */
export function ContactWindows({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useContent().ui.contact
  const reduce = useReducedMotion()
  const [form, setForm] = useState({ name: "", email: "", message: "" })
  const [status, setStatus] = useState<Status>("idle")
  const nameRef = useRef<HTMLInputElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    if (!open) return
    // focus the first field once its window has started flying in
    const id = window.setTimeout(() => nameRef.current?.focus({ preventScroll: true }), 150)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => {
      window.clearTimeout(id)
      window.removeEventListener("keydown", onKey)
    }
  }, [open, onClose])

  useEffect(() => () => clearTimeout(closeTimer.current), [])

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (status === "sending") return
    setStatus("sending")
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
      setStatus("success")
      setForm({ name: "", email: "", message: "" })
      // let the thank-you show, then the windows fly home
      closeTimer.current = setTimeout(() => {
        onClose()
        setStatus("idle")
      }, 1800)
    } catch {
      setStatus("error")
    }
  }

  const win = (key: Key, title: ReactNode, body: ReactNode, className?: string) => {
    const i = ORDER.indexOf(key)
    return (
      <motion.section
        key={key}
        initial={reduce ? { opacity: 0 } : { ...EDGE[key], opacity: 0 }}
        animate={{
          x: 0,
          y: 0,
          opacity: 1,
          transition: reduce ? { duration: 0.2 } : { type: "spring", stiffness: 110, damping: 17, delay: i * 0.09 },
        }}
        exit={
          reduce
            ? { opacity: 0, transition: { duration: 0.15 } }
            : { ...EDGE[key], opacity: 0, transition: { duration: 0.5, ease: [0.5, 0, 0.75, 0], delay: (ORDER.length - 1 - i) * 0.05 } }
        }
        className={cn(
          "overflow-hidden rounded-xl border border-white/12 bg-[#0c0c10]/95 shadow-[0_28px_70px_-12px_rgba(0,0,0,0.85)] backdrop-blur-md",
          className,
        )}
      >
        <header className="flex h-9 items-center justify-between gap-2 border-b border-white/10 bg-[#1b1b21] pl-3 pr-1.5">
          {title}
          <button
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className="grid h-6 w-6 place-items-center rounded-full text-white/50 outline-none transition-colors hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white/50"
          >
            <X aria-hidden className="h-3.5 w-3.5" />
          </button>
        </header>
        <div className="p-3">{body}</div>
      </motion.section>
    )
  }

  const label = (htmlFor: string, text: string) => (
    <label htmlFor={htmlFor} className="truncate font-mono text-xs text-white/60">
      {text}
    </label>
  )

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="contact-windows"
          role="dialog"
          aria-modal="true"
          aria-label={t.formTitle}
          // keeps the dialog mounted until every window has flown out
          exit={{ opacity: 1, transition: { duration: 0.75 } }}
          className="fixed inset-0 z-[3] grid place-items-center overflow-y-auto p-4"
        >
          <motion.div
            aria-hidden
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/25"
          />
          <form onSubmit={onSubmit} className="relative grid w-full max-w-2xl gap-3 sm:grid-cols-2">
            {win("name", label("cw-name", t.name),
              <input ref={nameRef} id="cw-name" name="name" value={form.name} onChange={onChange} required autoComplete="name" className={field} placeholder="Jane Doe" />,
            )}
            {win("email", label("cw-email", t.email),
              <input id="cw-email" name="email" type="email" value={form.email} onChange={onChange} required autoComplete="email" className={field} placeholder="jane@example.com" />,
            )}
            {win("message", label("cw-message", t.message),
              <textarea id="cw-message" name="message" value={form.message} onChange={onChange} required rows={5} className={cn(field, "resize-none")} placeholder="Let's build something…" />,
              "sm:col-span-2",
            )}
            {win("send", <span className="font-mono text-xs text-white/60">{t.send}</span>,
              <div className="grid gap-2">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-[#07070a] outline-none transition-colors hover:bg-white/85 focus-visible:ring-2 focus-visible:ring-white/60 disabled:opacity-60"
                >
                  {status === "sending" ? (
                    <>
                      <Loader2 aria-hidden className="h-4 w-4 animate-spin" /> {t.sending}
                    </>
                  ) : (
                    <>
                      <Send aria-hidden className="h-4 w-4" /> {t.send}
                    </>
                  )}
                </button>
                <p aria-live="polite" className="min-h-[1.25rem] text-center text-xs">
                  {status === "success" && <span className="text-green-400">{t.success}</span>}
                  {/* literal red: error feedback must stay red under every theme */}
                  {status === "error" && <span className="text-[#f87171]">{t.error}</span>}
                </p>
              </div>,
              "sm:col-start-2",
            )}
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
