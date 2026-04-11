"use client"

import dynamic from "next/dynamic"

// Dynamic import with SSR disabled — only fetched when this component renders (desktop only)
const SplineScene = dynamic(
    () => import('@/components/ui/splite').then(mod => ({ default: mod.SplineScene })),
    { ssr: false }
)

export default function DesktopSplineWrapper() {
    return (
        <div className="fixed inset-0 z-0 opacity-100">
            <SplineScene
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="w-full h-full"
            />
        </div>
    )
}
