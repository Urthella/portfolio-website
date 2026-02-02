"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code, Server, Database, Cloud, Shield, Cpu, GraduationCap } from 'lucide-react'
import { useScrollAnimation, useStaggeredAnimation } from '@/hooks/useScrollAnimation'
import { translations } from '@/data/translations'
import { GlowingEffect } from '@/components/ui/glowing-effect'
import useMediaQuery from '@/hooks/use-media-query'

interface SkillsProps {
    language: 'en' | 'tr'
}

export default function Skills({ language }: SkillsProps) {
    const t = translations[language]
    const { elementRef: skillsRef, isVisible: skillsVisible } = useScrollAnimation({ triggerOnce: true, threshold: 0.2 })
    const { containerRef: skillsContainerRef, visibleItems: visibleSkillItems } = useStaggeredAnimation(6, 120, true)
    const isMobile = useMediaQuery("(max-width: 768px)")

    const skillCategories = [
        {
            key: 'programmingLanguages',
            icon: Code,
            skills: ['Java', 'Python', 'JavaScript', 'TypeScript', 'C#']
        },
        {
            key: 'backendFrameworks',
            icon: Server,
            skills: ['Spring Boot', 'Spring', 'Node.js', 'Express.js', 'Kafka', 'REST APIs']
        },
        {
            key: 'databases',
            icon: Database,
            skills: ['MongoDB', 'SQL', 'PostgreSQL', 'Redis']
        },
        {
            key: 'devopsCloud',
            icon: Cloud,
            skills: ['Docker', 'CI/CD', 'GitHub Actions', 'Linux', 'AWS', 'IT Operations']
        },
        {
            key: 'securityTools',
            icon: Shield,
            skills: ['OWASP', 'Wireshark', 'Burp Suite', 'Metasploit', 'Social Engineering', 'Ethical Hacking', 'Penetration Testing']
        },
        {
            key: 'messageQueues', // Using messageQueues key for "Other Technologies" as per original file structure linking
            icon: Cpu,
            skills: ['React', 'Vue.js', 'Tailwind CSS', 'Management', 'Leadership', 'Teamwork', 'Communication']
        },
        {
            key: 'certifications',
            icon: GraduationCap,
            skills: ['CompTIA Security+', 'CompTIA Network+', 'CompTIA A+', 'CCNA', 'AWS Certified Cloud Practitioner']
        }
    ]

    return (
        <section
            id="skills"
            ref={skillsRef}
            className={`pt-20 pb-10 px-4 sm:px-6 lg:px-8 relative z-20 transition-all duration-700 ${skillsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-5xl font-bold text-white mb-6">
                        {t.skills.title}
                    </h2>
                    <p className="text-xl text-gray-400">{t.skills.subtitle}</p>
                </div>

                <div
                    ref={skillsContainerRef as React.RefObject<HTMLDivElement>}
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {skillCategories.map((category, index) => (
                        <div
                            key={category.key}
                            className={`relative rounded-2xl h-full transition-all duration-700 ${visibleSkillItems.includes(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                        >
                            <GlowingEffect spread={40} glow={true} disabled={isMobile} proximity={64} inactiveZone={0.01} borderWidth={3} />
                            <Card className="relative h-full pointer-events-auto bg-black/80 border-gray-800 hover:border-gray-600 hover:animate-pulse hover:scale-105">
                                <CardHeader>
                                    <div className="flex items-center space-x-3">
                                        <category.icon className="w-8 h-8 text-white" />
                                        <CardTitle className="text-white">
                                            {/* @ts-ignore - Dynamic key access */}
                                            {t.skills[category.key]}
                                        </CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {category.skills.map((skill) => (
                                            <Badge key={skill} className="bg-gray-900 text-gray-300 border-gray-700 hover:border-gray-500 transition-colors">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
