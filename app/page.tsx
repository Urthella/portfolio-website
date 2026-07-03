"use client"

import { useCallback, useEffect, useState } from "react"

import { About } from "@/components/v2/about"
import { AuroraBackground } from "@/components/v2/aurora-background"
import { Contact } from "@/components/v2/contact"
import { Experience } from "@/components/v2/experience"
import { Footer } from "@/components/v2/footer"
import { Hero } from "@/components/v2/hero"
import { Nav } from "@/components/v2/nav"
import { Projects } from "@/components/v2/projects"
import { Skills } from "@/components/v2/skills"
import { translations } from "@/data/translations"

const SECTION_IDS = ["home", "about", "experience", "skills", "projects", "contact"]

export default function Page() {
  const [language, setLanguage] = useState<"en" | "tr">("en")
  const [active, setActive] = useState("home")
  const t = translations[language]

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => {
      const next = prev === "en" ? "tr" : "en"
      document.documentElement.lang = next
      return next
    })
  }, [])

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const current = SECTION_IDS.find((id) => {
          const el = document.getElementById(id)
          if (!el) return false
          const r = el.getBoundingClientRect()
          return r.top <= 120 && r.bottom >= 120
        })
        if (current) setActive(current)
        ticking = false
      })
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const navItems = [
    { id: "home", label: t.nav.home },
    { id: "about", label: t.nav.about },
    { id: "experience", label: t.nav.experience },
    { id: "skills", label: t.nav.skills },
    { id: "projects", label: t.nav.projects },
    { id: "contact", label: t.nav.contact },
  ]

  return (
    <>
      <AuroraBackground />
      <Nav
        items={navItems}
        activeSection={active}
        language={language}
        onToggleLanguage={toggleLanguage}
        blogLabel={t.nav.blog}
      />
      <main>
        <Hero language={language} />
        <About language={language} />
        <Experience language={language} />
        <Skills language={language} />
        <Projects language={language} />
        <Contact language={language} />
      </main>
      <Footer />
    </>
  )
}
