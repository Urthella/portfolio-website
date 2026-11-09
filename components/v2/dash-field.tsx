"use client"

import { useReducedMotion } from "framer-motion"
import { useEffect, useRef } from "react"

import { usePerf } from "@/hooks/use-perf"

const INK = "21,20,19"
const ACCENT = "255,90,31"
const NEAR = 190 // px: inside this the dashes grow and warm to the accent
const RING_SPEED = 0.75 // px per ms
const RING_LIFE = 1400 // ms
const COOL = 1200 // ms after the last pointer move during which the warmth fades out

type Dash = { x: number; y: number; a: number; len: number; rate: number }

// shortest turn between two undirected angles (a dash looks the same either way round)
const turn = (from: number, to: number) => {
  let d = (to - from) % Math.PI
  if (d > Math.PI / 2) d -= Math.PI
  if (d < -Math.PI / 2) d += Math.PI
  return d
}

/**
 * A field of short ink dashes behind the hero that all turn toward the cursor,
 * like iron filings round a magnet. The turn ripples out from the pointer (far
 * dashes follow later), close by they grow and warm to the accent, and a click
 * sends a ring through them.
 *
 * It only draws while something moves: the loop runs from a pointer move or a
 * click until every dash has settled and the warmth has faded, then sleeps, so
 * a still page costs nothing. Reduced motion or lite mode: drawn once, still.
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
    // until the pointer shows up the dashes face a point above the name
    const ptr = { x: 0, y: 0, at: -1e9 }
    const rings: { x: number; y: number; t0: number }[] = []

    // a jittered grid, so the field reads as scattered rather than ruled
    const seed = () => {
      // 1.5x is plenty for 1.4px strokes, and a third cheaper to fill than 2x
      const dpr = Math.min(1.5, window.devicePixelRatio || 1)
      w = cv.clientWidth; h = cv.clientHeight
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (ptr.at < 0) { ptr.x = w * 0.5; ptr.y = h * 0.3 }
      const gap = w < 640 ? 30 : 36
      dashes = []
      for (let y = gap / 2; y < h; y += gap)
        for (let x = gap / 2; x < w; x += gap) {
          const d = {
            x: x + (Math.random() - 0.5) * gap * 0.8,
            y: y + (Math.random() - 0.5) * gap * 0.8,
            a: 0,
            len: 5 + Math.random() * 6,
            rate: 5 + Math.random() * 4,
          }
          d.a = Math.atan2(ptr.y - d.y, ptr.x - d.x)
          dashes.push(d)
        }
    }

    // draws one frame; returns whether anything is still moving
    const draw = (now: number, dt: number) => {
      for (let i = rings.length - 1; i >= 0; i--) if (now - rings[i].t0 > RING_LIFE) rings.splice(i, 1)
      const warmth = Math.max(0, 1 - (now - ptr.at) / COOL)

      ctx.clearRect(0, 0, w, h)
      ctx.lineCap = "round"
      ctx.lineWidth = 1.4
      // far dashes in one ink path; the warm ones near the pointer or a ring one by one
      ctx.strokeStyle = `rgba(${INK},0.2)`
      ctx.beginPath()
      const warm: [Dash, number][] = []
      let moving = 0
      for (const d of dashes) {
        const dx = ptr.x - d.x, dy = ptr.y - d.y
        const dist = Math.hypot(dx, dy)
        let goal = Math.atan2(dy, dx)
        let heat = Math.max(0, 1 - dist / NEAR) * warmth
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
        const da = turn(d.a, goal) * Math.min(1, dt * (d.rate / (1 + dist / 260)))
        d.a += da
        moving = Math.max(moving, Math.abs(da))
        const len = d.len * (1 + heat * 1.3)
        if (heat > 0.04) { warm.push([d, heat]); continue }
        const cx = Math.cos(d.a) * len * 0.5, cy = Math.sin(d.a) * len * 0.5
        ctx.moveTo(d.x - cx, d.y - cy)
        ctx.lineTo(d.x + cx, d.y + cy)
      }
      ctx.stroke()
      for (const [d, heat] of warm) {
        const len = d.len * (1 + heat * 1.3)
        const cx = Math.cos(d.a) * len * 0.5, cy = Math.sin(d.a) * len * 0.5
        ctx.strokeStyle = `rgba(${ACCENT},${0.25 + heat * 0.7})`
        ctx.lineWidth = 1.4 + heat * 0.8
        ctx.beginPath()
        ctx.moveTo(d.x - cx, d.y - cy)
        ctx.lineTo(d.x + cx, d.y + cy)
        ctx.stroke()
      }
      return moving > 0.0015 || warmth > 0 || rings.length > 0
    }

    seed()
    draw(performance.now(), 0)
    if (still) {
      const ro = new ResizeObserver(() => { seed(); draw(performance.now(), 0) })
      ro.observe(cv)
      return () => ro.disconnect()
    }

    let raf = 0, prev = 0, visible = true
    const frame = (now: number) => {
      raf = 0
      if (!visible || document.hidden) return
      const busy = draw(now, Math.min(0.05, (now - prev) / 1000))
      prev = now
      if (busy) raf = requestAnimationFrame(frame)
    }
    const wake = () => {
      if (raf || !visible || document.hidden) return
      prev = performance.now()
      raf = requestAnimationFrame(frame)
    }
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch" || !visible) return
      const r = cv.getBoundingClientRect()
      ptr.x = e.clientX - r.left; ptr.y = e.clientY - r.top; ptr.at = performance.now()
      wake()
    }
    const onDown = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect()
      const x = e.clientX - r.left, y = e.clientY - r.top
      if (x < 0 || y < 0 || x > w || y > h) return
      rings.push({ x, y, t0: performance.now() })
      wake()
    }
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting })
    const ro = new ResizeObserver(() => { seed(); draw(performance.now(), 0) })
    io.observe(cv)
    ro.observe(cv)
    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("pointerdown", onDown, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerdown", onDown)
    }
  }, [reduce, lite])

  return <canvas ref={ref} aria-hidden="true" className={className} />
}
