"use client"

import gsap from "gsap"
import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react"

/**
 * 3D swapping card stack (reactbits "CardSwap" equivalent, GSAP-driven).
 * Cards cycle: the front card drops, the rest promote forward, the dropped
 * card returns to the back. Pauses on hover.
 */

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  customClass?: string
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ customClass, className, ...rest }, ref) => (
  <div
    ref={ref}
    {...rest}
    className={[
      "absolute left-1/2 top-1/2 rounded-2xl [backface-visibility:hidden] [transform-style:preserve-3d] [will-change:transform]",
      customClass,
      className,
    ]
      .filter(Boolean)
      .join(" ")}
  />
))
Card.displayName = "Card"

interface Slot {
  x: number
  y: number
  z: number
  zIndex: number
}

const makeSlot = (i: number, distX: number, distY: number, total: number): Slot => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i,
})

const PERSPECTIVE = 900

/**
 * How far the fanned-out back cards reach past the front card's right edge,
 * after perspective (origin: the stack's centre) shrinks them toward the middle.
 */
const fanOverhang = (count: number, width: number, distX: number) => {
  let reach = width
  for (let i = 1; i < count; i++) {
    const { x, z } = makeSlot(i, distX, 0, count)
    const s = PERSPECTIVE / (PERSPECTIVE - z)
    reach = Math.max(reach, width / 2 + s * (x + width / 2))
  }
  return reach - width
}

const placeNow = (el: HTMLElement, slot: Slot, skew: number) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: "center center",
    zIndex: slot.zIndex,
    force3D: true,
  })

export interface CardSwapProps {
  width?: number
  height?: number
  cardDistance?: number
  verticalDistance?: number
  delay?: number
  pauseOnHover?: boolean
  skewAmount?: number
  easing?: "elastic" | "linear"
  children: ReactNode
}

export function CardSwap({
  width = 460,
  height = 340,
  cardDistance = 54,
  verticalDistance = 60,
  delay = 4200,
  pauseOnHover = true,
  skewAmount = 5,
  easing = "elastic",
  children,
}: CardSwapProps) {
  const config =
    easing === "elastic"
      ? { ease: "elastic.out(0.6,0.9)", durDrop: 2, durMove: 2, durReturn: 2, promoteOverlap: 0.9, returnDelay: 0.05 }
      : { ease: "power1.inOut", durDrop: 0.8, durMove: 0.8, durReturn: 0.8, promoteOverlap: 0.45, returnDelay: 0.2 }

  const childArr = useMemo(() => Children.toArray(children) as ReactElement[], [children])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const refs = useMemo(() => childArr.map(() => ({ current: null as HTMLDivElement | null })), [childArr.length])

  const order = useRef<number[]>(Array.from({ length: childArr.length }, (_, i) => i))
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const intervalRef = useRef<number | undefined>(undefined)
  const container = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const swapRef = useRef<() => void>(() => {})

  useEffect(() => {
    const total = refs.length
    refs.forEach((r, i) => {
      if (r.current) placeNow(r.current, makeSlot(i, cardDistance, verticalDistance, total), skewAmount)
    })

    const swap = () => {
      if (order.current.length < 2) return
      // Re-entrancy guard: never start a new swap while one is animating.
      if (tlRef.current && tlRef.current.isActive()) return
      const [front, ...rest] = order.current
      const elFront = refs[front].current
      if (!elFront) return

      const tl = gsap.timeline()
      tlRef.current = tl

      tl.to(elFront, { y: "+=500", duration: config.durDrop, ease: config.ease })
      tl.addLabel("promote", `-=${config.durDrop * config.promoteOverlap}`)
      rest.forEach((idx, i) => {
        const el = refs[idx].current
        if (!el) return
        const slot = makeSlot(i, cardDistance, verticalDistance, refs.length)
        tl.set(el, { zIndex: slot.zIndex }, "promote")
        tl.to(el, { x: slot.x, y: slot.y, z: slot.z, duration: config.durMove, ease: config.ease }, `promote+=${i * 0.15}`)
      })

      const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length)
      tl.addLabel("return", `promote+=${config.durMove * config.returnDelay}`)
      tl.call(() => gsap.set(elFront, { zIndex: backSlot.zIndex }), undefined, "return")
      tl.set(elFront, { x: backSlot.x, z: backSlot.z }, "return")
      tl.to(elFront, { y: backSlot.y, duration: config.durReturn, ease: config.ease }, "return")
      tl.call(() => {
        order.current = [...rest, front]
      })
    }
    swapRef.current = swap

    // Always clear before creating so intervals can never stack up.
    const startAuto = () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current)
      intervalRef.current = window.setInterval(swap, delay)
    }

    swap()
    startAuto()

    const node = container.current
    const pause = () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current)
      intervalRef.current = undefined
    }
    const resume = () => startAuto()
    if (pauseOnHover && node) {
      node.addEventListener("mouseenter", pause)
      node.addEventListener("mouseleave", resume)
    }

    return () => {
      if (pauseOnHover && node) {
        node.removeEventListener("mouseenter", pause)
        node.removeEventListener("mouseleave", resume)
      }
      if (intervalRef.current) window.clearInterval(intervalRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, easing])

  // The stage spans the whole fan, so it is what has to fit inside the parent box.
  const footprint = Math.ceil(width + fanOverhang(childArr.length, width, cardDistance))

  // Scale the stack down whenever its box is narrower than the fan, so no card spills out of the column.
  useLayoutEffect(() => {
    const el = stage.current
    const box = el?.parentElement
    if (!el || !box) return
    const fit = () => {
      el.style.scale = String(Math.min(1, box.clientWidth / footprint))
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(box)
    return () => ro.disconnect()
  }, [footprint])

  const rendered = childArr.map((child, i) =>
    isValidElement(child)
      ? cloneElement(child as ReactElement<CardProps>, {
          key: i,
          ref: (el: HTMLDivElement | null) => {
            refs[i].current = el
          },
          style: { width, height, ...((child.props as CardProps).style ?? {}) },
        } as Partial<CardProps> & { ref: (el: HTMLDivElement | null) => void })
      : child,
  )

  // Click advances one card. swap() self-guards against mid-animation calls,
  // and hovering has already paused the auto-interval (pauseOnHover), so we
  // never stack intervals or overlap timelines here.
  const handleClick = () => {
    swapRef.current()
  }

  return (
    // contain:layout turns the stack's overflow into ink overflow: Chrome sizes the perspective-shrunk back
    // cards larger for scrolling than they paint, which gave the page a phantom horizontal scroll near 1024-1150px.
    <div
      ref={stage}
      className="absolute bottom-0 right-0 origin-bottom-right translate-y-[18%] [contain:layout]"
      style={{ width: footprint, height }}
    >
      <div
        ref={container}
        onClick={handleClick}
        className="relative cursor-pointer"
        style={{ width, height, perspective: PERSPECTIVE }}
      >
        {rendered}
      </div>
    </div>
  )
}
