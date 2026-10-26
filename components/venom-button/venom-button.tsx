"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/* A cartoon glove pointer, drawn in a 32 x 36 box. The fingertip (the hotspot) sits at (11.5, 1). */
const GLOVE =
  "M9 14V3.6a2.5 2.5 0 0 1 5 0V12.2a2.2 2.2 0 0 1 4.4 0.4a2.2 2.2 0 0 1 4.4 0.8a2.2 2.2 0 0 1 4.2 1.6V22c0 4-2.6 7-6 7H14.6c-3 0-5.4-1.8-6.6-4.4L4.1 18.6a2.3 2.3 0 0 1 3.6-2.8L9 17.4Z";
const GLOVE_LINES = "M18.4 12.6V17.2M22.8 13.4V17.6M14 12.2V16.6";
const CUFF = "M12.6 28.6h12.2a1.6 1.6 0 0 1 1.6 1.6v3.4a1.6 1.6 0 0 1-1.6 1.6H12.6a1.6 1.6 0 0 1-1.6-1.6v-3.4a1.6 1.6 0 0 1 1.6-1.6Z";
const CUFF_LINES = "M15.4 29.2v5.4M18.7 29.2v5.4M22 29.2v5.4";
const HOT_X = 11.5, HOT_Y = 1;
/* Where the goo grabs the glove, in the same 32 x 36 box: index tip, the three knuckles, the
   thumb, the index joint, the palm and the cuff. */
const GRIPS: [number, number][] = [[11.5, 3.6], [16.2, 13.2], [20.6, 14], [24.9, 15.8], [5.6, 18], [11.5, 10], [18.5, 22], [18.7, 31.6]];
/* For each grip: the angle of the band of goo across it (radians) and its length in glove units. */
const BANDS: [number, number][] = [[0, 5.6], [0, 4.6], [0, 4.6], [0, 4.4], [Math.PI / 4, 4.8], [0, 5.6], [0.08, 11], [0, 15]];
/* With the system pointer there is no hand, so the strands gather round the hotspot. */
const NATIVE_GRIPS: [number, number][] = [[0, 0], [5, 7], [-4, 6], [8, 13], [-2, 12], [3, 3], [6, 18], [0, 16]];
const NATIVE_BANDS: [number, number][] = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];

/* Limits baked into the shader. */
const MH = 7; // thick strands that reach for the hand
const MB = 4; // portfolio addition: tentacles that carry the burst slabs out of the pill
const MS = MH + MB; // strands rendered as goo
const NP = 12; // points per strand
const MSPK = 8;
const MDROP = 6;

const VERT = `attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`;

/*
 * The goo is one signed distance field: the pill, a mound pulled toward the hand, the strands
 * (tapered capsules), spikes and droplets, all joined with a smooth minimum so every join melts
 * into the next. The field also carries a "thickness" so each part is shaded with its own round
 * profile: a pillow for the pill, a tube for a strand. Normals come from that height, and the
 * colour is a near-black lacquer reflecting a simple studio: a softbox above, a window on the left,
 * the pale floor below, plus two sharp glints.
 */
const FRAG = `precision highp float;
uniform vec2 uRes;      // canvas px
uniform float uDpr;
uniform vec4 uPill;     // x, y, w, h in css px
uniform vec4 uPts[${MS * NP}]; // x, y, radius, unused
uniform float uCount;   // strands in use
uniform vec4 uSpk[${MSPK}];    // base x, y, tip x, y
uniform vec4 uSpkR[${MSPK}];   // base radius, alive
uniform vec4 uDrop[${MDROP}];  // x, y, r, alive
uniform vec4 uMound;    // from x, y to x, y
uniform vec2 uMoundR;   // radius at base, radius at tip
uniform float uLean;
// portfolio additions: each strand's bounding box (min x, y, max x, y), so pixels far from a long
// tentacle skip its cones, and the burst slabs (centre x, y, half w, half h / corner, thickness, alive)
uniform vec4 uBB[${MS}];
uniform vec4 uPan[${MB}];
uniform vec4 uPanR[${MB}];

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
vec2 field(vec2 p){
  // the pill itself (a stadium) with a soft bevel thickness
  float rr = uPill.w * 0.5;
  vec2 c = vec2(uPill.x + uPill.z * 0.5, uPill.y + rr);
  float a = max(0.0, uPill.z * 0.5 - rr);
  vec2 q = p - c;
  vec2 body = vec2(length(q - vec2(clamp(q.x, -a, a), 0.0)) - rr, rr);
  float r;
  if (uMoundR.x > 0.01) {
    float dm = cone(p, uMound.xy, uMound.zw, uMoundR.x, uMoundR.y, r);
    body = smin(body, vec2(dm, rr), 14.0);
  }
  // strands, melted into each other a little and into the body a lot
  vec2 st = vec2(1e5, 2.0);
  for (int s = 0; s < ${MS}; s++) {
    if (float(s) >= uCount) break;
    // past 24px from its box a strand is too far to change the surface or its shadow
    vec4 bb = uBB[s];
    if (p.x < bb.x - 24.0 || p.y < bb.y - 24.0 || p.x > bb.z + 24.0 || p.y > bb.w + 24.0) continue;
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
  for (int k = 0; k < ${MSPK}; k++) {
    if (uSpkR[k].y < 0.5) continue;
    float d = cone(p, uSpk[k].xy, uSpk[k].zw, uSpkR[k].x, 0.35, r);
    st = smin(st, vec2(d, r + 1.0), 3.0);
  }
  for (int k = 0; k < ${MDROP}; k++) {
    if (uDrop[k].w < 0.5) continue;
    st = smin(st, vec2(length(p - uDrop[k].xy) - uDrop[k].z, uDrop[k].z), 5.0);
  }
  // portfolio addition: the burst slabs, rounded boxes with a bevelled rim, melted onto their tentacles
  for (int k = 0; k < ${MB}; k++) {
    if (uPanR[k].z < 0.5) continue;
    vec2 q = abs(p - uPan[k].xy) - uPan[k].zw + uPanR[k].x;
    float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - uPanR[k].x;
    st = smin(st, vec2(d, uPanR[k].y), 10.0);
  }
  vec2 res = smin(body, st, 11.0);
  // deep inside the body, keep the body's round profile even where a strand root overlaps it
  res.y = max(res.y, body.y * clamp(-body.x / 6.0, 0.0, 1.0));
  return res;
}
float dist(vec2 p){ return field(p).x; }

float env(vec3 R){
  R.x += uLean * 0.18;
  float up = -R.y;
  float e = 0.015;
  e += smoothstep(0.3, 0.5, up) * smoothstep(0.75, 0.55, up) * smoothstep(0.8, 0.5, abs(R.x)) * 2.6; // softbox above
  e += smoothstep(0.8, 0.95, up) * 0.6;                                                                 // ceiling
  e += smoothstep(-0.5, -0.7, R.x) * smoothstep(0.5, 0.25, abs(R.y))
       * 1.1;                                                                                            // window, left
  e += smoothstep(0.6, 0.85, R.x) * smoothstep(0.6, 0.2, abs(R.y)) * 0.5;                              // fill, right
  e += smoothstep(0.25, 0.7, R.y) * 1.25;                                                               // pale floor
  return e;
}

void main(){
  vec2 p = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uDpr;
  vec2 f = field(p);
  float d = f.x;
  float aa = clamp(0.5 - d * uDpr, 0.0, 1.0);

  // soft contact shadow, cast down and a little right
  float sh = 0.0;
  if (aa < 1.0) {
    float ds = dist(p - vec2(2.0, 9.0));
    sh = (1.0 - smoothstep(-4.0, 16.0, ds)) * 0.2;
  }

  vec3 col = vec3(0.0);
  if (aa > 0.0) {
    // round profile: a circle of radius = local thickness. The slope comes from the profile
    // analytically, the direction from the distance field, so the surface stays smooth.
    float B = max(f.y, 0.8);
    float s = clamp(-d, 0.0, B);
    float z = sqrt(max(1e-3, s * (2.0 * B - s)));
    float slope = min((B - s) / z, 6.0);
    float e = 0.5;
    vec2 g = vec2(dist(p + vec2(e, 0.0)) - d, dist(p + vec2(0.0, e)) - d);
    g = length(g) > 1e-6 ? normalize(g) : vec2(0.0);
    vec3 n = normalize(vec3(g * slope, 1.0));
    vec3 R = reflect(vec3(0.0, 0.0, -1.0), n);
    float fres = 0.05 + 0.95 * pow(1.0 - max(n.z, 0.0), 3.0);
    col = vec3(0.008, 0.008, 0.01) + min(env(R) * fres, 1.0) * vec3(0.93, 0.94, 0.97);
    col += pow(max(dot(R, normalize(vec3(-0.35, -0.75, 0.56))), 0.0), 70.0) * 1.2;
    col += pow(max(dot(R, normalize(vec3(0.55, -0.35, 0.76))), 0.0), 140.0) * 0.55;
  }
  float alpha = aa + (1.0 - aa) * sh;
  gl_FragColor = vec4(col * aa, alpha);
}`;

type Strand = {
  x: Float32Array; y: Float32Array; px: Float32Array; py: Float32Array;
  spread: number; s: number; slack: number; width: number;
  grip: [number, number]; band: [number, number]; gi: number; reachK: number; ex: number; ey: number; follow: number;
  seg: number; phase: number; hair: boolean;
};
type Spike = { s: number; tilt: number; len: number; age: number; life: number };
type Drop = { x: number; y: number; vx: number; vy: number; r: number; age: number };

/**
 * Venom Button: a glossy black pill that behaves like a symbiote looking for a host. When the
 * cursor comes within `sense`, the surface swells toward it and pseudopods ooze out and feel about
 * in its direction, reaching further the closer it gets. At `reach` they lunge and latch on, each
 * strand wrapping one finger of the glove (the index tip, the knuckles, the thumb, the palm, the
 * cuff), coiling round it as they land and strung together with fine web threads. A pulse runs
 * along them toward the hand, and black skin creeps out over the glove from every finger they hold
 * until the hand is nearly swallowed; they hold on even while the hand rests on the button. Pull
 * away past `release` and they stretch thin, snap, and slump back into the body, which wobbles and
 * throws up a few spikes that sink again. Back off before it grabs and the feelers simply withdraw.
 *
 * The goo is drawn by one WebGL shader as a single liquid surface (smooth-unioned distance fields),
 * lit like black lacquer, so every join is seamless; the strands are verlet ropes with heavy damping
 * so they move like something viscous. The pointer can be a cartoon glove or the system cursor. It
 * is a real button: focusable and clickable. Without WebGL, or under reduced motion, it is a plain
 * glossy pill with the system cursor. With `autoplay` a ghost glove plays with it until the pointer
 * arrives, and again after the pointer has been away for a few seconds. Pauses off screen.
 */
export type VenomButtonProps = {
  /** Text on the button. */
  label?: string;
  onClick?: () => void;
  /**
   * Added for this portfolio (not in the Nexus UI original): called with true once the black skin
   * has swallowed the hand it holds (about 2s after the grab) and false when the goo lets go, so
   * the page around can react to the takeover.
   */
  onTakeover?: (taken: boolean) => void;
  /**
   * Added for this portfolio: draw on a fixed, full-viewport canvas instead of inside the stage, so
   * the strands can reach for a pointer anywhere on the page (mouse only: a finger still has to
   * start on the stage). The glove is drawn while the pointer is over the stage or held.
   */
  fullscreen?: boolean;
  /**
   * Added for this portfolio: while `open`, the goo bursts out of the pill into each element
   * matching `targets` (up to 4): a tentacle shoots to it carrying a drop that swells into a glossy
   * slab the size of the element's box, and reels it back in once `open` turns false. Each target
   * gets a --goo custom property (0 to 1) once its slab has filled, to fade its content in.
   * Needs `fullscreen` when the targets lie outside the stage.
   */
  burst?: { open: boolean; targets: string };
  /** Added for this portfolio: called once the goo is unavailable (no WebGL, or the context was lost). */
  onFallback?: () => void;
  /** Added for this portfolio: set when the button opens a dialog, for aria-haspopup / aria-expanded. */
  expanded?: boolean;
  /** Thick strands (2 to 7); about as many fine hairs are added between them. */
  strands?: number;
  /** Distance from the edge, in px, at which the goo notices the cursor and starts reaching for it. */
  sense?: number;
  /** Distance from the edge, in px, at which the strands lunge and grab the fingers. */
  reach?: number;
  /** Distance from the edge, in px, at which they snap. Keep it above `reach`. */
  release?: number;
  /** "glove" draws the cartoon hand inside the stage; "native" keeps the system pointer. */
  cursor?: "glove" | "native";
  /** Stage height in px. */
  height?: number;
  /**
   * A ghost glove plays with the button until a real pointer arrives, and again once it has been away for a few seconds.
   * Off by default: the button only reacts to the visitor's own cursor or finger.
   */
  autoplay?: boolean;
  className?: string;
};

export function VenomButton({
  label = "let’s collaborate",
  onClick,
  onTakeover,
  fullscreen = false,
  burst,
  onFallback,
  expanded,
  strands = 7,
  sense = 290,
  reach = 140,
  release = 215,
  cursor = "glove",
  height = 420,
  autoplay,
  className,
}: VenomButtonProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const glRef = useRef<HTMLCanvasElement>(null);
  const fxRef = useRef<HTMLCanvasElement>(null);
  const handRef = useRef<HTMLCanvasElement>(null);
  const [fallback, setFallback] = useState(false);
  const reduced = !!useReducedMotion();
  // portfolio addition: the latest onTakeover and burst, read from the animation loop without
  // restarting it; `wake` restarts a loop that went to sleep off screen when a burst opens
  const onTakeoverRef = useRef(onTakeover);
  const burstRef = useRef(burst);
  const wakeRef = useRef<() => void>(undefined);
  useEffect(() => {
    onTakeoverRef.current = onTakeover;
    burstRef.current = burst;
  });
  const burstOpen = !!burst?.open;
  useEffect(() => {
    if (burstOpen) wakeRef.current?.();
  }, [burstOpen]);
  const onFallbackRef = useRef(onFallback);
  useEffect(() => {
    onFallbackRef.current = onFallback;
  });
  useEffect(() => {
    if (fallback) onFallbackRef.current?.();
  }, [fallback]);

  useEffect(() => {
    const stage = stageRef.current!, btn = btnRef.current!;
    const glc = glRef.current!, fxc = fxRef.current!, hc = handRef.current!;
    const fx = fxc.getContext("2d")!, hx = hc.getContext("2d")!;
    // With reduced motion the goo stays a still pill and the system pointer is kept.
    const glove = cursor === "glove" && !reduced;

    // ---- WebGL setup ----
    const gl = glc.getContext("webgl", { premultipliedAlpha: true, antialias: false, alpha: true });
    const shaders: WebGLShader[] = [];
    let prog: WebGLProgram | null = null;
    let quad: WebGLBuffer | null = null;
    const U: Record<string, WebGLUniformLocation | null> = {};
    const disposeGL = () => {
      if (!gl) return;
      if (quad) gl.deleteBuffer(quad);
      if (prog) gl.deleteProgram(prog);
      for (const s of shaders) gl.deleteShader(s);
      quad = null;
      prog = null;
      shaders.length = 0;
    };
    if (gl) {
      const sh = (t: number, src: string) => {
        const s = gl.createShader(t);
        if (!s) return null;
        shaders.push(s);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        return s;
      };
      const vs = sh(gl.VERTEX_SHADER, VERT), fs = sh(gl.FRAGMENT_SHADER, FRAG);
      const p = gl.createProgram();
      if (p) {
        if (vs && fs) {
          gl.attachShader(p, vs);
          gl.attachShader(p, fs);
          gl.linkProgram(p);
        }
        if (vs && fs && gl.getProgramParameter(p, gl.LINK_STATUS)) prog = p;
        else gl.deleteProgram(p);
      }
    }
    if (!gl || !prog) {
      // no WebGL (or the shader did not build): the button paints its own glossy pill instead
      disposeGL();
      setFallback(true);
      return;
    }
    // portfolio change: a lost context is the end of the goo. Everything stops, so nothing keeps
    // holding (or hiding) the pointer behind the plain pill that replaces it.
    let dead = false;
    const onContextLost = (e: Event) => {
      e.preventDefault();
      dead = true;
      cancelAnimationFrame(raf);
      raf = 0;
      reeled = false;
      showHand(false);
      if (taken) { taken = false; onTakeoverRef.current?.(false); }
      fx.setTransform(1, 0, 0, 1, 0, 0); fx.clearRect(0, 0, fxc.width, fxc.height);
      hx.setTransform(1, 0, 0, 1, 0, 0); hx.clearRect(0, 0, hc.width, hc.height);
      setFallback(true);
    };
    glc.addEventListener("webglcontextlost", onContextLost);
    gl.useProgram(prog);
    for (const n of ["uRes", "uDpr", "uPill", "uPts", "uCount", "uSpk", "uSpkR", "uDrop", "uMound", "uMoundR", "uLean", "uBB", "uPan", "uPanR"]) U[n] = gl.getUniformLocation(prog, n);
    quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    const aLoc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(aLoc);
    gl.vertexAttribPointer(aLoc, 2, gl.FLOAT, false, 0, 0);
    const quadData = new Float32Array(8);
    const pts = new Float32Array(MS * NP * 4);
    const spk = new Float32Array(MSPK * 4), spkR = new Float32Array(MSPK * 4), drp = new Float32Array(MDROP * 4);
    const bbs = new Float32Array(MS * 4), pan = new Float32Array(MB * 4), panR = new Float32Array(MB * 4);

    let w = 0, h = 0, dpr = 1;
    const gloveP = new Path2D(GLOVE), gloveL = new Path2D(GLOVE_LINES), cuffP = new Path2D(CUFF), cuffL = new Path2D(CUFF_LINES);
    const handClip = new Path2D();
    handClip.addPath(gloveP);
    handClip.addPath(cuffP);

    // the pill in canvas coordinates, re-measured every frame (it scales when pressed). Everything
    // here is in layout px: if a parent is scaled with a CSS transform, rect sizes are divided by k.
    // (portfolio change: measured against the canvas, not the stage, so the same code serves the
    // in-stage canvas and the full-viewport one; `box` is the stage within the canvas.)
    const pill = { x: 0, y: 0, w: 0, h: 0, r: 0, ls: 0, P: 1 };
    const box = { x: 0, y: 0, w: 0, h: 0 };
    const org = { x: 0, y: 0, k: 1 };
    const measure = () => {
      const a = glc.getBoundingClientRect(), b = btn.getBoundingClientRect(), sr = stage.getBoundingClientRect();
      const k = glc.offsetWidth ? a.width / glc.offsetWidth : 1;
      org.x = a.left; org.y = a.top; org.k = k;
      box.x = (sr.left - a.left) / k; box.y = (sr.top - a.top) / k; box.w = sr.width / k; box.h = sr.height / k;
      pill.x = (b.left - a.left) / k; pill.y = (b.top - a.top) / k; pill.w = b.width / k; pill.h = b.height / k;
      pill.r = pill.h / 2;
      pill.ls = Math.max(0, pill.w - pill.h);
      pill.P = 2 * pill.ls + 2 * Math.PI * pill.r || 1;
    };
    const at = (s: number) => {
      const { x, y, w: W, h: H, r, ls, P } = pill;
      s = ((s % P) + P) % P;
      if (s < ls) return { x: x + r + s, y, nx: 0, ny: -1 };
      s -= ls;
      if (s < Math.PI * r) {
        const a = -Math.PI / 2 + s / r;
        return { x: x + W - r + Math.cos(a) * r, y: y + r + Math.sin(a) * r, nx: Math.cos(a), ny: Math.sin(a) };
      }
      s -= Math.PI * r;
      if (s < ls) return { x: x + W - r - s, y: y + H, nx: 0, ny: 1 };
      s -= ls;
      const a = Math.PI / 2 + s / r;
      return { x: x + r + Math.cos(a) * r, y: y + r + Math.sin(a) * r, nx: Math.cos(a), ny: Math.sin(a) };
    };
    const nearest = (qx: number, qy: number) => {
      const { x, w: W, r, ls } = pill;
      const cy = pill.y + r;
      const cx = Math.max(x + r, Math.min(x + W - r, qx));
      const dist = Math.hypot(qx - cx, qy - cy) - r;
      let s: number;
      if (qx > x + W - r) s = ls + (Math.atan2(qy - cy, qx - cx) + Math.PI / 2) * r;
      else if (qx < x + r) {
        let a = Math.atan2(qy - cy, qx - cx);
        if (a < -Math.PI / 2) a += Math.PI * 2;
        s = 2 * ls + Math.PI * r + (a - Math.PI / 2) * r;
      } else s = qy < cy ? qx - (x + r) : ls + Math.PI * r + (x + W - r - qx);
      return { s, dist };
    };
    const loopDiff = (a: number, b: number) => {
      const P = pill.P;
      let d = (b - a) % P;
      if (d > P / 2) d -= P;
      if (d < -P / 2) d += P;
      return d;
    };

    const fit = () => {
      const r = glc.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = glc.offsetWidth || r.width; h = glc.offsetHeight || r.height;
      for (const c of [glc, fxc, hc]) { c.width = Math.round(w * dpr); c.height = Math.round(h * dpr); }
      gl.viewport(0, 0, glc.width, glc.height);
      measure();
    };

    // Touch has no hover, so the hand follows a finger only while it is down, lingers a moment after it
    // lifts (a tap is a quick poke), and lets go at once if the browser takes the gesture to scroll.
    const touchOnly = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    const ghostOn = !!autoplay;
    const LINGER = 1700; // ms the goo keeps hold after a finger lifts
    const FINGER_LIFT = 52; // px the glove is drawn above a finger, so the hand is not hidden under it
    const ptr = { x: -999, y: -999, inside: false, inWin: false, last: 0, touch: false, down: false, upAt: 0, movedAt: -1e9 };
    let touched = false;
    const place = (e: PointerEvent) => {
      const r = glc.getBoundingClientRect();
      // Undo any CSS scale on a parent so pointer space matches layout space.
      const k = glc.offsetWidth ? r.width / glc.offsetWidth : 1;
      ptr.x = (e.clientX - r.left) / k;
      ptr.y = (e.clientY - r.top) / k;
      // portfolio change: a finger is over the stage by its box, as before; a mouse only when the
      // stage itself is under it, not the nav or a dialog on top (inWin: anywhere in the window)
      const sr = stage.getBoundingClientRect();
      ptr.inside = e.pointerType === "touch"
        ? e.clientX >= sr.left && e.clientY >= sr.top && e.clientX <= sr.right && e.clientY <= sr.bottom
        : e.target instanceof Node && stage.contains(e.target);
      ptr.inWin = true;
      ptr.movedAt = performance.now();
      if (ptr.inside) { touched = true; ptr.last = ptr.movedAt; }
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") {
        if (!ptr.down || !e.isPrimary) return;
        ptr.touch = true;
      } else ptr.touch = false;
      place(e);
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "touch" || !e.isPrimary) return;
      ptr.touch = true;
      ptr.down = true;
      place(e);
    };
    const onUp = (e: PointerEvent) => {
      if (e.pointerType !== "touch" || !e.isPrimary || !ptr.down) return;
      ptr.down = false;
      ptr.upAt = performance.now();
      // the browser took the gesture to scroll the page: let go straight away
      if (e.type === "pointercancel") { ptr.inside = false; ptr.last = ptr.upAt; }
    };
    // a mouse that leaves the window sends no more moves, so without this the goo would keep holding
    const onLeaveWindow = () => { if (!ptr.touch) { ptr.inside = false; ptr.inWin = false; } };
    window.addEventListener("pointermove", onMove, { passive: true });
    stage.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", onUp, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeaveWindow);

    // ghost path for autoplay, in fractions of the stage, with seconds per leg
    const GHOST: [number, number, number][] = [
      [0.5, 0.8, 1.1], [0.36, 0.74, 1.0], [0.6, 0.82, 0.9], [0.8, 0.64, 0.55], [0.98, 0.97, 1.4],
      [0.86, 0.28, 1.1], [0.7, 0.18, 1.0], [0.5, 0.12, 1.0], [0.3, 0.2, 0.55], [0.03, 0.04, 1.4],
      [0.16, 0.58, 1.1], [0.32, 0.86, 1.0],
    ];
    const ghostTotal = GHOST.reduce((a, p) => a + p[2], 0);
    const ghostAt = (t: number) => {
      let u = t % ghostTotal, i = 0;
      while (u > GHOST[i][2]) { u -= GHOST[i][2]; i++; }
      const f = u / GHOST[i][2];
      const p = (k: number) => GHOST[(k + GHOST.length) % GHOST.length];
      const p0 = p(i - 1), p1 = p(i), p2 = p(i + 1), p3 = p(i + 2);
      const e = f * f * (3 - 2 * f);
      const cr = (a: number, b: number, c: number, d: number) =>
        0.5 * (2 * b + (-a + c) * e + (2 * a - 5 * b + 4 * c - d) * e * e + (-a + 3 * b - 3 * c + d) * e * e * e);
      return { x: box.x + cr(p0[0], p1[0], p2[0], p3[0]) * box.w, y: box.y + cr(p0[1], p1[1], p2[1], p3[1]) * box.h };
    };

    // ---- goo state ----
    // idle -> seek (pseudopods reach for the hand) -> grow (they lunge for the fingers) -> hold -> snap
    let mode: "idle" | "seek" | "grow" | "hold" | "snap" = "idle";
    let violentSnap = false;
    let grow = 0;
    let seekF = 0;
    let list: Strand[] = [];
    let webs: [number, number, number, number, number][] = [];
    const spikes: Spike[] = [];
    const drops: Drop[] = [];
    let near = { s: 0, dist: 999 };
    let hand = { x: -999, y: -999 };
    let anchor = { x: 0, y: 0 };
    let stretch = 0;
    // the mound is a damped spring, so it wobbles when the strands let go
    let mound = 0, moundV = 0, moundS = 0;
    let moundDir = { x: 0, y: 1 };
    let lean = 0;
    const sc = 1.55;
    const grips = glove ? GRIPS : NATIVE_GRIPS;
    const bands = glove ? BANDS : NATIVE_BANDS;
    // how far the goo has crept over each part of the glove (0 to 1); it lives apart from the
    // strands so it can keep receding after they are gone
    const coat = new Float32Array(GRIPS.length);
    // portfolio addition: whether onTakeover was last told the hand is swallowed
    let taken = false;
    // portfolio addition: the burst, one slot per target. A slot outlives its target while the slab
    // reels back in (the element may be gone by then), so it keeps the last box it saw.
    type Burst = { st: Strand; el: HTMLElement; bx: number; by: number; bw: number; bh: number; cr: number; p: number; wait: number };
    const bursts: (Burst | null)[] = new Array(MB).fill(null);
    let armed = true; // after a burst the goo won't grab again until the pointer has backed off
    let handShown = false; // whether the system cursor is hidden for the drawn glove
    const showHand = (on: boolean) => {
      if (on === handShown) return;
      handShown = on;
      document.documentElement.classList.toggle("venom-hand", on);
    };
    // portfolio addition: once it holds the hand the goo reels it in over PULL seconds, dragging the
    // drawn glove onto the pill. The real pointer can't be moved, so the glove leaves it behind (yank
    // past `release` and it snaps back); while the glove sits on the pill, a click is the button's.
    const PULL = 1.2;
    let pull = 0;
    let reeled = false;
    let fxInk = false, hxInk = false; // whether the 2D layers were drawn on (and need clearing)
    let asleep = false; // canvases shrunk to 1px while the loop sleeps
    const onClickCapture = (e: MouseEvent) => {
      if (!reeled || !handShown || (e.target instanceof Node && btn.contains(e.target))) return;
      e.preventDefault();
      e.stopPropagation();
      btn.click();
    };
    window.addEventListener("click", onClickCapture, true);

    const gripAt = (g: [number, number]) =>
      glove ? { x: hand.x + (g[0] - HOT_X) * sc, y: hand.y + (g[1] - HOT_Y) * sc } : { x: hand.x + g[0], y: hand.y + g[1] };

    const spawn = () => {
      list = [];
      const main = Math.max(2, Math.min(MH, Math.round(strands)));
      const total = main * 2 - 1;
      const root = at(near.s);
      for (let k = 0; k < total; k++) {
        const hair = k % 2 === 1;
        const mi = Math.floor(k / 2);
        // each thick strand claims a finger; each hair takes a spot between two of them
        const g: [number, number] = hair
          ? [(grips[mi % grips.length][0] + grips[(mi + 1) % grips.length][0]) / 2, (grips[mi % grips.length][1] + grips[(mi + 1) % grips.length][1]) / 2]
          : grips[mi % grips.length];
        list.push({
          x: new Float32Array(NP).fill(root.x), y: new Float32Array(NP).fill(root.y),
          px: new Float32Array(NP).fill(root.x), py: new Float32Array(NP).fill(root.y),
          spread: (k / (total - 1)) * 2 - 1 + (Math.random() - 0.5) * 0.15,
          s: near.s,
          slack: 1.02 + Math.random() * (hair ? 0.2 : 0.12),
          width: hair ? 0.5 : 0.8 + Math.random() * 0.45,
          grip: g,
          band: hair ? [0, 0] : bands[mi % bands.length],
          gi: hair ? -1 : mi % grips.length,
          reachK: hair ? 0.35 : 0.55 + Math.random() * 0.4,
          ex: root.x, ey: root.y,
          follow: 9 + Math.random() * 8,
          seg: 0, phase: Math.random() * 10, hair,
        });
      }
      webs = [];
      for (let k = 0; k < list.length - 1; k++) {
        const count = 1 + Math.floor(Math.random() * 2);
        for (let c = 0; c < count; c++) {
          const i = 3 + Math.floor(Math.random() * (NP - 5));
          const j = Math.max(2, Math.min(NP - 2, i + Math.round((Math.random() - 0.5) * 3)));
          webs.push([k, k + 1, i, j, (Math.random() - 0.5) * 5]);
        }
      }
      grow = 0;
      mode = "seek";
    };

    const snap = (violent: boolean) => {
      if (mode === "idle" || mode === "snap") return;
      mode = "snap";
      violentSnap = violent;
      if (!violent) return;
      moundV -= 90; // the body recoils
      const seen = new Set<number>();
      for (const st of list) {
        if (st.hair) continue;
        const key = Math.round(st.s / 8);
        if (seen.has(key) || spikes.length >= MSPK) continue;
        seen.add(key);
        spikes.push({ s: st.s, tilt: (Math.random() - 0.5) * 0.8, len: 10 + Math.random() * 16, age: 0, life: 1.1 + Math.random() * 0.6 });
        if (Math.random() < 0.6 && drops.length < MDROP) {
          const i = 4 + Math.floor(Math.random() * 4);
          const root = at(st.s);
          drops.push({ x: st.x[i], y: st.y[i], vx: (root.x - st.x[i]) * 2, vy: (root.y - st.y[i]) * 2 - 40, r: 2 + Math.random() * 2.2, age: 0 });
        }
      }
    };

    // One verlet step for a strand rooted at (rx, ry): viscous drift, a slow wave, gravity, then the
    // length constraints and a little bending stiffness. (Portfolio change: lifted out of the loop
    // below unchanged, so the burst tentacles move the same way.)
    const rope = (st: Strand, rx: number, ry: number, pinTip: boolean, damp: number, time: number, dt: number) => {
      for (let i = 1; i < NP; i++) {
        const vx = (st.x[i] - st.px[i]) * damp, vy = (st.y[i] - st.py[i]) * damp;
        st.px[i] = st.x[i]; st.py[i] = st.y[i];
        const mid = Math.sin((i / (NP - 1)) * Math.PI);
        const wx = Math.sin(time * 1.6 + st.phase + i * 0.55) * 14 * mid;
        const wy = Math.cos(time * 1.3 + st.phase * 1.3 + i * 0.45) * 14 * mid;
        st.x[i] += vx + wx * dt * dt;
        st.y[i] += vy + (260 + wy) * dt * dt;
      }
      st.x[0] = st.px[0] = rx; st.y[0] = st.py[0] = ry;
      if (pinTip) { st.x[NP - 1] = st.ex; st.y[NP - 1] = st.ey; }
      const len = Math.max(0.01, st.seg);
      for (let it = 0; it < 14; it++) {
        for (let i = 0; i < NP - 1; i++) {
          const dx = st.x[i + 1] - st.x[i], dy = st.y[i + 1] - st.y[i];
          const d = Math.hypot(dx, dy) || 0.0001;
          const diff = (d - len) / d;
          const a = i === 0 ? 0 : 0.5, b = pinTip && i + 1 === NP - 1 ? 0 : i === 0 ? 1 : 0.5;
          const m = a + b || 1;
          st.x[i] += dx * diff * (a / m); st.y[i] += dy * diff * (a / m);
          st.x[i + 1] -= dx * diff * (b / m); st.y[i + 1] -= dy * diff * (b / m);
        }
      }
      // a little bending stiffness, so a strand curves like goo instead of folding into kinks
      for (let pass = 0; pass < 2; pass++) {
        for (let i = 1; i < NP - 1; i++) {
          if (pinTip && i === NP - 1) continue;
          st.x[i] += ((st.x[i - 1] + st.x[i + 1]) / 2 - st.x[i]) * 0.22;
          st.y[i] += ((st.y[i - 1] + st.y[i + 1]) / 2 - st.y[i]) * 0.22;
        }
      }
      if (!Number.isFinite(st.x[NP - 1])) { st.x.fill(rx); st.y.fill(ry); st.px.fill(rx); st.py.fill(ry); }
    };

    let raf = 0;
    let visible = true;
    let prev = performance.now();
    const t0 = prev;
    const draw = (now: number) => {
      const dt = Math.max(1 / 240, Math.min(0.033, (now - prev) / 1000));
      prev = now;
      if (!w || !h) return;
      measure();
      const time = (now - t0) / 1000;

      // a lifted finger keeps hold for a moment, then lets go
      if (ptr.touch && !ptr.down && ptr.inside && now - ptr.upAt > LINGER) { ptr.inside = false; ptr.last = now; }
      const ghost = ghostOn && !reduced && !ptr.down && (!touched || (!ptr.inside && now - ptr.last > 2500));
      // portfolio change: on the full-viewport canvas a mouse is followed anywhere in the window
      let live = fullscreen && !ptr.touch ? ptr.inWin : ptr.inside;
      if (ghost) { hand = ghostAt(time); live = true; } else hand = { x: ptr.x, y: ptr.touch ? ptr.y - FINGER_LIFT : ptr.y };
      // portfolio addition: while a burst is out the goo lets go of the hand (the form needs the pointer)
      const bs = burstRef.current;
      const open = !!bs?.open;

      // distance is measured from the middle of the hand; over the button it counts as touching
      anchor = glove ? { x: hand.x + (16 - HOT_X) * sc, y: hand.y + (18 - HOT_Y) * sc } : { x: hand.x, y: hand.y };
      near = nearest(anchor.x, anchor.y);
      const D = Math.max(0, near.dist);
      // on a narrow touch stage the sensing distance shrinks with it, or the whole stage would be inside `sense`
      const dk = ptr.touch || (touchOnly && ghost) ? Math.max(0.55, Math.min(1, box.w / 560)) : 1;
      // a finger is a clumsy pointer: it keeps the full grab and let-go distances and only senses sooner
      const sn = sense * dk, rc = reach, rl = release;
      const cx = pill.x + pill.w / 2;
      lean += ((live ? Math.max(-1, Math.min(1, (hand.x - cx) / (pill.w * 1.5))) : 0) - lean) * Math.min(1, dt * 4);

      if (!reduced) {
        // portfolio addition: a burst takes all its attention, and whatever it held is let go at once
        if (open) { if (mode === "seek") snap(false); else if (mode === "grow" || mode === "hold") snap(true); }
        else if (mode === "idle" && live && D < sn) spawn();
        else if (mode === "snap" && !violentSnap && live && D < sn) mode = "seek"; // changed its mind
        else if (mode === "seek" && (!live || D > sn + 25)) snap(false);
        // (portfolio change: only a pointer that has just moved is grabbed, not one the page scrolled the pill under)
        else if (mode === "seek" && D < rc && armed && (ptr.touch || ghost || now - ptr.movedAt < 800)) { mode = "grow"; grow = 0; }
        else if ((mode === "grow" || mode === "hold") && (!live || D > rl)) snap(true);
        // portfolio addition: after a burst it only grabs again once the pointer has backed off
        if (open) armed = false;
        else if (!armed && (!live || D > rl)) armed = true;
      }
      const holding = mode === "hold" || mode === "grow";
      const seeking = mode === "seek";
      // portfolio change: the glove is drawn over the stage, or wherever the goo still holds it; the
      // system cursor hides only while it is (an html class, as the hand may be outside the stage)
      const handOn = glove && live && !open && (ghost || ptr.inside || holding);
      showHand(handOn && !ghost);
      // portfolio addition: reel the held hand in, its middle sinking just inside the pill's rim (D
      // above stays the real pointer's distance, so pulling away still breaks the hold)
      pull = mode === "hold" ? Math.min(1, pull + dt / PULL) : Math.max(0, pull - dt * 4);
      if (pull > 0 && near.dist > 0) {
        const e = at(near.s), k = pull * pull * (3 - 2 * pull);
        const ox = (e.x - e.nx * 10 - anchor.x) * k, oy = (e.y - e.ny * 10 - anchor.y) * k;
        hand = { x: hand.x + ox, y: hand.y + oy };
        anchor = { x: anchor.x + ox, y: anchor.y + oy };
        near = nearest(anchor.x, anchor.y);
      }
      reeled = holding && pull > 0.8;
      // how hard it is reaching: nothing at the edge of its senses, everything at grabbing range
      const fT = seeking ? Math.max(0, Math.min(1, (sn - D) / Math.max(1, sn - rc))) : holding ? 1 : 0;
      seekF += (fT - seekF) * Math.min(1, dt * 5);
      stretch = holding ? Math.min(1, D / rl) : 0;
      if (mode === "grow") {
        grow = Math.min(1, grow + dt / 0.3);
        if (grow >= 1) mode = "hold";
      }

      // ---- simulate ----
      const spreadPx = Math.max(14, Math.min(pill.w * 0.3, Math.max(0, near.dist) * 0.4 + 14)) * (seeking ? 0.65 : 1);
      let alive = 0;
      for (const st of list) {
        const target = near.s + st.spread * spreadPx;
        st.s += loopDiff(st.s, target) * Math.min(1, dt * (mode === "snap" ? 1.5 : 6));
        const root = at(st.s);
        const rx = root.x - root.nx * 3, ry = root.y - root.ny * 3;
        let pinTip = false;
        const gp = gripAt(st.grip);
        if (seeking) {
          // a pseudopod reaching for its finger: part of the way there, feeling about as it goes
          const vx = gp.x - rx, vy = gp.y - ry;
          const vl = Math.hypot(vx, vy) || 1;
          const ease = seekF * seekF * (3 - 2 * seekF);
          // it hesitates, then darts a little further, then draws back, like it is testing the air
          const dart = Math.pow(Math.max(0, Math.sin(time * 1.9 + st.phase * 3.1)), 10) * 0.28;
          const len = Math.max(3, vl * st.reachK * 0.85 * ease * (1 + dart));
          const sway = Math.sin(time * 2.7 + st.phase) * (3 + 9 * ease) + Math.sin(time * 5.3 + st.phase * 2) * 2 * ease;
          const tx = rx + (vx / vl) * len - (vy / vl) * sway;
          const ty = ry + (vy / vl) * len + (vx / vl) * sway;
          const k = 1 - Math.exp(-dt * 6);
          st.ex += (tx - st.ex) * k;
          st.ey += (ty - st.ey) * k;
          pinTip = true;
          st.seg = (Math.hypot(st.ex - rx, st.ey - ry) * (st.slack + 0.06)) / (NP - 1);
        } else if (holding) {
          // lunge for the finger and coil in around it, then hold on and trail it like syrup
          let gx = gp.x, gy = gp.y;
          if (mode === "grow") {
            const coil = Math.pow(1 - grow, 1.6) * (st.hair ? 7 : 13);
            const a = st.phase + grow * Math.PI * 2.6;
            gx += Math.cos(a) * coil;
            gy += Math.sin(a) * coil * 0.8;
          }
          const k = 1 - Math.exp(-dt * (mode === "grow" ? 20 + st.follow : st.follow * 1.4));
          st.ex += (gx - st.ex) * k;
          st.ey += (gy - st.ey) * k;
          pinTip = true;
          st.seg = (Math.hypot(st.ex - rx, st.ey - ry) * st.slack) / (NP - 1);
        } else {
          st.seg *= Math.exp(-dt * 5.5); // reel back in, slowly, like something heavy
          if (st.seg * (NP - 1) > 1.5) alive++;
        }
        rope(st, rx, ry, pinTip, mode === "snap" ? 0.86 : 0.92, time, dt);
      }
      if (mode === "snap" && alive === 0) { mode = "idle"; list = []; webs = []; }

      // mound spring
      const moundTarget = holding ? 5 + 16 * stretch : seeking ? 3 + 9 * seekF : 0;
      moundV += ((moundTarget - mound) * 150 - moundV * 9) * dt;
      mound += moundV * dt;
      if (holding || seeking) {
        moundS += loopDiff(moundS, near.s) * Math.min(1, dt * 6);
        const e = at(moundS);
        const tx = anchor.x - e.x, ty = anchor.y - e.y, tl = Math.hypot(tx, ty) || 1;
        moundDir = { x: e.nx * 0.55 + (tx / tl) * 0.45, y: e.ny * 0.55 + (ty / tl) * 0.45 };
      }

      for (let k = spikes.length - 1; k >= 0; k--) { spikes[k].age += dt; if (spikes[k].age > spikes[k].life) spikes.splice(k, 1); }
      for (let k = drops.length - 1; k >= 0; k--) {
        const d = drops[k];
        d.age += dt;
        d.vy += 520 * dt;
        d.vx *= Math.exp(-dt * 2); d.vy *= Math.exp(-dt * 1);
        d.x += d.vx * dt; d.y += d.vy * dt;
        d.r *= Math.exp(-dt * 1.5);
        if (d.age > 0.9 || nearest(d.x, d.y).dist < -d.r) drops.splice(k, 1);
      }

      // ---- portfolio addition: the burst ----
      // Each target gets a tentacle that shoots out of the pill carrying a drop (progress 0 to 0.45),
      // the drop swells into a slab the size of the target with a little overshoot (0.4 to 1), and
      // the target's content fades in over the last stretch. Closing plays it backwards.
      const els = open && bs ? document.querySelectorAll<HTMLElement>(bs.targets) : null;
      for (let i = 0; i < MB; i++) {
        const el = els && i < els.length ? els[i] : null;
        let b = bursts[i];
        if (el) {
          const r = el.getBoundingClientRect();
          const bx = (r.left - org.x) / org.k, by = (r.top - org.y) / org.k, bw = r.width / org.k, bh = r.height / org.k;
          if (!b || b.el !== el) {
            // a new target (or the same slot re-rendered): keep a tentacle that is still out
            const s0 = b ? b.st.s : nearest(bx + bw / 2, by + bh / 2).s;
            const root = at(s0);
            const st: Strand = b?.st ?? {
              x: new Float32Array(NP).fill(root.x), y: new Float32Array(NP).fill(root.y),
              px: new Float32Array(NP).fill(root.x), py: new Float32Array(NP).fill(root.y),
              spread: 0, s: s0, slack: 1.05, width: 1.5, grip: [0, 0], band: [0, 0], gi: -1, reachK: 1,
              ex: root.x, ey: root.y, follow: 0, seg: 0, phase: i * 1.7 + 0.4, hair: false,
            };
            b = bursts[i] = {
              st, el, bx, by, bw, bh,
              cr: parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0,
              p: b ? b.p : 0, wait: b ? 0 : i * 0.09,
            };
          } else { b.bx = bx; b.by = by; b.bw = bw; b.bh = bh; }
        } else if (b && b.el.isConnected) {
          // closing: the slab keeps following its target while the target is still on the page
          const r = b.el.getBoundingClientRect();
          b.bx = (r.left - org.x) / org.k; b.by = (r.top - org.y) / org.k; b.bw = r.width / org.k; b.bh = r.height / org.k;
        }
        if (!b) continue;
        if (el) { if (b.wait > 0) b.wait -= dt; else b.p = Math.min(1, b.p + dt / 0.95); }
        else b.p = Math.max(0, b.p - dt / 0.7);
        if (!el && b.p <= 0) { b.el.style.removeProperty("--goo"); bursts[i] = null; continue; }
        b.el.style.setProperty("--goo", Math.max(0, Math.min(1, (b.p - 0.82) / 0.18)).toFixed(3));
        // the root slides round the pill to face its slab; the tip rides out to the slab's centre
        const st = b.st;
        const cx = b.bx + b.bw / 2, cy = b.by + b.bh / 2;
        st.s += loopDiff(st.s, nearest(cx, cy).s) * Math.min(1, dt * 6);
        const root = at(st.s);
        const rx = root.x - root.nx * 3, ry = root.y - root.ny * 3;
        const s1 = Math.min(1, b.p / 0.45);
        const e1 = 1 - Math.pow(1 - s1, 3);
        st.ex = rx + (cx - rx) * e1; st.ey = ry + (cy - ry) * e1;
        st.seg = (Math.hypot(st.ex - rx, st.ey - ry) * st.slack) / (NP - 1);
        rope(st, rx, ry, true, 0.9, time, dt);
      }

      // ---- upload to the shader ----
      const thin = 1 - 0.5 * stretch;
      const mains = list.filter((s) => !s.hair).slice(0, MH);
      let minX = pill.x, minY = pill.y, maxX = pill.x + pill.w, maxY = pill.y + pill.h;
      const grow2 = seeking ? 0.55 + 0.45 * seekF : 1;
      // portfolio addition: each strand slot's box, for the shader to skip far pixels
      const bound = (st: Strand, slot: number) => {
        let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
        for (let i = 0; i < NP; i++) {
          x0 = Math.min(x0, st.x[i]); x1 = Math.max(x1, st.x[i]);
          y0 = Math.min(y0, st.y[i]); y1 = Math.max(y1, st.y[i]);
        }
        bbs[slot * 4] = x0; bbs[slot * 4 + 1] = y0; bbs[slot * 4 + 2] = x1; bbs[slot * 4 + 3] = y1;
        minX = Math.min(minX, x0); maxX = Math.max(maxX, x1); minY = Math.min(minY, y0); maxY = Math.max(maxY, y1);
      };
      mains.forEach((st, si) => {
        for (let i = 0; i < NP; i++) {
          const f = i / (NP - 1);
          // thick where it leaves the body, a fine thread at the hand
          let r = (st.width * (3.0 - 1.9 * f)) * thin * grow2;
          // a slow pulse travels from the body toward the hand, as if it is feeding
          if (holding) r *= 1 + 0.24 * Math.sin(f * 9 - time * 6 + st.phase) * Math.sin(f * Math.PI);
          if (mode === "snap") r *= 1.15; // gathering up as it slumps back
          const o = (si * NP + i) * 4;
          pts[o] = st.x[i]; pts[o + 1] = st.y[i]; pts[o + 2] = Math.max(0.55, r); pts[o + 3] = 1;
        }
        bound(st, si);
      });
      // portfolio addition: the burst tentacles take the slots after the hand's, then their slabs
      let slots = mains.length;
      pan.fill(0); panR.fill(0);
      bursts.forEach((b, k) => {
        if (!b) return;
        const st = b.st;
        for (let i = 0; i < NP; i++) {
          const f = i / (NP - 1);
          let r = st.width * (3.0 - 1.9 * f);
          // once its slab is full it feeds it, a pulse running out from the pill
          if (b.p >= 1) r *= 1 + 0.2 * Math.sin(f * 9 - time * 6 + st.phase) * Math.sin(f * Math.PI);
          const o = (slots * NP + i) * 4;
          pts[o] = st.x[i]; pts[o + 1] = st.y[i]; pts[o + 2] = Math.max(0.55, r); pts[o + 3] = 1;
        }
        bound(st, slots++);
        // the slab: a drop riding the tip that swells into the target's box (ease-out with a little overshoot)
        const s1 = Math.min(1, b.p / 0.45);
        const drop = Math.min(3 + 13 * (1 - Math.pow(1 - s1, 3)), b.bw / 2, b.bh / 2);
        const s2 = Math.max(0, Math.min(1, (b.p - 0.4) / 0.6));
        const e2 = s2 > 0 ? 1 + 2.2 * Math.pow(s2 - 1, 3) + 1.2 * Math.pow(s2 - 1, 2) : 0;
        const hw = Math.max(0.5, drop + (b.bw / 2 - drop) * e2), hh = Math.max(0.5, drop + (b.bh / 2 - drop) * e2);
        const rr = Math.min(hw, hh, drop + (Math.min(b.cr, b.bw / 2, b.bh / 2) - drop) * e2);
        pan[k * 4] = st.ex; pan[k * 4 + 1] = st.ey; pan[k * 4 + 2] = hw; pan[k * 4 + 3] = hh;
        panR[k * 4] = Math.max(0, rr); panR[k * 4 + 1] = Math.min(14, hw, hh); panR[k * 4 + 2] = 1;
        minX = Math.min(minX, st.ex - hw); maxX = Math.max(maxX, st.ex + hw);
        minY = Math.min(minY, st.ey - hh); maxY = Math.max(maxY, st.ey + hh);
      });
      spk.fill(0); spkR.fill(0);
      spikes.forEach((sp, k) => {
        const p = sp.age / sp.life;
        const up = p < 0.15 ? 1 - Math.pow(1 - p / 0.15, 3) : p > 0.45 ? Math.max(0, 1 - (p - 0.45) / 0.55) : 1;
        const len = sp.len * (p > 0.45 ? up * up * (3 - 2 * up) : up);
        const b = at(sp.s);
        const sway = Math.sin(sp.age * 14) * Math.exp(-sp.age * 3) * 0.35;
        const ang = Math.atan2(b.ny, b.nx) + sp.tilt + sway;
        const tx = b.x + Math.cos(ang) * len, ty = b.y + Math.sin(ang) * len;
        spk[k * 4] = b.x - b.nx * 2; spk[k * 4 + 1] = b.y - b.ny * 2; spk[k * 4 + 2] = tx; spk[k * 4 + 3] = ty;
        spkR[k * 4] = 2.6 * Math.min(1, up + 0.2); spkR[k * 4 + 1] = len > 0.6 ? 1 : 0;
        minX = Math.min(minX, tx); maxX = Math.max(maxX, tx); minY = Math.min(minY, ty); maxY = Math.max(maxY, ty);
      });
      drp.fill(0);
      drops.forEach((d, k) => {
        drp[k * 4] = d.x; drp[k * 4 + 1] = d.y; drp[k * 4 + 2] = d.r; drp[k * 4 + 3] = 1;
        minX = Math.min(minX, d.x); maxX = Math.max(maxX, d.x); minY = Math.min(minY, d.y); maxY = Math.max(maxY, d.y);
      });
      const me = at(moundS);
      const mlen = Math.max(0, mound);
      const mr = Math.max(0, mound) > 0.3 ? (9 + spreadPx * 0.32) * Math.min(1, mound / 6) : 0;
      const mtx = me.x + moundDir.x * mlen, mty = me.y + moundDir.y * mlen;

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(U.uRes, glc.width, glc.height);
      gl.uniform1f(U.uDpr, dpr);
      gl.uniform4f(U.uPill, pill.x, pill.y, pill.w, pill.h);
      gl.uniform4fv(U.uPts, pts);
      gl.uniform1f(U.uCount, slots);
      gl.uniform4fv(U.uBB, bbs);
      gl.uniform4fv(U.uPan, pan);
      gl.uniform4fv(U.uPanR, panR);
      gl.uniform4fv(U.uSpk, spk);
      gl.uniform4fv(U.uSpkR, spkR);
      gl.uniform4fv(U.uDrop, drp);
      gl.uniform4f(U.uMound, me.x - me.nx * 6, me.y - me.ny * 6, mtx, mty);
      gl.uniform2f(U.uMoundR, mr, mr * 0.45);
      gl.uniform1f(U.uLean, lean);
      // only shade the box around the goo (plus room for its shadow)
      const pad = 34;
      const x0 = Math.max(0, minX - pad), x1 = Math.min(w, maxX + pad), y0 = Math.max(0, minY - pad), y1 = Math.min(h, maxY + pad + 10);
      const X = (v: number) => (v / w) * 2 - 1, Y = (v: number) => 1 - (v / h) * 2;
      quadData.set([X(x0), Y(y0), X(x1), Y(y0), X(x0), Y(y1), X(x1), Y(y1)]);
      gl.bufferData(gl.ARRAY_BUFFER, quadData, gl.DYNAMIC_DRAW);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      // ---- fine hairs and web threads on top, in 2D ----
      // (portfolio change: the 2D layers may span the viewport, so they are only cleared after a
      // frame that drew on them; an untouched canvas costs nothing to show)
      fx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (fxInk) { fx.clearRect(0, 0, w, h); fxInk = false; }
      fx.lineCap = "round";
      fx.lineJoin = "round";
      if (list.length && (holding || mode === "snap")) {
        fxInk = true;
        fx.strokeStyle = "rgba(6,6,8,0.9)";
        for (const st of list) {
          if (!st.hair) continue;
          fx.lineWidth = 0.7 * thin;
          fx.beginPath();
          fx.moveTo(st.x[0], st.y[0]);
          for (let i = 1; i < NP - 1; i++) fx.quadraticCurveTo(st.x[i], st.y[i], (st.x[i] + st.x[i + 1]) / 2, (st.y[i] + st.y[i + 1]) / 2);
          fx.lineTo(st.x[NP - 1], st.y[NP - 1]);
          fx.stroke();
        }
        if (mode === "hold") {
          fx.strokeStyle = "rgba(10,10,12,0.6)";
          fx.lineWidth = 0.5;
          for (const [a, b, i, j, kink] of webs) {
            const A = list[a], Bs = list[b];
            if (!A || !Bs) continue;
            fx.beginPath();
            fx.moveTo(A.x[i], A.y[i]);
            fx.lineTo((A.x[i] + Bs.x[j]) / 2 + kink, (A.y[i] + Bs.y[j]) / 2 - Math.abs(kink) * 0.4);
            fx.lineTo(Bs.x[j], Bs.y[j]);
            fx.stroke();
          }
        }
      }

      // ---- the goo creeping over the glove ----
      for (let g = 0; g < coat.length; g++) {
        const caught = holding && list.some((st) => st.gi === g && Math.hypot(st.ex - gripAt(st.grip).x, st.ey - gripAt(st.grip).y) < 6);
        // it spreads slowly while it holds on, and slides off quickly when it lets go
        coat[g] = caught ? Math.min(1, coat[g] + dt * 0.5) : Math.max(0, coat[g] - dt * 1.4);
      }
      // portfolio addition: the takeover is complete once the fingers it holds are nearly all black
      // (released below 60% so it doesn't flicker at the threshold, or at once when it lets go)
      let held = 0, coated = 0;
      for (const st of list) if (!st.hair && st.gi >= 0) { held++; coated += coat[st.gi]; }
      const swallowed = held > 0 ? coated / held : 0;
      if (!taken && holding && swallowed >= 0.9) { taken = true; onTakeoverRef.current?.(true); }
      else if (taken && (!holding || swallowed < 0.6)) { taken = false; onTakeoverRef.current?.(false); }

      // ---- the glove, always on top, then the goo wrapped round each finger it has caught ----
      hx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (hxInk) { hx.clearRect(0, 0, w, h); hxInk = false; }
      if (handOn) {
        hxInk = true;
        hx.save();
        hx.translate(hand.x - HOT_X * sc, hand.y - HOT_Y * sc);
        hx.scale(sc, sc);
        hx.save();
        hx.translate(2.5, 4.5);
        hx.fillStyle = "rgba(0,0,0,0.15)";
        hx.fill(gloveP); hx.fill(cuffP);
        hx.restore();
        hx.fillStyle = "#ffffff";
        hx.fill(cuffP);
        hx.fill(gloveP);
        // living black skin spreading out from each finger it holds, clipped to the glove
        if (coat.some((c) => c > 0.01)) {
          hx.save();
          hx.clip(handClip);
          for (let g = 0; g < coat.length; g++) {
            const c = coat[g];
            if (c < 0.01) continue;
            const e = c * c * (3 - 2 * c);
            const [gx0, gy0] = GRIPS[g];
            // it creeps from the finger toward the middle of the hand as it spreads
            const cx0 = gx0 + (17 - gx0) * e * 0.35, cy0 = gy0 + (20 - gy0) * e * 0.35;
            const R = 2.4 + e * 7.5;
            hx.beginPath();
            for (let k = 0; k <= 28; k++) {
              const a = (k / 28) * Math.PI * 2;
              const rr = R * (1 + 0.17 * Math.sin(4 * a + g * 1.7 + time * 2.2) + 0.08 * Math.sin(7 * a - time * 3.1 + g));
              const x = cx0 + Math.cos(a) * rr, y = cy0 + Math.sin(a) * rr;
              if (k === 0) hx.moveTo(x, y); else hx.lineTo(x, y);
            }
            hx.closePath();
            const grad = hx.createRadialGradient(cx0 - R * 0.35, cy0 - R * 0.4, 0, cx0, cy0, R * 1.15);
            grad.addColorStop(0, "#56565b");
            grad.addColorStop(0.28, "#141416");
            grad.addColorStop(1, "#050506");
            hx.fillStyle = grad;
            hx.fill();
          }
          hx.restore();
        }
        hx.strokeStyle = "#0b0b0b";
        hx.lineWidth = 1.9; hx.stroke(cuffP);
        hx.lineWidth = 1.1; hx.stroke(cuffL);
        hx.lineWidth = 1.9; hx.stroke(gloveP);
        hx.lineWidth = 1.1; hx.stroke(gloveL);
        hx.restore();
      }
      if (holding && list.length) {
        hxInk = true;
        hx.lineCap = "round";
        hx.lineJoin = "round";
        for (const st of list) {
          const gp = gripAt(st.grip);
          const gap = Math.hypot(st.ex - gp.x, st.ey - gp.y);
          const on = Math.max(0, Math.min(1, 1 - gap / 14));
          if (on <= 0) continue;
          // the last stretch of the strand runs over the glove, drawn as one smooth taper
          const from = NP - 4;
          hx.globalAlpha = on;
          hx.strokeStyle = "#060607";
          for (let i = from; i < NP - 1; i++) {
            const f = i / (NP - 1);
            hx.lineWidth = Math.max(0.6, st.width * (3.0 - 1.9 * f) * thin * 2) * (st.hair ? 0.45 : 1);
            const x0 = i === from ? st.x[i] : (st.x[i - 1] + st.x[i]) / 2, y0 = i === from ? st.y[i] : (st.y[i - 1] + st.y[i]) / 2;
            const last = i === NP - 2;
            hx.beginPath();
            hx.moveTo(x0, y0);
            hx.quadraticCurveTo(st.x[i], st.y[i], last ? st.x[NP - 1] : (st.x[i] + st.x[i + 1]) / 2, last ? st.y[NP - 1] : (st.y[i] + st.y[i + 1]) / 2);
            hx.stroke();
          }
          hx.globalAlpha = 1;
        }
      }
    };
    // Animated: one rAF loop that sleeps while the button is off screen. Reduced motion: no loop,
    // the still pill is drawn once at the start and again whenever the stage is resized.
    // (portfolio change: a burst keeps it running off screen too, so its slabs never freeze, and a
    // loop going to sleep shrinks its canvases to a pixel: that wipes them, as they may cover the
    // whole viewport, and frees their memory on pages where the footer is out of sight.)
    const frame = (now: number) => {
      if (dead) { raf = 0; return; }
      if (!visible && !burstRef.current?.open && !bursts.some(Boolean)) {
        raf = 0;
        for (const c of [glc, fxc, hc]) { c.width = 1; c.height = 1; }
        fxInk = hxInk = false;
        asleep = true;
        showHand(false);
        return;
      }
      raf = requestAnimationFrame(frame);
      draw(now);
    };
    const start = () => {
      if (raf || reduced || dead) return;
      if (asleep) { asleep = false; fit(); }
      prev = performance.now();
      raf = requestAnimationFrame(frame);
    };
    wakeRef.current = start;
    const ro = new ResizeObserver(() => {
      if (asleep) return; // refitted on waking
      fit();
      if (reduced) draw(performance.now());
    });
    // portfolio change: the canvas, which is the stage's size or the viewport's
    ro.observe(glc);
    // the still pill is not re-measured every frame, so redraw when the button itself changes size
    if (reduced) ro.observe(btn);
    fit();
    let io: IntersectionObserver | null = null;
    if (reduced) {
      draw(performance.now());
    } else {
      raf = requestAnimationFrame(frame);
      // (portfolio change: on the full-viewport canvas the feelers reach well past the stage, so it
      // counts as on screen a little before it scrolls in and after it scrolls out)
      io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
      }, { rootMargin: fullscreen ? "400px" : "0px" });
      io.observe(stage);
    }
    return () => {
      cancelAnimationFrame(raf);
      io?.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeaveWindow);
      glc.removeEventListener("webglcontextlost", onContextLost);
      // portfolio additions: never leave the page stuck in its taken-over state, the cursor hidden,
      // or a target half faded
      if (taken) onTakeoverRef.current?.(false);
      showHand(false);
      window.removeEventListener("click", onClickCapture, true);
      for (const b of bursts) b?.el.style.removeProperty("--goo");
      wakeRef.current = undefined;
      disposeGL();
    };
  }, [strands, sense, reach, release, cursor, autoplay, reduced, fullscreen]);

  // portfolio addition: the still pill of reduced motion stays in the stage (it is drawn once and
  // would not follow the page on a fixed canvas)
  const layer = fullscreen && !reduced ? "fixed" : "absolute";

  return (
    <div
      ref={stageRef}
      className={cn("relative flex w-full items-center justify-center overflow-hidden rounded-[24px]", className)}
      style={{
        height,
        // a finger can still scroll the page from here; sideways drags and taps drive the goo
        touchAction: "pan-y",
        background: "linear-gradient(180deg,#f5f4f6 0%,#efeef1 55%,#e4e3e6 100%)",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Inter, system-ui, sans-serif",
      }}
    >
      <canvas ref={handRef} className={cn("pointer-events-none inset-0 h-full w-full", layer)} style={{ zIndex: 30 }} aria-hidden="true" />
      <canvas ref={glRef} className={cn("pointer-events-none inset-0 z-10 h-full w-full", layer)} aria-hidden="true" />
      <motion.button
        ref={btnRef}
        type="button"
        onClick={onClick}
        whileTap={reduced ? undefined : { scale: 0.96 }}
        transition={{ type: "spring", stiffness: 420, damping: 18 }}
        aria-haspopup={expanded === undefined ? undefined : "dialog"}
        aria-expanded={expanded}
        // portfolio change: a light ring, as the pill sits on a dark page here
        className="relative z-20 h-[64px] rounded-full border-0 px-9 text-[20px] font-bold tracking-[-0.02em] text-[#f4f4f4] outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#07070a]"
        style={{
          background: fallback ? "linear-gradient(180deg,#1c1c1e 0%,#0a0a0a 42%,#020202 100%)" : "transparent",
          boxShadow: fallback ? "inset 0 1px 0 rgba(255,255,255,.14), inset 0 -1.5px 0 rgba(255,255,255,.22), 0 18px 28px -14px rgba(0,0,0,.55)" : "none",
          textShadow: "0 1px 0 rgba(0,0,0,.75), 0 -0.5px 0 rgba(255,255,255,.25)",
        }}
      >
        {label}
      </motion.button>
      <canvas ref={fxRef} className={cn("pointer-events-none inset-0 z-[25] h-full w-full", layer)} aria-hidden="true" />
    </div>
  );
}
