"use client"

import { useReducedMotion } from "framer-motion"
import { useEffect, useRef, useSyncExternalStore } from "react"

import { usePerf } from "@/hooks/use-perf"

// Only a real mouse: touch has no cursor to feel for.
const FINE = "(hover: hover) and (pointer: fine)"
const subscribeFine = (cb: () => void) => {
  const mq = window.matchMedia(FINE)
  mq.addEventListener("change", cb)
  return () => mq.removeEventListener("change", cb)
}
const isFine = () => window.matchMedia(FINE).matches

const SENSE = 260 // px from a pill's edge at which its goo notices the cursor
const REACH = 70 // px a tentacle reaches toward the cursor at most (times its own reachK)
const HOVER = 52 // px it sticks out while the cursor rests on the pill itself
const MB = 2 // pills with goo at once
const PER = 4 // tentacles per pill, at most
const MS = MB * PER // strands in the shader
const NP = 12 // points per strand
// Past this far from a strand's points it cannot change any pixel that gets drawn (the smooth
// union only reaches 11px), so the shader skips its cones there. Uniforms: 96 + 8 + 2 + 2 + 4 vec4.
const MARGIN = 20

const VERT = `attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`

/*
 * The Venom Button's goo (components/venom-button), cut down to its seeking pseudopods: one signed
 * distance field of the pills and the tentacles (tapered capsules), smooth-unioned so each root
 * melts into its pill, shaded as near-black lacquer in a simple studio. The pills themselves are
 * HTML underneath, so the shader only paints what the tentacles add to them.
 */
const FRAG = `precision highp float;
uniform vec2 uRes;            // canvas px
uniform float uDpr;
uniform vec4 uBox[${MB}];       // pills with goo: x, y, w, h in css px
uniform float uRad[${MB}];      // their corner radius
uniform float uBoxN;
uniform vec4 uPts[${MS * NP}];  // x, y, radius, unused
uniform vec4 uBB[${MS}];        // per strand: min x, min y, max x, max y (margin included)
uniform float uCount;

vec2 smin(vec2 a, vec2 b, float k){
  // smooth union of (distance, thickness) pairs
  float h = clamp(0.5 + 0.5 * (b.x - a.x) / k, 0.0, 1.0);
  return vec2(mix(b.x, a.x, h) - k * h * (1.0 - h), mix(b.y, a.y, h));
}
// exact distance to a tapered capsule (a circle of radius ra at a, rb at b, joined by tangents)
float cone(vec2 p, vec2 a, vec2 b, float ra, float rb, out float r){
  vec2 pb = b - a;
  p -= a;
  float h = dot(pb, pb);
  float t = clamp(dot(p, pb) / (h + 1e-4), 0.0, 1.0);
  r = mix(ra, rb, t);
  float bb = ra - rb;
  if (h <= bb * bb + 1e-3) {
    // too short to taper: the larger circle swallows the smaller one
    return ra > rb ? length(p) - ra : length(p - pb) - rb;
  }
  vec2 q = vec2(dot(p, vec2(pb.y, -pb.x)), dot(p, pb)) / h;
  q.x = abs(q.x);
  vec2 c = vec2(sqrt(h - bb * bb), bb);
  float k = c.x * q.y - c.y * q.x;
  float m = dot(c, q);
  float n = dot(q, q);
  if (k < 0.0) return sqrt(h * n) - ra;
  if (k > c.x) return sqrt(h * (n + 1.0 - 2.0 * q.y)) - rb;
  return m - ra;
}
float rbox(vec2 p, vec4 b, float r){
  vec2 h = b.zw * 0.5;
  vec2 q = abs(p - b.xy - h) - h + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}
// x: distance to the goo, y: its thickness, z: distance to the nearest pill
vec3 field(vec2 p){
  vec2 body = vec2(1e5, 2.0);
  for (int k = 0; k < ${MB}; k++) {
    if (float(k) >= uBoxN) break;
    float d = rbox(p, uBox[k], uRad[k]);
    if (d < body.x) body = vec2(d, uBox[k].w * 0.5);
  }
  vec2 st = vec2(1e5, 2.0);
  float r;
  for (int s = 0; s < ${MS}; s++) {
    if (float(s) >= uCount) break;
    vec4 bb = uBB[s];
    if (p.x < bb.x || p.y < bb.y || p.x > bb.z || p.y > bb.w) continue;
    // one strand is a hard union of its pieces (no beads at the joints)...
    vec2 one = vec2(1e5, 2.0);
    for (int i = 0; i < ${NP - 1}; i++) {
      vec4 A = uPts[s * ${NP} + i];
      vec4 B = uPts[s * ${NP} + i + 1];
      float d = cone(p, A.xy, B.xy, A.z, B.z, r);
      if (d < one.x) one = vec2(d, r + 0.3);
    }
    // ...and neighbouring strands melt together where they touch
    st = smin(st, one, 3.5);
  }
  return vec3(smin(body, st, 11.0), body.x);
}
float dist(vec2 p){ return field(p).x; }

float env(vec3 R){
  float up = -R.y;
  float e = 0.015;
  e += smoothstep(0.3, 0.5, up) * smoothstep(0.75, 0.55, up) * smoothstep(0.8, 0.5, abs(R.x)) * 2.6; // softbox above
  e += smoothstep(0.8, 0.95, up) * 0.6;                                                                 // ceiling
  e += smoothstep(-0.5, -0.7, R.x) * smoothstep(0.5, 0.25, abs(R.y)) * 1.1;                            // window, left
  e += smoothstep(0.6, 0.85, R.x) * smoothstep(0.6, 0.2, abs(R.y)) * 0.5;                              // fill, right
  e += smoothstep(0.25, 0.7, R.y) * 1.25;                                                               // pale floor
  return e;
}

void main(){
  vec2 p = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uDpr;
  vec3 f = field(p);
  float d = f.x;
  // Paint only outside the pills (the HTML pill and its label show through) and only where the
  // goo differs from the bare pill, so no ring is drawn round it and the roots fade into its edge.
  float a = clamp(0.5 - d * uDpr, 0.0, 1.0) * clamp(f.z * uDpr + 0.5, 0.0, 1.0) * clamp((f.z - d) * 1.5, 0.0, 1.0);
  if (a <= 0.0) { gl_FragColor = vec4(0.0); return; }
  // round profile: a circle of radius = local thickness. The slope comes from the profile
  // analytically, the direction from the distance field, so the surface stays smooth.
  float B = max(f.y, 0.8);
  float s = clamp(-d, 0.0, B);
  float z = sqrt(max(1e-3, s * (2.0 * B - s)));
  float slope = min((B - s) / z, 6.0);
  vec2 g = vec2(dist(p + vec2(0.5, 0.0)) - d, dist(p + vec2(0.0, 0.5)) - d);
  g = length(g) > 1e-6 ? normalize(g) : vec2(0.0);
  vec3 n = normalize(vec3(g * slope, 1.0));
  vec3 R = reflect(vec3(0.0, 0.0, -1.0), n);
  float fres = 0.05 + 0.95 * pow(1.0 - max(n.z, 0.0), 3.0);
  vec3 col = vec3(0.008, 0.008, 0.01) + min(env(R) * fres, 1.0) * vec3(0.93, 0.94, 0.97);
  col += pow(max(dot(R, normalize(vec3(-0.35, -0.75, 0.56))), 0.0), 70.0) * 1.2;
  col += pow(max(dot(R, normalize(vec3(0.55, -0.35, 0.76))), 0.0), 140.0) * 0.55;
  gl_FragColor = vec4(col * a, a);
}`

type Box = { x: number; y: number; w: number; h: number; r: number }
type Strand = {
  x: Float32Array; y: Float32Array; px: Float32Array; py: Float32Array
  spread: number; reachK: number; slack: number; width: number; phase: number
  sx: number; sy: number; ex: number; ey: number; seg: number
}
type Goo = { b: Box; on: boolean; f: number; strands: Strand[] }

// The nearest point on a rounded rect's edge, the outward normal there and the signed distance.
const edge = (b: Box, px: number, py: number) => {
  const qx = Math.max(b.x + b.r, Math.min(b.x + b.w - b.r, px))
  const qy = Math.max(b.y + b.r, Math.min(b.y + b.h - b.r, py))
  const l = Math.hypot(px - qx, py - qy)
  if (l < 1e-3) {
    // inside the straight core: out through the top or the bottom (these pills are wide)
    const top = py < b.y + b.h / 2
    return { x: px, y: top ? b.y : b.y + b.h, nx: 0, ny: top ? -1 : 1, d: -(top ? py - b.y : b.y + b.h - py) }
  }
  const nx = (px - qx) / l, ny = (py - qy) / l
  return { x: qx + nx * b.r, y: qy + ny * b.r, nx, ny, d: l - b.r }
}

/**
 * The home page's call-to-action pills ([data-tentacles]) sprout goo toward the cursor, like the
 * Venom Button's seek mode: within SENSE of a pill, 3 or 4 thick tentacles ooze from the edge
 * nearest the cursor and feel toward it, reaching further the closer it gets, swaying, darting
 * now and then, heavy and slightly sagging. They never grab. When the cursor leaves they reel back
 * in. One fixed full-viewport WebGL canvas serves every pill and only runs while there is goo to
 * draw. Off under reduced motion, lite mode, touch, or without WebGL; the pills keep their look.
 */
export function TentacleLayer() {
  const { lite } = usePerf()
  const reduce = useReducedMotion()
  const fine = useSyncExternalStore(subscribeFine, isFine, () => false)
  if (lite || reduce || !fine) return null
  return <TentacleCanvas />
}

function TentacleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current!
    const gl = canvas.getContext("webgl", { premultipliedAlpha: true, antialias: false, alpha: true })
    // no WebGL, or the shader did not build: no goo, the pills stay as they are
    const off = () => {
      canvas.style.display = "none"
    }
    if (!gl) return off()
    const shaders: WebGLShader[] = []
    const sh = (t: number, src: string) => {
      const s = gl.createShader(t)
      if (!s) return null
      shaders.push(s)
      gl.shaderSource(s, src)
      gl.compileShader(s)
      return s
    }
    const vs = sh(gl.VERTEX_SHADER, VERT), fs = sh(gl.FRAGMENT_SHADER, FRAG)
    const prog = gl.createProgram()
    if (prog && vs && fs) {
      gl.attachShader(prog, vs)
      gl.attachShader(prog, fs)
      gl.linkProgram(prog)
    }
    const quad = gl.createBuffer()
    const dispose = () => {
      gl.deleteBuffer(quad)
      gl.deleteProgram(prog)
      for (const s of shaders) gl.deleteShader(s)
    }
    if (!prog || !vs || !fs || !quad || !gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      dispose()
      return off()
    }
    gl.useProgram(prog)
    const U: Record<string, WebGLUniformLocation | null> = {}
    for (const n of ["uRes", "uDpr", "uBox", "uRad", "uBoxN", "uPts", "uBB", "uCount"]) U[n] = gl.getUniformLocation(prog, n)
    gl.bindBuffer(gl.ARRAY_BUFFER, quad)
    const aLoc = gl.getAttribLocation(prog, "a")
    gl.enableVertexAttribArray(aLoc)
    gl.vertexAttribPointer(aLoc, 2, gl.FLOAT, false, 0, 0)
    gl.clearColor(0, 0, 0, 0)
    const quadData = new Float32Array(8)
    const pts = new Float32Array(MS * NP * 4), bbs = new Float32Array(MS * 4)
    const boxes = new Float32Array(MB * 4), rads = new Float32Array(MB)

    let vw = 0, vh = 0, dpr = 1
    const fit = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1)
      vw = canvas.clientWidth
      vh = canvas.clientHeight
      canvas.width = Math.round(vw * dpr)
      canvas.height = Math.round(vh * dpr)
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    fit()

    // the pills, looked up again whenever the loop wakes (cheap, and survives re-renders and HMR)
    let pills: Element[] = []
    const radius = new WeakMap<Element, number>()
    const measure = (el: Element) => {
      const r = el.getBoundingClientRect()
      let rad = radius.get(el)
      if (rad === undefined) radius.set(el, (rad = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0))
      const b: Box = { x: r.left, y: r.top, w: r.width, h: r.height, r: Math.min(rad, r.width / 2, r.height / 2) }
      return { b, seen: r.width > 0 && r.bottom > 0 && r.top < vh && r.right > 0 && r.left < vw }
    }

    let mx = -1e4, my = -1e4
    const goos = new Map<Element, Goo>()

    const spawn = (b: Box): Goo => {
      const n = Math.random() < 0.5 ? 3 : PER
      const e = edge(b, mx, my)
      const strands: Strand[] = []
      for (let k = 0; k < n; k++) {
        strands.push({
          x: new Float32Array(NP).fill(e.x), y: new Float32Array(NP).fill(e.y),
          px: new Float32Array(NP).fill(e.x), py: new Float32Array(NP).fill(e.y),
          spread: (k / (n - 1)) * 2 - 1 + (Math.random() - 0.5) * 0.15,
          reachK: 0.55 + Math.random() * 0.4,
          slack: 1.02 + Math.random() * 0.12,
          width: 1.7 + Math.random() * 0.6,
          phase: Math.random() * 10,
          // the root, relative to the pill so it rides along when the page scrolls
          sx: e.x - b.x, sy: e.y - b.y,
          ex: e.x, ey: e.y, seg: 0,
        })
      }
      return { b, on: true, f: 0, strands }
    }

    let raf = 0
    let prev = 0
    const t0 = performance.now()
    const clear = () => gl.clear(gl.COLOR_BUFFER_BIT)

    const frame = (now: number) => {
      raf = 0
      const dt = Math.max(1 / 240, Math.min(0.033, (now - prev) / 1000))
      prev = now
      const time = (now - t0) / 1000

      // ---- which pills want goo: the nearest two on screen within SENSE ----
      const near: [Element, Box, number][] = []
      for (const el of pills) {
        const { b, seen } = measure(el)
        const g = goos.get(el)
        if (g) {
          // carry the goo along with its pill (scroll, resize, framer's entrance)
          const dx = b.x - g.b.x, dy = b.y - g.b.y
          if (dx || dy) {
            for (const st of g.strands) {
              for (let i = 0; i < NP; i++) {
                st.x[i] += dx
                st.px[i] += dx
                st.y[i] += dy
                st.py[i] += dy
              }
              st.ex += dx
              st.ey += dy
            }
          }
          g.b = b
        }
        const d = edge(b, mx, my).d
        if (seen && d < SENSE + (g?.on ? 25 : 0)) near.push([el, b, d])
      }
      near.sort((p, q) => p[2] - q[2])
      // a pill whose way to the cursor runs past a nearer one stays quiet, or its tentacles would
      // only dive into that pill and web the gap between them
      const blocked = (nb: Box, b: Box) => {
        const e = edge(b, mx, my)
        for (let i = 0; i <= 8; i++) if (edge(nb, e.x + ((mx - e.x) * i) / 8, e.y + ((my - e.y) * i) / 8).d < 16) return true
        return false
      }
      const pick: typeof near = []
      for (const c of near) if (pick.length < MB && !pick.some((q) => blocked(q[1], c[1]))) pick.push(c)
      for (const g of goos.values()) g.on = false
      for (const [el, b] of pick) {
        const g = goos.get(el)
        if (g) g.on = true
        else if (goos.size < MB) goos.set(el, spawn(b))
      }

      // ---- simulate, as the Venom Button's seek mode ----
      let n = 0, bi = 0
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
      for (const [el, g] of goos) {
        const b = g.b
        const e = edge(b, mx, my)
        const D = Math.max(0, e.d)
        // how hard it is reaching: nothing at the edge of its senses, everything on the pill
        g.f += ((g.on ? Math.max(0, 1 - D / SENSE) : 0) - g.f) * Math.min(1, dt * 5)
        const ease = g.f * g.f * (3 - 2 * g.f)
        const spreadPx = Math.max(24, Math.min(b.w * 0.35, D * 0.4 + 24)) * 0.8
        let alive = 0
        for (const st of g.strands) {
          if (g.on) {
            // roots slide along the edge after the cursor, a little apart from each other
            const k = Math.min(1, dt * 6)
            st.sx += (e.x - e.ny * st.spread * spreadPx - b.x - st.sx) * k
            st.sy += (e.y + e.nx * st.spread * spreadPx - b.y - st.sy) * k
          }
          const root = edge(b, b.x + st.sx, b.y + st.sy)
          // a short strand sinks back into the pill, so its fillet melts away instead of popping
          const life = Math.min(1, (st.seg * (NP - 1)) / 16)
          const inset = Math.min(Math.min(b.w, b.h) / 2, 3 + 14 * (1 - life))
          const rx = root.x - root.nx * inset, ry = root.y - root.ny * inset
          if (g.on) {
            const vx = mx - rx, vy = my - ry
            const vl = Math.hypot(vx, vy) || 1
            // aim at the cursor, leaning out of the pill; over the pill, straight out and bent toward it
            const lean = e.d > 0 ? 0.35 : 1.6
            let ax = vx / vl + root.nx * lean, ay = vy / vl + root.ny * lean
            const al = Math.hypot(ax, ay) || 1
            ax /= al
            ay /= al
            // it hesitates, then darts a little further, then draws back, like it is testing the air
            const dart = Math.pow(Math.max(0, Math.sin(time * 1.9 + st.phase * 3.1)), 10) * 0.28
            // part of the way, more the closer the cursor; right by the pill, just past it
            const reach = st.reachK * ease * (e.d > 0 ? REACH : HOVER)
            const len = Math.max(3, (e.d > 0 ? Math.min(reach, vl + 22 * st.reachK) : reach) * (1 + dart))
            const sway = Math.sin(time * 2.7 + st.phase) * (3 + 9 * ease) + Math.sin(time * 5.3 + st.phase * 2) * 2 * ease
            const tx = rx + ax * len - ay * sway, ty = ry + ay * len + ax * sway
            const k = 1 - Math.exp(-dt * 6)
            st.ex += (tx - st.ex) * k
            st.ey += (ty - st.ey) * k
            st.seg = (Math.hypot(st.ex - rx, st.ey - ry) * (st.slack + 0.06)) / (NP - 1)
            alive++
          } else {
            st.seg *= Math.exp(-dt * 5.5) // reel back in, slowly, like something heavy
            // the tip is free now; remember where it is so it can pick up from here if the cursor returns
            st.ex = st.x[NP - 1]
            st.ey = st.y[NP - 1]
            if (st.seg * (NP - 1) > 1.5) alive++
          }
          // verlet rope: heavy damping, a slow wobble and a little sag
          for (let i = 1; i < NP; i++) {
            const vx = (st.x[i] - st.px[i]) * 0.92, vy = (st.y[i] - st.py[i]) * 0.92
            st.px[i] = st.x[i]
            st.py[i] = st.y[i]
            const mid = Math.sin((i / (NP - 1)) * Math.PI)
            const wx = Math.sin(time * 1.6 + st.phase + i * 0.55) * 14 * mid
            const wy = Math.cos(time * 1.3 + st.phase * 1.3 + i * 0.45) * 14 * mid
            st.x[i] += vx + wx * dt * dt
            st.y[i] += vy + (260 + wy) * dt * dt
          }
          st.x[0] = st.px[0] = rx
          st.y[0] = st.py[0] = ry
          if (g.on) {
            st.x[NP - 1] = st.ex
            st.y[NP - 1] = st.ey
          }
          const len = Math.max(0.01, st.seg)
          for (let it = 0; it < 14; it++) {
            for (let i = 0; i < NP - 1; i++) {
              const dx = st.x[i + 1] - st.x[i], dy = st.y[i + 1] - st.y[i]
              const d = Math.hypot(dx, dy) || 0.0001
              const diff = (d - len) / d
              const wa = i === 0 ? 0 : 0.5, wb = g.on && i + 1 === NP - 1 ? 0 : i === 0 ? 1 : 0.5
              const m = wa + wb || 1
              st.x[i] += dx * diff * (wa / m)
              st.y[i] += dy * diff * (wa / m)
              st.x[i + 1] -= dx * diff * (wb / m)
              st.y[i + 1] -= dy * diff * (wb / m)
            }
          }
          // a little bending stiffness, so a strand curves like goo instead of folding into kinks
          for (let pass = 0; pass < 2; pass++) {
            for (let i = 1; i < NP - 1; i++) {
              st.x[i] += ((st.x[i - 1] + st.x[i + 1]) / 2 - st.x[i]) * 0.22
              st.y[i] += ((st.y[i - 1] + st.y[i + 1]) / 2 - st.y[i]) * 0.22
            }
          }
          if (!Number.isFinite(st.x[NP - 1])) {
            st.x.fill(rx)
            st.px.fill(rx)
            st.y.fill(ry)
            st.py.fill(ry)
          }
        }
        if (!g.on && !alive) {
          goos.delete(el)
          continue
        }

        // ---- upload: thick where it leaves the pill, fine at the tip, thinner while only noticing ----
        const thick = 0.55 + 0.45 * g.f
        for (const st of g.strands) {
          if (n >= MS) break
          let sx0 = Infinity, sy0 = Infinity, sx1 = -Infinity, sy1 = -Infinity
          for (let i = 0; i < NP; i++) {
            const r = Math.max(0.55, st.width * (3.0 - 1.9 * (i / (NP - 1))) * thick)
            pts.set([st.x[i], st.y[i], r, 0], (n * NP + i) * 4)
            sx0 = Math.min(sx0, st.x[i] - r)
            sx1 = Math.max(sx1, st.x[i] + r)
            sy0 = Math.min(sy0, st.y[i] - r)
            sy1 = Math.max(sy1, st.y[i] + r)
          }
          sx0 -= MARGIN
          sy0 -= MARGIN
          sx1 += MARGIN
          sy1 += MARGIN
          bbs.set([sx0, sy0, sx1, sy1], n * 4)
          x0 = Math.min(x0, sx0)
          y0 = Math.min(y0, sy0)
          x1 = Math.max(x1, sx1)
          y1 = Math.max(y1, sy1)
          n++
        }
        boxes.set([b.x, b.y, b.w, b.h], bi * 4)
        rads[bi++] = b.r
      }

      clear()
      if (n) {
        gl.uniform2f(U.uRes, canvas.width, canvas.height)
        gl.uniform1f(U.uDpr, dpr)
        gl.uniform4fv(U.uBox, boxes)
        gl.uniform1fv(U.uRad, rads)
        gl.uniform1f(U.uBoxN, bi)
        gl.uniform4fv(U.uPts, pts)
        gl.uniform4fv(U.uBB, bbs)
        gl.uniform1f(U.uCount, n)
        // only shade the box round the goo
        const qx0 = Math.max(0, x0), qx1 = Math.min(vw, x1), qy0 = Math.max(0, y0), qy1 = Math.min(vh, y1)
        if (qx1 > qx0 && qy1 > qy0) {
          const X = (v: number) => (v / vw) * 2 - 1, Y = (v: number) => 1 - (v / vh) * 2
          quadData.set([X(qx0), Y(qy0), X(qx1), Y(qy0), X(qx0), Y(qy1), X(qx1), Y(qy1)])
          gl.bufferData(gl.ARRAY_BUFFER, quadData, gl.DYNAMIC_DRAW)
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
        }
      }
      // keep going while there is goo; once it has all reeled in, sleep on an empty canvas
      if (goos.size) raf = requestAnimationFrame(frame)
    }

    let dead = false
    // asleep: wake only when the cursor comes within SENSE of a pill on screen
    const wake = () => {
      if (raf || dead || document.hidden) return
      pills = Array.from(document.querySelectorAll("[data-tentacles]"))
      for (const el of pills) {
        const { b, seen } = measure(el)
        if (seen && edge(b, mx, my).d < SENSE) {
          prev = performance.now()
          raf = requestAnimationFrame(frame)
          return
        }
      }
    }
    const sleep = () => {
      cancelAnimationFrame(raf)
      raf = 0
      goos.clear()
      clear()
    }
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return
      mx = e.clientX
      my = e.clientY
      wake()
    }
    // a mouse that leaves the window sends no more moves: let the goo reel in
    const onLeave = () => {
      mx = my = -1e4
    }
    const onVisibility = () => {
      if (document.hidden) sleep()
    }
    const onResize = () => {
      fit()
      wake()
    }
    const onLost = () => {
      dead = true
      sleep()
      off()
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("scroll", wake, { passive: true })
    window.addEventListener("resize", onResize)
    document.documentElement.addEventListener("mouseleave", onLeave)
    document.addEventListener("visibilitychange", onVisibility)
    canvas.addEventListener("webglcontextlost", onLost)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("scroll", wake)
      window.removeEventListener("resize", onResize)
      document.documentElement.removeEventListener("mouseleave", onLeave)
      document.removeEventListener("visibilitychange", onVisibility)
      canvas.removeEventListener("webglcontextlost", onLost)
      dispose()
    }
  }, [])

  // fixed over the hero inside <main>: above its content (the pills sit in framer layers, so the
  // goo cannot go under them), below the tech marquee (z-40). At z-1 and before the footer in the
  // DOM, the venom's ink layer (also z-1) paints after it, so its tentacles invert with the page.
  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[1] h-full w-full" />
}
