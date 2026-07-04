"use client"

import { MacbookScroll } from "@/components/ui/macbook-scroll"

export function Showcase() {
  return (
    <section className="relative overflow-hidden">
      <MacbookScroll
        src="/okutgitsin.png"
        showGradient
        title={
          <span className="font-mono text-2xl sm:text-3xl">
            <span className="text-blue-400">// featured</span> <span className="text-white">Okut Gitsin</span>
            <span className="mt-3 block text-sm font-normal text-white/50">
              A live-auction platform — opened up.
            </span>
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
