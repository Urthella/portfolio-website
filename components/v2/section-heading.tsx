import { Reveal } from "@/components/v2/reveal"

export function SectionHeading({
  index,
  label,
  title,
  subtitle,
}: {
  index: string
  label: string
  title: string
  subtitle?: string
}) {
  return (
    <Reveal className="mb-12">
      <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-orange-500">
        <span className="text-orange-500/40">{"// "}{index} /</span> {label}
      </p>
      <h2 className="text-4xl font-bold tracking-tight text-ink sm:text-5xl">{title}</h2>
      {subtitle && <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-ink/50">{subtitle}</p>}
    </Reveal>
  )
}
