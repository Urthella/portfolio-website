
import React from 'react'
import {
    Code2, Database, Globe, Server, Terminal, Cpu, Cloud, Shield,
    Layers, Box, Command, Hash, Activity, Zap, Radio
} from 'lucide-react'


// Fallback for Leaf/Spring icon since lucide might not have exact match, using generic or skipping
const Leaf = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
)

const technologies = [
    { name: 'Java', icon: <Code2 className="w-8 h-8 text-orange-500" /> },
    { name: 'Spring Boot', icon: <Leaf className="w-8 h-8 text-green-500" /> }, // Custom Leaf icon below if needed or use similar
    { name: 'TypeScript', icon: <Code2 className="w-8 h-8 text-blue-400" /> },
    { name: 'React', icon: <Box className="w-8 h-8 text-cyan-400" /> },
    { name: 'Next.js', icon: <Globe className="w-8 h-8 text-white" /> },
    { name: 'Node.js', icon: <Server className="w-8 h-8 text-green-600" /> },
    { name: 'Docker', icon: <Box className="w-8 h-8 text-blue-500" /> },
    { name: 'MongoDB', icon: <Database className="w-8 h-8 text-green-500" /> },
    { name: 'Kafka', icon: <Activity className="w-8 h-8 text-purple-500" /> },
    { name: 'Python', icon: <Hash className="w-8 h-8 text-yellow-400" /> },
    { name: 'AWS', icon: <Cloud className="w-8 h-8 text-orange-400" /> },
    { name: 'Linux', icon: <Terminal className="w-8 h-8 text-white" /> },
    { name: 'Cybersecurity', icon: <Shield className="w-8 h-8 text-red-500" /> },
]



export default function TechMarquee() {
    return (
        <div className="w-full py-10 bg-black/50 backdrop-blur-sm border-y border-white/5 overflow-hidden">
            <div className="relative w-full flex">
                <div className="flex animate-marquee whitespace-nowrap">
                    {technologies.map((tech, index) => (
                        <div key={index} className="flex items-center space-x-2 mx-8 group cursor-default">
                            <span className="group-hover:scale-110 transition-transform duration-300 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
                                {tech.icon}
                            </span>
                            <span className="text-xl font-bold bg-gradient-to-r from-gray-400 to-gray-200 bg-clip-text text-transparent group-hover:text-white transition-colors">
                                {tech.name}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="flex absolute top-0 animate-marquee2 whitespace-nowrap">
                    {technologies.map((tech, index) => (
                        <div key={`dup-${index}`} className="flex items-center space-x-2 mx-8 group cursor-default">
                            <span className="group-hover:scale-110 transition-transform duration-300 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
                                {tech.icon}
                            </span>
                            <span className="text-xl font-bold bg-gradient-to-r from-gray-400 to-gray-200 bg-clip-text text-transparent group-hover:text-white transition-colors">
                                {tech.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
