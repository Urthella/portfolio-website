"use client"

import { MacbookScroll } from "@/components/ui/macbook-scroll"
import { useContent } from "@/data/i18n"

export function Showcase() {
  const s = useContent().ui.showcase
  return (
    <section className="relative overflow-hidden">
      <MacbookScroll
        src="/okutgitsin.png"
        showGradient
        title={
          <span className="font-mono text-2xl sm:text-3xl">
            <span className="text-orange-500">{s.featured}</span> <span className="text-white">{s.name}</span>
            <span className="mt-3 block text-sm font-normal text-white/50">{s.caption}</span>
          </span>
        }
        badge={
          <a
            href="https://okutgitsin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/15 bg-black/60 px-3 py-1 font-mono text-xs text-white/80 backdrop-blur"
          >
            okutgitsin.com ↗
          </a>
        }
      />
    </section>
  )
}
