"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Guitar, Dumbbell, Gamepad2, Instagram } from 'lucide-react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { translations } from '@/data/translations'

interface HobbiesProps {
    language: 'en' | 'tr'
}

export default function Hobbies({ language }: HobbiesProps) {
    const t = translations[language]
    const { elementRef: hobbiesRef, isVisible: hobbiesVisible } = useScrollAnimation({ triggerOnce: true, threshold: 0.2 })

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
                    <Card className="pointer-events-auto bg-black/80 border-gray-800 hover:border-gray-600 shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in-up delay-300">
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

                    {/* Fitness & Sports */}
                    <Card className="pointer-events-auto bg-black/80 border-gray-800 hover:border-gray-600 shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in-up delay-300">
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

                    {/* Reading & RPG Gaming */}
                    <Card className="pointer-events-auto bg-black/80 border-gray-800 hover:border-gray-600 shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in-up delay-300">
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

                    {/* Collecting & Trading */}
                    {/* Centering spacer for grid if needed */}
                    <div className="md:col-span-2 lg:col-span-1 flex justify-center lg:hidden"></div>

                    <Card className="pointer-events-auto bg-black/80 border-gray-800 hover:border-gray-600 shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in-up delay-300">
                        <CardHeader>
                            <div className="flex items-center space-x-3">
                                <Instagram className="w-8 h-8 text-white" />
                                <CardTitle className="text-white">{t.hobbies.collectingTrading}</CardTitle>
                            </div>
                            <CardDescription className="text-gray-400 mt-2">
                                {t.hobbies.collectingDescription}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}
