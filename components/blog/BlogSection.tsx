'use client'

import { BlogCard } from './BlogCard'
import { getRecentBlogPosts } from '@/lib/blog/utils'
import { Button } from '@/components/ui/button'
import { BookOpen, TrendingUp, Code, Coffee } from 'lucide-react'
import Link from 'next/link'

interface BlogSectionProps {
  language: 'en' | 'tr'
}

const translations = {
  en: {
    title: 'Latest Articles',
    subtitle: 'Insights, tutorials, and thoughts on technology, career, and music 📚',
    viewAll: 'View All Articles',
    featuredPost: 'Featured Post',
    recentPosts: 'Recent Posts',
    stats: {
      articles: 'Articles',
      views: 'Total Views', 
      topics: 'Topics Covered'
    }
  },
  tr: {
    title: 'Son Makaleler',
    subtitle: 'Teknoloji, kariyer ve müzik hakkında görüşler, öğreticiler ve düşünceler 📚',
    viewAll: 'Tüm Makaleleri Gör',
    featuredPost: 'Öne Çıkan Makale',
    recentPosts: 'Son Makaleler',
    stats: {
      articles: 'Makale',
      views: 'Toplam Görüntülenme',
      topics: 'Konu Kapsamı'
    }
  }
}

export function BlogSection({ language }: BlogSectionProps) {
  const t = translations[language]
  const recentPosts = getRecentBlogPosts(4)
  const featuredPost = recentPosts[0]
  const otherPosts = recentPosts.slice(1)

  return (
    <section id="blog" className="py-20 px-4 sm:px-6 lg:px-8 relative z-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6">
            {t.title}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">{t.subtitle}</p>
        </div>

        {/* Blog Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/20 text-center">
            <div className="flex items-center justify-center mb-3">
              <BookOpen className="w-8 h-8 text-cyan-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">15+</div>
            <div className="text-gray-400">{t.stats.articles}</div>
          </div>
          
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20 text-center">
            <div className="flex items-center justify-center mb-3">
              <TrendingUp className="w-8 h-8 text-purple-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">2.5K+</div>
            <div className="text-gray-400">{t.stats.views}</div>
          </div>
          
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-green-500/20 text-center">
            <div className="flex items-center justify-center mb-3">
              <Code className="w-8 h-8 text-green-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">8+</div>
            <div className="text-gray-400">{t.stats.topics}</div>
          </div>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-cyan-400 mb-6 flex items-center">
              <Coffee className="w-6 h-6 mr-2" />
              {t.featuredPost}
            </h3>
            <BlogCard post={featuredPost} featured={true} />
          </div>
        )}

        {/* Recent Posts Grid */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-purple-400 mb-6">{t.recentPosts}</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button 
            asChild
            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0 rounded-full px-8 py-3 text-lg font-medium shadow-lg shadow-cyan-500/30"
          >
            <Link href="/blog">
              {t.viewAll}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
