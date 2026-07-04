"use client"

import gsap from "gsap"
import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
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

  useEffect(() => {
    const total = refs.length
    refs.forEach((r, i) => {
      if (r.current) placeNow(r.current, makeSlot(i, cardDistance, verticalDistance, total), skewAmount)
    })

    const swap = () => {
      if (order.current.length < 2) return
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

    swap()
    intervalRef.current = window.setInterval(swap, delay)

    const node = container.current
    const pause = () => {
      tlRef.current?.pause()
      if (intervalRef.current) window.clearInterval(intervalRef.current)
    }
    const resume = () => {
      tlRef.current?.play()
      intervalRef.current = window.setInterval(swap, delay)
    }
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

  return (
    <div
      ref={container}
      className="absolute bottom-0 right-0 origin-bottom-right [perspective:900px] [transform:translate(5%,18%)] max-md:[transform:scale(0.72)_translate(20%,22%)]"
      style={{ width, height }}
    >
      {rendered}
    </div>
  )
}
