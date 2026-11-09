"use client"

import { useReducedMotion } from "framer-motion"
import { useEffect, useRef } from "react"

import { usePerf } from "@/hooks/use-perf"

const INK = "21,20,19"
const ACCENT = "255,90,31"
const NEAR = 190 // px: inside this the dashes grow and warm to the accent
const RING_SPEED = 0.75 // px per ms
const RING_LIFE = 1400 // ms

type Dash = { x: number; y: number; a: number; len: number; rate: number }

// shortest signed turn between two angles
const turn = (from: number, to: number) => {
  const d = (to - from) % (Math.PI * 2)
  return d > Math.PI ? d - Math.PI * 2 : d < -Math.PI ? d + Math.PI * 2 : d
}

/**
 * A vector field behind the hero: tiny ink arrows that all point at the
 * cursor. The turn ripples out from the pointer (far arrows follow later),
 * close by they grow and warm to the accent, and a click sends a ring through
 * them. With no pointer about they drift into a slow swirling current.
 * Reduced motion or lite mode: drawn once, still. Sleeps while off screen or
 * in a hidden tab.
 */
export function DashField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduce = useReducedMotion()
  const { lite } = usePerf()

  useEffect(() => {
    const cv = ref.current
    const ctx = cv?.getContext("2d")
    if (!cv || !ctx) return
    const still = !!reduce || lite
    let w = 0, h = 0
    let dashes: Dash[] = []
    const ptr = { x: 0, y: 0, at: -1e9 }
    const rings: { x: number; y: number; t0: number }[] = []

    // a jittered grid, so the field reads as scattered rather than ruled
    const seed = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      w = cv.clientWidth; h = cv.clientHeight
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const gap = w < 640 ? 30 : 36
      dashes = []
      for (let y = gap / 2; y < h; y += gap)
        for (let x = gap / 2; x < w; x += gap)
          dashes.push({
            x: x + (Math.random() - 0.5) * gap * 0.8,
            y: y + (Math.random() - 0.5) * gap * 0.8,
            a: Math.random() * Math.PI,
            len: 7 + Math.random() * 5,
            rate: 5 + Math.random() * 4,
          })
    }

    // an arrow: a shaft through (x, y) with a small head at its tip
    const arrow = (d: Dash, len: number) => {
      const ux = Math.cos(d.a), uy = Math.sin(d.a)
      const tx = d.x + ux * len * 0.5, ty = d.y + uy * len * 0.5
      ctx.moveTo(d.x - ux * len * 0.5, d.y - uy * len * 0.5)
      ctx.lineTo(tx, ty)
      const hl = Math.min(3.2, len * 0.38)
      ctx.moveTo(tx - (ux * 0.87 - uy * 0.5) * hl, ty - (uy * 0.87 + ux * 0.5) * hl)
      ctx.lineTo(tx, ty)
      ctx.lineTo(tx - (ux * 0.87 + uy * 0.5) * hl, ty - (uy * 0.87 - ux * 0.5) * hl)
    }

    const draw = (now: number, dt: number) => {
      const idle = now - ptr.at > 3500
      const t = now / 1000
      for (let i = rings.length - 1; i >= 0; i--) if (now - rings[i].t0 > RING_LIFE) rings.splice(i, 1)

      ctx.clearRect(0, 0, w, h)
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.lineWidth = 1.3
      // far arrows in one ink path; the warm ones near the pointer or a ring one by one
      ctx.strokeStyle = `rgba(${INK},0.22)`
      ctx.beginPath()
      const warm: [Dash, number][] = []
      for (const d of dashes) {
        const dx = ptr.x - d.x, dy = ptr.y - d.y
        const dist = idle ? 1e4 : Math.hypot(dx, dy)
        // the pointer, or with nobody about a slow swirling current
        let goal = idle
          ? Math.sin(d.x * 0.0042 + t * 0.35) * Math.cos(d.y * 0.0051 - t * 0.27) * Math.PI * 1.6
          : Math.atan2(dy, dx)
        let heat = idle ? 0 : Math.max(0, 1 - dist / NEAR)
        for (const r of rings) {
          // a ring passing lays the dashes round it, tangent to the wave
          const rr = (now - r.t0) * RING_SPEED
          const off = Math.abs(Math.hypot(d.x - r.x, d.y - r.y) - rr)
          if (off < 26) {
            const k = (1 - off / 26) * (1 - (now - r.t0) / RING_LIFE)
            if (k > heat) { heat = k; goal = Math.atan2(d.y - r.y, d.x - r.x) + Math.PI / 2 }
          }
        }
        // far dashes are slower to come round, so the turn ripples outward
        d.a += turn(d.a, goal) * Math.min(1, dt * (d.rate / (1 + dist / 260)))
        if (heat > 0.04) { warm.push([d, heat]); continue }
        arrow(d, d.len)
      }
      ctx.stroke()
      for (const [d, heat] of warm) {
        ctx.strokeStyle = `rgba(${ACCENT},${0.25 + heat * 0.7})`
        ctx.lineWidth = 1.3 + heat * 0.8
        ctx.beginPath()
        arrow(d, d.len * (1 + heat * 1.3))
        ctx.stroke()
      }
    }

    seed()
    if (still) {
      draw(performance.now(), 0)
      const ro = new ResizeObserver(() => { seed(); draw(performance.now(), 0) })
      ro.observe(cv)
      return () => ro.disconnect()
    }

    let raf = 0, prev = performance.now(), visible = true
    const frame = (now: number) => {
      raf = 0
      if (!visible || document.hidden) return
      draw(now, Math.min(0.05, (now - prev) / 1000))
      prev = now
      raf = requestAnimationFrame(frame)
    }
    const wake = () => {
      if (raf || !visible || document.hidden) return
      prev = performance.now()
      raf = requestAnimationFrame(frame)
    }
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return
      const r = cv.getBoundingClientRect()
      ptr.x = e.clientX - r.left; ptr.y = e.clientY - r.top; ptr.at = performance.now()
    }
    const onDown = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect()
      const x = e.clientX - r.left, y = e.clientY - r.top
      if (x >= 0 && y >= 0 && x <= w && y <= h) rings.push({ x, y, t0: performance.now() })
    }
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; wake() })
    const ro = new ResizeObserver(seed)
    io.observe(cv)
    ro.observe(cv)
    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("pointerdown", onDown, { passive: true })
    document.addEventListener("visibilitychange", wake)
    wake()
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerdown", onDown)
      document.removeEventListener("visibilitychange", wake)
    }
  }, [reduce, lite])

  return <canvas ref={ref} aria-hidden="true" className={className} />
}
