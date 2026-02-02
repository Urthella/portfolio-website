"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, Instagram } from 'lucide-react'
import Link from "next/link"
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { translations } from '@/data/translations'

interface ProjectsProps {
    language: 'en' | 'tr'
    setSelectedProject: (project: string | null) => void
}

export default function Projects({ language, setSelectedProject }: ProjectsProps) {
    const t = translations[language]
    const { elementRef: projectsRef, isVisible: projectsVisible } = useScrollAnimation({ triggerOnce: true, threshold: 0.2 })

    return (
        <section
            id="projects"
            ref={projectsRef}
            className={`pt-10 pb-20 px-4 sm:px-6 lg:px-8 relative z-20 transition-all duration-700 ${projectsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-5xl font-bold text-white mb-6">
                        {t.projects.title}
                    </h2>
                    <p className="text-xl text-gray-400">{t.projects.subtitle}</p>
                </div>

                <h3 className="text-3xl font-bold text-white mb-8 text-center">{t.projects.featuredContent}</h3>

                <div className="flex flex-wrap justify-center gap-8 mb-16">
                    {/* Extramus HR System */}
                    <Card className="pointer-events-auto hover:shadow-2xl hover:shadow-gray-500/30 transition-all duration-300 hover:-translate-y-2 bg-black/80 border-gray-800 hover:border-gray-600 w-full max-w-md hover:scale-105 animate-fade-in-up delay-200">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between text-white">
                                Extramus HR System
                                <Link href="https://github.com/Urthella" className="text-white hover:text-gray-300 transition-colors">
                                    <Github className="w-6 h-6" />
                                </Link>
                            </CardTitle>
                            <CardDescription className="text-gray-400">
                                HR management system with document management, secure file uploads, and role-based access control.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <Badge className="bg-gray-900 text-gray-300 border-gray-700 hover:border-gray-500 transition-colors">JavaScript</Badge>
                                <Badge className="bg-gray-900 text-gray-300 border-gray-700 hover:border-gray-500 transition-colors">TypeScript</Badge>
                                <Badge className="bg-gray-900 text-gray-300 border-gray-700 hover:border-gray-500 transition-colors">Node.js</Badge>
                            </div>
                            <Button
                                onClick={() => setSelectedProject('extramus')}
                                className="w-full bg-white text-black hover:bg-gray-200 border-none transition-all duration-300 rounded-xl touch-target focus-visible"
                            >
                                Show Details
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Reveil Game - Featured */}
                    <Card className="pointer-events-auto hover:shadow-2xl hover:shadow-gray-500/30 transition-all duration-300 hover:-translate-y-2 bg-black/80 border-gray-800 hover:border-gray-600 w-full max-w-md hover:scale-105 animate-fade-in-up delay-200">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between text-white">
                                Reveil
                                <Link href="https://github.com/Urthella/Reveil" className="text-white hover:text-gray-300 transition-colors">
                                    <Github className="w-6 h-6" />
                                </Link>
                            </CardTitle>
                            <CardDescription className="text-gray-400">
                                An immersive game project built with TypeScript and modern web technologies. Features interactive gameplay mechanics.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <Badge className="bg-gray-900 text-gray-300 border-gray-700 hover:border-gray-500 transition-colors">TypeScript</Badge>
                                <Badge className="bg-gray-900 text-gray-300 border-gray-700 hover:border-gray-500 transition-colors">JavaScript</Badge>
                                <Badge className="bg-gray-900 text-gray-300 border-gray-700 hover:border-gray-500 transition-colors">Python</Badge>
                            </div>
                            <Button
                                onClick={() => setSelectedProject('reveil')}
                                className="w-full bg-white text-black hover:bg-gray-200 border-none transition-all duration-300 rounded-xl"
                            >
                                Show Details
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Portfolio Website */}
                    <Card className="pointer-events-auto hover:shadow-2xl hover:shadow-gray-500/30 transition-all duration-300 hover:-translate-y-2 bg-black/80 border-gray-800 hover:border-gray-600 w-full max-w-md hover:scale-105 animate-fade-in-up delay-200">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between text-white">
                                Portfolio Website
                                <Link href="https://github.com/Urthella" className="text-white hover:text-gray-300 transition-colors">
                                    <Github className="w-6 h-6" />
                                </Link>
                            </CardTitle>
                            <CardDescription className="text-gray-400">
                                Modern, responsive portfolio website built with Next.js, featuring dark mode, animations, and multilingual support
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <Badge className="bg-gray-900 text-gray-300 border-gray-700 hover:border-gray-500 transition-colors">Next.js</Badge>
                                <Badge className="bg-gray-900 text-gray-300 border-gray-700 hover:border-gray-500 transition-colors">TypeScript</Badge>
                                <Badge className="bg-gray-900 text-gray-300 border-gray-700 hover:border-gray-500 transition-colors">Tailwind CSS</Badge>
                            </div>
                            <Button
                                onClick={() => setSelectedProject('portfolio')}
                                className="w-full bg-white text-black hover:bg-gray-200 border-none transition-all duration-300 rounded-xl"
                            >
                                Show Details
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex flex-wrap justify-center gap-8 mb-16">
                    {/* MIPS16 Pipeline Simulator */}
                    <Card className="pointer-events-auto hover:shadow-2xl hover:shadow-gray-500/30 transition-all duration-300 hover:-translate-y-2 bg-black/80 border-gray-800 hover:border-gray-600 w-full max-w-md hover:scale-105 animate-fade-in-up delay-200">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between text-white">
                                MIPS16 Pipeline Simulator
                                <Link href="https://github.com/Urthella/-MIPS16-pipeline-sim" className="text-white hover:text-gray-300 transition-colors">
                                    <Github className="w-6 h-6" />
                                </Link>
                            </CardTitle>
                            <CardDescription className="text-gray-400">
                                5-stage pipeline CPU simulator with hazard detection, data forwarding, and real-time visualization. Includes Verilog RTL modules.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <Badge className="bg-gray-900 text-gray-300 border-gray-700 hover:border-gray-500 transition-colors">Java</Badge>
                                <Badge className="bg-gray-900 text-gray-300 border-gray-700 hover:border-gray-500 transition-colors">TypeScript</Badge>
                                <Badge className="bg-gray-900 text-gray-300 border-gray-700 hover:border-gray-500 transition-colors">React</Badge>
                                <Badge className="bg-gray-900 text-gray-300 border-gray-700 hover:border-gray-500 transition-colors">Verilog</Badge>
                            </div>
                            <Button
                                onClick={() => setSelectedProject('mips16')}
                                className="w-full bg-white text-black hover:bg-gray-200 border-none transition-all duration-300 rounded-xl"
                            >
                                Show Details
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Algorithm Test Simulator */}
                    <Card className="pointer-events-auto hover:shadow-2xl hover:shadow-gray-500/30 transition-all duration-300 hover:-translate-y-2 bg-black/80 border-gray-800 hover:border-gray-600 w-full max-w-md hover:scale-105 animate-fade-in-up delay-200">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between text-white">
                                Algorithm Performance Analyzer
                                <Link href="https://github.com/Urthella/algortihm-test-sim" className="text-white hover:text-gray-300 transition-colors">
                                    <Github className="w-6 h-6" />
                                </Link>
                            </CardTitle>
                            <CardDescription className="text-gray-400">
                                Sorting algorithm benchmarking tool with time/memory analysis, interactive charts, and multiple data patterns support.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <Badge className="bg-gray-900 text-gray-300 border-gray-700 hover:border-gray-500 transition-colors">Spring Boot</Badge>
                                <Badge className="bg-gray-900 text-gray-300 border-gray-700 hover:border-gray-500 transition-colors">React</Badge>
                                <Badge className="bg-gray-900 text-gray-300 border-gray-700 hover:border-gray-500 transition-colors">Vite</Badge>
                            </div>
                            <Button
                                onClick={() => setSelectedProject('algorithm')}
                                className="w-full bg-white text-black hover:bg-gray-200 border-none transition-all duration-300 rounded-xl"
                            >
                                Show Details
                            </Button>
                        </CardContent>
                    </Card>


                    {/* Pen Trading via Instagram (@pen.pick) */}
                    <Card className="pointer-events-auto hover:shadow-2xl hover:shadow-gray-500/30 transition-all duration-300 hover:-translate-y-2 bg-black/80 border-gray-800 hover:border-gray-600 w-full max-w-md hover:scale-105 animate-fade-in-up delay-200">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2 text-white">
                                <span>Pen Trading via Instagram (@pen.pick)</span>
                                <a href="https://instagram.com/pen.pick" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">
                                    <Instagram className="w-6 h-6 align-middle" />
                                </a>
                            </CardTitle>
                            <CardDescription className="text-gray-400">
                                A niche Instagram-based marketplace for premium pens. Focused on fountain, rollerball, and ballpoint models.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <Badge className="bg-gray-900 text-gray-300 border-gray-700 hover:border-gray-500 transition-colors">Instagram</Badge>
                                <Badge className="bg-gray-900 text-gray-300 border-gray-700 hover:border-gray-500 transition-colors">Product Photography</Badge>
                                <Badge className="bg-gray-900 text-gray-300 border-gray-700 hover:border-gray-500 transition-colors">E-commerce</Badge>
                                <Badge className="bg-gray-900 text-gray-300 border-gray-700 hover:border-gray-500 transition-colors">Branding</Badge>
                            </div>
                            <Button
                                onClick={() => setSelectedProject('penpick')}
                                className="w-full bg-white text-black hover:bg-gray-200 border-none transition-all duration-300 rounded-xl"
                            >
                                Show Details
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Custom Guitar Build */}
                    <Card className="pointer-events-auto hover:shadow-2xl hover:shadow-gray-500/30 transition-all duration-300 hover:-translate-y-2 bg-black/80 border-gray-800 hover:border-gray-600 w-full max-w-md hover:scale-105 animate-fade-in-up delay-200">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between text-white">
                                Custom Guitar Build
                            </CardTitle>
                            <CardDescription className="text-gray-400">
                                Handcrafted custom guitar with unique design, premium components, and exceptional playability
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <Badge className="bg-gray-900 text-gray-300 border-gray-700 hover:border-gray-500 transition-colors">Woodworking</Badge>
                                <Badge className="bg-gray-900 text-gray-300 border-gray-700 hover:border-gray-500 transition-colors">Electronics</Badge>
                                <Badge className="bg-gray-900 text-gray-300 border-gray-700 hover:border-gray-500 transition-colors">Guitar Setup</Badge>
                            </div>
                            <Button
                                onClick={() => setSelectedProject('guitar')}
                                className="w-full bg-white text-black hover:bg-gray-200 border-none transition-all duration-300 rounded-xl"
                            >
                                Show Details
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}
