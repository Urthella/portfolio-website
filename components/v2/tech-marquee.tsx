"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { IconType } from "react-icons"
import { FaJava } from "react-icons/fa"
import {
  SiApachekafka,
  SiDocker,
  SiGithubactions,
  SiLinux,
  SiMongodb,
  SiNestjs,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPrisma,
  SiPython,
  SiReact,
  SiRedis,
  SiSpringboot,
  SiTypescript,
} from "react-icons/si"

import { marqueeTech } from "@/data/content"

const ICONS: Record<string, IconType> = {
  TypeScript: SiTypescript,
  "Node.js": SiNodedotjs,
  NestJS: SiNestjs,
  "Next.js": SiNextdotjs,
  React: SiReact,
  "Spring Boot": SiSpringboot,
  Java: FaJava,
  Python: SiPython,
  PostgreSQL: SiPostgresql,
  Redis: SiRedis,
  Prisma: SiPrisma,
  MongoDB: SiMongodb,
  Kafka: SiApachekafka,
  Docker: SiDocker,
  "GitHub Actions": SiGithubactions,
  Linux: SiLinux,
}

export function TechMarquee() {
  const reduce = useReducedMotion()
  const row = [...marqueeTech, ...marqueeTech]

  return (
    <div className="relative w-full overflow-hidden border-y border-white/[0.06] bg-black/20 py-5">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#07070a] to-transparent sm:w-32" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#07070a] to-transparent sm:w-32" />
      <motion.div
        className="flex w-max gap-10 whitespace-nowrap pr-10"
        animate={reduce ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
      >
        {row.map((tech, i) => {
          const Icon = ICONS[tech]
          return (
            <span key={i} className="flex items-center gap-2.5 font-mono text-sm text-white/45">
              {Icon ? <Icon className="h-[18px] w-[18px] text-orange-400/80" /> : <span className="text-orange-500/60">◆</span>}
              {tech}
            </span>
          )
        })}
      </motion.div>
    </div>
  )
}
