"use client"

import { Button } from "@/components/ui/button"
import { Mail, Phone, Github, BookOpen, Linkedin, Instagram } from 'lucide-react'
import Link from "next/link"
import { useState } from "react"
import emailjs from '@emailjs/browser'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { translations } from '@/data/translations'

interface ContactProps {
    language: 'en' | 'tr'
}

export default function Contact({ language }: ContactProps) {
    const t = translations[language]
    const { elementRef: contactRef, isVisible: contactVisible } = useScrollAnimation({ triggerOnce: true, threshold: 0.2 })
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setSubmitStatus('idle')

        try {
            const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
            const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
            const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

            if (!serviceId || !templateId || !publicKey) {
                throw new Error('EmailJS configuration is missing.')
            }

            // Explicitly initialize with the public key
            emailjs.init({ publicKey })

            const templateParams = {
                from_name: formData.name,
                from_email: formData.email,
                message: formData.message
            }

            await emailjs.send(serviceId, templateId, templateParams, publicKey)

            setSubmitStatus('success')
            setFormData({ name: '', email: '', message: '' })

            setTimeout(() => setSubmitStatus('idle'), 5000)

        } catch (error: any) {
            console.error('❌ Email sending failed:', error)
            setSubmitStatus('error')
            setTimeout(() => setSubmitStatus('idle'), 5000)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <section
            id="contact"
            ref={contactRef}
            className={`py-20 px-4 sm:px-6 lg:px-8 relative z-20 transition-all duration-700 ${contactVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-5xl font-bold text-white mb-6">
                        {t.contact.title}
                    </h2>
                    <p className="text-xl text-gray-400">{t.contact.subtitle}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Contact Information */}
                    <div className="pointer-events-auto">
                        <h3 className="text-3xl font-bold text-white mb-8">{t.contact.contactInformation}</h3>
                        <div className="space-y-6">
                            <div className="flex items-center space-x-4 text-gray-300">
                                <Mail className="w-6 h-6 text-white" />
                                <a href="mailto:utkudemirtas0@gmail.com" className="hover:text-white transition-colors">utkudemirtas0@gmail.com</a>
                            </div>
                            <div className="flex items-center space-x-4 text-gray-300">
                                <Phone className="w-6 h-6 text-white" />
                                <span>+905070451623</span>
                            </div>
                            <div className="space-y-6">
                                {/* Social Media Section */}
                                {/* Social Profiles Grid */}
                                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Link href="https://www.linkedin.com/in/utkudemirtas/" target="_blank" className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors group">
                                        <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-gray-700 transition-colors">
                                            <Linkedin className="w-5 h-5 text-white" />
                                        </div>
                                        <span className="font-medium">LinkedIn</span>
                                    </Link>

                                    <Link href="https://www.instagram.com/urthella_/" target="_blank" className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors group">
                                        <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-gray-700 transition-colors">
                                            <Instagram className="w-5 h-5 text-white" />
                                        </div>
                                        <span className="font-medium">Instagram</span>
                                    </Link>

                                    <Link href="https://github.com/Urthella" target="_blank" className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors group">
                                        <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-gray-700 transition-colors">
                                            <Github className="w-5 h-5 text-white" />
                                        </div>
                                        <span className="font-medium">GitHub</span>
                                    </Link>

                                    <Link href="https://medium.com/@utkudemirtas0" target="_blank" className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors group">
                                        <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-gray-700 transition-colors">
                                            <BookOpen className="w-5 h-5 text-white" />
                                        </div>
                                        <span className="font-medium">Medium</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>



                    {/* Contact Form */}
                    <div className="pointer-events-auto bg-black/80 backdrop-blur-sm p-8 rounded-3xl border border-gray-800 shadow-xl">
                        <h3 className="text-2xl font-bold text-white mb-6">{t.contact.sendMessage}</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">{t.contact.name}</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">{t.contact.email}</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">{t.contact.message}</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    required
                                    rows={4}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                                    placeholder="Your message..."
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-white text-black hover:bg-gray-200 border-none font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105"
                            >
                                {isSubmitting ? t.contact.sending : t.contact.send}
                            </Button>
                            {submitStatus === 'success' && (
                                <p className="text-green-400 text-center mt-4 animate-fade-in-up">
                                    {t.contact.success}
                                </p>
                            )}
                            {submitStatus === 'error' && (
                                <p className="text-red-400 text-center mt-4 animate-fade-in-up">
                                    {t.contact.error}
                                </p>
                            )}
                        </form>
                    </div >
                </div >
            </div >
        </section >
    )
}
