"use client"

import { Component, type ReactNode } from "react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

/**
 * Catches render/commit errors (including rejected lazy imports surfaced through
 * Suspense) so a non-critical widget (e.g. a WebGL background) can fail
 * without taking down the whole page.
 */
export class ErrorBoundary extends Component<Props, { hasError: boolean }> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch() {
    // intentionally swallowed; the guarded widget is decorative
  }

  render() {
    if (this.state.hasError) return this.props.fallback ?? null
    return this.props.children
  }
}
