"use client"

import { useEffect, useState } from "react"

import { TextFlippingBoard } from "@/components/ui/text-flipping-board"
import { Reveal } from "@/components/v2/reveal"

const PHRASES = [
  "SHIPPING REAL-TIME SYSTEMS",
  "SECURE APIS. CLEAN CI/CD.",
  "BACKEND, DEVOPS & CHAOS",
  "LET'S BUILD SOMETHING",
]

export function Statement() {
  const [i, setI] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % PHRASES.length), 6500)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <Reveal>
        <TextFlippingBoard text={PHRASES[i]} className="border border-white/10 !bg-neutral-950/85 backdrop-blur" />
      </Reveal>
    </section>
  )
}
