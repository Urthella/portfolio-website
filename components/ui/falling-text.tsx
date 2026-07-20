"use client"

import Matter from "matter-js"
import { useEffect, useMemo, useRef, useState } from "react"

/**
 * FallingText (reactbits equivalent, matter-js physics). Words hang in place,
 * then drop and pile up when triggered; they can be flung around with the
 * mouse. Trigger via "auto", "scroll" (on view), "click" or "hover".
 */
interface FallingTextProps {
  text?: string
  highlightWords?: string[]
  highlightClass?: string
  trigger?: "auto" | "scroll" | "click" | "hover"
  backgroundColor?: string
  wireframes?: boolean
  gravity?: number
  mouseConstraintStiffness?: number
  fontSize?: string
}

export function FallingText({
  text = "",
  highlightWords = [],
  highlightClass = "text-orange-400 font-semibold",
  trigger = "scroll",
  backgroundColor = "transparent",
  wireframes = false,
  gravity = 0.56,
  mouseConstraintStiffness = 0.9,
  fontSize = "1.5rem",
}: FallingTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const canvasContainerRef = useRef<HTMLDivElement>(null)
  const [started, setStarted] = useState(false)

  const words = useMemo(() => text.split(" ").filter(Boolean), [text])

  useEffect(() => {
    if (!textRef.current) return
    textRef.current.innerHTML = words
      .map((word) => {
        // \p{L}\p{N} instead of \w so Turkish letters (ü, ş, İ…) survive the strip
        const highlighted = highlightWords.some((hw) => word.replace(/[^\p{L}\p{N}']/gu, "").toLowerCase() === hw.toLowerCase())
        return `<span class="inline-block mx-[3px] select-none ${highlighted ? highlightClass : ""}">${word}</span>`
      })
      .join(" ")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words])

  useEffect(() => {
    if (trigger === "auto") {
      setStarted(true)
      return
    }
    if (trigger === "scroll" && containerRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              setStarted(true)
              observer.disconnect()
            }
          })
        },
        { threshold: 0.4 },
      )
      observer.observe(containerRef.current)
      return () => observer.disconnect()
    }
  }, [trigger])

  useEffect(() => {
    if (!started) return
    const { Engine, Render, World, Bodies, Runner, Mouse, MouseConstraint, Body } = Matter

    const container = containerRef.current
    const canvasContainer = canvasContainerRef.current
    const textEl = textRef.current
    if (!container || !canvasContainer || !textEl) return

    const width = container.clientWidth
    const height = container.clientHeight
    if (width <= 0 || height <= 0) return

    const engine = Engine.create()
    engine.world.gravity.y = gravity

    const render = Render.create({
      element: canvasContainer,
      engine,
      options: { width, height, background: backgroundColor, wireframes },
    })

    const wallOpts = { isStatic: true, render: { fillStyle: "transparent" } }
    const floor = Bodies.rectangle(width / 2, height + 24, width, 48, wallOpts)
    const left = Bodies.rectangle(-24, height / 2, 48, height, wallOpts)
    const right = Bodies.rectangle(width + 24, height / 2, 48, height, wallOpts)
    const ceiling = Bodies.rectangle(width / 2, -24, width, 48, wallOpts)

    const spans = textEl.querySelectorAll<HTMLSpanElement>("span")
    const cRect = container.getBoundingClientRect()
    const wordBodies = Array.from(spans).map((elem) => {
      const rect = elem.getBoundingClientRect()
      const x = rect.left - cRect.left + rect.width / 2
      const y = rect.top - cRect.top + rect.height / 2
      const body = Bodies.rectangle(x, y, rect.width, rect.height, {
        restitution: 0.82,
        frictionAir: 0.012,
        friction: 0.2,
        render: { fillStyle: "transparent" },
      })
      Body.setVelocity(body, { x: (Math.random() - 0.5) * 5, y: 0 })
      Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.05)
      elem.style.position = "absolute"
      elem.style.left = `${x}px`
      elem.style.top = `${y}px`
      elem.style.transform = "translate(-50%, -50%)"
      return { elem, body }
    })

    const mouse = Mouse.create(container)
    // Matter's Mouse preventDefaults wheel and touch events, which traps page
    // scrolling while the pointer is over the box — detach those listeners so
    // the page keeps scrolling (mouse-dragging the words still works).
    const m = mouse as unknown as {
      mousewheel: EventListener
      mousedown: EventListener
      mousemove: EventListener
      mouseup: EventListener
    }
    container.removeEventListener("wheel", m.mousewheel) // matter-js >= 0.19 registers 'wheel'
    container.removeEventListener("mousewheel", m.mousewheel) // legacy names, older versions
    container.removeEventListener("DOMMouseScroll", m.mousewheel)
    container.removeEventListener("touchstart", m.mousedown)
    container.removeEventListener("touchmove", m.mousemove)
    container.removeEventListener("touchend", m.mouseup)
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: mouseConstraintStiffness, render: { visible: false } },
    })
    render.mouse = mouse

    World.add(engine.world, [floor, left, right, ceiling, mouseConstraint, ...wordBodies.map((w) => w.body)])

    const runner = Runner.create()
    Runner.run(runner, engine)
    Render.run(render)

    let raf = 0
    const update = () => {
      wordBodies.forEach(({ body, elem }) => {
        elem.style.left = `${body.position.x}px`
        elem.style.top = `${body.position.y}px`
        elem.style.transform = `translate(-50%, -50%) rotate(${body.angle}rad)`
      })
      raf = requestAnimationFrame(update)
    }
    raf = requestAnimationFrame(update)

    // Physics, canvas render and DOM sync all pause while the box is
    // off-screen — no reason to simulate what nobody can see.
    let paused = false
    const visObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && paused) {
        paused = false
        Runner.run(runner, engine)
        Render.run(render)
        raf = requestAnimationFrame(update)
      } else if (!entry.isIntersecting && !paused) {
        paused = true
        Runner.stop(runner)
        Render.stop(render)
        cancelAnimationFrame(raf)
      }
    })
    visObserver.observe(container)

    return () => {
      visObserver.disconnect()
      cancelAnimationFrame(raf)
      Render.stop(render)
      Runner.stop(runner)
      if (render.canvas && render.canvas.parentNode === canvasContainer) canvasContainer.removeChild(render.canvas)
      World.clear(engine.world, false)
      Engine.clear(engine)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, gravity, wireframes, backgroundColor, mouseConstraintStiffness])

  const manualTrigger = () => {
    if (!started && (trigger === "click" || trigger === "hover")) setStarted(true)
  }

  return (
    <div
      ref={containerRef}
      onClick={trigger === "click" ? manualTrigger : undefined}
      onMouseEnter={trigger === "hover" ? manualTrigger : undefined}
      className="relative z-[1] h-full w-full overflow-hidden"
    >
      <div ref={textRef} className="pt-6 text-center leading-relaxed text-white/85" style={{ fontSize }} />
      <div ref={canvasContainerRef} className="absolute left-0 top-0 z-0" />
    </div>
  )
}
