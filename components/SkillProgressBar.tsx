'use client'

import { useEffect, useState } from 'react'

interface SkillProgressBarProps {
  skill: string
  percentage: number
  color: string
  delay?: number
  icon?: React.ReactNode
}

export default function SkillProgressBar({ skill, percentage, color, delay = 0, icon }: SkillProgressBarProps) {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
      const animationTimer = setTimeout(() => {
        setProgress(percentage)
      }, 200)
      return () => clearTimeout(animationTimer)
    }, delay)

    return () => clearTimeout(timer)
  }, [percentage, delay])

  return (
    <div className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          {icon && <span className="text-lg">{icon}</span>}
          <span className="font-medium text-gray-200">{skill}</span>
        </div>
        <span className="text-sm font-bold" style={{ color }}>{percentage}%</span>
      </div>
      <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ease-out relative`}
          style={{
            width: `${progress}%`,
            backgroundColor: color,
            boxShadow: `0 0 20px ${color}40`
          }}
        >
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"
            style={{
              background: `linear-gradient(90deg, transparent, ${color}60, transparent)`
            }}
          />
        </div>
      </div>
    </div>
  )
}
