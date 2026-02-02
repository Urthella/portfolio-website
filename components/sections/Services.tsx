"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Guitar, Dumbbell, Apple } from 'lucide-react'
import { translations } from '@/data/translations'

interface ServicesProps {
    language: 'en' | 'tr'
}

export default function Services({ language }: ServicesProps) {
    const t = translations[language]

    return (
        <section
            id="services"
            className="py-20 px-4 sm:px-6 lg:px-8 relative z-20"
        >
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-5xl font-bold text-white mb-6">
                        {t.services.title}
                    </h2>
                    <p className="text-xl text-gray-400">{t.services.subtitle}</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Guitar Lessons */}
                    <Card className="pointer-events-auto bg-black/80 border-gray-800 hover:border-gray-600 shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in-up delay-400">
                        <CardHeader>
                            <div className="flex items-center space-x-3">
                                <Guitar className="w-8 h-8 text-white" />
                                <CardTitle className="text-white">{t.services.guitarLessons}</CardTitle>
                            </div>
                            <CardDescription className="text-gray-400 mt-2">{t.services.guitarDescription}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: "smooth" })}
                                className="bg-white text-black hover:bg-gray-200 border-none transition-all duration-300 rounded-xl"
                            >
                                {t.services.contactForDetails}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Fitness Coaching */}
                    <Card className="pointer-events-auto bg-black/80 border-gray-800 hover:border-gray-600 shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in-up delay-400">
                        <CardHeader>
                            <div className="flex items-center space-x-3">
                                <Dumbbell className="w-8 h-8 text-white" />
                                <CardTitle className="text-white">{t.services.fitnessCoaching}</CardTitle>
                            </div>
                            <CardDescription className="text-gray-400 mt-2">{t.services.fitnessCoachingDescription}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: "smooth" })}
                                className="bg-white text-black hover:bg-gray-200 border-none transition-all duration-300 rounded-xl"
                            >
                                {t.services.contactForDetails}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Nutrition Coaching */}
                    <Card className="pointer-events-auto bg-black/80 border-gray-800 hover:border-gray-600 shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in-up delay-400">
                        <CardHeader>
                            <div className="flex items-center space-x-3">
                                <Apple className="w-8 h-8 text-white" />
                                <CardTitle className="text-white">{t.services.nutritionCoaching}</CardTitle>
                            </div>
                            <CardDescription className="text-gray-400 mt-2">{t.services.nutritionDescription}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: "smooth" })}
                                className="bg-white text-black hover:bg-gray-200 border-none transition-all duration-300 rounded-xl"
                            >
                                {t.services.contactForDetails}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}
