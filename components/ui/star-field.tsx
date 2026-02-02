"use client"

import React, { useEffect, useState } from 'react'

export const StarField = () => {
    const [mounted, setMounted] = useState(false)
    const [stars, setStars] = useState({ sm: '', md: '', lg: '' })

    useEffect(() => {
        const generateStars = (count: number) => {
            let value = ''
            for (let i = 0; i < count; i++) {
                const x = Math.floor(Math.random() * 2000)
                const y = Math.floor(Math.random() * 2000)
                value += `${x}px ${y}px #FFF${i < count - 1 ? ', ' : ''}`
            }
            return value
        }

        setStars({
            sm: generateStars(700),
            md: generateStars(200),
            lg: generateStars(100)
        })
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden md:hidden opacity-30">
            <div className="stars-sm absolute" style={{ boxShadow: stars.sm, width: '1px', height: '1px' }} />
            <div className="stars-md absolute" style={{ boxShadow: stars.md, width: '2px', height: '2px' }} />
            <div className="stars-lg absolute" style={{ boxShadow: stars.lg, width: '3px', height: '3px' }} />
        </div>
    )
}
