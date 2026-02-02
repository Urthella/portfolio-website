import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Guitar, Dumbbell } from 'lucide-react'
import { translations } from "@/data/translations"

interface HeroProps {
    language: 'en' | 'tr'
}

export default function Hero({ language }: HeroProps) {
    const t = translations[language]

    return (
        <section id="home" className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 relative z-20">
            <div className="max-w-6xl mx-auto">
                <div className="text-center py-20">
                    <div className="mb-8">
                        {/* Profile Photo */}
                        <div className="mb-8 flex justify-center">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gray-800 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition duration-500"></div>
                                <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-gray-800 shadow-2xl">
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

                        <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight cursor-default">
                            {t.hero.title}
                        </h1>
                        <h2 className="text-2xl md:text-4xl text-gray-400 mb-6 font-semibold">{t.hero.subtitle}</h2>

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
                                className="bg-white text-black hover:bg-gray-200 px-8 py-3 rounded-full font-medium transition-all duration-300"
                            >
                                Wanna download my CV?
                            </Button>
                        </div>

                        <div className="pointer-events-auto bg-black/80 backdrop-blur-sm rounded-3xl p-8 max-w-3xl mx-auto border border-gray-800">
                            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                                {t.hero.description}
                            </p>
                            <div className="flex items-center justify-center space-x-6 text-gray-300 flex-wrap gap-4">
                                <div className="flex items-center space-x-3 bg-gray-900/50 px-4 py-2 rounded-full border border-gray-800">
                                    <span className="font-medium">{t.hero.computerEngineer}</span>
                                </div>
                                <div className="flex items-center space-x-3 bg-gray-900/50 px-4 py-2 rounded-full border border-gray-800">
                                    <Guitar className="w-6 h-6 text-white" />
                                    <span className="font-medium">{t.hero.guitarist}</span>
                                </div>
                                <div className="flex items-center space-x-3 bg-gray-900/50 px-4 py-2 rounded-full border border-gray-800">
                                    <Dumbbell className="w-6 h-6 text-white" />
                                    <span className="font-medium">{t.hero.fitnessEnthusiast}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
