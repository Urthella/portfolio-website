"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"

// 2. INNER DYNAMIC IMPORT
// This is the heavy one. It will only be fetched when <SplineScene /> is rendered.
const SplineScene = dynamic(
    () => import('@/components/ui/splite').then(mod => ({ default: mod.SplineScene })),
    {
        ssr: false,
    }
)

export default function DesktopSplineWrapper() {
    const [shouldLoad, setShouldLoad] = useState(false)

    useEffect(() => {
        // 3. IDLE WAIT STRATEGY
        // Even after the wrapper renders, we wait for the browser main thread to idle.
        // This allows the initial paint and interactive elements to settle first.

        if (typeof window !== "undefined" && "requestIdleCallback" in window) {
            const handle = (window as any).requestIdleCallback(() => {
                setShouldLoad(true)
            }, { timeout: 5000 }) // Fallback: 5s max wait

            return () => (window as any).cancelIdleCallback(handle)
        } else {
            // Fallback for browsers without requestIdleCallback (e.g. Safari)
            const timer = setTimeout(() => {
                setShouldLoad(true)
            }, 3000)

            return () => clearTimeout(timer)
        }
    }, [])

    // 4. RENDER GATE
    // Until idle + delay is complete, we render NOTHING.
    // This keeps the DOM light and prevents the heavy script from executing.
    if (!shouldLoad) return null

    return (
        <div className="fixed inset-0 z-0 opacity-100 transition-opacity duration-1000 ease-in-out">
            <SplineScene
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="w-full h-full"
            />
        </div>
    )
}
