"use client"

import { BookOpen, Github, Instagram, Linkedin, Loader2, Mail, Phone, Send } from "lucide-react"
import { useState } from "react"

import { Reveal } from "@/components/v2/reveal"
import { SectionHeading } from "@/components/v2/section-heading"
import { fromLeft, scaleIn } from "@/lib/motion"
import { profile } from "@/data/content"

const socials = [
  { href: profile.socials.linkedin, label: "LinkedIn", Icon: Linkedin },
  { href: profile.socials.github, label: "GitHub", Icon: Github },
  { href: profile.socials.instagram, label: "Instagram", Icon: Instagram },
  { href: profile.socials.medium, label: "Medium", Icon: BookOpen },
]

export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" })
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
    } catch {
      setStatus("error")
    } finally {
      setTimeout(() => setStatus("idle"), 5000)
    }
  }

  const field =
    "w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-blue-500/50 focus:bg-white/[0.05]"

  return (
    <section id="contact" className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <SectionHeading
        index="07"
        label="Contact"
        title="Let's build something"
        subtitle="Open to internships, freelance and collaboration — drop a line and I'll get back to you."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Reveal variants={fromLeft}>
          <div className="flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
            <div className="space-y-4">
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-3 text-white/70 transition-colors hover:text-white"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-blue-400">
                  <Mail className="h-5 w-5" />
                </span>
                {profile.email}
              </a>
              <div className="flex items-center gap-3 text-white/70">
                <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-blue-400">
                  <Phone className="h-5 w-5" />
                </span>
                {profile.phone}
              </div>
            </div>

            <div className="mt-8">
              <p className="mb-3 font-mono text-xs text-white/40">// find me online</p>
              <div className="flex gap-2">
                {socials.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 text-white/60 transition-all hover:-translate-y-0.5 hover:border-blue-500/40 hover:text-white"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal variants={scaleIn}>
          <form onSubmit={onSubmit} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
            <div className="grid gap-4">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-xs text-white/50">
                  Name
                </label>
                <input id="name" name="name" value={form.name} onChange={onChange} required className={field} placeholder="Jane Doe" />
              </div>
              <div>
                <label htmlFor="email" className="mb-1.5 block text-xs text-white/50">
                  Email
                </label>
                <input id="email" name="email" type="email" value={form.email} onChange={onChange} required className={field} placeholder="jane@example.com" />
              </div>
              <div>
                <label htmlFor="message" className="mb-1.5 block text-xs text-white/50">
                  Message
                </label>
                <textarea id="message" name="message" value={form.message} onChange={onChange} required rows={4} className={field} placeholder="Let's build something…" />
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition-all hover:bg-blue-500 disabled:opacity-60"
              >
                {status === "sending" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" /> Send message
                  </>
                )}
              </button>

              <p aria-live="polite" className="min-h-[1.25rem] text-center text-sm">
                {status === "success" && <span className="text-green-400">Message sent — I'll reply soon. Thanks!</span>}
                {status === "error" && <span className="text-red-400">Something went wrong — email me directly instead.</span>}
              </p>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  )
}
