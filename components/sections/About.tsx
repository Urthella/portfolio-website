"use client"

import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { translations } from '@/data/translations'
import { GlowingEffect } from '@/components/ui/glowing-effect'
import useMediaQuery from '@/hooks/use-media-query'

interface AboutProps {
    language: 'en' | 'tr'
}

export default function About({ language }: AboutProps) {
    const t = translations[language]
    const { elementRef: aboutRef, isVisible: aboutVisible } = useScrollAnimation({ triggerOnce: true, threshold: 0.2 })
    const isMobile = useMediaQuery("(max-width: 768px)")

    return (
        <section
            id="about"
            ref={aboutRef}
            className={`py-20 px-4 sm:px-6 lg:px-8 relative z-20 transition-all duration-700 ${aboutVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-5xl font-bold text-white mb-6">
                        {t.about.title}
                    </h2>
                    <p className="text-xl text-gray-400">{t.about.subtitle}</p>
                </div>

                <div className="relative rounded-3xl">
                    <GlowingEffect spread={40} glow={true} disabled={isMobile} proximity={64} inactiveZone={0.01} borderWidth={3} />
                    <div className="relative pointer-events-auto bg-black/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-800">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h3 className="text-3xl font-bold text-white mb-6">{t.about.journey}</h3>
                                <p className="text-gray-300 mb-6 leading-relaxed">
                                    {t.about.description1}
                                </p>
                                <p className="text-gray-300 mb-6 leading-relaxed">
                                    {t.about.description2}
                                </p>
                                <p className="text-gray-300 leading-relaxed">
                                    {t.about.description3}
                                </p>
                            </div>
                            <div className="space-y-6">
                                <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800">
                                    <h4 className="text-xl font-semibold text-white mb-3">{t.about.currentFocus}</h4>
                                    <p className="text-gray-400">{t.about.focusDescription}</p>
                                </div>
                                <div className="bg-gray-900/50 p-6 rounded-2xl border border-gray-800">
                                    <h4 className="text-xl font-semibold text-white mb-3">{t.about.achievements}</h4>
                                    <ul className="text-gray-300 space-y-2">
                                        <li>• Provincial basketball championship winner</li>
                                        <li>• Professional guitarist with live performance experience</li>
                                        <li>• Calisthenics athlete with experience</li>
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
