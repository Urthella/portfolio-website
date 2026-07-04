"use client"

import { useEffect, useState } from "react"

import { TextFlippingBoard } from "@/components/ui/text-flipping-board"
import { ErrorBoundary } from "@/components/v2/error-boundary"
import { Reveal } from "@/components/v2/reveal"
import { ShaderBg } from "@/components/v2/shader-bg"

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
    <section className="relative overflow-hidden py-20">
      {/* real WebGL shader band, guarded so a WebGL failure never breaks the page */}
      <ErrorBoundary fallback={null}>
        <ShaderBg className="absolute inset-0 h-full w-full opacity-50" />
      </ErrorBoundary>
      <div className="absolute inset-0 bg-gradient-to-b from-[#07070a] via-transparent to-[#07070a]" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
        <Reveal>
          <TextFlippingBoard text={PHRASES[i]} className="border border-white/10 !bg-neutral-950/90 backdrop-blur" />
        </Reveal>
      </div>
    </section>
  )
}
