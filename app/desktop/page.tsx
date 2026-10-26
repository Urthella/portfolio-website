import type { Metadata } from "next"

import { pageMeta } from "@/lib/page-meta"

import { Desktop } from "@/components/desktop/desktop"

export const metadata: Metadata = pageMeta(
  "utkuOS · Utku Demirtaş",
  "Utku Demirtaş's portfolio as a tiny Linux desktop: browse projects in Files, read the résumé, or poke around in the terminal.",
  "/desktop",
)

export default function DesktopPage() {
  return <Desktop />
}
