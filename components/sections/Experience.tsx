"use client"

import { Badge } from "@/components/ui/badge"
import { translations } from '@/data/translations'

interface ExperienceProps {
    language: 'en' | 'tr'
}

import { GlowingEffect } from '@/components/ui/glowing-effect'
import useMediaQuery from '@/hooks/use-media-query'

export default function Experience({ language }: ExperienceProps) {
    const t = translations[language]
    const isMobile = useMediaQuery("(max-width: 768px)")

    return (
        <section id="experience" className="py-20 px-4 sm:px-6 lg:px-8 relative z-20">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-5xl font-bold text-white mb-6">
                        {t.experience.title}
                    </h2>
                    <p className="text-xl text-gray-400">
                        {t.experience.subtitle}
                    </p>
                </div>

                <div className="relative">
                    {/* Timeline line */}
                    {/* Timeline line */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gray-800 rounded-full hidden md:block"></div>

                    {/* Experience Items */}
                    <div className="space-y-12">
                        {/* Extramus Organization */}
                        <div className="relative flex items-center justify-between">
                            <div className="hidden md:block w-5/12"></div>
                            <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gray-600 rounded-full border-4 border-gray-900 hidden md:block z-10"></div>
                            <div className="w-full md:w-5/12 relative rounded-2xl">
                                <GlowingEffect spread={40} glow={true} disabled={isMobile} proximity={64} inactiveZone={0.01} borderWidth={3} />
                                <div className="relative w-full pointer-events-auto bg-black/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 hover:border-gray-600 transition-all duration-300 hover:-translate-y-1">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-white text-sm font-medium bg-gray-800 px-3 py-1 rounded-full">
                                            {t.experience.extramus.date}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">{t.experience.extramus.role}</h3>
                                    <p className="text-gray-400 font-medium mb-3">{t.experience.extramus.company}</p>
                                    <ul className="text-gray-400 text-sm space-y-2">
                                        {t.experience.extramus.items.map((item, i) => (
                                            <li key={i}>• {item}</li>
                                        ))}
                                    </ul>
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        <Badge className="bg-gray-900 text-gray-300 border-gray-700 text-xs">JavaScript</Badge>
                                        <Badge className="bg-gray-900 text-gray-300 border-gray-700 text-xs">TypeScript</Badge>
                                        <Badge className="bg-gray-900 text-gray-300 border-gray-700 text-xs">Docker</Badge>
                                        <Badge className="bg-gray-900 text-gray-300 border-gray-700 text-xs">Node.js</Badge>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Telenity */}
                        <div className="relative flex items-center justify-between flex-row-reverse">
                            <div className="hidden md:block w-5/12"></div>
                            <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gray-600 rounded-full border-4 border-gray-900 hidden md:block z-10"></div>
                            <div className="w-full md:w-5/12 relative rounded-2xl">
                                <GlowingEffect spread={40} glow={true} disabled={isMobile} proximity={64} inactiveZone={0.01} borderWidth={3} />
                                <div className="relative w-full pointer-events-auto bg-black/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 hover:border-gray-600 transition-all duration-300 hover:-translate-y-1">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-white text-sm font-medium bg-gray-800 px-3 py-1 rounded-full">
                                            {t.experience.telenity.date}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">{t.experience.telenity.role}</h3>
                                    <p className="text-gray-400 font-medium mb-3">{t.experience.telenity.company}</p>
                                    <ul className="text-gray-400 text-sm space-y-2">
                                        {t.experience.telenity.items.map((item, i) => (
                                            <li key={i}>• {item}</li>
                                        ))}
                                    </ul>
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        <Badge className="bg-gray-900 text-gray-300 border-gray-700 text-xs">Spring Boot</Badge>
                                        <Badge className="bg-gray-900 text-gray-300 border-gray-700 text-xs">Java</Badge>
                                        <Badge className="bg-gray-900 text-gray-300 border-gray-700 text-xs">MongoDB</Badge>
                                        <Badge className="bg-gray-900 text-gray-300 border-gray-700 text-xs">Kafka</Badge>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Anticverse Tech */}
                        <div className="relative flex items-center justify-between">
                            <div className="hidden md:block w-5/12"></div>
                            <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gray-600 rounded-full border-4 border-gray-900 hidden md:block z-10"></div>
                            <div className="w-full md:w-5/12 relative rounded-2xl">
                                <GlowingEffect spread={40} glow={true} disabled={isMobile} proximity={64} inactiveZone={0.01} borderWidth={3} />
                                <div className="relative w-full pointer-events-auto bg-black/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 hover:border-gray-600 transition-all duration-300 hover:-translate-y-1">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-white text-sm font-medium bg-gray-800 px-3 py-1 rounded-full">
                                            {t.experience.anticverseTech.date}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">{t.experience.anticverseTech.role}</h3>
                                    <p className="text-gray-400 font-medium mb-3">{t.experience.anticverseTech.company}</p>
                                    <ul className="text-gray-400 text-sm space-y-2">
                                        {t.experience.anticverseTech.items.map((item, i) => (
                                            <li key={i}>• {item}</li>
                                        ))}
                                    </ul>
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        <Badge className="bg-gray-900 text-gray-300 border-gray-700 text-xs">Leadership</Badge>
                                        <Badge className="bg-gray-900 text-gray-300 border-gray-700 text-xs">Strategy</Badge>
                                        <Badge className="bg-gray-900 text-gray-300 border-gray-700 text-xs">Management</Badge>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Anticverse RedPill */}
                        <div className="relative flex items-center justify-between flex-row-reverse">
                            <div className="hidden md:block w-5/12"></div>
                            <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gray-600 rounded-full border-4 border-gray-900 hidden md:block z-10"></div>
                            <div className="w-full md:w-5/12 relative rounded-2xl">
                                <GlowingEffect spread={40} glow={true} disabled={isMobile} proximity={64} inactiveZone={0.01} borderWidth={3} />
                                <div className="relative w-full pointer-events-auto bg-black/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 hover:border-gray-600 transition-all duration-300 hover:-translate-y-1">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-white text-sm font-medium bg-gray-800 px-3 py-1 rounded-full">
                                            {t.experience.redpill.date}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">{t.experience.redpill.role}</h3>
                                    <p className="text-gray-400 font-medium mb-3">{t.experience.redpill.company}</p>
                                    <ul className="text-gray-400 text-sm space-y-2">
                                        {t.experience.redpill.items.map((item, i) => (
                                            <li key={i}>• {item}</li>
                                        ))}
                                    </ul>
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        <Badge className="bg-gray-900 text-gray-300 border-gray-700 text-xs">Cybersecurity</Badge>
                                        <Badge className="bg-gray-900 text-gray-300 border-gray-700 text-xs">Malware</Badge>
                                        <Badge className="bg-gray-900 text-gray-300 border-gray-700 text-xs">Event Planning</Badge>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Teknofest */}
                        <div className="relative flex items-center justify-between">
                            <div className="hidden md:block w-5/12"></div>
                            <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gray-600 rounded-full border-4 border-gray-900 hidden md:block z-10"></div>
                            <div className="w-full md:w-5/12 relative rounded-2xl">
                                <GlowingEffect spread={40} glow={true} disabled={isMobile} proximity={64} inactiveZone={0.01} borderWidth={3} />
                                <div className="relative w-full pointer-events-auto bg-black/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 hover:border-gray-600 transition-all duration-300 hover:-translate-y-1">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-white text-sm font-medium bg-gray-800 px-3 py-1 rounded-full">
                                            {t.experience.teknofest.date}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">{t.experience.teknofest.role}</h3>
                                    <p className="text-gray-400 font-medium mb-3">{t.experience.teknofest.company}</p>
                                    <ul className="text-gray-400 text-sm space-y-2">
                                        {t.experience.teknofest.items.map((item, i) => (
                                            <li key={i}>• {item}</li>
                                        ))}
                                    </ul>
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        <Badge className="bg-gray-900 text-gray-300 border-gray-700 text-xs">Drone Tech</Badge>
                                        <Badge className="bg-gray-900 text-gray-300 border-gray-700 text-xs">Engineering</Badge>
                                        <Badge className="bg-gray-900 text-gray-300 border-gray-700 text-xs">Leadership</Badge>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Education */}
                        <div className="relative flex items-center justify-between flex-row-reverse">
                            <div className="hidden md:block w-5/12"></div>
                            <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gray-600 rounded-full border-4 border-gray-900 hidden md:block z-10"></div>
                            <div className="w-full md:w-5/12 relative rounded-2xl">
                                <GlowingEffect spread={40} glow={true} disabled={isMobile} proximity={64} inactiveZone={0.01} borderWidth={3} />
                                <div className="relative w-full pointer-events-auto bg-black/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 hover:border-gray-600 transition-all duration-300 hover:-translate-y-1">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-white text-sm font-medium bg-gray-800 px-3 py-1 rounded-full">
                                            {t.experience.education.date}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">{t.experience.education.role}</h3>
                                    <p className="text-gray-400 font-medium mb-3">{t.experience.education.company}</p>
                                    <ul className="text-gray-400 text-sm space-y-2">
                                        {t.experience.education.items.map((item, i) => (
                                            <li key={i}>• {item}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
