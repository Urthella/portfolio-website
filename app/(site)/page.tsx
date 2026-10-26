import { Hero } from "@/components/v2/hero"
import { TechMarquee } from "@/components/v2/tech-marquee"
import { TentacleLayer } from "@/components/v2/tentacle-layer"

export default function HomePage() {
  return (
    <>
      <Hero />
      <TentacleLayer />
      <TechMarquee />
    </>
  )
}
