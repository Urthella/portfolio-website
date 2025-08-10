'use client'

import { useEffect, useRef, useState } from 'react'

interface UseScrollAnimationOptions {
  threshold?: number
  triggerOnce?: boolean
  rootMargin?: string
}

export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)
  const elementRef = useRef<HTMLElement>(null)

  const {
    threshold = 0.1,
    triggerOnce = true,
    rootMargin = '0px 0px -100px 0px'
  } = options

  useEffect(() => {
    const element = elementRef.current

    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (triggerOnce) {
            setHasTriggered(true)
          }
        } else if (!triggerOnce) {
          setIsVisible(false)
        }
      },
      {
        threshold,
        rootMargin,
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [threshold, triggerOnce, rootMargin, hasTriggered])

  return { elementRef, isVisible }
}

export function useStaggeredAnimation(itemCount: number, delay: number = 100, triggerOnce: boolean = false) {
  const [visibleItems, setVisibleItems] = useState<number[]>([])
  const [isTriggered, setIsTriggered] = useState(false)
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!triggerOnce || !isTriggered)) {
          if (!triggerOnce) {
            setVisibleItems([]) // Reset items for re-trigger
          }
          setIsTriggered(true)
          
          // Staggered animation for items
          for (let i = 0; i < itemCount; i++) {
            setTimeout(() => {
              setVisibleItems(prev => [...prev, i])
            }, i * delay)
          }
        } else if (!triggerOnce && !entry.isIntersecting) {
          setVisibleItems([])
          setIsTriggered(false)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(container)

    return () => {
      observer.disconnect()
    }
  }, [itemCount, delay, triggerOnce, isTriggered])

  return { containerRef, visibleItems, isTriggered }
}
