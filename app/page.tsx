"use client"

import { useEffect, useState } from "react"

import { About } from "@/components/v2/about"
import { Articles } from "@/components/v2/articles"
import { AuroraBackground } from "@/components/v2/aurora-background"
import { Contact } from "@/components/v2/contact"
import { Experience } from "@/components/v2/experience"
import { Featured } from "@/components/v2/featured"
import { GithubStats } from "@/components/v2/github-stats"
import { Hero } from "@/components/v2/hero"
import { Hobbies } from "@/components/v2/hobbies"
import { Nav } from "@/components/v2/nav"
import { Projects } from "@/components/v2/projects"
import { SceneFluid } from "@/components/v2/scene-fluid"
import { ScrollProgress } from "@/components/v2/scroll-progress"
import { Services } from "@/components/v2/services"
import { Showcase } from "@/components/v2/showcase"
import { Skills } from "@/components/v2/skills"
import { Snap } from "@/components/v2/snap"
import { Statement } from "@/components/v2/statement"
import { TechMarquee } from "@/components/v2/tech-marquee"
import { Terminal } from "@/components/v2/terminal"
import { LangProvider } from "@/data/i18n"

const NAV = ["about", "experience", "skills", "projects", "hobbies", "contact"]

const SPY = ["home", "about", "experience", "skills", "projects", "hobbies", "services", "articles", "contact"]

export default function Page() {
  const [active, setActive] = useState("home")

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const current = SPY.find((id) => {
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

  return (
    <LangProvider>
      <AuroraBackground />
      <SceneFluid />
      <ScrollProgress />
      <Nav items={NAV} activeSection={active} />
      <main className="relative z-10">
        <Hero />
        <TechMarquee />
        <About />
        <Terminal />
        <Experience />
        <Skills />
        <Featured />
        <Projects />
        <GithubStats />
        <Showcase />
        <Statement />
        <Hobbies />
        <Services />
        <Articles />
        <Snap />
        <Contact />
      </main>
    </LangProvider>
  )
}
