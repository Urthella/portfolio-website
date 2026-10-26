import type { Metadata } from "next"

import { pageMeta } from "@/lib/page-meta"

import { Featured } from "@/components/v2/featured"
import { GithubHeatmap } from "@/components/v2/github-heatmap"
import { GithubStats } from "@/components/v2/github-stats"
import { Projects } from "@/components/v2/projects"

export const metadata: Metadata = pageMeta(
  "Projects · Utku Demirtaş",
  "Auction platforms, distributed systems, ML detectors and security tooling, plus GitHub activity.",
  "/projects",
)

export default function ProjectsPage() {
  return (
    <div className="pt-16">
      <Featured />
      <Projects />
      <GithubStats />
      <GithubHeatmap />
    </div>
  )
}
