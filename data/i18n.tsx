"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

import { about, aboutHero, articles, experiences, hobbies, profile, projects, services, skillGroups } from "@/data/content"
import { tr } from "@/data/content-tr"

const uiEN = {
  nav: {
    home: "Home",
    about: "About",
    experience: "Experience",
    skills: "Skills",
    projects: "Projects",
    hobbies: "Hobbies",
    contact: "Contact",
    blog: "Blog",
    writing: "Writing",
    beyond: "Beyond",
    desktop: "Desktop",
  },
  palette: { openDesktop: "Open desktop (utkuOS)" },
  hero: {
    welcome: "WELCOME TO MY PLAYGROUND",
    viewProjects: "View projects",
    resume: "Résumé",
    scroll: "scroll",
    moreAbout: "More about me",
  },
  idcard: {
    access: "// ACCESS",
    allAreas: "ALL AREAS",
    contact: "// CONTACT",
    findOnline: "// find me online",
    flipBack: "tap to flip back",
    clickFlip: "click the card to flip",
    statusAvailable: "Available for work",
  },
  headings: {
    about: { label: "About" },
    experience: { label: "Experience", title: "Where I've been" },
    skills: { label: "Skills", title: "Tech I build with", certs: "Certifications" },
    featured: {
      label: "Highlights",
      title: "Things I've shipped",
      subtitle: "A rotating look at what I'm building now: AI-agent tooling, consensus and storage engines, web PKI and on-chain fee audits.",
      seeAll: "See all projects",
    },
    projects: {
      label: "Projects",
      title: "Selected work",
      subtitle: "Consensus and storage engines, tooling for AI agents, web PKI and post-quantum crypto, on-chain fee audits and the products I'm launching. Plus repos I collaborate on.",
      collab: "collaboration",
    },
    hobbies: {
      label: "Beyond code",
      title: "Off the keyboard",
      subtitle: "The disciplines that keep me sharp, creative and a little stubborn.",
    },
    services: {
      label: "Coaching",
      title: "I also coach",
      subtitle: "Years of practice, shared: guitar, training, and sustainable nutrition habits.",
    },
    articles: {
      label: "Writing",
      title: "On Medium",
      subtitle: "Notes on security, networking and the craft.",
    },
    contact: {
      label: "Contact",
      title: "Let's build something",
      subtitle: "Open to internships, freelance and collaboration. Drop a line and I'll get back to you.",
    },
  },
  featured: {
    cards: [
      { title: "Okut Gitsin", tag: "Flagship SaaS", desc: "Live-stream vehicle auction platform: real-time bidding, secure payments, launching soon, waitlist open at okutgitsin.com." },
      { title: "Tooling for AI agents", tag: "AI agents", desc: "MCP servers that keep agents safe around Postgres, an OpenAI-compatible LLM gateway, an OpenTelemetry viewer for agent runs, and traps that test agents against prompt injection." },
      { title: "Consensus & storage", tag: "Distributed systems", desc: "A Raft key-value store checked Jepsen-style for linearizability, Raft running live in the browser, and an LSM-tree crashed at every filesystem operation." },
      { title: "Web PKI & post-quantum", tag: "Security", desc: "Certificate Transparency inclusion proofs, ACME renewal windows (RFC 9773), the X-Wing hybrid KEM, and how your crates were really published." },
      { title: "On-chain fee audits", tag: "Web3", desc: "Ethereum blob fees recomputed after Osaka's EIP-7918 and OP Stack L1 data fees from raw transaction bytes, each checked against what the chain says." },
      { title: "Distributed Systems Series", tag: "Backend", desc: "Five from-scratch builds: CRDT sync, Redis Lua rate limiting, saga orchestration, hybrid RAG and a race-safe job queue." },
    ],
  },
  github: {
    title: "// github @Urthella",
    viewProfile: "view profile →",
    heatmap: "contributions in the last year",
    stats: [
      { value: "50+", label: "Public repos" },
      { value: "90+", label: "Merged PRs (2026)" },
      { value: "8", label: "Languages shipped" },
    ],
  },
  contact: {
    name: "Name",
    email: "Email",
    message: "Message",
    send: "Send message",
    sending: "Sending…",
    success: "Message sent, I'll reply soon. Thanks!",
    error: "Something went wrong, please try again or reach me on LinkedIn.",
    findMe: "// find me online",
    backToTop: "Back to top",
    collaborate: "let’s collaborate",
    formTitle: "Contact form",
    close: "Close",
    namePlaceholder: "Jane Doe",
    emailPlaceholder: "jane@example.com",
    messagePlaceholder: "Let's build something…",
    privacy: "Goes straight to my inbox through EmailJS. I only use it to reply.",
    built: "Built with Next.js & Framer Motion.",
  },
  footer: {
    cta: "Contact me",
    builtWith: "Built with",
    builtItems: ["Next.js & Framer Motion", "passion ❤️‍🔥", "less sleep 😴", "even less sleep 🥱", "a LOT of coffee ☕"],
    rights: "All rights reserved.",
  },
  snap: {
    kicker: "// perfectly balanced",
    line: "Your next design is just a snap away.",
    snap: "snap your fingers",
    restore: "restore the universe",
  },
  statement: ["SHIPPING REAL-TIME SYSTEMS", "SECURE APIS. CLEAN CI/CD.", "BACKEND, DEVOPS & CHAOS", "LET'S BUILD SOMETHING"],
  showcase: { featured: "// featured", name: "Okut Gitsin", caption: "A live-auction platform, opened up." },
  terminal: { whoami: "Halil Utku Demirtaş, software engineer: backend, distributed systems & AI", boot: "→ boot the desktop" },
  perf: {
    enableLite: "Turn animations off (lite mode)",
    enableFull: "Turn animations on",
  },
}

export const en = {
  profile: { role: profile.role, focus: profile.focus, tagline: profile.tagline, chips: profile.chips },
  about: { bio: about.bio, focus: about.focus, languages: about.languages },
  aboutHero,
  experiences,
  skillGroups,
  projects,
  hobbies,
  articles: articles.map((a) => ({ title: a.title, blurb: a.blurb, tag: a.tag })),
  services,
  ui: uiEN,
}

export type Lang = "en" | "tr"

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: "en", setLang: () => {} })

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en")

  useEffect(() => {
    try {
      const s = window.localStorage.getItem("lang")
      if (s === "tr" || s === "en") setLang(s)
    } catch {}
  }, [])

  // <html lang> follows the choice: screen readers switch voice, and CSS uppercase maps i -> İ in Turkish
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const set = (l: Lang) => {
    setLang(l)
    try {
      window.localStorage.setItem("lang", l)
    } catch {}
  }

  return <Ctx.Provider value={{ lang, setLang: set }}>{children}</Ctx.Provider>
}

export const useLang = () => useContext(Ctx)

/** Active-language content bundle (data + ui strings). */
export const useContent = () => {
  const { lang } = useLang()
  return lang === "tr" ? (tr as unknown as typeof en) : en
}
