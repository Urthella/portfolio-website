export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  author: string
  publishedAt: string
  updatedAt?: string
  tags: string[]
  category: string
  coverImage?: string
  readingTime: number
  isPublished: boolean
  language: 'en' | 'tr'
  seo: {
    title: string
    description: string
    keywords: string[]
  }
}

export interface BlogCategory {
  id: string
  name: string
  slug: string
  description: string
  color: string
}

export interface BlogTag {
  id: string
  name: string
  slug: string
  count: number
}

export interface BlogStats {
  totalPosts: number
  totalViews: number
  totalCategories: number
  totalTags: number
}
