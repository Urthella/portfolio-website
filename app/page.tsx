"use client"

import { useEffect, useState } from "react"

import { About } from "@/components/v2/about"
import { AuroraBackground } from "@/components/v2/aurora-background"
import { Contact } from "@/components/v2/contact"
import { DottedBg } from "@/components/v2/dotted-bg"
import { Experience } from "@/components/v2/experience"
import { Footer } from "@/components/v2/footer"
import { Hero } from "@/components/v2/hero"
import { Nav } from "@/components/v2/nav"
import { Projects } from "@/components/v2/projects"
import { Skills } from "@/components/v2/skills"
import { TechMarquee } from "@/components/v2/tech-marquee"

const NAV = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
]

export default function Page() {
  const [active, setActive] = useState("home")

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const current = NAV.map((n) => n.id).find((id) => {
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
      <Nav items={NAV} activeSection={active} />
      <main className="relative z-10">
        <Hero />
        <TechMarquee />
        <About />
        <Experience />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
