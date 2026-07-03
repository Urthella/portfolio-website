"use client"

import { motion } from "framer-motion"
import { ArrowUpRight, Github } from "lucide-react"

import { SectionHeading } from "@/components/v2/section-heading"
import { container, scaleIn } from "@/lib/motion"
import { translations } from "@/data/translations"

interface Project {
  title: string
  tag: string
  description: string
  tech: string[]
  href: string
  code?: boolean
}

const projects: Project[] = [
  {
    title: "Reveil",
    tag: "AI · Mobile",
    description:
      "Privacy-focused habit-tracking app — a React Native (Expo) front-end, a NestJS API, and a FastAPI AI engine over PostgreSQL.",
    tech: ["React Native", "NestJS", "FastAPI", "PostgreSQL"],
    href: "https://github.com/Urthella/Reveil",
    code: true,
  },
  {
    title: "Costsight",
    tag: "ML · Cloud",
    description:
      "Cloud-cost anomaly detection on AWS CUR data — STL, Isolation Forest and Z-Score detectors with severity-banded alerts and a Streamlit dashboard.",
    tech: ["Python", "scikit-learn", "Streamlit", "AWS"],
    href: "https://github.com/Urthella/costsight",
    code: true,
  },
  {
    title: "Used Car Platform",
    tag: "Full-stack",
    description:
      "A used-car marketplace with JWT auth, role-based access (admin / seller / buyer), favorites, in-app messaging and Cypress E2E.",
    tech: ["Next.js", "Express", "MongoDB", "Cypress"],
    href: "https://github.com/Urthella/used-car-platform",
    code: true,
  },
  {
    title: "MIPS16 Pipeline Simulator",
    tag: "Systems",
    description:
      "A 5-stage 16-bit MIPS pipeline simulator with hazard handling (forwarding, stalls, flushes) — Java backend, React/TS frontend and Verilog RTL.",
    tech: ["Java", "React", "Verilog"],
    href: "https://github.com/Urthella/MIPS16-pipeline-simulator",
    code: true,
  },
  {
    title: "Algorithm Analyzer",
    tag: "Tooling",
    description:
      "A sorting-algorithm benchmarking suite (Quick / Heap / Shell / Merge / Radix) over random, sorted and reverse data, with a Spring Boot API + React UI.",
    tech: ["Spring Boot", "React", "Charts"],
    href: "https://github.com/Urthella/algortihm-test-sim",
    code: true,
  },
  {
    title: "Pen Trading — @pen.pick",
    tag: "Side project",
    description:
      "A niche Instagram marketplace for premium pens — fountain, rollerball and ballpoint — with product photography and a curated catalog.",
    tech: ["Community", "Curation", "Photography"],
    href: "https://instagram.com/pen.pick",
  },
]

export function Projects({ language }: { language: "en" | "tr" }) {
  const t = translations[language]

  return (
    <section id="projects" className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <SectionHeading eyebrow="04 — Projects" title={t.projects.title} subtitle={t.projects.subtitle} />

      <motion.div
        variants={container(0.06)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {projects.map((p) => (
          <motion.a
            key={p.title}
            variants={scaleIn}
            whileHover={{ y: -5 }}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-blue-500/40"
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/[0.07] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

            <div className="relative flex items-center justify-between">
              <span className="rounded-full border border-blue-500/25 bg-blue-500/10 px-2.5 py-1 font-mono text-[11px] text-blue-300">
                {p.tag}
              </span>
              <span className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-white/40 transition-all group-hover:border-white/25 group-hover:text-white">
                {p.code ? <Github className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
              </span>
            </div>

            <h3 className="relative mt-4 text-lg font-semibold text-white">{p.title}</h3>
            <p className="relative mt-2 flex-1 text-sm leading-relaxed text-white/55">{p.description}</p>

            <div className="relative mt-4 flex flex-wrap gap-1.5">
              {p.tech.map((tech) => (
                <span key={tech} className="rounded-md bg-white/[0.04] px-2 py-0.5 font-mono text-[11px] text-white/45">
                  {tech}
                </span>
              ))}
            </div>
          </motion.a>
        ))}
      </motion.div>
    </section>
  )
}
