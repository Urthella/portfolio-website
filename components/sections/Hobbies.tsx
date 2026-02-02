"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Guitar, Dumbbell, Gamepad2 } from 'lucide-react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { translations } from '@/data/translations'
import { GlowingEffect } from '@/components/ui/glowing-effect'
import useMediaQuery from '@/hooks/use-media-query'

interface HobbiesProps {
    language: 'en' | 'tr'
}

export default function Hobbies({ language }: HobbiesProps) {
    const t = translations[language]
    const { elementRef: hobbiesRef, isVisible: hobbiesVisible } = useScrollAnimation({ triggerOnce: true, threshold: 0.2 })
    const isMobile = useMediaQuery("(max-width: 768px)")

    return (
        <section
            id="hobbies"
            ref={hobbiesRef}
            className={`py-20 px-4 sm:px-6 lg:px-8 relative z-20 transition-all duration-700 ${hobbiesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-5xl font-bold text-white mb-6">
                        {t.hobbies.title}
                    </h2>
                    <p className="text-xl text-gray-400">{t.hobbies.subtitle}</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Music & Guitar */}
                    {/* Music & Guitar */}
                    <div className="relative h-full rounded-3xl">
                        <GlowingEffect spread={40} glow={true} disabled={isMobile} proximity={64} inactiveZone={0.01} borderWidth={3} />
                        <Card className="relative z-10 h-full bg-black/90 border-gray-800 rounded-3xl transition-all duration-300">
                            <CardHeader>
                                <div className="flex items-center space-x-3">
                                    <Guitar className="w-8 h-8 text-white" />
                                    <CardTitle className="text-white">{t.hobbies.musicGuitar}</CardTitle>
                                </div>
                                <CardDescription className="text-gray-400 mt-2">{t.hobbies.musicDescription}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {/* Music Info */}
                                    <div className="text-sm text-gray-400">
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Fitness & Sports */}
                    {/* Fitness & Sports */}
                    <div className="relative h-full rounded-3xl">
                        <GlowingEffect spread={40} glow={true} disabled={isMobile} proximity={64} inactiveZone={0.01} borderWidth={3} />
                        <Card className="relative z-10 h-full bg-black/90 border-gray-800 rounded-3xl transition-all duration-300">
                            <CardHeader>
                                <div className="flex items-center space-x-3">
                                    <Dumbbell className="w-8 h-8 text-white" />
                                    <CardTitle className="text-white">{t.hobbies.fitnessSports}</CardTitle>
                                </div>
                                <CardDescription className="text-gray-400 mt-2">{t.hobbies.fitnessDescription}</CardDescription>
                            </CardHeader>
                            <CardContent>

                            </CardContent>
                        </Card>
                    </div>

                    {/* Reading & RPG Gaming */}
                    {/* Reading & RPG Gaming */}
                    <div className="relative h-full rounded-3xl">
                        <GlowingEffect spread={40} glow={true} disabled={isMobile} proximity={64} inactiveZone={0.01} borderWidth={3} />
                        <Card className="relative z-10 h-full bg-black/90 border-gray-800 rounded-3xl transition-all duration-300">
                            <CardHeader>
                                <div className="flex items-center space-x-3">
                                    <Gamepad2 className="w-8 h-8 text-white" />
                                    <CardTitle className="text-white">{t.hobbies.readingRpg}</CardTitle>
                                </div>
                                <CardDescription className="text-gray-400 mt-2">{t.hobbies.readingDescription}</CardDescription>
                            </CardHeader>
                            <CardContent>
                            </CardContent>
                        </Card>
                    </div>


                </div>
            </div>
        </section>
    )
}
