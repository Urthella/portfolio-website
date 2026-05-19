"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Guitar, Dumbbell, Apple } from 'lucide-react'
import { translations } from '@/data/translations'
import { GlowingEffect } from '@/components/ui/glowing-effect'
import useMediaQuery from '@/hooks/use-media-query'
import { useScrollAnimation, useStaggeredAnimation } from '@/hooks/useScrollAnimation'

interface ServicesProps {
    language: 'en' | 'tr'
}

export default function Services({ language }: ServicesProps) {
    const t = translations[language]
    const isMobile = useMediaQuery("(max-width: 768px)")
    const { elementRef: servicesRef, isVisible: servicesVisible } = useScrollAnimation({ triggerOnce: true, threshold: 0.15 })
    const { containerRef: servicesGridRef, visibleItems: visibleServiceItems } = useStaggeredAnimation(3, 150, true)

    return (
        <section
            id="services"
            ref={servicesRef}
            className={`py-20 px-4 sm:px-6 lg:px-8 relative z-20 transition-all duration-700 ${servicesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-5xl font-bold mb-6 section-title-gradient">
                        {t.services.title}
                    </h2>
                    <p className="text-xl text-gray-400">{t.services.subtitle}</p>
                </div>

                <div ref={servicesGridRef as React.RefObject<HTMLDivElement>} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Guitar Lessons */}
                    <div className={`relative h-full rounded-3xl transition-all duration-700 ${visibleServiceItems.includes(0) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <GlowingEffect spread={40} glow={true} disabled={isMobile} proximity={64} inactiveZone={0.01} borderWidth={3} />
                        <Card className="relative z-10 h-full bg-black/90 border-gray-800 rounded-3xl transition-all duration-300">
                            <CardHeader>
                                <div className="flex items-center space-x-3">
                                    <Guitar className="w-8 h-8 text-white" />
                                    <CardTitle className="text-white">{t.services.guitarLessons}</CardTitle>
                                </div>
                                <CardDescription className="text-gray-400 mt-2">{t.services.guitarDescription}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col h-full">
                                <div className="space-y-4 mb-6 flex-grow">
                                    <div>
                                        <h4 className="text-white font-semibold mb-2 text-sm">{t.services.included}</h4>
                                        <ul className="list-disc list-inside text-gray-400 text-sm space-y-1">
                                            {t.services.guitarIncluded.map((item, i) => (
                                                <li key={i}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-semibold mb-2 text-sm">{t.services.notIncluded}</h4>
                                        <ul className="list-disc list-inside text-gray-400 text-sm space-y-1">
                                            {t.services.guitarNotIncluded.map((item, i) => (
                                                <li key={i}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <p className="text-xs text-gray-500 italic mt-4 border-t border-gray-800 pt-3">
                                        {t.services.guitarDisclaimer}
                                    </p>
                                </div>
                                <Button
                                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: "smooth" })}
                                    className="bg-white text-black hover:bg-gray-200 border-none transition-all duration-300 rounded-xl w-full mt-auto"
                                >
                                    {t.services.contactForDetails}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Fitness Coaching */}
                    <div className={`relative h-full rounded-3xl transition-all duration-700 ${visibleServiceItems.includes(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <GlowingEffect spread={40} glow={true} disabled={isMobile} proximity={64} inactiveZone={0.01} borderWidth={3} />
                        <Card className="relative z-10 h-full bg-black/90 border-gray-800 rounded-3xl transition-all duration-300">
                            <CardHeader>
                                <div className="flex items-center space-x-3">
                                    <Dumbbell className="w-8 h-8 text-white" />
                                    <CardTitle className="text-white">{t.services.fitnessCoaching}</CardTitle>
                                </div>
                                <CardDescription className="text-gray-400 mt-2">{t.services.fitnessCoachingDescription}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col h-full">
                                <div className="space-y-4 mb-6 flex-grow">
                                    <div>
                                        <h4 className="text-white font-semibold mb-2 text-sm">{t.services.included}</h4>
                                        <ul className="list-disc list-inside text-gray-400 text-sm space-y-1">
                                            {t.services.fitnessIncluded.map((item, i) => (
                                                <li key={i}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-semibold mb-2 text-sm">{t.services.notIncluded}</h4>
                                        <ul className="list-disc list-inside text-gray-400 text-sm space-y-1">
                                            {t.services.fitnessNotIncluded.map((item, i) => (
                                                <li key={i}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <p className="text-xs text-gray-500 italic mt-4 border-t border-gray-800 pt-3">
                                        {t.services.fitnessDisclaimer}
                                    </p>
                                </div>
                                <Button
                                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: "smooth" })}
                                    className="bg-white text-black hover:bg-gray-200 border-none transition-all duration-300 rounded-xl w-full mt-auto"
                                >
                                    {t.services.contactForDetails}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Nutrition Coaching */}
                    <div className={`relative h-full rounded-3xl transition-all duration-700 ${visibleServiceItems.includes(2) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <GlowingEffect spread={40} glow={true} disabled={isMobile} proximity={64} inactiveZone={0.01} borderWidth={3} />
                        <Card className="relative z-10 h-full bg-black/90 border-gray-800 rounded-3xl transition-all duration-300">
                            <CardHeader>
                                <div className="flex items-center space-x-3">
                                    <Apple className="w-8 h-8 text-white" />
                                    <CardTitle className="text-white">{t.services.nutritionCoaching}</CardTitle>
                                </div>
                                <CardDescription className="text-gray-400 mt-2">{t.services.nutritionDescription}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-col h-full">
                                <div className="space-y-4 mb-6 flex-grow">
                                    <div>
                                        <h4 className="text-white font-semibold mb-2 text-sm">{t.services.included}</h4>
                                        <ul className="list-disc list-inside text-gray-400 text-sm space-y-1">
                                            {t.services.nutritionIncluded.map((item, i) => (
                                                <li key={i}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-semibold mb-2 text-sm">{t.services.notIncluded}</h4>
                                        <ul className="list-disc list-inside text-gray-400 text-sm space-y-1">
                                            {t.services.nutritionNotIncluded.map((item, i) => (
                                                <li key={i}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <p className="text-xs text-gray-500 italic mt-4 border-t border-gray-800 pt-3">
                                        {t.services.nutritionDisclaimer}
                                    </p>
                                </div>
                                <Button
                                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: "smooth" })}
                                    className="bg-white text-black hover:bg-gray-200 border-none transition-all duration-300 rounded-xl w-full mt-auto"
                                >
                                    {t.services.contactForDetails}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    )
}
