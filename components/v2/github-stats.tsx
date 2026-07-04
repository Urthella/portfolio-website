"use client"

import { Github } from "lucide-react"

import { Reveal } from "@/components/v2/reveal"
import { profile } from "@/data/content"

const BASE = "https://github-readme-stats.vercel.app/api"
const COMMON = "hide_border=true&bg_color=00000000&title_color=3b82f6&icon_color=3b82f6&text_color=9ca3af"

export function GithubStats() {
  return (
    <section className="relative mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <Reveal className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-mono text-sm text-white/70">
            <Github className="h-4 w-4 text-blue-400" /> // github @Urthella
          </h3>
          <a
            href={profile.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-blue-400 transition-colors hover:text-blue-300"
          >
            view profile →
          </a>
        </div>
        <div className="grid items-center gap-4 md:grid-cols-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${BASE}?username=Urthella&show_icons=true&${COMMON}`}
            alt="Utku Demirtaş — GitHub stats"
            className="w-full"
            loading="lazy"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${BASE}/top-langs/?username=Urthella&layout=compact&langs_count=8&${COMMON}`}
            alt="Utku Demirtaş — most used languages"
            className="w-full"
            loading="lazy"
          />
        </div>
      </Reveal>
    </section>
  )
}
