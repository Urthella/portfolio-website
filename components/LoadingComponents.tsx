'use client'

import { useEffect, useState } from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: string
  className?: string
}

export function LoadingSpinner({ 
  size = 'md', 
  color = 'border-cyan-500', 
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  }

  return (
    <div className={`${sizeClasses[size]} border-2 ${color} border-t-transparent rounded-full animate-spin ${className}`} />
  )
}

interface PageLoadingProps {
  isLoading: boolean
}

export function PageLoading({ isLoading }: PageLoadingProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !isLoading) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="text-gray-300 text-lg">Loading portfolio...</p>
        <div className="mt-4 flex space-x-1 justify-center">
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-100"></div>
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse delay-200"></div>
        </div>
      </div>
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="bg-gray-900/80 border border-gray-700 rounded-2xl p-6 animate-pulse">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 bg-gray-700 rounded-full skeleton"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-700 rounded skeleton mb-2"></div>
          <div className="h-3 bg-gray-700 rounded skeleton w-2/3"></div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-3 bg-gray-700 rounded skeleton"></div>
        <div className="h-3 bg-gray-700 rounded skeleton w-5/6"></div>
        <div className="h-3 bg-gray-700 rounded skeleton w-4/6"></div>
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        <div className="h-6 w-16 bg-gray-700 rounded-full skeleton"></div>
        <div className="h-6 w-20 bg-gray-700 rounded-full skeleton"></div>
        <div className="h-6 w-14 bg-gray-700 rounded-full skeleton"></div>
      </div>
    </div>
  )
}
