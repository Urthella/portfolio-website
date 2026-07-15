"use client"

import { useEffect, useState } from "react"

import { About } from "@/components/v2/about"
import { Articles } from "@/components/v2/articles"
import { AuroraBackground } from "@/components/v2/aurora-background"
import { CommandPalette } from "@/components/v2/command-palette"
import { Contact } from "@/components/v2/contact"
import { Experience } from "@/components/v2/experience"
import { Featured } from "@/components/v2/featured"
import { Footer } from "@/components/v2/footer"
import { GithubHeatmap } from "@/components/v2/github-heatmap"
import { GithubStats } from "@/components/v2/github-stats"
import { Hero } from "@/components/v2/hero"
import { Hobbies } from "@/components/v2/hobbies"
import { Nav } from "@/components/v2/nav"
import { Projects } from "@/components/v2/projects"
import { SceneFluid } from "@/components/v2/scene-fluid"
import { ScrollProgress } from "@/components/v2/scroll-progress"
import { SideNav } from "@/components/v2/side-nav"
import { Skills } from "@/components/v2/skills"
import { ThemeLab } from "@/components/v2/theme-lab"
import { TechMarquee } from "@/components/v2/tech-marquee"
import { Terminal } from "@/components/v2/terminal"
import GradualBlur from "@/components/ui/gradual-blur"
import { LangProvider } from "@/data/i18n"

const NAV = ["about", "experience", "skills", "projects", "hobbies", "contact"]

const SPY = ["home", "about", "experience", "skills", "projects", "hobbies", "articles", "contact"]

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
      <CommandPalette />
      <Nav items={NAV} activeSection={active} />
      <main className="relative z-10">
        {/* inside <main> so the marquee (z-40) can layer above it within the same stacking context */}
        <SideNav items={NAV} activeSection={active} />
        <Hero />
        <TechMarquee />
        <About />
        <Terminal />
        <Experience />
        <Skills />
        <Featured />
        <Projects />
        <GithubStats />
        <GithubHeatmap />
        <ThemeLab />
        <Hobbies />
        <Articles />
        <Contact />
        <Footer />
      </main>
      {/* content melts into a soft blur at the bottom edge of the viewport (desktop only) */}
      <GradualBlur
        target="page"
        position="bottom"
        height="6rem"
        strength={2}
        divCount={5}
        curve="bezier"
        exponential
        opacity={1}
        style={{ zIndex: 30 }}
        className="hidden md:block"
      />
    </LangProvider>
  )
}
