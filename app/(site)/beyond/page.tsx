import type { Metadata } from "next"

import { pageMeta } from "@/lib/page-meta"

import { Hobbies } from "@/components/v2/hobbies"

export const metadata: Metadata = pageMeta(
  "Beyond code · Utku Demirtaş",
  "Guitar, training, reading and pen collecting: life off the keyboard.",
  "/beyond",
)

export default function BeyondPage() {
  return (
    <div className="pt-16">
      <Hobbies />
    </div>
  )
}
