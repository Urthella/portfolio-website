"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code, Server, Database, Cloud, Shield, Cpu, GraduationCap } from 'lucide-react'
import { useScrollAnimation, useStaggeredAnimation } from '@/hooks/useScrollAnimation'
import { translations } from '@/data/translations'

interface SkillsProps {
    language: 'en' | 'tr'
}

export default function Skills({ language }: SkillsProps) {
    const t = translations[language]
    const { elementRef: skillsRef, isVisible: skillsVisible } = useScrollAnimation({ triggerOnce: true, threshold: 0.2 })
    const { containerRef: skillsContainerRef, visibleItems: visibleSkillItems } = useStaggeredAnimation(6, 120, true)

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
                    {/* Programming Languages */}
                    <Card className={`pointer-events-auto bg-black/80 border-gray-800 hover:border-gray-600 transition-all duration-700 hover:animate-pulse hover:scale-105 ${visibleSkillItems.includes(0) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <CardHeader>
                            <div className="flex items-center space-x-3">
                                <Code className="w-8 h-8 text-white" />
                                <CardTitle className="text-white">{t.skills.programmingLanguages}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {['Java', 'Python', 'JavaScript', 'TypeScript', 'C#'].map((skill) => (
                                    <Badge key={skill} className="bg-gray-900 text-gray-300 border-gray-700 hover:border-gray-500 transition-colors">
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Backend & Frameworks */}
                    <Card className={`pointer-events-auto bg-black/80 border-gray-800 hover:border-gray-600 transition-all duration-700 hover:animate-pulse hover:scale-105 ${visibleSkillItems.includes(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <CardHeader>
                            <div className="flex items-center space-x-3">
                                <Server className="w-8 h-8 text-white" />
                                <CardTitle className="text-white">{t.skills.backendFrameworks}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {['Spring Boot', 'Spring', 'Node.js', 'Express.js', 'Kafka', 'REST APIs'].map((skill) => (
                                    <Badge key={skill} className="bg-gray-900 text-gray-300 border-gray-700 hover:border-gray-500 transition-colors">
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Databases */}
                    <Card className={`pointer-events-auto bg-black/80 border-gray-800 hover:border-gray-600 transition-all duration-700 hover:animate-pulse hover:scale-105 ${visibleSkillItems.includes(2) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <CardHeader>
                            <div className="flex items-center space-x-3">
                                <Database className="w-8 h-8 text-white" />
                                <CardTitle className="text-white">{t.skills.databases}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {['MongoDB', 'SQL', 'PostgreSQL', 'Redis'].map((skill) => (
                                    <Badge key={skill} className="bg-gray-900 text-gray-300 border-gray-700 hover:border-gray-500 transition-colors">
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* DevOps & Cloud */}
                    <Card className={`pointer-events-auto bg-black/80 border-gray-800 hover:border-gray-600 transition-all duration-700 hover:animate-pulse hover:scale-105 ${visibleSkillItems.includes(3) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <CardHeader>
                            <div className="flex items-center space-x-3">
                                <Cloud className="w-8 h-8 text-white" />
                                <CardTitle className="text-white">{t.skills.devopsCloud}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {['Docker', 'CI/CD', 'GitHub Actions', 'Linux', 'AWS', 'IT Operations'].map((skill) => (
                                    <Badge key={skill} className="bg-gray-900 text-gray-300 border-gray-700 hover:border-gray-500 transition-colors">
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Security & Tools */}
                    <Card className={`pointer-events-auto bg-black/80 border-gray-800 hover:border-gray-600 transition-all duration-700 hover:animate-pulse hover:scale-105 ${visibleSkillItems.includes(4) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <CardHeader>
                            <div className="flex items-center space-x-3">
                                <Shield className="w-8 h-8 text-white" />
                                <CardTitle className="text-white">{t.skills.securityTools}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {['OWASP', 'Wireshark', 'Burp Suite', 'Metasploit', 'Social Engineering', 'Ethical Hacking', 'Penetration Testing'].map((skill) => (
                                    <Badge key={skill} className="bg-gray-900 text-gray-300 border-gray-700 hover:border-gray-500 transition-colors">
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Other Technologies */}
                    <Card className={`pointer-events-auto bg-black/80 border-gray-800 hover:border-gray-600 transition-all duration-700 hover:animate-pulse hover:scale-105 ${visibleSkillItems.includes(5) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <CardHeader>
                            <div className="flex items-center space-x-3">
                                <Cpu className="w-8 h-8 text-white" />
                                <CardTitle className="text-white">{t.skills.messageQueues}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {['React', 'Vue.js', 'Tailwind CSS', 'Management', 'Leadership', 'Teamwork', 'Communication'].map((skill) => (
                                    <Badge key={skill} className="bg-gray-900 text-gray-300 border-gray-700 hover:border-gray-500 transition-colors">
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Certifications */}
                    <Card className={`pointer-events-auto bg-black/80 border-gray-800 hover:border-gray-600 transition-all duration-700 hover:animate-pulse hover:scale-105 ${visibleSkillItems.includes(6) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <CardHeader>
                            <div className="flex items-center space-x-3">
                                <GraduationCap className="w-8 h-8 text-white" />
                                <CardTitle className="text-white">{t.skills.certifications}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {['CompTIA Security+', 'CompTIA Network+', 'CompTIA A+', 'CCNA', 'AWS Certified Cloud Practitioner'].map((skill) => (
                                    <Badge key={skill} className="bg-gray-900 text-gray-300 border-gray-700 hover:border-gray-500 transition-colors">
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}
