"use client"

import { useEffect, useState } from "react"

import { About } from "@/components/v2/about"
import { AuroraBackground } from "@/components/v2/aurora-background"
import { Contact } from "@/components/v2/contact"
import { DottedBg } from "@/components/v2/dotted-bg"
import { Experience } from "@/components/v2/experience"
import { Footer } from "@/components/v2/footer"
import { Hero } from "@/components/v2/hero"
import { Hobbies } from "@/components/v2/hobbies"
import { Nav } from "@/components/v2/nav"
import { Projects } from "@/components/v2/projects"
import { Scene3D } from "@/components/v2/scene-3d"
import { ScrollProgress } from "@/components/v2/scroll-progress"
import { Services } from "@/components/v2/services"
import { Skills } from "@/components/v2/skills"
import { TechMarquee } from "@/components/v2/tech-marquee"

const NAV = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "hobbies", label: "Hobbies" },
  { id: "contact", label: "Contact" },
]

const SPY = ["home", "about", "experience", "skills", "projects", "hobbies", "services", "contact"]

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
    <>
      <AuroraBackground />
      <DottedBg />
      <Scene3D />
      <ScrollProgress />
      <Nav items={NAV} activeSection={active} />
      <main className="relative z-10">
        <Hero />
        <TechMarquee />
        <About />
        <Experience />
        <Skills />
        <Projects />
        <Hobbies />
        <Services />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
