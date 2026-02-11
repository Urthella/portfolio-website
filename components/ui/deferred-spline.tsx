"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"

// Dynamically import Spline so it's not in the initial bundle
const SplineScene = dynamic(
    () => import('@/components/ui/splite').then(mod => ({ default: mod.SplineScene })),
    {
        ssr: false,
        loading: () => <div className="fixed inset-0 z-0 bg-black" /> // Placeholder while loading
    }
)

export function DeferredSpline() {
    const [shouldLoad, setShouldLoad] = useState(false)

    useEffect(() => {
        // Determine when to load: usage of requestIdleCallback with a timeout fallback
        if ("requestIdleCallback" in window) {
            const handle = (window as any).requestIdleCallback(() => {
                setShouldLoad(true)
            }, { timeout: 4000 }) // Fallback: load after 4s max if main thread never idles

            return () => (window as any).cancelIdleCallback(handle)
        } else {
            // Fallback for Safari/browsers without requestIdleCallback
            const timer = setTimeout(() => {
                setShouldLoad(true)
            }, 2000) // Load after 2s delay

            return () => clearTimeout(timer)
        }
    }, [])

    if (!shouldLoad) return null

    return (
        <div className="fixed inset-0 z-0 opacity-40 transition-opacity duration-1000 ease-in-out">
            <SplineScene
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="w-full h-full"
            />
        </div>
    )
}
