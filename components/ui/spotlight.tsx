'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface SpotlightProps {
    className?: string;
    size?: number;
}

export function Spotlight({ className, size = 200 }: SpotlightProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = useCallback(
        (event: MouseEvent) => {
            const parent = containerRef.current?.parentElement;
            if (!parent) return;
            const rect = parent.getBoundingClientRect();
            setPosition({
                x: event.clientX - rect.left - size / 2,
                y: event.clientY - rect.top - size / 2,
            });
        },
        [size]
    );

    useEffect(() => {
        const parent = containerRef.current?.parentElement;
        if (!parent) return;

        // Ensure parent has proper styles for spotlight positioning
        parent.style.position = parent.style.position || 'relative';
        parent.style.overflow = 'hidden';

        const handleEnter = () => setIsHovered(true);
        const handleLeave = () => setIsHovered(false);

        parent.addEventListener('mousemove', handleMouseMove);
        parent.addEventListener('mouseenter', handleEnter);
        parent.addEventListener('mouseleave', handleLeave);

        return () => {
            parent.removeEventListener('mousemove', handleMouseMove);
            parent.removeEventListener('mouseenter', handleEnter);
            parent.removeEventListener('mouseleave', handleLeave);
        };
    }, [handleMouseMove]);

    return (
        <div
            ref={containerRef}
            className={cn(
                'pointer-events-none absolute rounded-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops),transparent_80%)] blur-xl transition-opacity duration-200',
                'from-zinc-50 via-zinc-100 to-zinc-200',
                isHovered ? 'opacity-100' : 'opacity-0',
                className
            )}
            style={{
                width: size,
                height: size,
                left: `${position.x}px`,
                top: `${position.y}px`,
                transition: 'left 0.1s ease-out, top 0.1s ease-out, opacity 0.2s',
            }}
        />
    );
}
