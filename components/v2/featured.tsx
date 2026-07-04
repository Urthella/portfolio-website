"use client"

import { ArrowUpRight, Boxes, GitBranch, Rocket, ShieldCheck, type LucideIcon } from "lucide-react"

import { Card, CardSwap } from "@/components/ui/card-swap"
import { Reveal } from "@/components/v2/reveal"
import { SectionHeading } from "@/components/v2/section-heading"
import { useContent } from "@/data/i18n"

const META: { icon: LucideIcon; grad: string }[] = [
  { icon: Rocket, grad: "from-orange-500/25 via-orange-500/5 to-transparent" },
  { icon: Boxes, grad: "from-rose-500/25 via-rose-500/5 to-transparent" },
  { icon: ShieldCheck, grad: "from-amber-500/25 via-amber-500/5 to-transparent" },
  { icon: GitBranch, grad: "from-orange-400/25 via-orange-400/5 to-transparent" },
]

export function Featured() {
  const content = useContent()
  const h = content.ui.headings.featured
  const cards = content.ui.featured.cards

  return (
    <section className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <SectionHeading index="04" label={h.label} title={h.title} subtitle={h.subtitle} />
          <Reveal delay={0.1}>
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-xl border border-orange-500/30 bg-orange-500/10 px-5 py-3 text-sm font-medium text-orange-200 transition-all hover:border-orange-500/50 hover:bg-orange-500/20"
            >
              {h.seeAll} <ArrowUpRight className="h-4 w-4" />
            </a>
          </Reveal>
        </div>

        <div className="relative h-[360px] w-full max-md:h-[300px]">
          <CardSwap width={420} height={300} cardDistance={50} verticalDistance={56} delay={4000}>
            {cards.map((card, i) => {
              const { icon: Icon, grad } = META[i % META.length]
              return (
                <Card
                  key={card.title}
                  className="border border-white/12 bg-neutral-950/90 p-6 shadow-2xl shadow-black/50 backdrop-blur-xl"
                >
                  <div className={`pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br ${grad}`} />
                  <div className="relative flex h-full flex-col">
                    <div className="flex items-center justify-between">
                      <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/12 bg-white/[0.04] text-orange-300">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[11px] text-white/50">
                        {card.tag}
                      </span>
                    </div>
                    <h3 className="mt-5 text-xl font-semibold text-white">{card.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-white/55">{card.desc}</p>
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
