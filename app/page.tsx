"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Github, Mail, Phone, Linkedin, ExternalLink, Guitar, Dumbbell, Apple, Instagram, Code, Database, Server, Cloud, Shield, Cpu, Terminal, Zap, Gamepad2 } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import emailjs from '@emailjs/browser'
import { ClientOnly } from '@/components/ClientOnly'
import { useScrollAnimation, useStaggeredAnimation } from '@/hooks/useScrollAnimation'

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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  // Scroll animations
  // Scroll animation hooks
  const { elementRef: aboutRef, isVisible: aboutVisible } = useScrollAnimation({ triggerOnce: true, threshold: 0.2 })
  const { elementRef: skillsRef, isVisible: skillsVisible } = useScrollAnimation({ triggerOnce: true, threshold: 0.2 })
  const { elementRef: projectsRef, isVisible: projectsVisible } = useScrollAnimation({ triggerOnce: true, threshold: 0.2 })
  const { elementRef: hobbiesRef, isVisible: hobbiesVisible } = useScrollAnimation({ triggerOnce: true, threshold: 0.2 })
  const { elementRef: articlesRef, isVisible: articlesVisible } = useScrollAnimation({ triggerOnce: true, threshold: 0.2 })
  const { elementRef: gamemusicRef, isVisible: gamemusicVisible } = useScrollAnimation({ triggerOnce: true, threshold: 0.2 })
  const { elementRef: contactRef, isVisible: contactVisible } = useScrollAnimation({ triggerOnce: true, threshold: 0.2 })
  const { containerRef: skillsContainerRef, visibleItems: visibleSkillItems } = useStaggeredAnimation(6, 120, true)

  const translations = {
    en: {
      nav: {
        home: 'Home',
        about: 'About',
        experience: 'Experience',
        skills: 'Skills',
        certifications: 'Certifications',
        projects: 'Projects',
        hobbies: 'Hobbies',
        articles: 'Articles',
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
        description1: "Highly motivated and detail-oriented computer engineering student with hands-on experience in backend and DevOps development, particularly within HR management systems. Proficient in building Spring Boot applications and developing secure backend modules using Java, MongoDB, and Kafka.",
        description2: "During my role at Extramus, I worked on document management features, implemented CI/CD pipelines, and contributed to containerized deployments using Docker. I am adept at solving complex software issues and collaborating with cross-functional, international teams.",
        description3: "Passionate about scalable system design, cloud-based architectures, and continuously improving my technical skill set. Seeking to apply my knowledge in AI development and infrastructure in a dynamic, innovation-driven environment. Also a dedicated musician, athlete, and RPG game enthusiast.",
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
        messageQueues: 'Message Queues & Others',
        certifications: 'Certifications & Training',
        certificationsSubtitle: 'Professional certifications and completed courses 📜'
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
        musicDescription: '🎵 8+ years in music! 🎸 Electric • Classical • Acoustic guitar 🥁 Bass guitar • Drums. Playing guitar allows me to express creativity in a different medium than code. From classical blues to modern metal, I find that the discipline required for music complements my technical studies perfectly.',
        fitnessSports: 'Fitness & Sports',
        fitnessDescription: 'Physical fitness is crucial for mental clarity and productivity! 💪 As a calisthenics athlete and provincial basketball champion, I believe in the connection between physical and mental well-being. Regular workouts help me maintain focus during long coding sessions and provide a healthy outlet for stress.',
        readingRpg: 'Reading & RPG Gaming',
        readingDescription: 'Books and RPG games are my gateway to infinite worlds! 📖 I\'m passionate about fantasy and science fiction literature, philosophy, and immersive RPG experiences. These interests fuel my creativity, expand my perspective, and enhance my analytical thinking and problem-solving skills in programming.',
        collectingTrading: 'Collecting & Trading',
        collectingDescription: 'I enjoy discovering and collecting high-quality pens and other timeless tools. Through local trading, I engage with a growing community of enthusiasts in Türkiye and explore the heritage of writing instruments.'
      },
      gamemusic: {
        title: 'Game Musics I Designed',
        subtitle: 'Original compositions and soundtracks for gaming experiences 🎵',
        description: 'Here are some of the game music tracks I\'ve composed and designed. Each piece is crafted to enhance the gaming experience and create immersive atmospheres.',
        playlistTitle: 'My Playlist',
        playlistDescription: 'Discover my musical taste through my personal playlist'
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
      articles: {
        title: 'Medium Articles',
        subtitle: 'Articles I wrote on cybersecurity and technology',
        socialEngineering: {
          title: 'The Part Where The Fun Begins: Social Engineering',
          description: 'A detailed article examining how social engineering attacks work and how we can protect ourselves against these threats.'
        },
        sqlInjection: {
          title: 'SQL Injection: The Vulnerability That Never Goes Away',
          description: 'A comprehensive analysis of SQL injection vulnerabilities, attack methods, and protection techniques.'
        },
        osiModel: {
          title: 'Understanding the OSI Model',
          description: 'A detailed explanation in Turkish about the layers and functioning of the OSI Model that forms the foundation of network communication.'
        },
        vpn: {
          title: 'VPN: The Secure Gateway of the Digital World',
          description: 'A comprehensive guide on how VPN technology works, security advantages, and choosing the right VPN.'
        },
        readArticle: 'Read Article',
        comingSoon: 'Coming Soon...',
        musicTheory: 'The Impact of Music Theory on Coding',
        musicTheoryDesc: 'Similarities between harmonic structures and programming paradigms',
        followMedium: 'You can follow my Medium profile for more articles!',
        mediumProfile: 'My Medium Profile'
      },
      experience: {
        title: 'Experience',
        subtitle: 'My professional journey so far 🚀',
        extramus: {
          role: 'Backend & DevOps Developer',
          company: 'Extramus Organization',
          date: '2025 Jul - 2025 Sep',
          items: [
            'Developed HR management system with document management',
            'Implemented secure file uploads and role-based access control',
            'Built CI/CD pipelines with GitHub Actions',
            'Containerized deployments using Docker'
          ]
        },
        telenity: {
          role: 'Software Engineering Intern',
          company: 'Telenity',
          date: '2024 Jun - 2024 Aug',
          items: [
            'Developed Spring Boot applications in R&D department',
            'Built secure backend modules with Java, MongoDB, Kafka',
            'Focused on bug fixing and performance optimization',
            'Collaborated effectively with cross-functional teams'
          ]
        },
        anticverseTech: {
          role: 'Engineering Lead',
          company: 'Anticverse Tech',
          date: '2023 Apr - 2023 Nov',
          items: [
            'Promoted from RedPill Cybersecurity Division',
            'Supported strategic planning and inter-division communication',
            'Aligned technical operations with organizational goals',
            'Led cross-functional coordination efforts'
          ]
        },
        redpill: {
          role: 'Board Member & Student Engineer',
          company: 'Anticverse RedPill',
          date: '2022 Dec - 2023 Oct',
          items: [
            'Cybersecurity studies and reverse engineering',
            'Malware analysis and web vulnerability research',
            'Organized 1st Anticverse Congress for 250+ students',
            'Quality training development for members'
          ]
        },
        teknofest: {
          role: 'Team Leader & Design Engineer',
          company: 'Teknofest - Ouroboros Team',
          date: '2021 Dec - 2022 May',
          items: [
            'Led drone design and development team',
            'Applied drone technology and innovation',
            'Managed team coordination and problem-solving',
            'Successfully deployed advanced drone systems'
          ]
        },
        education: {
          role: 'Computer Science',
          company: 'Konya Food and Agriculture University',
          date: '2022 - 2026',
          items: [
            "Bachelor's Degree in Computer Science",
            'Focus on technology and innovation',
            'Hands-on projects and interdisciplinary learning'
          ]
        }
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
        send: 'Send',
        success: '✅ Message sent successfully! I will get back to you as soon as possible.',
        error: '❌ An error occurred while sending the message. Please try again later or contact me directly via email.',
        sending: 'Sending...',
        articles: 'Articles'
      }
    },
    tr: {
      nav: {
        home: 'Ana Sayfa',
        about: 'Hakkımda',
        skills: 'Yetenekler',
        certifications: 'Sertifikalar',
        projects: 'Projeler',
        hobbies: 'Hobiler',
        articles: 'Makaleler',
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
        description1: "Özellikle İK yönetim sistemleri dahilinde backend ve DevOps geliştirme konusunda uygulamalı deneyime sahip, yüksek motivasyonlu ve detay odaklı bilgisayar mühendisliği öğrencisi. Spring Boot uygulamaları oluşturma ve Java, MongoDB ve Kafka kullanarak güvenli backend modülleri geliştirme konusunda yetkin.",
        description2: "Extramus'taki görevim sırasında doküman yönetimi özellikleri üzerinde çalıştım, CI/CD süreçlerini uyguladım ve Docker kullanarak konteyner tabanlı dağıtımlara katkıda bulundum. Karmaşık yazılım sorunlarını çözme ve uluslararası, çok işlevli ekiplerle işbirliği yapma konusunda yetenekliyim.",
        description3: "Ölçeklenebilir sistem tasarımı, bulut tabanlı mimariler ve teknik becerilerimi sürekli geliştirme konusunda tutkulu. Dinamik, inovasyon odaklı bir ortamda yapay zeka geliştirme ve altyapı konusundaki bilgilerimi uygulamayı hedefliyorum. Ayrıca kendini adamış bir müzisyen, sporcu ve RPG oyun tutkunu.",
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
        messageQueues: 'Mesaj Kuyrukları ve Diğerleri',
        certifications: 'Sertifikalar ve Eğitimler',
        certificationsSubtitle: 'Profesyonel sertifikalar ve tamamlanan kurslar 📜'
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
        musicDescription: '🎵 8+ yıldır müziğin içinde! 🎸 Elektro • Klasik • Akustik gitar 🥁 Bas gitar • Bateri. Gitar çalmak, yaratıcılığımı koddan farklı bir ortamda ifade etmeme olanak sağlıyor. Klasik bluesdan modern metale kadar, müzik için gereken disiplinin teknik çalışmalarımı mükemmel bir şekilde tamamladığını görüyorum.',
        fitnessSports: 'Fitness ve Spor',
        fitnessDescription: 'Fiziksel fitness, zihinsel berraklık ve verimlilik için çok önemli! 💪 Kalistenik sporcu ve il basketbol şampiyonu olarak, fiziksel ve zihinsel refah arasındaki bağlantıya inanıyorum. Düzenli antrenmanlar, uzun kodlama seansları sırasında odaklanmamı sağlıyor ve stres için sağlıklı bir çıkış noktası sunuyor.',
        readingRpg: 'Okuma ve RPG Oyunları',
        readingDescription: 'Kitaplar ve RPG oyunları sonsuz dünyalara açılan kapım! 📖 Fantastik ve bilim kurgu edebiyatı, felsefe ve sürükleyici RPG deneyimleri konusunda tutkuluyum. Bu ilgi alanları yaratıcılığımı besliyor, perspektifimi genişletiyor ve programlamadaki analitik düşünme ve problem çözme becerilerimi geliştiriyor.',
        collectingTrading: 'Koleksiyonculuk ve Takas',
        collectingDescription: 'Kaliteli kalemler ve zamansız araçları keşfetmekten ve toplamaktan keyif alıyorum. Yerel takaslar sayesinde Türkiye’de büyüyen bir meraklı topluluğuyla etkileşim kuruyor ve yazı gereçlerinin mirasını keşfediyorum.'
      },
      gamemusic: {
        title: 'Tasarladığım Oyun Müzikleri',
        subtitle: 'Oyun deneyimleri için orijinal kompozisyonlar ve müzikler 🎵',
        description: 'Bestelediğim ve tasarladığım oyun müziği parçalarından bazıları. Her parça, oyun deneyimini geliştirmek ve sürükleyici atmosferler yaratmak için özenle hazırlanmıştır.',
        playlistTitle: 'Çalma Listem',
        playlistDescription: 'Kişisel çalma listem aracılığıyla müzik zevkimi keşfedin'
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
      articles: {
        title: 'Medium Makalelerim',
        subtitle: 'Siber güvenlik ve teknoloji üzerine yazdığım makaleler',
        socialEngineering: {
          title: 'The Part Where The Fun Begins: Social Engineering',
          description: 'Social engineering saldırılarının nasıl çalıştığını ve bu tehditlere karşı nasıl korunabileceğimizi incelediğim detaylı makale.'
        },
        sqlInjection: {
          title: 'SQL Injection: The Vulnerability That Never Goes Away',
          description: 'SQL Injection zafiyetlerinin teknik detayları, saldırı yöntemleri ve koruma teknikleri üzerine kapsamlı bir analiz.'
        },
        osiModel: {
          title: 'OSI Modelini Anlamak',
          description: 'Ağ iletişiminin temelini oluşturan OSI Model\'in katmanları ve işleyişi hakkında detaylı Türkçe açıklama.'
        },
        vpn: {
          title: 'VPN: Dijital Dünyanın Güvenli Kapısı',
          description: 'VPN teknolojisinin nasıl çalıştığı, güvenlik avantajları ve doğru VPN seçimi konularında kapsamlı rehber.'
        },
        readArticle: 'Makaleyi Oku',
        comingSoon: 'Yakında...',
        musicTheory: 'Müzik Teorisinin Kod Yazımına Etkisi',
        musicTheoryDesc: 'Harmonik yapılar ve programlama paradigmaları arasındaki benzerlikler',
        followMedium: 'Daha fazla makale için Medium profilimi takip edebilirsiniz!',
        mediumProfile: 'Medium Profilim'
      },
      experience: {
        title: 'Deneyim',
        subtitle: 'Profesyonel yolculuğum 🚀',
        extramus: {
          role: 'Backend & DevOps Geliştirici',
          company: 'Extramus Organization',
          date: '2024 Ağu - 2025 Şub',
          items: [
            'Doküman yönetimi özellikli İK yönetim sistemi geliştirdi',
            'Güvenli dosya yükleme ve rol tabanlı erişim kontrolü uyguladı',
            'GitHub Actions ile CI/CD süreçleri oluşturdu',
            'Docker kullanarak konteynerize dağıtımlar yaptı'
          ]
        },
        telenity: {
          role: 'Yazılım Mühendisliği Stajyeri',
          company: 'Telenity',
          date: '2024 Haz - 2024 Ağu',
          items: [
            'Ar-Ge departmanında Spring Boot uygulamaları geliştirdi',
            'Java, MongoDB, Kafka ile güvenli backend modülleri kurdu',
            'Hata düzeltme ve performans optimizasyonuna odaklandı',
            'Fonksiyonlar arası ekiplerle etkili işbirliği yaptı'
          ]
        },
        anticverseTech: {
          role: 'Mühendislik Lideri',
          company: 'Anticverse Tech',
          date: '2023 Nis - 2023 Kas',
          items: [
            'RedPill Siber Güvenlik Bölümü\'nden terfi etti',
            'Stratejik planlama ve bölümler arası iletişimi destekledi',
            'Teknik operasyonları kurumsal hedeflerle uyumlu hale getirdi',
            'Fonksiyonlar arası koordinasyon çalışmalarını yönetti'
          ]
        },
        redpill: {
          role: 'Yönetim Kurulu Üyesi & Öğrenci Mühendisi',
          company: 'Anticverse RedPill',
          date: '2022 Ara - 2023 Ekim',
          items: [
            'Siber güvenlik çalışmaları ve tersine mühendislik',
            'Zararlı yazılım analizi ve web zafiyet araştırmaları',
            '250+ öğrenci için 1. Anticverse Kongresi\'ni organize etti',
            'Üyeler için kaliteli eğitim geliştirme'
          ]
        },
        teknofest: {
          role: 'Takım Lideri & Tasarım Mühendisi',
          company: 'Teknofest - Ouroboros Takımı',
          date: '2021 Ara - 2022 May',
          items: [
            'Drone tasarım ve geliştirme ekibine liderlik etti',
            'Drone teknolojisi ve inovasyon uyguladı',
            'Takım koordinasyonu ve problem çözümü yönetimi',
            'İleri drone sistemlerini başarıyla konuşlandırdı'
          ]
        },
        education: {
          role: 'Bilgisayar Bilimleri',
          company: 'Konya Gıda ve Tarım Üniversitesi',
          date: '2022 - 2026',
          items: [
            'Bilgisayar Bilimleri Lisans Derecesi',
            'Teknoloji ve inovasyon odağı',
            'Uygulamalı projeler ve disiplinlerarası öğrenme'
          ]
        }
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
        send: 'Gönder',
        success: '✅ Mesajınız başarıyla gönderildi! Size en kısa sürede geri dönüş yapacağım.',
        error: '❌ Mesaj gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin veya doğrudan email adresimden iletişime geçin.',
        sending: 'Gönderiliyor...',
        articles: 'Makaleler'
      }
    }
  }

  const t = translations[language]

  // EmailJS configuration
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // EmailJS configuration
      // Fallback values handled for Vercel deployment stability
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || 'service_to6ga2c'
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || 'template_9ypkl6o'
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '1G13LwoQUrMXT7Igo'

      if (!serviceId || !templateId || !publicKey) {
        throw new Error('EmailJS configuration is missing.')
      }

      // Explicitly initialize with the public key (fixes some v4 issues)
      emailjs.init({ publicKey })

      console.log('🚀 Attempting to send email with keys:', {
        serviceId,
        templateId,
        publicKey,
        formData
      })

      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        message: formData.message,
        to_name: 'Utku Demirtaş'
      }

      await emailjs.send(serviceId, templateId, templateParams, publicKey)

      console.log('✅ Email sent successfully!')
      setSubmitStatus('success')
      setFormData({ name: '', email: '', message: '' })

      // Success message will be shown for 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000)

    } catch (error) {
      console.error('❌ Email sending failed:', error)
      setSubmitStatus('error')

      // Error message will be shown for 5 seconds
      setTimeout(() => setSubmitStatus('idle'), 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  useEffect(() => {
    const generateFireflies = () => {
      const newFireflies: Firefly[] = []

      // Deterministik pseudo-random fonksiyonu
      const seededRandom = (seed: number) => {
        const x = Math.sin(seed * 12.9898) * 43758.5453123
        return x - Math.floor(x)
      }

      for (let i = 0; i < 35; i++) {
        // Her firefly için farklı seed değerleri
        const xSeed = seededRandom(i * 1.234)
        const ySeed = seededRandom(i * 2.456)
        const sizeSeed = seededRandom(i * 3.789)
        const opacitySeed = seededRandom(i * 4.567)
        const speedSeed = seededRandom(i * 5.890)

        newFireflies.push({
          id: i,
          x: xSeed * (typeof window !== 'undefined' ? window.innerWidth : 1200),
          y: ySeed * (typeof window !== 'undefined' ? window.innerHeight : 800),
          size: sizeSeed * 6 + 3,
          opacity: opacitySeed * 0.5 + 0.4,
          speed: speedSeed * 2 + 1
        })
      }
      setFireflies(newFireflies)
    }

    generateFireflies()
    window.addEventListener('resize', generateFireflies)

    let animationTime = 0
    const animateFireflies = () => {
      animationTime += 50 // Her frame 50ms
      setFireflies(prev => prev.map(firefly => ({
        ...firefly,
        x: (firefly.x + firefly.speed) % window.innerWidth,
        y: firefly.y + Math.sin(animationTime * 0.001 + firefly.id) * 0.5,
        opacity: 0.3 + Math.sin(animationTime * 0.002 + firefly.id) * 0.3
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
      <ClientOnly fallback={<div />}>
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
              background: 'radial-gradient(circle, #00ffff 0%, #00aaff 30%, transparent 70%)',
              borderRadius: '50%',
              boxShadow: `0 0 ${firefly.size * 3}px #00ffff, 0 0 ${firefly.size * 1.5}px #00aaff`,
              animation: `pulse ${2 + (firefly.id * 0.1) % 2}s infinite alternate`
            }}
          />
        ))}
      </ClientOnly>

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/90 backdrop-blur-xl border-b border-cyan-500/30 z-50 shadow-lg shadow-cyan-500/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              UD
            </div>
            <div className="hidden md:flex space-x-8 items-center">
              {['home', 'about', 'experience', 'skills', 'certifications', 'projects', 'hobbies', 'articles', 'services', 'contact'].map((section) => (
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

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-3">
              <Button
                onClick={() => setLanguage(language === 'en' ? 'tr' : 'en')}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0 rounded-full px-3 py-2 text-sm font-medium"
              >
                {language === 'en' ? 'TR' : 'EN'}
              </Button>
              <button
                onClick={() => {
                  const nav = document.getElementById('mobile-nav')
                  nav?.classList.toggle('hidden')
                }}
                className="text-gray-300 hover:text-cyan-400 transition-colors p-2"
                aria-label="Toggle mobile menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          id="mobile-nav"
          className="hidden md:hidden bg-gray-900/95 backdrop-blur-sm border-t border-gray-800 px-4 py-6"
        >
          <div className="flex flex-col space-y-4">
            {['home', 'about', 'skills', 'projects', 'hobbies', 'articles', 'gamemusic', 'services', 'contact'].map((section) => (
              <a
                key={section}
                href={`#${section}`}
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById(section)?.scrollIntoView({ behavior: "smooth" })
                  document.getElementById('mobile-nav')?.classList.add('hidden')
                }}
                className="text-gray-300 hover:text-cyan-400 transition-colors font-medium cursor-pointer capitalize text-lg py-2 border-b border-gray-800 last:border-b-0"
              >
                {t.nav[section as keyof typeof t.nav]}
              </a>
            ))}
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
              {/* Profile Photo */}
              <div className="mb-8 flex justify-center">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition duration-500 animate-pulse"></div>
                  <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-gray-900 shadow-2xl">
                    <Image
                      src="/PP.jpg"
                      alt="Utku Demirtaş"
                      fill
                      className="object-cover hover:scale-110 transition-transform duration-500"
                      priority
                    />
                  </div>
                </div>
              </div>

              <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6 leading-tight hover:animate-pulse hover:scale-105 transition-all duration-300 cursor-default">
                {t.hero.title}
              </h1>
              <h2 className="text-2xl md:text-4xl text-gray-300 mb-6 font-semibold">{t.hero.subtitle}</h2>

              {/* CV Download Button */}
              <div className="mb-8">
                <Button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = '/Utku Demirtas CV.pdf';
                    link.download = 'Utku_Demirtas_CV.pdf';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/30"
                >
                  📄 Wanna download my CV?
                </Button>
              </div>

              <div className="bg-gray-900/80 backdrop-blur-sm rounded-3xl p-8 max-w-3xl mx-auto shadow-xl border border-cyan-500/30 shadow-cyan-500/20">
                <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                  {t.hero.description}
                </p>
                <div className="flex items-center justify-center space-x-6 text-gray-300 flex-wrap gap-4">
                  <div className="flex items-center space-x-3 bg-gray-900/50 px-4 py-2 rounded-full border border-cyan-500/30">
                    <span className="text-2xl">💻</span>
                    <span className="font-medium">{t.hero.computerEngineer}</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-gray-900/50 px-4 py-2 rounded-full border border-orange-500/30">
                    <Guitar className="w-6 h-6 text-orange-400" />
                    <span className="font-medium">{t.hero.guitarist}</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-gray-900/50 px-4 py-2 rounded-full border border-green-500/30">
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
      <section
        id="about"
        ref={aboutRef}
        className={`py-20 px-4 sm:px-6 lg:px-8 relative z-20 transition-all duration-700 ${aboutVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
      >
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
                <div className="bg-gray-900/50 p-6 rounded-2xl border border-cyan-500/20">
                  <h4 className="text-xl font-semibold text-cyan-400 mb-3">{t.about.currentFocus}</h4>
                  <p className="text-gray-300">{t.about.focusDescription}</p>
                </div>
                <div className="bg-gray-900/50 p-6 rounded-2xl border border-purple-500/20">
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

      {/* Experience Timeline Section */}
      <section id="experience" className="py-20 px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6">
              {t.experience.title}
            </h2>
            <p className="text-xl text-gray-300">
              {t.experience.subtitle}
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-cyan-500 via-purple-500 to-pink-500 rounded-full hidden md:block"></div>

            {/* Experience Items */}
            <div className="space-y-12">
              {/* Extramus Organization */}
              <div className="relative flex items-center justify-between">
                <div className="hidden md:block w-5/12"></div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-cyan-500 rounded-full border-4 border-gray-900 shadow-lg shadow-cyan-500/50 hidden md:block z-10"></div>
                <div className="w-full md:w-5/12 bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/30 shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-cyan-400 text-sm font-medium bg-cyan-500/10 px-3 py-1 rounded-full">
                      {t.experience.extramus.date}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-cyan-400 mb-2">{t.experience.extramus.role}</h3>
                  <p className="text-purple-300 font-medium mb-3">{t.experience.extramus.company}</p>
                  <ul className="text-gray-300 text-sm space-y-2">
                    {t.experience.extramus.items.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Badge className="bg-gray-800 text-cyan-200 border-cyan-500/30 text-xs">JavaScript</Badge>
                    <Badge className="bg-gray-800 text-green-200 border-green-500/30 text-xs">TypeScript</Badge>
                    <Badge className="bg-gray-800 text-orange-200 border-orange-500/30 text-xs">Docker</Badge>
                    <Badge className="bg-gray-800 text-purple-200 border-purple-500/30 text-xs">Node.js</Badge>
                  </div>
                </div>
              </div>

              {/* Telenity */}
              <div className="relative flex items-center justify-between flex-row-reverse">
                <div className="hidden md:block w-5/12"></div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-purple-500 rounded-full border-4 border-gray-900 shadow-lg shadow-purple-500/50 hidden md:block z-10"></div>
                <div className="w-full md:w-5/12 bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 shadow-xl shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-purple-400 text-sm font-medium bg-purple-500/10 px-3 py-1 rounded-full">
                      {t.experience.telenity.date}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-purple-400 mb-2">{t.experience.telenity.role}</h3>
                  <p className="text-cyan-300 font-medium mb-3">{t.experience.telenity.company}</p>
                  <ul className="text-gray-300 text-sm space-y-2">
                    {t.experience.telenity.items.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Badge className="bg-gray-800 text-purple-200 border-purple-500/30 text-xs">Spring Boot</Badge>
                    <Badge className="bg-gray-800 text-orange-200 border-orange-500/30 text-xs">Java</Badge>
                    <Badge className="bg-gray-800 text-green-200 border-green-500/30 text-xs">MongoDB</Badge>
                    <Badge className="bg-gray-800 text-blue-200 border-blue-500/30 text-xs">Kafka</Badge>
                  </div>
                </div>
              </div>

              {/* Anticverse Tech */}
              <div className="relative flex items-center justify-between">
                <div className="hidden md:block w-5/12"></div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-red-500 rounded-full border-4 border-gray-900 shadow-lg shadow-red-500/50 hidden md:block z-10"></div>
                <div className="w-full md:w-5/12 bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-red-500/30 shadow-xl shadow-red-500/20 hover:shadow-red-500/40 transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-red-400 text-sm font-medium bg-red-500/10 px-3 py-1 rounded-full">
                      {t.experience.anticverseTech.date}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-red-400 mb-2">{t.experience.anticverseTech.role}</h3>
                  <p className="text-cyan-300 font-medium mb-3">{t.experience.anticverseTech.company}</p>
                  <ul className="text-gray-300 text-sm space-y-2">
                    {t.experience.anticverseTech.items.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Badge className="bg-gray-800 text-red-200 border-red-500/30 text-xs">Leadership</Badge>
                    <Badge className="bg-gray-800 text-purple-200 border-purple-500/30 text-xs">Strategy</Badge>
                    <Badge className="bg-gray-800 text-cyan-200 border-cyan-500/30 text-xs">Management</Badge>
                  </div>
                </div>
              </div>

              {/* Anticverse RedPill */}
              <div className="relative flex items-center justify-between flex-row-reverse">
                <div className="hidden md:block w-5/12"></div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-pink-500 rounded-full border-4 border-gray-900 shadow-lg shadow-pink-500/50 hidden md:block z-10"></div>
                <div className="w-full md:w-5/12 bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-pink-500/30 shadow-xl shadow-pink-500/20 hover:shadow-pink-500/40 transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-pink-400 text-sm font-medium bg-pink-500/10 px-3 py-1 rounded-full">
                      {t.experience.redpill.date}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-pink-400 mb-2">{t.experience.redpill.role}</h3>
                  <p className="text-cyan-300 font-medium mb-3">{t.experience.redpill.company}</p>
                  <ul className="text-gray-300 text-sm space-y-2">
                    {t.experience.redpill.items.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Badge className="bg-gray-800 text-pink-200 border-pink-500/30 text-xs">Cybersecurity</Badge>
                    <Badge className="bg-gray-800 text-red-200 border-red-500/30 text-xs">Malware</Badge>
                    <Badge className="bg-gray-800 text-purple-200 border-purple-500/30 text-xs">Event Planning</Badge>
                  </div>
                </div>
              </div>

              {/* Teknofest */}
              <div className="relative flex items-center justify-between">
                <div className="hidden md:block w-5/12"></div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-orange-500 rounded-full border-4 border-gray-900 shadow-lg shadow-orange-500/50 hidden md:block z-10"></div>
                <div className="w-full md:w-5/12 bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-orange-500/30 shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-orange-400 text-sm font-medium bg-orange-500/10 px-3 py-1 rounded-full">
                      {t.experience.teknofest.date}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-orange-400 mb-2">{t.experience.teknofest.role}</h3>
                  <p className="text-cyan-300 font-medium mb-3">{t.experience.teknofest.company}</p>
                  <ul className="text-gray-300 text-sm space-y-2">
                    {t.experience.teknofest.items.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Badge className="bg-gray-800 text-orange-200 border-orange-500/30 text-xs">Drone Tech</Badge>
                    <Badge className="bg-gray-800 text-blue-200 border-blue-500/30 text-xs">Engineering</Badge>
                    <Badge className="bg-gray-800 text-green-200 border-green-500/30 text-xs">Leadership</Badge>
                  </div>
                </div>
              </div>

              {/* Education */}
              <div className="relative flex items-center justify-between flex-row-reverse">
                <div className="hidden md:block w-5/12"></div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-green-500 rounded-full border-4 border-gray-900 shadow-lg shadow-green-500/50 hidden md:block z-10"></div>
                <div className="w-full md:w-5/12 bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30 shadow-xl shadow-green-500/20 hover:shadow-green-500/40 transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-green-400 text-sm font-medium bg-green-500/10 px-3 py-1 rounded-full">
                      {t.experience.education.date}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-green-400 mb-2">{t.experience.education.role}</h3>
                  <p className="text-cyan-300 font-medium mb-3">{t.experience.education.company}</p>
                  <ul className="text-gray-300 text-sm space-y-2">
                    {t.experience.education.items.map((item, i) => (
                      <li key={i}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Technical Skills Section */}
      <section
        id="skills"
        ref={skillsRef}
        className={`py-20 px-4 sm:px-6 lg:px-8 relative z-20 transition-all duration-700 ${skillsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6">
              {t.skills.title}
            </h2>
            <p className="text-xl text-gray-300">{t.skills.subtitle}</p>
          </div>

          <div
            ref={skillsContainerRef as React.RefObject<HTMLDivElement>}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {/* Programming Languages */}
            <Card className={`bg-gray-900/80 border-cyan-500/30 shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-700 hover:animate-pulse hover:scale-105 ${visibleSkillItems.includes(0) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Code className="w-8 h-8 text-cyan-400" />
                  <CardTitle className="text-cyan-400">{t.skills.programmingLanguages}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {['Java', 'Python', 'JavaScript', 'TypeScript', 'C#'].map((skill) => (
                    <Badge key={skill} className="bg-gradient-to-r from-gray-800 to-gray-700 text-cyan-200 border-gray-600 hover:border-cyan-500/50 transition-colors">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Backend & Frameworks */}
            <Card className={`bg-gray-900/80 border-purple-500/30 shadow-xl shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-700 hover:animate-pulse hover:scale-105 ${visibleSkillItems.includes(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Server className="w-8 h-8 text-purple-400" />
                  <CardTitle className="text-purple-400">{t.skills.backendFrameworks}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {['Spring Boot', 'Spring', 'Node.js', 'Express.js', 'Kafka', 'REST APIs'].map((skill) => (
                    <Badge key={skill} className="bg-gradient-to-r from-gray-800 to-gray-700 text-purple-200 border-gray-600 hover:border-purple-500/50 transition-colors">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Databases */}
            <Card className={`bg-gray-900/80 border-green-500/30 shadow-xl shadow-green-500/20 hover:shadow-green-500/40 transition-all duration-700 hover:animate-pulse hover:scale-105 ${visibleSkillItems.includes(2) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Database className="w-8 h-8 text-green-400" />
                  <CardTitle className="text-green-400">{t.skills.databases}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {['MongoDB', 'SQL', 'PostgreSQL', 'Redis'].map((skill) => (
                    <Badge key={skill} className="bg-gradient-to-r from-gray-800 to-gray-700 text-green-200 border-gray-600 hover:border-green-500/50 transition-colors">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* DevOps & Cloud */}
            <Card className={`bg-gray-900/80 border-orange-500/30 shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 transition-all duration-700 hover:animate-pulse hover:scale-105 ${visibleSkillItems.includes(3) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Cloud className="w-8 h-8 text-orange-400" />
                  <CardTitle className="text-orange-400">{t.skills.devopsCloud}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {['Docker', 'CI/CD', 'GitHub Actions', 'Linux', 'AWS', 'IT Operations'].map((skill) => (
                    <Badge key={skill} className="bg-gradient-to-r from-gray-800 to-gray-700 text-orange-200 border-gray-600 hover:border-orange-500/50 transition-colors">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Security & Tools */}
            <Card className={`bg-gray-900/80 border-red-500/30 shadow-xl shadow-red-500/20 hover:shadow-red-500/40 transition-all duration-700 hover:animate-pulse hover:scale-105 ${visibleSkillItems.includes(4) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Shield className="w-8 h-8 text-red-400" />
                  <CardTitle className="text-red-400">{t.skills.securityTools}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {['OWASP', 'Wireshark', 'Burp Suite', 'Metasploit', 'Social Engineering', 'Ethical Hacking', 'Penetration Testing'].map((skill) => (
                    <Badge key={skill} className="bg-gradient-to-r from-gray-800 to-gray-700 text-red-200 border-gray-600 hover:border-red-500/50 transition-colors">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Other Technologies */}
            <Card className={`bg-gray-900/80 border-indigo-500/30 shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all duration-700 hover:animate-pulse hover:scale-105 ${visibleSkillItems.includes(5) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Cpu className="w-8 h-8 text-indigo-400" />
                  <CardTitle className="text-indigo-400">{t.skills.messageQueues}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {['React', 'Vue.js', 'Tailwind CSS', 'Management', 'Leadership', 'Teamwork', 'Communication'].map((skill) => (
                    <Badge key={skill} className="bg-gradient-to-r from-gray-800 to-gray-700 text-indigo-200 border-gray-600 hover:border-indigo-500/50 transition-colors">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section id="certifications" className="py-20 px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6">
              {t.skills.certifications}
            </h2>
            <p className="text-xl text-gray-300">{t.skills.certificationsSubtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Introduction to Cyber Security', issuer: 'Turkcell Writers of the Future', color: 'cyan' },
              { name: 'Social Engineering and Phishing', issuer: 'BTK Academy', color: 'purple' },
              { name: 'Advanced Python Programming', issuer: 'BTK Academy', color: 'green' },
              { name: 'C#', issuer: 'BTK Academy', color: 'blue' },
              { name: 'Ethical Hacking Course', issuer: 'Udemy', color: 'red' },
              { name: 'Ethical Hacking - Level 2: Network Attacks', issuer: 'Udemy', color: 'red' },
              { name: 'Presonus Studio One - Mixing and Mastering', issuer: 'Udemy', color: 'pink' },
              { name: 'DoS / DDOS Attacks and Protecting', issuer: 'BTK Academy', color: 'orange' },
              { name: 'Introduction to Penetration Testing', issuer: 'BTK Academy', color: 'red' }
            ].map((cert, index) => (
              <div key={index} className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 p-6 rounded-xl hover:border-cyan-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-cyan-500/10 group">
                <div className={`w-12 h-12 rounded-full bg-${cert.color}-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <span className="text-2xl">📜</span>
                </div>
                <h3 className="text-lg font-bold text-gray-200 mb-2 group-hover:text-cyan-400 transition-colors">{cert.name}</h3>
                <p className="text-sm text-gray-400">{cert.issuer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section
        id="projects"
        ref={projectsRef}
        className={`py-20 px-4 sm:px-6 lg:px-8 relative z-20 transition-all duration-700 ${projectsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6">
              {t.projects.title}
            </h2>
            <p className="text-xl text-gray-300">{t.projects.subtitle}</p>
          </div>

          <h3 className="text-3xl font-bold text-cyan-400 mb-8 text-center">{t.projects.featuredContent}</h3>

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
                  HR management system with document management, secure file uploads, and role-based access control.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className="bg-gradient-to-r from-gray-800 to-gray-700 text-cyan-200 border-gray-600 hover:border-cyan-500/50 transition-colors">JavaScript</Badge>
                  <Badge className="bg-gradient-to-r from-gray-800 to-gray-700 text-green-200 border-gray-600 hover:border-green-500/50 transition-colors">TypeScript</Badge>
                  <Badge className="bg-gradient-to-r from-gray-800 to-gray-700 text-purple-200 border-gray-600 hover:border-purple-500/50 transition-colors">Node.js</Badge>
                </div>
                <Button
                  onClick={() => setSelectedProject('extramus')}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-600 hover:border-cyan-500/50 transition-all duration-300 rounded-xl touch-target focus-visible"
                >
                  Show Details
                </Button>
              </CardContent>
            </Card>

            {/* Reveil Game - Featured */}
            <Card className="hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-2 bg-gray-900/80 border-purple-500/30 w-full max-w-md hover:animate-pulse hover:scale-105 animate-fade-in-up delay-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-purple-400">
                  Reveil
                  <Link href="https://github.com/Urthella/Reveil" className="text-purple-400 hover:text-purple-300 transition-colors">
                    <Github className="w-6 h-6" />
                  </Link>
                </CardTitle>
                <CardDescription className="text-gray-300">
                  An immersive game project built with TypeScript and modern web technologies. Features interactive gameplay mechanics.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className="bg-gradient-to-r from-gray-800 to-gray-700 text-purple-200 border-gray-600 hover:border-purple-500/50 transition-colors">TypeScript</Badge>
                  <Badge className="bg-gradient-to-r from-gray-800 to-gray-700 text-yellow-200 border-gray-600 hover:border-yellow-500/50 transition-colors">JavaScript</Badge>
                  <Badge className="bg-gradient-to-r from-gray-800 to-gray-700 text-blue-200 border-gray-600 hover:border-blue-500/50 transition-colors">Python</Badge>
                </div>
                <Button
                  onClick={() => setSelectedProject('reveil')}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-600 hover:border-purple-500/50 transition-all duration-300 rounded-xl"
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
                  <Link href="https://github.com/Urthella" className="text-green-400 hover:text-green-300 transition-colors">
                    <Github className="w-6 h-6" />
                  </Link>
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Modern, responsive portfolio website built with Next.js, featuring dark mode, animations, and multilingual support
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className="bg-gradient-to-r from-gray-800 to-gray-700 text-cyan-200 border-gray-600 hover:border-cyan-500/50 transition-colors">Next.js</Badge>
                  <Badge className="bg-gradient-to-r from-gray-800 to-gray-700 text-green-200 border-gray-600 hover:border-green-500/50 transition-colors">TypeScript</Badge>
                  <Badge className="bg-gradient-to-r from-gray-800 to-gray-700 text-purple-200 border-gray-600 hover:border-purple-500/50 transition-colors">Tailwind CSS</Badge>
                </div>
                <Button
                  onClick={() => setSelectedProject('portfolio')}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-600 hover:border-green-500/50 transition-all duration-300 rounded-xl"
                >
                  Show Details
                </Button>
              </CardContent>
            </Card>
          </div>

          <h3 className="text-3xl font-bold text-purple-400 mb-8 text-center">Other Projects</h3>

          <div className="flex flex-wrap justify-center gap-8">
            {/* MIPS16 Pipeline Simulator */}
            <Card className="hover:shadow-2xl hover:shadow-orange-500/30 transition-all duration-300 hover:-translate-y-2 bg-gray-900/80 border-orange-500/30 w-full max-w-md hover:animate-pulse hover:scale-105 animate-fade-in-up delay-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-orange-400">
                  MIPS16 Pipeline Simulator
                  <Link href="https://github.com/Urthella/-MIPS16-pipeline-sim" className="text-orange-400 hover:text-orange-300 transition-colors">
                    <Github className="w-6 h-6" />
                  </Link>
                </CardTitle>
                <CardDescription className="text-gray-300">
                  5-stage pipeline CPU simulator with hazard detection, data forwarding, and real-time visualization. Includes Verilog RTL modules.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className="bg-gradient-to-r from-gray-800 to-gray-700 text-orange-200 border-gray-600 hover:border-orange-500/50 transition-colors">Java</Badge>
                  <Badge className="bg-gradient-to-r from-gray-800 to-gray-700 text-cyan-200 border-gray-600 hover:border-cyan-500/50 transition-colors">TypeScript</Badge>
                  <Badge className="bg-gradient-to-r from-gray-800 to-gray-700 text-purple-200 border-gray-600 hover:border-purple-500/50 transition-colors">React</Badge>
                  <Badge className="bg-gradient-to-r from-gray-800 to-gray-700 text-blue-200 border-gray-600 hover:border-blue-500/50 transition-colors">Verilog</Badge>
                </div>
                <Button
                  onClick={() => setSelectedProject('mips16')}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-600 hover:border-orange-500/50 transition-all duration-300 rounded-xl"
                >
                  Show Details
                </Button>
              </CardContent>
            </Card>

            {/* Algorithm Test Simulator */}
            <Card className="hover:shadow-2xl hover:shadow-red-500/30 transition-all duration-300 hover:-translate-y-2 bg-gray-900/80 border-red-500/30 w-full max-w-md hover:animate-pulse hover:scale-105 animate-fade-in-up delay-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-red-400">
                  Algorithm Performance Analyzer
                  <Link href="https://github.com/Urthella/algortihm-test-sim" className="text-red-400 hover:text-red-300 transition-colors">
                    <Github className="w-6 h-6" />
                  </Link>
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Sorting algorithm benchmarking tool with time/memory analysis, interactive charts, and multiple data patterns support.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className="bg-gradient-to-r from-gray-800 to-gray-700 text-red-200 border-gray-600 hover:border-red-500/50 transition-colors">Spring Boot</Badge>
                  <Badge className="bg-gradient-to-r from-gray-800 to-gray-700 text-cyan-200 border-gray-600 hover:border-cyan-500/50 transition-colors">React</Badge>
                  <Badge className="bg-gradient-to-r from-gray-800 to-gray-700 text-green-200 border-gray-600 hover:border-green-500/50 transition-colors">Vite</Badge>
                </div>
                <Button
                  onClick={() => setSelectedProject('algorithm')}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-600 hover:border-red-500/50 transition-all duration-300 rounded-xl"
                >
                  Show Details
                </Button>
              </CardContent>
            </Card>


            {/* Pen Trading via Instagram (@pen.pick) */}
            <Card className="hover:shadow-2xl hover:shadow-pink-500/30 transition-all duration-300 hover:-translate-y-2 bg-gray-900/80 border-pink-500/30 w-full max-w-md hover:animate-pulse hover:scale-105 animate-fade-in-up delay-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-pink-400">
                  <span>Pen Trading via Instagram (@pen.pick)</span>
                  <a href="https://instagram.com/pen.pick" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition-colors">
                    <Instagram className="w-6 h-6 align-middle" />
                  </a>
                </CardTitle>
                <CardDescription className="text-gray-300">
                  A niche Instagram-based marketplace for premium pens. Focused on fountain, rollerball, and ballpoint models.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className="bg-gradient-to-r from-gray-800 to-gray-700 text-pink-200 border-gray-600 hover:border-pink-500/50 transition-colors">Instagram</Badge>
                  <Badge className="bg-gradient-to-r from-gray-800 to-gray-700 text-purple-200 border-gray-600 hover:border-purple-500/50 transition-colors">Product Photography</Badge>
                  <Badge className="bg-gradient-to-r from-gray-800 to-gray-700 text-blue-200 border-gray-600 hover:border-blue-500/50 transition-colors">E-commerce</Badge>
                  <Badge className="bg-gradient-to-r from-gray-800 to-gray-700 text-green-200 border-gray-600 hover:border-green-500/50 transition-colors">Branding</Badge>
                </div>
                <Button
                  onClick={() => setSelectedProject('penpick')}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-600 hover:border-pink-500/50 transition-all duration-300 rounded-xl"
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
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Handcrafted custom guitar with unique design, premium components, and exceptional playability
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className="bg-gradient-to-r from-gray-800 to-gray-700 text-blue-200 border-gray-600 hover:border-blue-500/50 transition-colors">Woodworking</Badge>
                  <Badge className="bg-gradient-to-r from-gray-800 to-gray-700 text-purple-200 border-gray-600 hover:border-purple-500/50 transition-colors">Electronics</Badge>
                  <Badge className="bg-gradient-to-r from-gray-800 to-gray-700 text-green-200 border-gray-600 hover:border-green-500/50 transition-colors">Guitar Setup</Badge>
                </div>
                <Button
                  onClick={() => setSelectedProject('guitar')}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-600 hover:border-blue-500/50 transition-all duration-300 rounded-xl"
                >
                  Show Details
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Hobbies Section */}
      <section
        id="hobbies"
        ref={hobbiesRef}
        className={`py-20 px-4 sm:px-6 lg:px-8 relative z-20 transition-all duration-700 ${hobbiesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6">
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
                <div className="space-y-4">
                  {/* Music Info */}
                  <div className="text-sm text-gray-400">
                  </div>
                </div>
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
            {/* Collecting & Trading */}
            <div className="md:col-span-2 lg:col-span-1 flex justify-center"></div>
            <Card className="bg-gray-900/80 border-pink-500/30 shadow-xl shadow-pink-500/20 hover:shadow-pink-500/40 transition-all duration-300 hover:animate-pulse hover:scale-105 animate-fade-in-up delay-300">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Instagram className="w-8 h-8 text-pink-400" />
                  <CardTitle className="text-pink-400">{t.hobbies.collectingTrading}</CardTitle>
                </div>
                <CardDescription className="text-gray-300 mt-2">
                  {t.hobbies.collectingDescription}
                </CardDescription>
              </CardHeader>
              <CardContent>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section
        id="articles"
        ref={articlesRef}
        className={`py-20 px-4 sm:px-6 lg:px-8 relative z-20 transition-all duration-700 ${articlesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6">
              {t.articles.title}
            </h2>
            <p className="text-xl text-gray-300">{t.articles.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Social Engineering Article */}
            <Card className="bg-gray-900/80 border-cyan-500/30 shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-105 group">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-cyan-400 group-hover:text-cyan-300 transition-colors">
                    {t.articles.socialEngineering.title}
                  </CardTitle>
                  <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 mb-4">
                  {t.articles.socialEngineering.description}
                </CardDescription>
                <Link
                  href="https://medium.com/@urthella1/the-part-where-the-fun-beggins-social-engineering-c1b5cbaa5ffb"
                  target="_blank"
                  className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
                >
                  {t.articles.readArticle}
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Link>
              </CardContent>
            </Card>

            {/* SQL Injection Article */}
            <Card className="bg-gray-900/80 border-purple-500/30 shadow-xl shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105 group">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-purple-400 group-hover:text-purple-300 transition-colors">
                    {t.articles.sqlInjection.title}
                  </CardTitle>
                  <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 mb-4">
                  {t.articles.sqlInjection.description}
                </CardDescription>
                <Link
                  href="https://medium.com/@urthella1/sql-injection-the-vulnerability-that-never-goes-away-fc5f931f3a7c"
                  target="_blank"
                  className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors font-medium"
                >
                  {t.articles.readArticle}
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Link>
              </CardContent>
            </Card>

            {/* OSI Model Article */}
            <Card className="bg-gray-900/80 border-green-500/30 shadow-xl shadow-green-500/20 hover:shadow-green-500/40 transition-all duration-300 hover:scale-105 group">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-green-400 group-hover:text-green-300 transition-colors">
                    {t.articles.osiModel.title}
                  </CardTitle>
                  <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-green-400 transition-colors" />
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 mb-4">
                  {t.articles.osiModel.description}
                </CardDescription>
                <Link
                  href="https://medium.com/@urthella1/osi-modelini-anlamak-96cb794b44d7"
                  target="_blank"
                  className="inline-flex items-center text-green-400 hover:text-green-300 transition-colors font-medium"
                >
                  {t.articles.readArticle}
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Link>
              </CardContent>
            </Card>

            {/* VPN Article */}
            <Card className="bg-gray-900/80 border-orange-500/30 shadow-xl shadow-orange-500/20 hover:shadow-orange-500/40 transition-all duration-300 hover:scale-105 group">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-orange-400 group-hover:text-orange-300 transition-colors">
                    {t.articles.vpn.title}
                  </CardTitle>
                  <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-orange-400 transition-colors" />
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 mb-4">
                  {t.articles.vpn.description}
                </CardDescription>
                <Link
                  href="https://medium.com/@urthella1/vpn-dijital-d%C3%BCnyan%C4%B1n-g%C3%BCvenli-kap%C4%B1s%C4%B1-3fea39c03de0"
                  target="_blank"
                  className="inline-flex items-center text-orange-400 hover:text-orange-300 transition-colors font-medium"
                >
                  {t.articles.readArticle}
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Future Articles Teaser */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-lg p-8 border border-gray-600">
              <h3 className="text-2xl font-bold text-purple-400 mb-4">{t.articles.comingSoon}</h3>
              <p className="text-gray-300 mb-4">
                🎵 <strong>{t.articles.musicTheory}</strong> - {t.articles.musicTheoryDesc}
              </p>
              <p className="text-gray-400 text-sm">
                {t.articles.followMedium}
              </p>
              <Link
                href="https://medium.com/@urthella1"
                target="_blank"
                className="inline-flex items-center mt-4 text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
              >
                {t.articles.mediumProfile}
                <ExternalLink className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Game Music Section */}
      <section
        id="gamemusic"
        ref={gamemusicRef}
        className={`py-20 px-4 sm:px-6 lg:px-8 relative z-20 transition-all duration-700 ${gamemusicVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
      >
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
                  <source src="/Whisper_of_the_Ents.mp3" type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-gradient-to-r from-gray-800 to-gray-700 text-green-200 border-gray-600 hover:border-green-500/50 transition-colors">Fantasy</Badge>
                  <Badge className="bg-gradient-to-r from-gray-800 to-gray-700 text-cyan-200 border-gray-600 hover:border-cyan-500/50 transition-colors">Puzzle</Badge>
                  <Badge className="bg-gradient-to-r from-gray-800 to-gray-700 text-purple-200 border-gray-600 hover:border-purple-500/50 transition-colors">Mystical</Badge>
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
                  <source src="/Haunted_House.mp3" type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-gradient-to-r from-gray-800 to-gray-700 text-red-200 border-gray-600 hover:border-red-500/50 transition-colors">Horror</Badge>
                  <Badge className="bg-gradient-to-r from-gray-800 to-gray-700 text-gray-200 border-gray-600 hover:border-gray-500/50 transition-colors">Dark</Badge>
                  <Badge className="bg-gradient-to-r from-gray-800 to-gray-700 text-purple-200 border-gray-600 hover:border-purple-500/50 transition-colors">Puzzle</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Spotify Profile Widget */}
          <div className="mt-12">
            <div className="text-center mb-6">
              <h3 className="text-3xl font-bold text-cyan-400 mb-4">🎵 {t.gamemusic.playlistTitle}</h3>
              <p className="text-lg text-gray-300">{t.gamemusic.playlistDescription}</p>
            </div>
            <div className="max-w-2xl mx-auto">
              <div className="bg-black rounded-xl overflow-hidden">
                <iframe
                  data-testid="embed-iframe"
                  style={{ borderRadius: "12px" }}
                  src="https://open.spotify.com/embed/playlist/5PTPX85YTcfoKYeJwkysu4?utm_source=generator&theme=0"
                  width="100%"
                  height="480"
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section
        id="services"
        className="py-20 px-4 sm:px-6 lg:px-8 relative z-20"
      >
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
                  className="bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-600 hover:border-cyan-500/50 transition-all duration-300 rounded-xl"
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
                  className="bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-600 hover:border-purple-500/50 transition-all duration-300 rounded-xl"
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
                  className="bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-600 hover:border-green-500/50 transition-all duration-300 rounded-xl"
                >
                  {t.services.contactForDetails}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        ref={contactRef}
        className={`py-20 px-4 sm:px-6 lg:px-8 relative z-20 transition-all duration-700 ${contactVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6">
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
                <div className="space-y-3">
                  <h4 className="text-xl font-semibold text-green-400">{t.contact.articles}</h4>
                  <Link href="https://medium.com/@urthella1" className="flex items-center space-x-2 text-gray-300 hover:text-green-400 transition-colors">
                    <span className="w-6 h-6 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
                        <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
                      </svg>
                    </span>
                    <span>Medium</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-cyan-500/30 shadow-cyan-500/20">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6">
                {t.contact.sendMessage} 🚀
              </h3>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300">
                  {t.contact.success}
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300">
                  {t.contact.error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-gray-300 text-sm font-medium mb-2">{t.contact.name}</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="shadow-sm bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                    placeholder={t.contact.name}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-300 text-sm font-medium mb-2">{t.contact.email}</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="shadow-sm bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5"
                    placeholder={t.contact.email}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-gray-300 text-sm font-medium mb-2">{t.contact.message}</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="shadow-sm bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                    placeholder={t.contact.message}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-full px-5 py-3 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{t.contact.sending}</span>
                    </div>
                  ) : (
                    t.contact.send
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Project Details Modal */}
      {
        selectedProject && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900/95 border border-cyan-500/30 rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-cyan-500/20">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  {selectedProject === 'extramus' && 'Extramus HR System'}
                  {selectedProject === 'penpick' && 'Pen Trading via Instagram (@pen.pick)'}
                  {selectedProject === 'portfolio' && 'Portfolio Website'}
                  {selectedProject === 'mips16' && 'MIPS16 Pipeline Simulator'}
                  {selectedProject === 'algorithm' && 'Algorithm Performance Analyzer'}
                  {selectedProject === 'reveil' && 'Reveil'}
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
                        <Badge className="bg-gradient-to-r from-gray-800 to-gray-700 text-blue-200 border-gray-600 hover:border-blue-500/50 transition-colors">JavaScript</Badge>
                        <Badge className="bg-gradient-to-r from-gray-800 to-gray-700 text-green-200 border-gray-600 hover:border-green-500/50 transition-colors">TypeScript</Badge>
                        <Badge className="bg-gradient-to-r from-gray-800 to-gray-700 text-orange-200 border-gray-600 hover:border-orange-500/50 transition-colors">Docker</Badge>
                        <Badge className="bg-gradient-to-r from-gray-800 to-gray-700 text-purple-200 border-gray-600 hover:border-purple-500/50 transition-colors">Node.js</Badge>
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
                        <Badge className="bg-gradient-to-r from-gray-800 to-gray-700 text-cyan-200 border-gray-600 hover:border-cyan-500/50 transition-colors">Next.js</Badge>
                        <Badge className="bg-gradient-to-r from-gray-800 to-gray-700 text-green-200 border-gray-600 hover:border-green-500/50 transition-colors">TypeScript</Badge>
                        <Badge className="bg-gradient-to-r from-gray-800 to-gray-700 text-purple-200 border-gray-600 hover:border-purple-500/50 transition-colors">Tailwind CSS</Badge>
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

                {selectedProject === 'mips16' && (
                  <>
                    <div>
                      <h4 className="text-xl font-semibold text-cyan-400 mb-3">Project Overview</h4>
                      <p className="text-gray-300 leading-relaxed">
                        A comprehensive MIPS16 pipeline CPU simulator featuring a 5-stage pipeline (IF → ID → EX → MEM → WB) with hazard detection, data forwarding, and real-time visualization. Includes Verilog RTL modules and testbenches for hardware-level simulation.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-purple-400 mb-3">Technologies Used</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-gradient-to-r from-gray-800 to-gray-700 text-orange-200 border-gray-600 hover:border-orange-500/50 transition-colors">Java</Badge>
                        <Badge className="bg-gradient-to-r from-gray-800 to-gray-700 text-cyan-200 border-gray-600 hover:border-cyan-500/50 transition-colors">TypeScript</Badge>
                        <Badge className="bg-gradient-to-r from-gray-800 to-gray-700 text-purple-200 border-gray-600 hover:border-purple-500/50 transition-colors">React</Badge>
                        <Badge className="bg-gradient-to-r from-gray-800 to-gray-700 text-blue-200 border-gray-600 hover:border-blue-500/50 transition-colors">Verilog</Badge>
                        <Badge className="bg-gradient-to-r from-gray-800 to-gray-700 text-green-200 border-gray-600 hover:border-green-500/50 transition-colors">Tailwind CSS</Badge>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-green-400 mb-3">Key Features</h4>
                      <ul className="text-gray-300 space-y-2">
                        <li>• 5-stage pipeline: IF → ID → EX → MEM → WB</li>
                        <li>• Data Forwarding (EX-EX, MEM-EX)</li>
                        <li>• Load-Use Stall Detection</li>
                        <li>• Branch Flush for Control Hazards</li>
                        <li>• Performance Metrics: CPI, IPC, Stall/Forward/Flush counts</li>
                        <li>• Modern Web UI with real-time visualization</li>
                        <li>• Verilog RTL modules and testbenches</li>
                      </ul>
                    </div>
                    <div>
                      <Link href="https://github.com/Urthella/-MIPS16-pipeline-sim" target="_blank" className="inline-flex items-center text-orange-400 hover:text-orange-300 transition-colors">
                        <Github className="w-5 h-5 mr-2" />
                        View on GitHub
                      </Link>
                    </div>
                  </>
                )}

                {selectedProject === 'algorithm' && (
                  <>
                    <div>
                      <h4 className="text-xl font-semibold text-cyan-400 mb-3">Project Overview</h4>
                      <p className="text-gray-300 leading-relaxed">
                        A comprehensive sorting algorithm performance analysis tool that compares time complexity, memory usage, and execution patterns across multiple algorithms. Features interactive charts and detailed benchmarking capabilities.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-purple-400 mb-3">Technologies Used</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-gradient-to-r from-gray-800 to-gray-700 text-red-200 border-gray-600 hover:border-red-500/50 transition-colors">Spring Boot</Badge>
                        <Badge className="bg-gradient-to-r from-gray-800 to-gray-700 text-cyan-200 border-gray-600 hover:border-cyan-500/50 transition-colors">React</Badge>
                        <Badge className="bg-gradient-to-r from-gray-800 to-gray-700 text-green-200 border-gray-600 hover:border-green-500/50 transition-colors">Vite</Badge>
                        <Badge className="bg-gradient-to-r from-gray-800 to-gray-700 text-blue-200 border-gray-600 hover:border-blue-500/50 transition-colors">Java</Badge>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-green-400 mb-3">Key Features</h4>
                      <ul className="text-gray-300 space-y-2">
                        <li>• Time Complexity: Theoretical vs practical measurements</li>
                        <li>• Memory Usage: Heap memory tracking per algorithm</li>
                        <li>• Data Patterns: Random, Partially Sorted, Reverse Sorted</li>
                        <li>• Multiple Sizes: 1K, 10K, 100K, 500K elements</li>
                        <li>• Interactive charts (Line, Bar, Radar)</li>
                        <li>• CSV/JSON export functionality</li>
                        <li>• RESTful API for benchmarking</li>
                      </ul>
                    </div>
                    <div>
                      <Link href="https://github.com/Urthella/algortihm-test-sim" target="_blank" className="inline-flex items-center text-red-400 hover:text-red-300 transition-colors">
                        <Github className="w-5 h-5 mr-2" />
                        View on GitHub
                      </Link>
                    </div>
                  </>
                )}

                {selectedProject === 'reveil' && (
                  <>
                    <div>
                      <h4 className="text-xl font-semibold text-cyan-400 mb-3">Project Overview</h4>
                      <p className="text-gray-300 leading-relaxed">
                        An immersive game project built with TypeScript and modern web technologies. Features interactive gameplay mechanics, dynamic environments, and engaging user experiences.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-purple-400 mb-3">Technologies Used</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-gradient-to-r from-gray-800 to-gray-700 text-indigo-200 border-gray-600 hover:border-indigo-500/50 transition-colors">TypeScript (93.8%)</Badge>
                        <Badge className="bg-gradient-to-r from-gray-800 to-gray-700 text-yellow-200 border-gray-600 hover:border-yellow-500/50 transition-colors">JavaScript (3.9%)</Badge>
                        <Badge className="bg-gradient-to-r from-gray-800 to-gray-700 text-blue-200 border-gray-600 hover:border-blue-500/50 transition-colors">Python (2.3%)</Badge>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-green-400 mb-3">Key Features</h4>
                      <ul className="text-gray-300 space-y-2">
                        <li>• Interactive gameplay mechanics</li>
                        <li>• Modern web-based game engine</li>
                        <li>• Dynamic game environments</li>
                        <li>• TypeScript for type-safe development</li>
                        <li>• Python scripting for game logic</li>
                      </ul>
                    </div>
                    <div>
                      <Link href="https://github.com/Urthella/Reveil" target="_blank" className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors">
                        <Github className="w-5 h-5 mr-2" />
                        View on GitHub
                      </Link>
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
                        <Badge className="bg-gradient-to-r from-gray-800 to-gray-700 text-blue-200 border-gray-600 hover:border-blue-500/50 transition-colors">Woodworking</Badge>
                        <Badge className="bg-gradient-to-r from-gray-800 to-gray-700 text-purple-200 border-gray-600 hover:border-purple-500/50 transition-colors">Electronics</Badge>
                        <Badge className="bg-gradient-to-r from-gray-800 to-gray-700 text-green-200 border-gray-600 hover:border-green-500/50 transition-colors">Guitar Setup</Badge>
                        <Badge className="bg-gradient-to-r from-gray-800 to-gray-700 text-orange-200 border-gray-600 hover:border-orange-500/50 transition-colors">Handcrafted</Badge>
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

                {selectedProject === 'penpick' && (
                  <>
                    <div>
                      <h4 className="text-xl font-semibold text-cyan-400 mb-3">Project Overview</h4>
                      <p className="text-gray-300 leading-relaxed">
                        A niche Instagram-based marketplace for premium pens including Montblanc, Parker, and Pelikan. Focused on fountain, rollerball, and ballpoint models. Managed via <a href="https://instagram.com/pen.pick" target="_blank" rel="noopener noreferrer" className="text-pink-400 underline hover:text-pink-500 transition-colors">@pen.pick</a>.
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-purple-400 mb-3">Technologies Used</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-gradient-to-r from-gray-800 to-gray-700 text-pink-200 border-gray-600 hover:border-pink-500/50 transition-colors">Instagram</Badge>
                        <Badge className="bg-gradient-to-r from-gray-800 to-gray-700 text-gray-200 border-gray-600 hover:border-gray-500/50 transition-colors">Product Photography</Badge>
                        <Badge className="bg-gradient-to-r from-gray-800 to-gray-700 text-green-200 border-gray-600 hover:border-green-500/50 transition-colors">E-commerce</Badge>
                        <Badge className="bg-gradient-to-r from-gray-800 to-gray-700 text-blue-200 border-gray-600 hover:border-blue-500/50 transition-colors">Branding</Badge>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-green-400 mb-3">Key Features</h4>
                      <ul className="text-gray-300 space-y-2">
                        <li>• Clean, minimal pen photography with detailed descriptions</li>
                        <li>• Active Instagram presence to connect with local collectors</li>
                        <li>• Handles packaging, negotiation, and delivery within Türkiye</li>
                        <li>• Researches models, verifies authenticity, and tracks market trends</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-pink-400 mb-3">Skills & Outcomes</h4>
                      <p className="text-gray-300 leading-relaxed">
                        Enhanced practical skills in social media marketing, customer communication, and inventory handling through this hobby-turned-micro-business.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )
      }

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
          <p className="text-gray-400 mt-2 text-xs opacity-50">
            © 2025 Utku Demirtaş. All rights reserved.
          </p>
        </div>
      </footer>
    </div >
  )
}
