"use client"

import { useState, useEffect } from "react"
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Menu, X, Globe, ChevronUp } from 'lucide-react'
import { translations } from "@/data/translations"

// Components
import Hero from "@/components/sections/Hero"
import About from "@/components/sections/About"
import Experience from "@/components/sections/Experience"
import Skills from "@/components/sections/Skills"
import Projects from "@/components/sections/Projects"
import Hobbies from "@/components/sections/Hobbies"
import Services from "@/components/sections/Services"
import Contact from "@/components/sections/Contact"
import GithubStats from '@/components/GithubStats'
import TerminalModal from '@/components/TerminalModal'
import TechMarquee from '@/components/TechMarquee'
import { SplineScene } from "@/components/ui/splite"
import { Spotlight } from "@/components/ui/spotlight"
import { StarField } from "@/components/ui/star-field"
import { Typewriter } from "@/components/ui/typewriter"

export default function Portfolio() {
  const [language, setLanguage] = useState<'en' | 'tr'>('en')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [selectedProject, setSelectedProject] = useState<string | null>(null) // Retaining selectedProject for potential modal usage/future exp.

  const t = translations[language]

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      // Active section detection
      const sections = ['home', 'about', 'experience', 'skills', 'projects', 'hobbies', 'services', 'articles', 'contact']
      const current = sections.find(section => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })
      if (current) setActiveSection(current)

      // Show/hide scroll to top button
      setShowScrollTop(window.scrollY > 500)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'tr' : 'en')
    document.documentElement.lang = language === 'en' ? 'tr' : 'en'
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const navItems = [
    { id: 'home', label: t.nav.home },
    { id: 'about', label: t.nav.about },
    { id: 'experience', label: t.nav.experience },
    { id: 'skills', label: t.nav.skills },
    { id: 'projects', label: t.nav.projects },
    { id: 'hobbies', label: t.nav.hobbies },
    { id: 'contact', label: t.nav.contact }
  ]

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">

      {/* Background Elements */}
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20 z-0"
        size={400}
      />

      <StarField />

      <div className="fixed inset-0 z-0 opacity-40 hidden md:block">
        <SplineScene
          scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
          className="w-full h-full"
        />
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isMenuOpen ? 'bg-black' : 'bg-black/80 backdrop-blur-md border-b border-gray-800'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <span
                onClick={scrollToTop}
                className="text-2xl font-bold text-white cursor-pointer hover:opacity-80 transition-opacity"
              >
                UD
              </span>
              <div className="hidden md:block ml-8">
                <Link href="/blog">
                  <Button variant="outline" className="border-gray-600 text-white hover:bg-white hover:text-black transition-all duration-300">
                    {t.nav.blog}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:text-white hover:scale-105 ${activeSection === item.id
                      ? 'text-black bg-white scale-105'
                      : 'text-gray-300'
                      }`}
                  >
                    {item.label}
                  </button>
                ))}

                <button
                  onClick={toggleLanguage}
                  className="p-2 rounded-full hover:bg-gray-800 transition-colors flex items-center space-x-2 text-gray-300 hover:text-white border border-gray-700 hover:border-white"
                  aria-label="Toggle Language"
                >
                  <Globe className="w-5 h-5" />
                  <span className="text-sm font-medium">{language.toUpperCase()}</span>
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-4">
              <Link href="/blog">
                <Button variant="outline" size="sm" className="border-gray-600 text-white hover:bg-white hover:text-black">
                  Blog
                </Button>
              </Link>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-300 hover:text-white p-2"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-xl border-b border-gray-800 absolute w-full left-0 top-20">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })
                    setIsMenuOpen(false)
                  }}
                  className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${activeSection === item.id
                    ? 'text-black bg-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }`}
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => {
                  toggleLanguage()
                  setIsMenuOpen(false)
                }}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 flex items-center space-x-2"
              >
                <Globe className="w-5 h-5" />
                <span>{language === 'en' ? 'Switch to Turkish' : 'İngilizce\'ye Geç'}</span>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="relative z-10 pointer-events-none">
        <Hero language={language} />

        <TechMarquee />

        <About language={language} />

        <Experience language={language} />

        <Skills language={language} />

        <Projects language={language} setSelectedProject={setSelectedProject} />

        <GithubStats />

        <Hobbies language={language} />

        <Services language={language} />

        <Contact language={language} />
      </main>

      {/* Footer / Copyright / Socials if any (using Contact section for now) */}
      <footer className="py-8 text-center text-gray-500 border-t border-gray-900 bg-black z-20 relative">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-center items-center gap-1 text-sm">
          <span>© {new Date().getFullYear()} Utku Demirtaş. All rights reserved. Built with care, little sleep and </span>
          <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank" rel="noopener noreferrer" className="text-yellow-500 hover:text-yellow-300 hover:drop-shadow-[0_0_10px_rgba(253,224,71,0.8)] transition-all duration-300 font-medium flex items-center">
            <Typewriter
              text={["lots of coffee ☕", "even less sleep 😴", "love ❤️", "passion 🔥"]}
              speed={70}
              className="inline-block"
              waitTime={1500}
              deleteSpeed={40}
              cursorChar={"_"}
            />
          </a>
        </div>
      </footer>

      {/* Interactive Elements */}
      <TerminalModal />

      {/* Scroll to top */}


      {/* Global Modals for Projects can go here if we implement a custom one */}
      {/* For now, the Projects component has buttons but no modal trigger implemented other than state set */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedProject(null)}>
          <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl max-w-2xl w-full relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedProject(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-white mb-4">Project Details: {selectedProject}</h2>
            <p className="text-gray-300">Detailed view coming soon! For now please check the GitHub repository link in the card.</p>
            <div className="mt-6 flex justify-end">
              <Link href="https://github.com/Urthella?tab=repositories" target="_blank" rel="noopener noreferrer">
                <Button>View on GitHub</Button>
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
