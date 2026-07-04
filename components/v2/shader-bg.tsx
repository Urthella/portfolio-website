"use client"

import { useEffect, useRef } from "react"

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`

// Warm flowing plasma whose brightest glow follows the pointer.
const FRAG = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;
void main() {
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= u_res.x / u_res.y;
  vec2 m = u_mouse * 2.0 - 1.0;
  m.x *= u_res.x / u_res.y;
  float t = u_time * 0.12;
  float v = 0.0;
  v += sin(p.x * 3.0 + t);
  v += sin(p.y * 4.0 + t * 1.3);
  v += sin((p.x + p.y) * 2.5 + t * 0.9);
  float dm = length(p - m);
  v += sin(dm * 5.0 - t * 1.8);
  v *= 0.25;
  vec3 base = vec3(0.05, 0.02, 0.03);
  vec3 warm = vec3(0.98, 0.42, 0.15);
  vec3 col = mix(base, warm, 0.5 + 0.5 * v);
  col += vec3(0.95, 0.25, 0.35) * smoothstep(0.75, 0.0, dm) * 0.7;
  gl_FragColor = vec4(col, 0.6);
}`

export function ShaderBg({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const mouse = useRef({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
    if (!gl || !(gl instanceof WebGLRenderingContext)) return

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)
      if (!s) return null
      gl.shaderSource(s, src)
      gl.compileShader(s)
      return s
    }
    const vs = compile(gl.VERTEX_SHADER, VERT)
    const fs = compile(gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) return
    const prog = gl.createProgram()
    if (!prog) return
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, "p")
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(prog, "u_res")
    const uTime = gl.getUniformLocation(prog, "u_time")
    const uMouse = gl.getUniformLocation(prog, "u_mouse")

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.max(1, Math.floor(canvas.clientWidth * dpr))
      canvas.height = Math.max(1, Math.floor(canvas.clientHeight * dpr))
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()
    window.addEventListener("resize", resize)

    const target = { x: 0.5, y: 0.5 }
    const onMove = (e: MouseEvent) => {
      target.x = e.clientX / window.innerWidth
      target.y = 1 - e.clientY / window.innerHeight
    }
    window.addEventListener("mousemove", onMove, { passive: true })

    let raf = 0
    const start = performance.now()
    const draw = (now: number) => {
      // ease the glow toward the pointer
      mouse.current.x += (target.x - mouse.current.x) * 0.06
      mouse.current.y += (target.y - mouse.current.y) * 0.06
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform1f(uTime, (now - start) / 1000)
      gl.uniform2f(uMouse, mouse.current.x, mouse.current.y)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", onMove)
      gl.getExtension("WEBGL_lose_context")?.loseContext()
    }
  }, [])

  return <canvas ref={ref} aria-hidden className={className ?? "absolute inset-0 h-full w-full"} />
}
