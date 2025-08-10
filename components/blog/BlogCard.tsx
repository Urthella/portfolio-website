'use client'

import { BlogPost } from '@/lib/blog/types'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Clock, User, ArrowRight } from 'lucide-react'
import { formatDate } from '@/lib/blog/utils'
import Link from 'next/link'

interface BlogCardProps {
  post: BlogPost
  featured?: boolean
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  return (
    <Card className={`group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-gray-900/80 border-cyan-500/30 shadow-xl ${
      featured ? 'lg:col-span-2 shadow-cyan-500/20' : 'shadow-cyan-500/10'
    } hover:shadow-cyan-500/40 hover:animate-pulse hover:scale-105`}>
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 border-cyan-500/30">
            {post.category}
          </Badge>
          <div className="flex items-center text-gray-400 text-sm">
            <Clock className="w-4 h-4 mr-1" />
            {post.readingTime} min read
          </div>
        </div>
        
        <CardTitle className={`group-hover:text-cyan-400 transition-colors ${
          featured ? 'text-2xl' : 'text-xl'
        } text-white line-clamp-2`}>
          {post.title}
        </CardTitle>
        
        <CardDescription className="text-gray-300 line-clamp-3">
          {post.excerpt}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.slice(0, 3).map((tag) => (
            <Badge 
              key={tag} 
              variant="outline" 
              className="text-xs bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700/50"
            >
              {tag}
            </Badge>
          ))}
          {post.tags.length > 3 && (
            <Badge variant="outline" className="text-xs bg-gray-800/50 border-gray-600 text-gray-300">
              +{post.tags.length - 3} more
            </Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-gray-400 text-sm">
            <User className="w-4 h-4 mr-1" />
            {post.author}
            <Calendar className="w-4 h-4 ml-3 mr-1" />
            {formatDate(post.publishedAt)}
          </div>
          
          <Link 
            href={`/blog/${post.slug}`}
            className="flex items-center text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
          >
            Read More
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
