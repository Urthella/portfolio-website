import type { Metadata } from "next"

import { pageMeta } from "@/lib/page-meta"

import { Hobbies } from "@/components/v2/hobbies"
import { ThemeLab } from "@/components/v2/theme-lab"

export const metadata: Metadata = pageMeta(
  "Beyond code · Utku Demirtaş",
  "Guitar, training and writing off the keyboard, plus a playground to repaint this site.",
  "/beyond",
)

export default function BeyondPage() {
  return (
    <div className="pt-16">
      <Hobbies />
      <ThemeLab />
    </div>
  )
}
