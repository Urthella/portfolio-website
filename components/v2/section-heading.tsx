import { Reveal } from "@/components/v2/reveal"

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string
  title: string
  subtitle?: string
}) {
  return (
    <Reveal className="mb-14 text-center">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-blue-400">{eyebrow}</p>
      <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">{title}</h2>
      {subtitle && <p className="mx-auto mt-4 max-w-xl text-pretty text-white/50">{subtitle}</p>}
    </Reveal>
  )
}
