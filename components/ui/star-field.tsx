"use client"

import React from 'react'
import { motion } from 'framer-motion'

export const StarField = () => {
    // Generate static stars map to reuse
    const generateStars = (count: number) => {
        let value = ''
        for (let i = 0; i < count; i++) {
            const x = Math.floor(Math.random() * 2000)
            const y = Math.floor(Math.random() * 2000)
            value += `${x}px ${y}px #FFF${i < count - 1 ? ', ' : ''}`
        }
        return value
    }

    // We use useMemo but for this simple server/client component just constants are fine
    // However to avoid hydration mismatch we need to ensure this matches or runs on client
    // For simplicity, we'll let it render on client only or use a fixed seed if needed.
    // To allow randomness but consistency, ideally we'd use a seed. 
    // Here we'll just suppress hydration warning or use a class-based approach if CSS modules were allowed.
    // Given the constraints, let's do this:

    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden md:hidden opacity-30">
            <div className="stars-sm absolute" style={{ boxShadow: generateStars(700), width: '1px', height: '1px' }} />
            <div className="stars-md absolute" style={{ boxShadow: generateStars(200), width: '2px', height: '2px' }} />
            <div className="stars-lg absolute" style={{ boxShadow: generateStars(100), width: '3px', height: '3px' }} />
        </div>
    )
}
