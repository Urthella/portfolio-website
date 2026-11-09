"use client"

import { motion, useReducedMotion } from "framer-motion"
import { useEffect, useMemo, useRef, useState } from "react"

const FS = 200 // the size the glyphs are measured and drawn at, in svg units
const TRACK = -0.045 // letter spacing, in em
const WALK = 1700 // ms per letter while the frame walks the name on its own
const ACCENT = "#ff5a1f"

// a glyph's pen position and its ink box around the baseline (y = 0), in svg units
type Glyph = { ch: string; x: number; l: number; r: number; asc: number; desc: number }

const spring = { type: "spring", stiffness: 260, damping: 26, mass: 0.7 } as const

/**
 * The name in giant ink letters with an inspector frame over it: the frame
 * hops to the letter under the cursor (and walks the name on its own when
 * nobody points at it), reads out that glyph's rendered size in px, its Unicode
 * code point and its UTF-8 bytes, and the letter drops to a dashed outline as
 * if selected in an editor. Drawn as one SVG measured with the page's own font, so the
 * frame sits on each glyph's real ink box at any width; screen readers get the
 * plain name.
 */
export function MeasuredName({ text, className }: { text: string; className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null)
  const reduce = useReducedMotion()
  const [glyphs, setGlyphs] = useState<Glyph[] | null>(null)
  const [k, setK] = useState(1) // rendered px per svg unit
  const [sel, setSel] = useState(0)
  const hovering = useRef(false)

  // measure every glyph with the font the svg will draw in
  useEffect(() => {
    let live = true
    const svg = svgRef.current
    if (!svg) return
    const family = getComputedStyle(svg).fontFamily
    const font = `900 ${FS}px ${family}`
    document.fonts.load(font).then(() => {
      if (!live) return
      const ctx = document.createElement("canvas").getContext("2d")
      if (!ctx) return
      ctx.font = font
      const chars = [...text]
      setGlyphs(
        chars.map((ch, i) => {
          const m = ctx.measureText(ch)
          return {
            ch,
            // measuring the whole prefix keeps the font's kerning between letters
            x: ctx.measureText(chars.slice(0, i).join("")).width + i * TRACK * FS,
            l: m.actualBoundingBoxLeft,
            r: m.actualBoundingBoxRight,
            asc: m.actualBoundingBoxAscent,
            desc: m.actualBoundingBoxDescent,
          }
        }),
      )
    })
    return () => {
      live = false
    }
  }, [text])

  // the box the letters span, and the px per unit it renders at
  const box = useMemo(
    () =>
      glyphs && {
        x0: Math.min(...glyphs.map((g) => g.x - g.l)),
        x1: Math.max(...glyphs.map((g) => g.x + g.r)),
        top: Math.max(...glyphs.map((g) => g.asc)),
        bottom: Math.max(...glyphs.map((g) => g.desc)),
      },
    [glyphs],
  )
  useEffect(() => {
    const svg = svgRef.current
    if (!svg || !box) return
    const ro = new ResizeObserver(() => setK(svg.clientWidth / (box.x1 - box.x0)))
    ro.observe(svg)
    return () => ro.disconnect()
  }, [box])

  // with nobody pointing at it, the frame walks the name letter by letter
  useEffect(() => {
    if (!glyphs || reduce) return
    const id = window.setInterval(() => {
      if (hovering.current) return
      setSel((s) => {
        let n = s
        do n = (n + 1) % glyphs.length
        while (glyphs[n].ch === " ")
        return n
      })
    }, WALK)
    return () => window.clearInterval(id)
  }, [glyphs, reduce])

  const pick = (clientX: number) => {
    const svg = svgRef.current
    if (!svg || !glyphs || !box) return
    const x = box.x0 + (clientX - svg.getBoundingClientRect().left) / k
    let best = sel, bestD = Infinity
    glyphs.forEach((g, i) => {
      if (g.ch === " ") return
      const d = x < g.x - g.l ? g.x - g.l - x : x > g.x + g.r ? x - g.x - g.r : 0
      if (d < bestD) { bestD = d; best = i }
    })
    setSel(best)
  }

  const g = glyphs?.[sel]
  const pad = 6 / k // the frame sits 6px off the ink
  const f = g && { x: g.x - g.l - pad, y: -g.asc - pad, w: g.l + g.r + 2 * pad, h: g.asc + g.desc + 2 * pad }
  const hs = 7 / k // handle size: 7px whatever the scale
  const flip = !!(f && box && f.x - box.x0 > (box.x1 - box.x0) * 0.55)
  const cp = g ? `U+${g.ch.codePointAt(0)!.toString(16).toUpperCase().padStart(4, "0")}` : ""
  // the letter as it travels on the wire: its UTF-8 bytes (ş is two of them)
  const bytes = g ? Array.from(new TextEncoder().encode(g.ch), (b) => b.toString(16).toUpperCase().padStart(2, "0")).join(" ") : ""
  const t = reduce ? { duration: 0 } : spring

  return (
    <h1 className={className}>
      <span className="sr-only">{text}</span>
      <svg
        ref={svgRef}
        aria-hidden="true"
        viewBox={box ? `${box.x0} ${-box.top} ${box.x1 - box.x0} ${box.top + box.bottom}` : "0 -150 1300 200"}
        className="block w-full overflow-visible font-sans transition-opacity duration-500"
        style={{ opacity: glyphs ? 1 : 0 }}
        onPointerMove={(e) => {
          hovering.current = true
          pick(e.clientX)
        }}
        onPointerLeave={() => {
          hovering.current = false
        }}
        onPointerDown={(e) => pick(e.clientX)}
      >
        {glyphs?.map((gl, i) => (
          <text
            key={i}
            x={gl.x}
            y={0}
            fontSize={FS}
            fontWeight={900}
            className="transition-[fill,stroke] duration-300"
            style={{ fill: i === sel ? "#e4e0d7" : "#151413", stroke: i === sel ? "#151413" : "transparent" }}
            strokeWidth={1.5}
            strokeDasharray="5 4"
            vectorEffect="non-scaling-stroke"
          >
            {gl.ch}
          </text>
        ))}

        {f && g && (
          <g>
            {/* attrX/attrY move the svg attributes (plain x/y would be a css transform) */}
            <motion.rect
              initial={false}
              animate={{ attrX: f.x, attrY: f.y, width: f.w, height: f.h }}
              transition={t}
              fill="none"
              stroke={ACCENT}
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
            />
            {[0, 1].flatMap((cx) =>
              [0, 1].map((cy) => (
                <motion.rect
                  key={`${cx}${cy}`}
                  initial={false}
                  animate={{ attrX: f.x + cx * f.w - hs / 2, attrY: f.y + cy * f.h - hs / 2, width: hs, height: hs }}
                  transition={t}
                  fill={ACCENT}
                />
              )),
            )}
            {/* over the last letters the readout hangs left from the frame's right edge, so it stays on screen */}
            <motion.text
              initial={false}
              animate={{ attrX: flip ? f.x + f.w : f.x, attrY: f.y - 9 / k }}
              transition={t}
              fontSize={11 / k}
              textAnchor={flip ? "end" : "start"}
              className="font-mono"
            >
              <tspan fill={ACCENT} fontWeight={600}>{g.ch}</tspan>
              <tspan fill={ACCENT} dx={8 / k}>
                {Math.round((g.l + g.r) * k)} × {Math.round((g.asc + g.desc) * k)}
              </tspan>
              <tspan fill="#151413" fillOpacity={0.45} dx={8 / k}>{cp}</tspan>
              <tspan fill="#151413" fillOpacity={0.45} dx={8 / k}>
                utf-8 {bytes}
              </tspan>
            </motion.text>
          </g>
        )}
      </svg>
    </h1>
  )
}
