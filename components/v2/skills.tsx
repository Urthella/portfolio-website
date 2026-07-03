"use client"

import { motion } from "framer-motion"
import { Cloud, Code, Cpu, Database, GraduationCap, Server, Shield } from "lucide-react"

import { SectionHeading } from "@/components/v2/section-heading"
import { container, scaleIn } from "@/lib/motion"
import { translations } from "@/data/translations"

const categories = [
  { key: "programmingLanguages", Icon: Code, skills: ["Java", "Python", "JavaScript", "TypeScript"] },
  { key: "backendFrameworks", Icon: Server, skills: ["Spring Boot", "Spring", "Node.js", "Express.js", "Kafka", "REST APIs"] },
  { key: "databases", Icon: Database, skills: ["MongoDB", "SQL", "PostgreSQL", "Redis"] },
  { key: "devopsCloud", Icon: Cloud, skills: ["Docker", "CI/CD", "GitHub Actions", "Linux", "IT Operations"] },
  { key: "securityTools", Icon: Shield, skills: ["OWASP", "Wireshark", "Burp Suite", "Metasploit"] },
  { key: "messageQueues", Icon: Cpu, skills: ["React", "Vue.js", "Tailwind CSS", "Leadership", "Teamwork"] },
  { key: "certifications", Icon: GraduationCap, skills: ["CompTIA Security+", "Network+", "CCNA", "AWS Cloud Practitioner"] },
] as const

export function Skills({ language }: { language: "en" | "tr" }) {
  const t = translations[language]

  return (
    <section id="skills" className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <SectionHeading eyebrow="03 — Skills" title={t.skills.title} subtitle={t.skills.subtitle} />

      <motion.div
        variants={container(0.07)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {categories.map(({ key, Icon, skills }) => (
          <motion.div
            key={key}
            variants={scaleIn}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-blue-500/30"
          >
            <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-500/10 opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />
            <div className="mb-4 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-blue-400 transition-colors group-hover:border-blue-500/30 group-hover:text-blue-300">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="font-semibold text-white">{t.skills[key as keyof typeof t.skills] as string}</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 font-mono text-xs text-white/60 transition-colors hover:border-white/25 hover:text-white"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
