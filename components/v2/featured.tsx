"use client"

import { ArrowUpRight, Boxes, GitBranch, Rocket, ShieldCheck } from "lucide-react"

import { Card, CardSwap } from "@/components/ui/card-swap"
import { Reveal } from "@/components/v2/reveal"
import { SectionHeading } from "@/components/v2/section-heading"

const CARDS = [
  {
    icon: Rocket,
    title: "Okut Gitsin",
    tag: "Flagship SaaS",
    desc: "Live-stream vehicle auction platform: real-time bidding, secure payments, live at okutgitsin.com.",
    grad: "from-orange-500/25 via-orange-500/5 to-transparent",
  },
  {
    icon: Boxes,
    title: "Penpick",
    tag: "Product",
    desc: "Marketplace for pen collectors, shipped end-to-end at penpick.vercel.app.",
    grad: "from-rose-500/25 via-rose-500/5 to-transparent",
  },
  {
    icon: ShieldCheck,
    title: "Extramus HR",
    tag: "Backend & Security",
    desc: "HR platform backend: RBAC, secure uploads, containerized services under load.",
    grad: "from-amber-500/25 via-amber-500/5 to-transparent",
  },
  {
    icon: GitBranch,
    title: "CI/CD Plumbing",
    tag: "DevOps",
    desc: "Dockerized pipelines and green GitHub Actions across a dozen shipped repos.",
    grad: "from-orange-400/25 via-orange-400/5 to-transparent",
  },
]

export function Featured() {
  return (
    <section className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <SectionHeading
            index="05"
            label="Highlights"
            title="Things I've shipped"
            subtitle="A rotating look at the work I'm proudest of, from marketplaces to the CI/CD that ships them."
          />
          <Reveal delay={0.1}>
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-xl border border-orange-500/30 bg-orange-500/10 px-5 py-3 text-sm font-medium text-orange-200 transition-all hover:border-orange-500/50 hover:bg-orange-500/20"
            >
              See all projects <ArrowUpRight className="h-4 w-4" />
            </a>
          </Reveal>
        </div>

        <div className="relative h-[360px] w-full max-md:h-[300px]">
          <CardSwap width={420} height={300} cardDistance={50} verticalDistance={56} delay={4000}>
            {CARDS.map((c) => {
              const Icon = c.icon
              return (
                <Card
                  key={c.title}
                  className="border border-white/12 bg-neutral-950/90 p-6 shadow-2xl shadow-black/50 backdrop-blur-xl"
                >
                  <div className={`pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br ${c.grad}`} />
                  <div className="relative flex h-full flex-col">
                    <div className="flex items-center justify-between">
                      <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/12 bg-white/[0.04] text-orange-300">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] text-white/50">
                        {c.tag}
                      </span>
                    </div>
                    <h3 className="mt-5 text-xl font-semibold text-white">{c.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-white/55">{c.desc}</p>
                    <div className="mt-4 h-px w-full bg-gradient-to-r from-orange-500/40 to-transparent" />
                  </div>
                </Card>
              )
            })}
          </CardSwap>
        </div>
      </div>
    </section>
  )
}
