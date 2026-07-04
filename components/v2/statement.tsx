"use client"

import { useEffect, useState } from "react"

import { TextFlippingBoard } from "@/components/ui/text-flipping-board"
import { Reveal } from "@/components/v2/reveal"
import { useContent } from "@/data/i18n"

export function Statement() {
  const phrases = useContent().ui.statement
  const [i, setI] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % phrases.length), 6500)
    return () => clearInterval(id)
  }, [phrases.length])

  return (
    <section className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <Reveal>
        <TextFlippingBoard text={phrases[i % phrases.length]} className="border border-white/10 !bg-neutral-950/85 backdrop-blur" />
      </Reveal>
    </section>
  )
}
