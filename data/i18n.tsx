"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

import { about, aboutHero, articles, experiences, hobbies, profile, projects, services, skillGroups } from "@/data/content"
import { tr } from "@/data/content-tr"

const uiEN = {
  nav: { about: "About", experience: "Experience", skills: "Skills", projects: "Projects", hobbies: "Hobbies", contact: "Contact", blog: "Blog" },
  hero: {
    rotating: ["Fullstack Developer", "Backend & DevOps", "Real-time systems", "Secure APIs"],
    viewProjects: "View projects",
    resume: "Résumé",
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
    skills: { label: "Skills", title: "Tech I build with" },
    featured: {
      label: "Highlights",
      title: "Things I've shipped",
      subtitle: "A rotating look at the work I'm proudest of, from marketplaces to the CI/CD that ships them.",
      seeAll: "See all projects",
    },
    projects: {
      label: "Projects",
      title: "Selected work",
      subtitle: "Auction engines, ML detectors, CPU simulators and security tooling. A spread across the stack, plus repos I collaborate on.",
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
      { title: "Okut Gitsin", tag: "Flagship SaaS", desc: "Live-stream vehicle auction platform: real-time bidding, secure payments, live at okutgitsin.com." },
      { title: "Penpick", tag: "In development", desc: "Marketplace for pen collectors, still in development, live preview at penpick.vercel.app." },
      { title: "Extramus HR", tag: "Backend & Security", desc: "HR platform backend: RBAC, secure uploads, containerized services under load." },
      { title: "CI/CD Plumbing", tag: "DevOps", desc: "Dockerized pipelines and green GitHub Actions across a dozen shipped repos." },
    ],
  },
  github: {
    title: "// github @Urthella",
    viewProfile: "view profile →",
    heatmap: "contributions in the last year",
    stats: [
      { value: "10+", label: "Public repos" },
      { value: "8", label: "Merged PRs (2026)" },
      { value: "6", label: "Languages shipped" },
    ],
  },
  contact: {
    name: "Name",
    email: "Email",
    message: "Message",
    send: "Send message",
    sending: "Sending…",
    success: "Message sent, I'll reply soon. Thanks!",
    error: "Something went wrong, email me directly instead.",
    findMe: "// find me online",
    backToTop: "Back to top",
    built: "Built with Next.js & Framer Motion.",
    dragWords: "drag the words ↔",
    falling:
      "Backend DevOps and Security minded. Node TypeScript Java Spring Kafka Docker CI/CD Redis Postgres. let's build something reliable",
    fallingHl: ["backend", "devops", "security", "let's", "build", "reliable"],
  },
  snap: {
    kicker: "// perfectly balanced",
    line: "Your next design is just a snap away.",
    snap: "snap your fingers",
    restore: "restore the universe",
  },
  statement: ["SHIPPING REAL-TIME SYSTEMS", "SECURE APIS. CLEAN CI/CD.", "BACKEND, DEVOPS & CHAOS", "LET'S BUILD SOMETHING"],
  showcase: { featured: "// featured", name: "Okut Gitsin", caption: "A live-auction platform, opened up." },
  terminal: { whoami: "Halil Utku Demirtaş, backend & devops-leaning fullstack engineer" },
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
