import type { Metadata } from "next"

import { pageMeta } from "@/lib/page-meta"

import { About } from "@/components/v2/about"
import { Experience } from "@/components/v2/experience"
import { Skills } from "@/components/v2/skills"
import { Terminal } from "@/components/v2/terminal"

export const metadata: Metadata = pageMeta(
  "About · Utku Demirtaş",
  "Who I am, where I've worked and the stack I build with: backend, distributed systems and AI.",
  "/about",
)

export default function AboutPage() {
  return (
    <div className="pt-16">
      <About />
      <Terminal />
      <Experience />
      <Skills />
    </div>
  )
}
