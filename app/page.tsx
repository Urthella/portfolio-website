"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Github, Mail, Phone, Linkedin, ExternalLink, Guitar, Dumbbell, Apple, Instagram, Code, Database, Server, Cloud, Shield, Cpu, Terminal, Zap, Gamepad2 } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

interface Firefly {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  speed: number
}

export default function Portfolio() {
  const [fireflies, setFireflies] = useState<Firefly[]>([])
  const [language, setLanguage] = useState<'en' | 'tr'>('en')
  const [selectedProject, setSelectedProject] = useState<string | null>(null)

  const translations = {
    en: {
      nav: {
        home: 'Home',
        about: 'About',
        skills: 'Skills',
        projects: 'Projects',
        hobbies: 'Hobbies',
        gamemusic: 'Game Music',
        services: 'Services',
        contact: 'Contact'
      },
      hero: {
        title: 'Utku Demirtaş',
        subtitle: 'Computer Engineering Student',
        description: "Welcome to my digital playground! 🚀 I'm passionate about technology, innovation, and creating solutions that make a difference. Let's build something amazing together!",
        computerEngineer: 'Computer Engineer',
        guitarist: 'Guitarist',
        fitnessEnthusiast: 'Athletic Freak'
      },
      about: {
        title: 'About Me',
        subtitle: 'Get to know the person behind the code 🌟',
        journey: 'My Journey',
        description1: "I'm a highly motivated Computer Engineering student with hands-on experience in backend and DevOps development. My journey has taken me through various roles, from Software Engineering Intern at Telenity to Backend & DevOps Developer at Extramus Organization.",
        description2: "I'm proficient in building Spring Boot applications and developing secure backend modules using Java, MongoDB, and Kafka. During my role at Extramus, I worked on document management features, implemented CI/CD pipelines, and contributed to containerized deployments using Docker.",
        description3: "Beyond coding, I'm passionate about scalable system design, cloud-based architectures, and continuously improving my technical skill set. I'm also a dedicated musician, athlete, and RPG game enthusiast who believes in the perfect balance between technology and creativity.",
        currentFocus: '🎯 Current Focus',
        focusDescription: 'Seeking to apply my knowledge in AI development and infrastructure in a dynamic, innovation-driven environment.',
        achievements: '🏆 Achievements',
        achievementsList: [
          '• Provincial basketball championship winner',
          '• Professional guitarist with live performance experience',
          '• Calisthenics athlete with competitive experience'
        ]
      },
      skills: {
        title: 'Technical Skills',
        subtitle: 'My technical arsenal and expertise 💻',
        programmingLanguages: 'Programming Languages',
        backendFrameworks: 'Backend & Frameworks',
        databases: 'Databases',
        devopsCloud: 'DevOps & Cloud',
        securityTools: 'Security & Tools',
        messageQueues: 'Message Queues & Others'
      },
      projects: {
        title: 'Projects',
        subtitle: 'A showcase of my computer engineering adventures 💻',
        featuredContent: 'Featured Content ✨',
        guitarVideo: 'Guitar Performance Video',
        comingSoon: 'Coming Soon 🎵'
      },
      hobbies: {
        title: 'Hobbies & Interests',
        subtitle: 'Beyond the code, here\'s what fuels my creativity 🎨',
        musicGuitar: 'Music & Guitar',
        musicDescription: 'Music has been my companion for years! 🎸 Playing guitar allows me to express creativity in a different medium than code. From classical blues to modern metal, I find that the discipline required for music complements my technical studies perfectly. Professional guitarist with extensive live performance experience.',
        fitnessSports: 'Fitness & Sports',
        fitnessDescription: 'Physical fitness is crucial for mental clarity and productivity! 💪 As a calisthenics athlete and provincial basketball champion, I believe in the connection between physical and mental well-being. Regular workouts help me maintain focus during long coding sessions and provide a healthy outlet for stress.',
        readingRpg: 'Reading & RPG Gaming',
        readingDescription: 'Books and RPG games are my gateway to infinite worlds! 📖 I\'m passionate about fantasy and science fiction literature, philosophy, and immersive RPG experiences. These interests fuel my creativity, expand my perspective, and enhance my analytical thinking and problem-solving skills in programming.'
      },
      gamemusic: {
        title: 'Game Musics I Designed',
        subtitle: 'Original compositions and soundtracks for gaming experiences 🎵',
        description: 'Here are some of the game music tracks I\'ve composed and designed. Each piece is crafted to enhance the gaming experience and create immersive atmospheres.'
      },
      services: {
        title: 'Services',
        subtitle: 'Sharing knowledge and passion through personalized coaching 🌟',
        guitarLessons: 'Guitar Lessons',
        guitarDescription: 'Learn guitar from beginner to advanced levels with personalized instruction',
        fitnessCoaching: 'Fitness Coaching',
        fitnessCoachingDescription: 'Achieve your fitness goals with customized workout plans and guidance',
        nutritionCoaching: 'Nutrition Coaching',
        nutritionDescription: 'Optimize your health with science-based nutrition guidance and meal planning',
        contactForDetails: 'Contact me for details'
      },
      contact: {
        title: 'Get In Touch',
        subtitle: 'Let\'s connect and explore opportunities together! 🚀',
        contactInformation: 'Contact Information',
        email: 'Email',
        phone: 'Phone',
        socialMedia: 'Social Media',
        professionalNetwork: 'Professional Network',
        codeRepository: 'Code Repository',
        lifeMoments: 'Life & Moments',
        technicalWriting: 'Technical Writing',
        sendMessage: 'Send Me a Message!',
        name: 'Name',
        message: 'Message',
        send: 'Send'
      }
    },
    tr: {
      nav: {
        home: 'Ana Sayfa',
        about: 'Hakkımda',
        skills: 'Yetenekler',
        projects: 'Projeler',
        hobbies: 'Hobiler',
        gamemusic: 'Oyun Müzikleri',
        services: 'Hizmetler',
        contact: 'İletişim'
      },
      hero: {
        title: 'Utku Demirtaş',
        subtitle: 'Bilgisayar Mühendisliği Öğrencisi',
        description: "Dijital oyun alanıma hoş geldiniz! 🚀 Teknoloji, inovasyon ve fark yaratan çözümler üretme konusunda tutkuluyum. Birlikte harika bir şeyler inşa edelim!",
        computerEngineer: 'Bilgisayar Mühendisi',
        guitarist: 'Gitarist',
        fitnessEnthusiast: 'Atletik Canavar'
      },
      about: {
        title: 'Hakkımda',
        subtitle: 'Kodun arkasındaki kişiyi tanıyın 🌟',
        journey: 'Yolculuğum',
        description1: "Özellikle İK yönetim sistemleri alanında backend ve DevOps geliştirme konusunda uygulamalı deneyime sahip, oldukça motive ve detay odaklı bir Bilgisayar Mühendisliği öğrencisiyim. Yolculuğum beni Telenity'de Yazılım Geliştirme Stajyeri'nden Extramus Organization'da Backend & DevOps Geliştirici'ye kadar çeşitli rollerden geçirdi.",
        description2: "Spring Boot uygulamaları oluşturma ve Java, MongoDB ve Kafka kullanarak güvenli backend modülleri geliştirme konusunda yetkinim. Extramus'taki rolüm sırasında doküman yönetimi özelliklerinde çalıştım, CI/CD pipeline'ları uyguladım ve Docker kullanarak konteynerleştirilmiş dağıtımlara katkıda bulundum.",
        description3: "Kodlamanın ötesinde, ölçeklenebilir sistem tasarımı, bulut tabanlı mimariler ve teknik beceri setimi sürekli geliştirme konusunda tutkuluyum. Aynı zamanda teknoloji ve yaratıcılık arasındaki mükemmel dengeye inanan, kendini adamış bir müzisyen, sporcu ve RPG oyun tutkunu.",
        currentFocus: '🎯 Mevcut Odak',
        focusDescription: 'Dinamik, inovasyon odaklı bir ortamda AI geliştirme ve altyapı konusundaki bilgilerimi uygulamaya çalışıyorum.',
        achievements: '🏆 Başarılar',
        achievementsList: [
          '• İl basketbol şampiyonluğu kazananı',
          '• Canlı performans deneyimi olan profesyonel gitarist',
          '• Yarışma deneyimi olan kalistenik sporcu'
        ]
      },
      skills: {
        title: 'Teknik Yetenekler',
        subtitle: 'Teknik arsenal ve uzmanlığım 💻',
        programmingLanguages: 'Programlama Dilleri',
        backendFrameworks: 'Backend ve Framework\'ler',
        databases: 'Veritabanları',
        devopsCloud: 'DevOps ve Bulut',
        securityTools: 'Güvenlik ve Araçlar',
        messageQueues: 'Mesaj Kuyrukları ve Diğerleri'
      },
      projects: {
        title: 'Projeler',
        subtitle: 'Bilgisayar mühendisliği maceralarımın bir vitrini 💻',
        featuredContent: 'Öne Çıkan İçerik ✨',
        guitarVideo: 'Gitar Performans Videosu',
        comingSoon: 'Yakında 🎵'
      },
      hobbies: {
        title: 'Hobiler ve İlgi Alanları',
        subtitle: 'Kodun ötesinde, yaratıcılığımı besleyen şeyler 🎨',
        musicGuitar: 'Müzik ve Gitar',
        musicDescription: 'Müzik yıllardır arkadaşım! 🎸 Gitar çalmak, yaratıcılığımı koddan farklı bir ortamda ifade etmeme olanak sağlıyor. Klasik blues\'tan modern metal\'e kadar, müzik için gereken disiplinin teknik çalışmalarımı mükemmel bir şekilde tamamladığını görüyorum. Geniş canlı performans deneyimi olan profesyonel gitarist.',
        fitnessSports: 'Fitness ve Spor',
        fitnessDescription: 'Fiziksel fitness, zihinsel berraklık ve verimlilik için çok önemli! 💪 Kalistenik sporcu ve il basketbol şampiyonu olarak, fiziksel ve zihinsel refah arasındaki bağlantıya inanıyorum. Düzenli antrenmanlar, uzun kodlama seansları sırasında odaklanmamı sağlıyor ve stres için sağlıklı bir çıkış noktası sunuyor.',
        readingRpg: 'Okuma ve RPG Oyunları',
        readingDescription: 'Kitaplar ve RPG oyunları sonsuz dünyalara açılan kapım! 📖 Fantastik ve bilim kurgu edebiyatı, felsefe ve sürükleyici RPG deneyimleri konusunda tutkuluyum. Bu ilgi alanları yaratıcılığımı besliyor, perspektifimi genişletiyor ve programlamadaki analitik düşünme ve problem çözme becerilerimi geliştiriyor.'
      },
      gamemusic: {
        title: 'Tasarladığım Oyun Müzikleri',
        subtitle: 'Oyun deneyimleri için orijinal kompozisyonlar ve müzikler 🎵',
        description: 'Bestelediğim ve tasarladığım oyun müziği parçalarından bazıları. Her parça, oyun deneyimini geliştirmek ve sürükleyici atmosferler yaratmak için özenle hazırlanmıştır.'
      },
      services: {
        title: 'Hizmetler',
        subtitle: 'Kişiselleştirilmiş koçluk ile bilgi ve tutku paylaşımı 🌟',
        guitarLessons: 'Gitar Dersleri',
        guitarDescription: 'Başlangıçtan ileri seviyeye kadar kişiselleştirilmiş eğitimle gitar öğrenin',
        fitnessCoaching: 'Fitness Koçluğu',
        fitnessCoachingDescription: 'Özelleştirilmiş antrenman planları ve rehberlikle fitness hedeflerinize ulaşın',
        nutritionCoaching: 'Beslenme Koçluğu',
        nutritionDescription: 'Bilim temelli beslenme rehberliği ve yemek planlaması ile sağlığınızı optimize edin',
        contactForDetails: 'Detaylar için iletişime geçin'
      },
      contact: {
        title: 'İletişime Geçin',
        subtitle: 'Bağlanalım ve fırsatları birlikte keşfedelim! 🚀',
        contactInformation: 'İletişim Bilgileri',
        email: 'E-posta',
        phone: 'Telefon',
        socialMedia: 'Sosyal Medya',
        professionalNetwork: 'Profesyonel Ağ',
        codeRepository: 'Kod Deposu',
        lifeMoments: 'Yaşam ve Anlar',
        technicalWriting: 'Teknik Yazım',
        sendMessage: 'Bana Mesaj Gönder!',
        name: 'İsim',
        message: 'Mesaj',
        send: 'Gönder'
      }
    }
  }

  const t = translations[language]

  useEffect(() => {
    const generateFireflies = () => {
      const newFireflies: Firefly[] = []
      for (let i = 0; i < 20; i++) {
        newFireflies.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 4 + 2,
          opacity: Math.random() * 0.8 + 0.2,
          speed: Math.random() * 2 + 1
        })
      }
      setFireflies(newFireflies)
    }

    generateFireflies()
    window.addEventListener('resize', generateFireflies)

    const animateFireflies = () => {
      setFireflies(prev => prev.map(firefly => ({
        ...firefly,
        x: (firefly.x + firefly.speed) % window.innerWidth,
        y: firefly.y + Math.sin(Date.now() * 0.001 + firefly.id) * 0.5,
        opacity: 0.3 + Math.sin(Date.now() * 0.002 + firefly.id) * 0.3
      })))
    }

    const interval = setInterval(animateFireflies, 50)
    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', generateFireflies)
    }
  }, [])

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <style jsx global>{`
        .animate-fade-in-up {
          animation: fade-in-up 1s forwards;
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      {/* Fireflies */}
      {fireflies.map(firefly => (
        <div
          key={firefly.id}
          className="fixed pointer-events-none z-10"
          style={{
            left: firefly.x,
            top: firefly.y,
            width: firefly.size,
            height: firefly.size,
            opacity: firefly.opacity,
            background: 'radial-gradient(circle, #00ffff 0%, transparent 70%)',
            borderRadius: '50%',
            boxShadow: `0 0 ${firefly.size * 2}px #00ffff`,
            animation: `pulse ${2 + Math.random() * 2}s infinite alternate`
          }}
        />
      ))}

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/90 backdrop-blur-xl border-b border-cyan-500/30 z-50 shadow-lg shadow-cyan-500/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              UD
            </div>
            <div className="hidden md:flex space-x-8 items-center">
              {['home', 'about', 'skills', 'projects', 'hobbies', 'gamemusic', 'services', 'contact'].map((section) => (
                <a
                  key={section}
                  href={`#${section}`}
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById(section)?.scrollIntoView({ behavior: "smooth" })
                  }}
                  className="text-gray-300 hover:text-cyan-400 transition-colors font-medium cursor-pointer capitalize"
                >
                  {t.nav[section as keyof typeof t.nav]}
                </a>
              ))}
              <Button
                onClick={() => setLanguage(language === 'en' ? 'tr' : 'en')}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0 rounded-full px-4 py-2 text-sm font-medium"
              >
                {language === 'en' ? 'TR' : 'EN'}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Entry Section */}
      <section className="min-h-screen flex items-center justify-center relative z-20">
        <div className="text-center">
          <button
            onClick={() => window.open('https://www.youtube.com/watch?v=rEq1Z0bjdwc', '_blank')}
            className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-purple-400 via-red-400 to-purple-400 bg-clip-text text-transparent mb-8 hover:scale-105 transition-transform duration-300 cursor-pointer"
          >
            Hello there!
          </button>
          
          <div className="flex items-center justify-center space-x-8 mb-8">
            {/* Purple Lightsaber */}
            <div className="relative">
              <div className="w-2 h-32 bg-gradient-to-t from-purple-500 to-purple-300 rounded-full shadow-lg shadow-purple-500/50 animate-pulse"></div>
              <div className="w-6 h-6 rounded-full mx-auto mt-2 bg-transparent"></div>
            </div>
            
            {/* Red Lightsaber */}
            <div className="relative">
              <div className="w-2 h-32 bg-gradient-to-t from-red-500 to-red-300 rounded-full shadow-lg shadow-red-500/50 animate-pulse"></div>
              <div className="w-6 h-6 rounded-full mx-auto mt-2 bg-transparent"></div>
            </div>
          </div>
          
          <p className="text-xl text-gray-300 mb-8">Welcome to my digital universe</p>
          
          <Button
            onClick={() => document.getElementById('home')?.scrollIntoView({ behavior: "smooth" })}
            className="bg-gradient-to-r from-purple-500 to-red-500 hover:from-purple-600 hover:to-red-600 text-white border-0 rounded-full px-8 py-4 text-lg font-medium shadow-lg shadow-purple-500/30"
          >
            Enter Portfolio
          </Button>
        </div>
      </section>

      {/* Hero Section */}
      <section id="home" className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <div className="mb-8">
              <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6 leading-tight hover:animate-pulse hover:scale-105 transition-all duration-300 cursor-default">
                {t.hero.title}
              </h1>
              <h2 className="text-2xl md:text-4xl text-gray-300 mb-8 font-semibold">{t.hero.subtitle}</h2>
              <div className="bg-gray-900/80 backdrop-blur-sm rounded-3xl p-8 max-w-3xl mx-auto shadow-xl border border-cyan-500/30 shadow-cyan-500/20">
                <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                  {t.hero.description}
                </p>
                <div className="flex items-center justify-center space-x-6 text-gray-300 flex-wrap gap-4">
                  <div className="flex items-center space-x-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 px-4 py-2 rounded-full border border-cyan-500/30">
                    <span className="text-2xl">💻</span>
                    <span className="font-medium">{t.hero.computerEngineer}</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 px-4 py-2 rounded-full border border-orange-500/30">
                    <Guitar className="w-6 h-6 text-orange-400" />
                    <span className="font-medium">{t.hero.guitarist}</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-gradient-to-r from-green-500/20 to-blue-500/20 px-4 py-2 rounded-full border border-green-500/30">
                    <Dumbbell className="w-6 h-6 text-green-400" />
                    <span className="font-medium">{t.hero.fitnessEnthusiast}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Me Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6">
              {t.about.title}
            </h2>
            <p className="text-xl text-gray-300">{t.about.subtitle}</p>
          </div>

          <div className="bg-gray-900/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-cyan-500/30 shadow-cyan-500/20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold text-cyan-400 mb-6">{t.about.journey}</h3>
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
                <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 p-6 rounded-2xl border border-cyan-500/20">
                  <h4 className="text-xl font-semibold text-cyan-400 mb-3">{t.about.currentFocus}</h4>
                  <p className="text-gray-300">{t.about.focusDescription}</p>
                </div>
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-6 rounded-2xl border border-purple-500/20">
                  <h4 className="text-xl font-semibold text-purple-400 mb-3">{t.about.achievements}</h4>
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
      </section>

      {/* Technical Skills Section */}
      <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900/50 to-black relative z-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
              {t.skills.title}
            </h2>
            <p className="text-xl text-gray-300">{t.skills.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Programming Languages */}
            <Card className="bg-gray-900/80 border-cyan-500/30 shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-300 hover:animate-pulse hover:scale-105 animate-fade-in-up delay-100">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Code className="w-8 h-8 text-cyan-400" />
                  <CardTitle className="text-cyan-400">{t.skills.programmingLanguages}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {['Java', 'Python', 'JavaScript', 'TypeScript', 'C#'].map((skill) => (
                    <Badge key={skill} className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border-cyan-500/30">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Backend & Frameworks */}
            <Card className="bg-gray-900/80 border-purple-500/30 shadow-xl shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300 hover:animate-pulse hover:scale-105 animate-fade-in-up delay-100">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Server className="w-8 h-8 text-purple-400" />
                  <CardTitle className="text-purple-400">{t.skills.backendFrameworks}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {['Spring Boot', 'Node.js', 'Express.js', 'REST APIs'].map((skill) => (
                    <Badge key={skill} className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Databases */}
            <Card className="bg-gray-900/80 border-green-500/30 shadow-xl shadow-green-500/20 hover:shadow-green-500/40 transition-all duration-300 hover:animate-pulse hover:scale-105 animate-fade-in-up delay-100">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Database className="w-8 h-8 text-green-400" />
                  <CardTitle className="text-green-400">{t.skills.databases}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {['MongoDB', 'SQL', 'PostgreSQL', 'Redis'].map((skill) => (
                    <Badge key={skill} className="bg-gradient-to-r from-green-500/20 to-teal-500/20 text-green-300 border-green-500/30">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* DevOps & Cloud */}
            <Card className="bg-gray-900/80 border-orange-500/30 shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 transition-all duration-300 hover:animate-pulse hover:scale-105 animate-fade-in-up delay-100">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Cloud className="w-8 h-8 text-orange-400" />
                  <CardTitle className="text-orange-400">{t.skills.devopsCloud}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {['Docker', 'CI/CD', 'GitHub Actions', 'Linux', 'AWS'].map((skill) => (
                    <Badge key={skill} className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 text-orange-300 border-orange-500/30">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Security & Tools */}
            <Card className="bg-gray-900/80 border-red-500/30 shadow-xl shadow-red-500/20 hover:shadow-red-500/40 transition-all duration-300 hover:animate-pulse hover:scale-105 animate-fade-in-up delay-100">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Shield className="w-8 h-8 text-red-400" />
                  <CardTitle className="text-red-400">{t.skills.securityTools}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {['OWASP', 'Wireshark', 'Burp Suite', 'Metasploit'].map((skill) => (
                    <Badge key={skill} className="bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-300 border-red-500/30">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Message Queues & Others */}
            <Card className="bg-gray-900/80 border-blue-500/30 shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300 hover:animate-pulse hover:scale-105 animate-fade-in-up delay-100">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Zap className="w-8 h-8 text-blue-400" />
                  <CardTitle className="text-blue-400">{t.skills.messageQueues}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {['Kafka', 'RabbitMQ', 'WebSockets'].map((skill) => (
                    <Badge key={skill} className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-500/30">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6">
              {t.projects.title}
            </h2>
            <p className="text-xl text-gray-300">{t.projects.subtitle}</p>
          </div>

          <h3 className="text-3xl font-bold text-cyan-400 mb-8">{t.projects.featuredContent}</h3>

          <div className="flex flex-wrap justify-center gap-8 mb-16">
            {/* Extramus HR System */}
            <Card className="hover:shadow-2xl hover:shadow-cyan-500/30 transition-all duration-300 hover:-translate-y-2 bg-gray-900/80 border-cyan-500/30 w-full max-w-md hover:animate-pulse hover:scale-105 animate-fade-in-up delay-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-cyan-400">
                  Extramus HR System
                  <Link href="https://github.com/Urthella" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                    <Github className="w-6 h-6" />
                  </Link>
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Comprehensive HR management system with document management, secure file uploads, and role-based access control
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border-cyan-500/30">JavaScript</Badge>
                  <Badge className="bg-gradient-to-r from-green-500/20 to-teal-500/20 text-green-300 border-green-500/30">TypeScript</Badge>
                  <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30">Node.js</Badge>
                </div>
                <Button
                  onClick={() => setSelectedProject('extramus')}
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0 rounded-xl"
                >
                  Show Details
                </Button>
              </CardContent>
            </Card>

            {/* Spring Boot Backend */}
            <Card className="hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-2 bg-gray-900/80 border-purple-500/30 w-full max-w-md hover:animate-pulse hover:scale-105 animate-fade-in-up delay-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-purple-400">
                  Spring Boot Backend
                  <Link href="https://github.com/Urthella/tut-rest" className="text-purple-400 hover:text-purple-300 transition-colors">
                    <Github className="w-6 h-6" />
                  </Link>
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Secure backend modules developed using Spring Boot, Java, MongoDB, and Kafka for scalable applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30">Spring Boot</Badge>
                  <Badge className="bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300 border-orange-500/30">Java</Badge>
                  <Badge className="bg-gradient-to-r from-green-500/20 to-teal-500/20 text-green-300 border-green-500/30">MongoDB</Badge>
                </div>
                <Button
                  onClick={() => setSelectedProject('springboot')}
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0 rounded-xl"
                >
                  Show Details
                </Button>
              </CardContent>
            </Card>

            {/* Portfolio Website */}
            <Card className="hover:shadow-2xl hover:shadow-green-500/30 transition-all duration-300 hover:-translate-y-2 bg-gray-900/80 border-green-500/30 w-full max-w-md hover:animate-pulse hover:scale-105 animate-fade-in-up delay-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-green-400">
                  Portfolio Website
                  <Link href="https://github.com/Urthella/portfolio-website" className="text-green-400 hover:text-green-300 transition-colors">
                    <Github className="w-6 h-6" />
                  </Link>
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Modern, responsive portfolio website built with Next.js, featuring dark mode, animations, and multilingual support
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border-cyan-500/30">Next.js</Badge>
                  <Badge className="bg-gradient-to-r from-green-500/20 to-teal-500/20 text-green-300 border-green-500/30">TypeScript</Badge>
                  <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30">Tailwind CSS</Badge>
                </div>
                <Button
                  onClick={() => setSelectedProject('portfolio')}
                  className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white border-0 rounded-xl"
                >
                  Show Details
                </Button>
              </CardContent>
            </Card>
          </div>

          <h3 className="text-3xl font-bold text-purple-400 mb-8 text-center">Other Projects</h3>

          <div className="flex flex-wrap justify-center gap-8">
            {/* Drone Control System */}
            <Card className="hover:shadow-2xl hover:shadow-orange-500/30 transition-all duration-300 hover:-translate-y-2 bg-gray-900/80 border-orange-500/30 w-full max-w-md hover:animate-pulse hover:scale-105 animate-fade-in-up delay-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-orange-400">
                  Drone Control System
                  <Link href="https://github.com/Urthella" className="text-orange-400 hover:text-orange-300 transition-colors">
                    
                  </Link>
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Real-time drone control system with telemetry data, GPS tracking, and autonomous flight capabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 text-orange-300 border-orange-500/30">Python</Badge>
                  <Badge className="bg-gradient-to-r from-green-500/20 to-teal-500/20 text-green-300 border-green-500/30">ROS</Badge>
                  <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30">C++</Badge>
                </div>
                <Button
                  onClick={() => setSelectedProject('drone')}
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0 rounded-xl"
                >
                  Show Details
                </Button>
              </CardContent>
            </Card>

            {/* CI/CD Pipeline */}
            <Card className="hover:shadow-2xl hover:shadow-red-500/30 transition-all duration-300 hover:-translate-y-2 bg-gray-900/80 border-red-500/30 w-full max-w-md hover:animate-pulse hover:scale-105 animate-fade-in-up delay-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-red-400">
                  CI/CD Pipeline
                  <Link href="https://github.com/Urthella" className="text-red-400 hover:text-red-300 transition-colors">
                    
                  </Link>
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Automated CI/CD pipeline using GitHub Actions, Docker, and AWS for seamless software deployment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className="bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-300 border-red-500/30">GitHub Actions</Badge>
                  <Badge className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 text-orange-300 border-orange-500/30">Docker</Badge>
                  <Badge className="bg-gradient-to-r from-green-500/20 to-teal-500/20 text-green-300 border-green-500/30">AWS</Badge>
                </div>
                <Button
                  onClick={() => setSelectedProject('cicd')}
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0 rounded-xl"
                >
                  Show Details
                </Button>
              </CardContent>
            </Card>

            {/* Custom Guitar Build */}
            <Card className="hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 hover:-translate-y-2 bg-gray-900/80 border-blue-500/30 w-full max-w-md hover:animate-pulse hover:scale-105 animate-fade-in-up delay-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-blue-400">
                  Custom Guitar Build
                  <Link href="https://github.com/Urthella" className="text-blue-400 hover:text-blue-300 transition-colors">
                    
                  </Link>
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Handcrafted custom guitar with unique design, premium components, and exceptional playability
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-500/30">Woodworking</Badge>
                  <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30">Electronics</Badge>
                  <Badge className="bg-gradient-to-r from-green-500/20 to-teal-500/20 text-green-300 border-green-500/30">Guitar Setup</Badge>
                </div>
                <Button
                  onClick={() => setSelectedProject('guitar')}
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0 rounded-xl"
                >
                  Show Details
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Hobbies Section */}
      <section id="hobbies" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-gray-900/50 relative z-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
              {t.hobbies.title}
            </h2>
            <p className="text-xl text-gray-300">{t.hobbies.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Music & Guitar */}
            <Card className="bg-gray-900/80 border-cyan-500/30 shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-300 hover:animate-pulse hover:scale-105 animate-fade-in-up delay-300">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Guitar className="w-8 h-8 text-cyan-400" />
                  <CardTitle className="text-cyan-400">{t.hobbies.musicGuitar}</CardTitle>
                </div>
                <CardDescription className="text-gray-300 mt-2">{t.hobbies.musicDescription}</CardDescription>
              </CardHeader>
              <CardContent>
                
              </CardContent>
            </Card>

            {/* Fitness & Sports */}
            <Card className="bg-gray-900/80 border-purple-500/30 shadow-xl shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300 hover:animate-pulse hover:scale-105 animate-fade-in-up delay-300">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Dumbbell className="w-8 h-8 text-purple-400" />
                  <CardTitle className="text-purple-400">{t.hobbies.fitnessSports}</CardTitle>
                </div>
                <CardDescription className="text-gray-300 mt-2">{t.hobbies.fitnessDescription}</CardDescription>
              </CardHeader>
              <CardContent>
                
              </CardContent>
            </Card>

            {/* Reading & RPG Gaming */}
            <Card className="bg-gray-900/80 border-green-500/30 shadow-xl shadow-green-500/20 hover:shadow-green-500/40 transition-all duration-300 hover:animate-pulse hover:scale-105 animate-fade-in-up delay-300">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Gamepad2 className="w-8 h-8 text-green-400" />
                  <CardTitle className="text-green-400">{t.hobbies.readingRpg}</CardTitle>
                </div>
                <CardDescription className="text-gray-300 mt-2">{t.hobbies.readingDescription}</CardDescription>
              </CardHeader>
              <CardContent>
                
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Game Music Section */}
      <section id="gamemusic" className="py-20 px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6">
              {t.gamemusic.title}
            </h2>
            <p className="text-xl text-gray-300">{t.gamemusic.subtitle}</p>
            <p className="text-lg text-gray-400 mt-4 max-w-3xl mx-auto">{t.gamemusic.description}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 justify-center">
            {/* Music Track 1 */}
            <Card className="bg-gray-900/80 border-cyan-500/30 shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-300 hover:animate-pulse hover:scale-105 animate-fade-in-up">
              <CardHeader>
                <CardTitle className="text-cyan-400 flex items-center space-x-2">
                  <span className="text-2xl">🌲</span>
                  <span>Whisper of the Ent's</span>
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Mystical forest music I made. An enchanting melody that guides players through ancient woodlands filled with hidden treasures and deceptive mimics.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <audio controls className="w-full mb-4">
                  <source src="app/Whisper of the Ent's.m4a" type="audio/mp4" />
                  Your browser does not support the audio element.
                </audio>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-gradient-to-r from-green-500/20 to-teal-500/20 text-green-300 border-green-500/30">Fantasy</Badge>
                  <Badge className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border-cyan-500/30">Puzzle</Badge>
                  <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30">Mystical</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Music Track 2 */}
            <Card className="bg-gray-900/80 border-red-500/30 shadow-xl shadow-red-500/20 hover:shadow-red-500/40 transition-all duration-300 hover:animate-pulse hover:scale-105 animate-fade-in-up">
              <CardHeader>
                <CardTitle className="text-red-400 flex items-center space-x-2">
                  <span className="text-2xl">🏚️</span>
                  <span>Haunted House</span>
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Eerie atmospheric music I made. Dark and suspenseful tones create tension as players search for treasure chests that may not be what they seem.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <audio controls className="w-full mb-4">
                  <source src="app/Haunted House.m4a" type="audio/mp4" />
                  Your browser does not support the audio element.
                </audio>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-300 border-red-500/30">Horror</Badge>
                  <Badge className="bg-gradient-to-r from-gray-500/20 to-black/20 text-gray-300 border-gray-500/30">Dark</Badge>
                  <Badge className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-300 border-purple-500/30">Puzzle</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6">
              {t.services.title}
            </h2>
            <p className="text-xl text-gray-300">{t.services.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Guitar Lessons */}
            <Card className="bg-gray-900/80 border-cyan-500/30 shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-300 hover:animate-pulse hover:scale-105 animate-fade-in-up delay-400">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Guitar className="w-8 h-8 text-cyan-400" />
                  <CardTitle className="text-cyan-400">{t.services.guitarLessons}</CardTitle>
                </div>
                <CardDescription className="text-gray-300 mt-2">{t.services.guitarDescription}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: "smooth" })}
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0 rounded-xl"
                >
                  {t.services.contactForDetails}
                </Button>
              </CardContent>
            </Card>

            {/* Fitness Coaching */}
            <Card className="bg-gray-900/80 border-purple-500/30 shadow-xl shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300 hover:animate-pulse hover:scale-105 animate-fade-in-up delay-400">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Dumbbell className="w-8 h-8 text-purple-400" />
                  <CardTitle className="text-purple-400">{t.services.fitnessCoaching}</CardTitle>
                </div>
                <CardDescription className="text-gray-300 mt-2">{t.services.fitnessCoachingDescription}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: "smooth" })}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-xl"
                >
                  {t.services.contactForDetails}
                </Button>
              </CardContent>
            </Card>

            {/* Nutrition Coaching */}
            <Card className="bg-gray-900/80 border-green-500/30 shadow-xl shadow-green-500/20 hover:shadow-green-500/40 transition-all duration-300 hover:animate-pulse hover:scale-105 animate-fade-in-up delay-400">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Apple className="w-8 h-8 text-green-400" />
                  <CardTitle className="text-green-400">{t.services.nutritionCoaching}</CardTitle>
                </div>
                <CardDescription className="text-gray-300 mt-2">{t.services.nutritionDescription}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: "smooth" })}
                  className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white border-0 rounded-xl"
                >
                  {t.services.contactForDetails}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900/50 to-black relative z-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
              {t.contact.title}
            </h2>
            <p className="text-xl text-gray-300">{t.contact.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h3 className="text-3xl font-bold text-cyan-400 mb-8">{t.contact.contactInformation}</h3>
              <div className="space-y-6">
                <div className="flex items-center space-x-4 text-gray-300">
                  <Mail className="w-6 h-6 text-cyan-400" />
                  <a href="mailto:utkudemirtas0@gmail.com" className="hover:text-cyan-400 transition-colors">utkudemirtas0@gmail.com</a>
                </div>
                <div className="flex items-center space-x-4 text-gray-300">
                  <Phone className="w-6 h-6 text-purple-400" />
                  <span>+905070451623</span>
                </div>
                <div className="space-y-3">
                  <h4 className="text-xl font-semibold text-purple-400">{t.contact.socialMedia}</h4>
                  <div className="flex space-x-4">
                    <Link href="https://www.linkedin.com/in/utkudemirtas/" className="text-gray-300 hover:text-cyan-400 transition-colors">
                      <Linkedin className="w-6 h-6" />
                    </Link>
                    <Link href="https://www.instagram.com/urthella_/" className="text-gray-300 hover:text-purple-400 transition-colors">
                      <Instagram className="w-6 h-6" />
                    </Link>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-xl font-semibold text-orange-400">{t.contact.codeRepository}</h4>
                  <Link href="https://github.com/Urthella" className="flex items-center space-x-2 text-gray-300 hover:text-orange-400 transition-colors">
                    <Github className="w-6 h-6" />
                    <span>GitHub</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-cyan-500/30 shadow-cyan-500/20">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6">
                {t.contact.sendMessage} 🚀
              </h3>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-gray-300 text-sm font-medium mb-2">{t.contact.name}</label>
                  <input
                    type="text"
                    id="name"
                    className="shadow-sm bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                    placeholder={t.contact.name}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-300 text-sm font-medium mb-2">{t.contact.email}</label>
                  <input
                    type="email"
                    id="email"
                    className="shadow-sm bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
                    placeholder={t.contact.email}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-gray-300 text-sm font-medium mb-2">{t.contact.message}</label>
                  <textarea
                    id="message"
                    rows={4}
                    className="shadow-sm bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                    placeholder={t.contact.message}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-full px-5 py-3 text-sm font-medium">
                  {t.contact.send}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900/95 border border-cyan-500/30 rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-cyan-500/20">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                {selectedProject === 'extramus' && 'Extramus HR System'}
                {selectedProject === 'springboot' && 'Spring Boot Backend'}
                {selectedProject === 'portfolio' && 'Portfolio Website'}
                {selectedProject === 'drone' && 'Drone Control System'}
                {selectedProject === 'cicd' && 'CI/CD Pipeline'}
                {selectedProject === 'guitar' && 'Custom Guitar Build'}
              </h3>
              <Button
                onClick={() => setSelectedProject(null)}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-full w-10 h-10 p-0"
              >
                ✕
              </Button>
            </div>
            
            {/* Project Details Content */}
            <div className="space-y-6">
              {selectedProject === 'extramus' && (
                <>
                  <div>
                    <h4 className="text-xl font-semibold text-cyan-400 mb-3">Project Overview</h4>
                    <p className="text-gray-300 leading-relaxed">
                      A comprehensive HR management system featuring document management, secure file uploads, user authentication, and role-based access control. Built with modern web technologies and containerized for scalable deployment.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-purple-400 mb-3">Technologies Used</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border-blue-500/30">JavaScript</Badge>
                      <Badge className="bg-gradient-to-r from-green-500/20 to-blue-500/20 text-green-300 border-green-500/30">TypeScript</Badge>
                      <Badge className="bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300 border-orange-500/30">Docker</Badge>
                      <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30">Node.js</Badge>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-green-400 mb-3">Key Features</h4>
                    <ul className="text-gray-300 space-y-2">
                      <li>• Secure document management with file upload/download</li>
                      <li>• Role-based access control and user authentication</li>
                      <li>• RESTful API design with comprehensive error handling</li>
                      <li>• Containerized deployment with Docker</li>
                      <li>• Responsive web interface with modern UI/UX</li>
                    </ul>
                  </div>
                </>
              )}
              
              {selectedProject === 'springboot' && (
                <>
                  <div>
                    <h4 className="text-xl font-semibold text-cyan-400 mb-3">Project Overview</h4>
                    <p className="text-gray-300 leading-relaxed">
                      A secure backend module developed using Spring Boot, Java, MongoDB, and Kafka for scalable applications. Focuses on providing robust and efficient data management and processing capabilities.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-purple-400 mb-3">Technologies Used</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30">Spring Boot</Badge>
                      <Badge className="bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300 border-orange-500/30">Java</Badge>
                      <Badge className="bg-gradient-to-r from-green-500/20 to-teal-500/20 text-green-300 border-green-500/30">MongoDB</Badge>
                      <Badge className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-500/30">Kafka</Badge>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-green-400 mb-3">Key Features</h4>
                    <ul className="text-gray-300 space-y-2">
                      <li>• Secure user authentication and authorization</li>
                      <li>• RESTful API endpoints for data access</li>
                      <li>• Asynchronous message processing with Kafka</li>
                      <li>• Scalable architecture for high availability</li>
                      <li>• Comprehensive logging and monitoring</li>
                    </ul>
                  </div>
                </>
              )}

              {selectedProject === 'portfolio' && (
                <>
                  <div>
                    <h4 className="text-xl font-semibold text-cyan-400 mb-3">Project Overview</h4>
                    <p className="text-gray-300 leading-relaxed">
                      A modern, responsive portfolio website showcasing my skills, projects, and experiences. Features dark mode with neon aesthetics, smooth animations, multilingual support, and interactive elements including animated fireflies and lightsaber effects.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-purple-400 mb-3">Technologies Used</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border-cyan-500/30">Next.js</Badge>
                      <Badge className="bg-gradient-to-r from-green-500/20 to-teal-500/20 text-green-300 border-green-500/30">TypeScript</Badge>
                      <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30">Tailwind CSS</Badge>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-green-400 mb-3">Key Features</h4>
                    <ul className="text-gray-300 space-y-2">
                      <li>• Responsive design optimized for all devices</li>
                      <li>• Dark mode with neon aesthetic and animated fireflies</li>
                      <li>• Multilingual support (English/Turkish)</li>
                      <li>• Smooth scrolling navigation and animations</li>
                      <li>• Interactive contact form with email integration</li>
                    </ul>
                  </div>
                </>
              )}

              {selectedProject === 'drone' && (
                <>
                  <div>
                    <h4 className="text-xl font-semibold text-cyan-400 mb-3">Project Overview</h4>
                    <p className="text-gray-300 leading-relaxed">
                      A real-time drone control system with telemetry data, GPS tracking, and autonomous flight capabilities. Designed for remote monitoring and control of unmanned aerial vehicles.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-purple-400 mb-3">Technologies Used</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 text-orange-300 border-orange-500/30">Python</Badge>
                      <Badge className="bg-gradient-to-r from-green-500/20 to-teal-500/20 text-green-300 border-green-500/30">ROS</Badge>
                      <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30">C++</Badge>
                      <Badge className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-500/30">GPS</Badge>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-green-400 mb-3">Key Features</h4>
                    <ul className="text-gray-300 space-y-2">
                      <li>• Real-time telemetry data visualization</li>
                      <li>• GPS tracking and waypoint navigation</li>
                      <li>• Autonomous flight mode with obstacle avoidance</li>
                      <li>• Remote control via web interface</li>
                      <li>• Secure communication protocol</li>
                    </ul>
                  </div>
                </>
              )}

              {selectedProject === 'cicd' && (
                <>
                  <div>
                    <h4 className="text-xl font-semibold text-cyan-400 mb-3">Project Overview</h4>
                    <p className="text-gray-300 leading-relaxed">
                      An automated CI/CD pipeline using GitHub Actions, Docker, and AWS for seamless software deployment. Streamlines the development process and ensures consistent and reliable deployments.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-purple-400 mb-3">Technologies Used</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-300 border-red-500/30">GitHub Actions</Badge>
                      <Badge className="bg-gradient-to-r from-orange-500/20 to-yellow-500/20 text-orange-300 border-orange-500/30">Docker</Badge>
                      <Badge className="bg-gradient-to-r from-green-500/20 to-teal-500/20 text-green-300 border-green-500/30">AWS</Badge>
                      <Badge className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-500/30">CI/CD</Badge>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-green-400 mb-3">Key Features</h4>
                    <ul className="text-gray-300 space-y-2">
                      <li>• Automated build and test process</li>
                      <li>• Containerized deployment with Docker</li>
                      <li>• Continuous integration and continuous delivery</li>
                      <li>• Infrastructure as code with AWS CloudFormation</li>
                      <li>• Real-time monitoring and alerting</li>
                    </ul>
                  </div>
                </>
              )}

              {selectedProject === 'guitar' && (
                <>
                  <div>
                    <h4 className="text-xl font-semibold text-cyan-400 mb-3">Project Overview</h4>
                    <p className="text-gray-300 leading-relaxed">
                      A handcrafted custom partscaster guitar with unique design, premium components, and exceptional playability. Combines woodworking skills with electronics and guitar setup expertise.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-purple-400 mb-3">Technologies Used</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-500/30">Woodworking</Badge>
                      <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30">Electronics</Badge>
                      <Badge className="bg-gradient-to-r from-green-500/20 to-teal-500/20 text-green-300 border-green-500/30">Guitar Setup</Badge>
                      <Badge className="bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300 border-orange-500/30">Handcrafted</Badge>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-green-400 mb-3">Key Features</h4>
                    <ul className="text-gray-300 space-y-2">
                      <li>• Unique guitar body design</li>
                      <li>• Premium hardware and pickups</li>
                      <li>• Exceptional playability and tone</li>
                      <li>• Custom wiring and electronics</li>
                      <li>• Professional guitar setup</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gray-900 to-black text-white relative z-20">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400">
            © 2025 Utku Demirtaş. All rights reserved. Made with ❤️ and lots of{' '}
            <button
              onClick={() => window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank')}
              className="hover:text-yellow-400 transition-colors cursor-pointer"
            >
              ☕
            </button>
          </p>
        </div>
      </footer>
    </div>
  )
}
