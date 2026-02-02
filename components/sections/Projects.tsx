"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Github, Instagram } from 'lucide-react'
import Link from "next/link"
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { translations } from '@/data/translations'
import { GlowingEffect } from '@/components/ui/glowing-effect'
import useMediaQuery from '@/hooks/use-media-query'

interface ProjectsProps {
    language: 'en' | 'tr'
    setSelectedProject: (project: string | null) => void
}

export default function Projects({ language, setSelectedProject }: ProjectsProps) {
    const t = translations[language]
    const { elementRef: projectsRef, isVisible: projectsVisible } = useScrollAnimation({ triggerOnce: true, threshold: 0.2 })
    const isMobile = useMediaQuery("(max-width: 768px)")

    return (
        <section
            id="projects"
            ref={projectsRef}
            className={`pt-0 -mt-24 pb-20 px-4 sm:px-6 lg:px-8 relative z-20 transition-all duration-700 ${projectsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
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
                    <div className="relative w-full max-w-md rounded-3xl">
                        <GlowingEffect spread={40} glow={true} disabled={isMobile} proximity={64} inactiveZone={0.01} borderWidth={3} />
                        <Card className="relative z-10 h-full bg-black/90 border-gray-800 rounded-3xl transition-all duration-300">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between text-white">
                                    Extramus HR System
                                    <Link href="https://github.com/Urthella" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors">
                                        <Github className="w-6 h-6" />
                                    </Link>
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    A modern HR management system designed to streamline intern and employee workflows with centralized profiles, document management, task tracking, and role-based access control.
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
                    </div>

                    {/* Reveil Game - Featured */}
                    <div className="relative w-full max-w-md rounded-3xl">
                        <GlowingEffect spread={40} glow={true} disabled={isMobile} proximity={64} inactiveZone={0.01} borderWidth={3} />
                        <Card className="relative z-10 h-full bg-black/90 border-gray-800 rounded-3xl transition-all duration-300">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between text-white">
                                    Reveil
                                    <Link href="https://github.com/Urthella/Reveil" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors">
                                        <Github className="w-6 h-6" />
                                    </Link>
                                </CardTitle>
                                <CardDescription className="text-gray-400">
                                    An immersive mobile app project built with TypeScript and modern web technologies. Features privacy-focused self-management app that helps users quit addictive behaviors, manage stress and anxiety, and build healthier routines through awareness and habit tracking.
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
                    </div>

                    {/* Portfolio Website */}
                    <div className="relative w-full max-w-md rounded-3xl">
                        <GlowingEffect spread={40} glow={true} disabled={isMobile} proximity={64} inactiveZone={0.01} borderWidth={3} />
                        <Card className="relative z-10 h-full bg-black/90 border-gray-800 rounded-3xl transition-all duration-300">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between text-white">
                                    Portfolio Website
                                    <Link href="https://github.com/Urthella" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors">
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
                </div>

                <div className="flex flex-wrap justify-center gap-8 mb-16">
                    {/* MIPS16 Pipeline Simulator */}
                    <div className="relative w-full max-w-md rounded-3xl">
                        <GlowingEffect spread={40} glow={true} disabled={isMobile} proximity={64} inactiveZone={0.01} borderWidth={3} />
                        <Card className="relative z-10 h-full bg-black/90 border-gray-800 rounded-3xl transition-all duration-300">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between text-white">
                                    MIPS16 Pipeline Simulator
                                    <Link href="https://github.com/Urthella/-MIPS16-pipeline-sim" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors">
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
                    </div>

                    {/* Algorithm Test Simulator */}
                    <div className="relative w-full max-w-md rounded-3xl">
                        <GlowingEffect spread={40} glow={true} disabled={isMobile} proximity={64} inactiveZone={0.01} borderWidth={3} />
                        <Card className="relative z-10 h-full bg-black/90 border-gray-800 rounded-3xl transition-all duration-300">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between text-white">
                                    Algorithm Performance Analyzer
                                    <Link href="https://github.com/Urthella/algortihm-test-sim" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors">
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
                    </div>


                    {/* Pen Trading via Instagram (@pen.pick) */}
                    <div className="relative w-full max-w-md rounded-3xl">
                        <GlowingEffect spread={40} glow={true} disabled={isMobile} proximity={64} inactiveZone={0.01} borderWidth={3} />
                        <Card className="relative z-10 h-full bg-black/90 border-gray-800 rounded-3xl transition-all duration-300">
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
                    </div>

                    {/* Custom Guitar Build */}
                    <div className="relative w-full max-w-md rounded-3xl">
                        <GlowingEffect spread={40} glow={true} disabled={isMobile} proximity={64} inactiveZone={0.01} borderWidth={3} />
                        <Card className="relative z-10 h-full bg-black/90 border-gray-800 rounded-3xl transition-all duration-300">
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
            </div>
        </section>
    )
}
