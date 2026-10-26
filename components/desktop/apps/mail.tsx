"use client"

import { BookOpen, Check, Copy, Github, Instagram, Linkedin, Loader2, Mail as MailIcon, Phone, Send } from "lucide-react"
import { useId, useRef, useState } from "react"

import { useT } from "@/components/desktop/os"
import type { AppProps } from "@/components/desktop/types"
import { profile } from "@/data/content"
import { cn } from "@/lib/utils"

const socials = [
  { href: profile.socials.linkedin, label: "LinkedIn", Icon: Linkedin },
  { href: profile.socials.github, label: "GitHub", Icon: Github },
  { href: profile.socials.instagram, label: "Instagram", Icon: Instagram },
  { href: profile.socials.medium, label: "Medium", Icon: BookOpen },
]

const ring = "outline-none focus-visible:ring-2 focus-visible:ring-orange-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07070a]"

const strings = {
  en: {
    contact: "Contact",
    copy: "Copy email address",
    copied: "Email address copied",
    call: "Call",
    elsewhere: "Elsewhere",
    newMessage: "New message",
    to: "To",
    name: "Name",
    email: "Email",
    subject: "Subject",
    message: "Message",
    namePh: "Jane Doe",
    emailPh: "jane@example.com",
    subjectPh: "Optional",
    messagePh: "Hi Utku, …",
    send: "Send",
    sending: "Sending…",
    success: "Message sent. I'll get back to you soon, thanks!",
    error: "Couldn't send it. Try again, or email me directly.",
    invalid: "Please fill in your name, email and message.",
    newTab: "(opens in a new tab)",
  },
  tr: {
    contact: "İletişim",
    copy: "E-posta adresini kopyala",
    copied: "E-posta adresi kopyalandı",
    call: "Ara",
    elsewhere: "Diğer hesaplar",
    newMessage: "Yeni ileti",
    to: "Kime",
    name: "Adın",
    email: "E-postan",
    subject: "Konu",
    message: "Mesaj",
    namePh: "Ayşe Yılmaz",
    emailPh: "ayse@ornek.com",
    subjectPh: "İsteğe bağlı",
    messagePh: "Merhaba Utku, …",
    send: "Gönder",
    sending: "Gönderiliyor…",
    success: "Mesajın iletildi. En kısa sürede dönerim, teşekkürler!",
    error: "Gönderilemedi. Tekrar dene ya da doğrudan e-posta at.",
    invalid: "Lütfen adını, e-postanı ve mesajını yaz.",
    newTab: "(yeni sekmede açılır)",
  },
}

type Status = "idle" | "sending" | "success" | "error" | "invalid"

export default function Mail({ args }: AppProps) {
  const t = useT(strings)
  const id = useId()
  const [form, setForm] = useState({ name: "", email: "", subject: args.subject ?? "", message: args.body ?? "" })
  const [status, setStatus] = useState<Status>("idle")
  const [copied, setCopied] = useState(false)
  const statusTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const copyTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  // Mail is single-window: opening it again (e.g. from contact.vcf) hands us new args; prefill from them.
  // A new args object means a new launch, so the same prefill applies again after a sent (cleared) form.
  const [seenArgs, setSeenArgs] = useState(args)
  if (args !== seenArgs) {
    setSeenArgs(args)
    if (args.subject !== undefined || args.body !== undefined)
      setForm((f) => ({ ...f, subject: args.subject ?? f.subject, message: args.body ?? f.message }))
  }

  const flash = (s: Status) => {
    setStatus(s)
    clearTimeout(statusTimer.current)
    if (s !== "sending") statusTimer.current = setTimeout(() => setStatus("idle"), 6000)
  }

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      clearTimeout(copyTimer.current)
      copyTimer.current = setTimeout(() => setCopied(false), 1800)
    } catch {
      // clipboard blocked (permissions / insecure context): the address is still selectable on screen
    }
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // native `required` lets whitespace through
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return flash("invalid")
    flash("sending")
    const subject = form.subject.trim()
    try {
      const emailjs = (await import("@emailjs/browser")).default
      const publicKey = "lG13LwoQUrMXT7Igo"
      emailjs.init({ publicKey })
      await emailjs.send(
        "service_to6ga2c",
        "template_9ypkl6o",
        {
          from_name: form.name,
          from_email: form.email,
          // the template has no subject field, so it rides at the top of the message
          message: subject ? `${t.subject}: ${subject}\n\n${form.message}` : form.message,
        },
        publicKey,
      )
      flash("success")
      setForm({ name: "", email: "", subject: "", message: "" })
    } catch {
      flash("error")
    }
  }

  const row =
    "flex items-center gap-3 border-b border-white/10 px-4 transition-colors @lg:px-5 has-[input:focus-visible]:bg-white/[0.03] has-[input:focus-visible]:shadow-[inset_2px_0_0_var(--color-orange-500)]"
  const rowLabel = "w-16 shrink-0 text-xs text-white/45 @lg:w-20"
  const input = "min-w-0 flex-1 bg-transparent py-2.5 text-sm text-white outline-none placeholder:text-white/25"
  const iconBtn = cn(
    "grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 text-white/55 transition-colors hover:border-orange-500/40 hover:text-white",
    ring,
  )

  return (
    <div className="@container h-full min-h-0 overflow-auto text-white">
      <div className="flex min-h-full flex-col @xl:flex-row">
        {/* contact card */}
        <aside
          aria-label={t.contact}
          className="shrink-0 border-b border-white/10 bg-white/[0.02] p-4 @xl:w-64 @xl:border-b-0 @xl:border-r @xl:p-5"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-orange-400">{t.contact}</p>

          <div className="mt-3 flex items-center gap-2">
            <a
              href={`mailto:${profile.email}`}
              className={cn("flex min-w-0 flex-1 items-center gap-2.5 rounded-lg text-sm text-white/80 transition-colors hover:text-white", ring)}
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/5 text-orange-400">
                <MailIcon aria-hidden className="h-4 w-4" />
              </span>
              <span className="truncate">{profile.email}</span>
            </a>
            <button type="button" onClick={copyEmail} aria-label={t.copy} title={t.copy} className={iconBtn}>
              {copied ? <Check aria-hidden className="h-4 w-4 text-green-400" /> : <Copy aria-hidden className="h-4 w-4" />}
            </button>
            <span role="status" className="sr-only">
              {copied ? t.copied : ""}
            </span>
          </div>

          <a
            href={`tel:${profile.phone.replace(/\s+/g, "")}`}
            aria-label={`${t.call} ${profile.phone}`}
            className={cn("mt-2 flex items-center gap-2.5 rounded-lg text-sm text-white/80 transition-colors hover:text-white", ring)}
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/5 text-orange-400">
              <Phone aria-hidden className="h-4 w-4" />
            </span>
            {profile.phone}
          </a>

          <p className="mt-5 text-xs text-white/40">{t.elsewhere}</p>
          <ul className="mt-2 flex gap-2">
            {socials.map(({ href, label, Icon }) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`${label} ${t.newTab}`} title={label} className={iconBtn}>
                  <Icon aria-hidden className="h-4 w-4" />
                </a>
              </li>
            ))}
          </ul>
        </aside>

        {/* compose */}
        <form onSubmit={onSubmit} aria-label={t.newMessage} className="flex min-w-0 flex-1 flex-col">
          <div className={row}>
            <span className={rowLabel}>{t.to}</span>
            <span className="min-w-0 flex-1 truncate py-2.5 text-sm">
              <span className="rounded-md border border-orange-500/30 bg-orange-500/10 px-2 py-0.5 text-white/85">{profile.email}</span>
            </span>
          </div>
          <div className={row}>
            <label htmlFor={`${id}-name`} className={rowLabel}>
              {t.name}
            </label>
            <input
              id={`${id}-name`}
              name="name"
              value={form.name}
              onChange={onChange}
              required
              autoComplete="name"
              placeholder={t.namePh}
              className={input}
            />
          </div>
          <div className={row}>
            <label htmlFor={`${id}-email`} className={rowLabel}>
              {t.email}
            </label>
            <input
              id={`${id}-email`}
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              required
              autoComplete="email"
              placeholder={t.emailPh}
              className={input}
            />
          </div>
          <div className={row}>
            <label htmlFor={`${id}-subject`} className={rowLabel}>
              {t.subject}
            </label>
            <input
              id={`${id}-subject`}
              name="subject"
              value={form.subject}
              onChange={onChange}
              placeholder={t.subjectPh}
              className={input}
            />
          </div>
          <label htmlFor={`${id}-message`} className="sr-only">
            {t.message}
          </label>
          <textarea
            id={`${id}-message`}
            name="message"
            value={form.message}
            onChange={onChange}
            required
            placeholder={t.messagePh}
            className="min-h-32 flex-1 resize-none bg-transparent px-4 py-3 text-sm leading-relaxed text-white outline-none placeholder:text-white/25 focus-visible:bg-white/[0.03] focus-visible:shadow-[inset_2px_0_0_var(--color-orange-500)] @lg:px-5"
          />

          <div className="flex flex-wrap items-center gap-3 border-t border-white/10 px-4 py-3 @lg:px-5">
            <button
              type="submit"
              disabled={status === "sending"}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-500 disabled:opacity-60",
                ring,
              )}
            >
              {status === "sending" ? (
                <Loader2 aria-hidden className="h-4 w-4 motion-safe:animate-spin" />
              ) : (
                <Send aria-hidden className="h-4 w-4" />
              )}
              {status === "sending" ? t.sending : t.send}
            </button>
            <p role="status" aria-live="polite" className="min-w-0 flex-1 text-sm">
              {status === "success" && <span className="text-green-400">{t.success}</span>}
              {/* literal red: error feedback must stay red under every accent */}
              {status === "error" && <span className="text-[#f87171]">{t.error}</span>}
              {status === "invalid" && <span className="text-[#f87171]">{t.invalid}</span>}
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
