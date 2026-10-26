import type { Metadata } from "next"

import { pageMeta } from "@/lib/page-meta"

import { Articles } from "@/components/v2/articles"

export const metadata: Metadata = pageMeta(
  "Writing · Utku Demirtaş",
  "Articles on security, networking and the craft of software, published on Medium.",
  "/writing",
)

export default function WritingPage() {
  return (
    <div className="pt-16">
      <Articles />
    </div>
  )
}
