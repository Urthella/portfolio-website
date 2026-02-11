"use client"

import { useEffect, useState } from "react"

interface TypewriterProps {
    text: string | string[]
    speed?: number
    className?: string
    waitTime?: number
    deleteSpeed?: number
    cursorChar?: string
    showCursor?: boolean
    cursorClassName?: string
}

const Typewriter = ({
    text,
    speed = 50,
    className = "",
    waitTime = 1500,
    deleteSpeed = 40,
    cursorChar = "|",
    showCursor = true,
    cursorClassName = "",
}: TypewriterProps) => {
    const [displayText, setDisplayText] = useState("")
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isWaiting, setIsWaiting] = useState(false)

    const texts = Array.isArray(text) ? text : [text]
    const isLooping = Array.isArray(text) && text.length > 1

    useEffect(() => {
        if (isWaiting) {
            const waitTimer = setTimeout(() => {
                setIsWaiting(false)
                if (isLooping) {
                    setIsDeleting(true)
                }
            }, waitTime)
            return () => clearTimeout(waitTimer)
        }

        const currentText = texts[currentIndex]

        if (isDeleting) {
            if (displayText.length === 0) {
                setIsDeleting(false)
                setCurrentIndex((prev) => (prev + 1) % texts.length)
                return
            }
            const deleteTimer = setTimeout(() => {
                setDisplayText((prev) => prev.slice(0, -1))
            }, deleteSpeed)
            return () => clearTimeout(deleteTimer)
        }

        if (displayText.length < currentText.length) {
            const typeTimer = setTimeout(() => {
                setDisplayText(currentText.slice(0, displayText.length + 1))
            }, speed)
            return () => clearTimeout(typeTimer)
        }

        // Finished typing current text
        if (isLooping) {
            setIsWaiting(true)
        }
    }, [displayText, currentIndex, isDeleting, isWaiting, texts, speed, deleteSpeed, waitTime, isLooping])

    return (
        <div className={`inline whitespace-pre-wrap tracking-tight ${className}`}>
            <span>{displayText}</span>
            {showCursor && (
                <span
                    className={`animate-cursor-blink ${cursorClassName} ${displayText.length > 0 ? "ml-1" : ""}`}
                >
                    {cursorChar}
                </span>
            )}
        </div>
    )
}

export { Typewriter }
