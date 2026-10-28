import type { Metadata } from "next"

import { Hero } from "@/components/v2/hero"
import { TechMarquee } from "@/components/v2/tech-marquee"
import { TentacleLayer } from "@/components/v2/tentacle-layer"

// only the home page: set in the root layout it would leak to any page
// without its own pageMeta and tell Google that page is the home page
export const metadata: Metadata = { alternates: { canonical: "/" } }

export default function HomePage() {
  return (
    <>
      <Hero />
      <TentacleLayer />
      <TechMarquee />
    </>
  )
}
