import { BlogPost, BlogCategory, BlogTag } from './types'

// Simulated blog data - gerçek uygulamada bu veriler CMS'den gelecek
export const blogCategories: BlogCategory[] = [
  {
    id: '1',
    name: 'Technology',
    slug: 'technology',
    description: 'Latest trends in software development and tech industry',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: '2', 
    name: 'DevOps',
    slug: 'devops',
    description: 'CI/CD, containerization, and infrastructure automation',
    color: 'from-green-500 to-teal-500'
  },
  {
    id: '3',
    name: 'Career',
    slug: 'career',
    description: 'Professional development and career insights',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: '4',
    name: 'Music & Code',
    slug: 'music-code',
    description: 'The intersection of music and programming',
    color: 'from-orange-500 to-red-500'
  }
]

export const blogTags: BlogTag[] = [
  { id: '1', name: 'React', slug: 'react', count: 12 },
  { id: '2', name: 'TypeScript', slug: 'typescript', count: 8 },
  { id: '3', name: 'Next.js', slug: 'nextjs', count: 6 },
  { id: '4', name: 'Docker', slug: 'docker', count: 4 },
  { id: '5', name: 'DevOps', slug: 'devops', count: 7 },
  { id: '6', name: 'Music Theory', slug: 'music-theory', count: 3 },
  { id: '7', name: 'Career Tips', slug: 'career-tips', count: 5 }
]

export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'modern-react-patterns-2025',
    title: 'Modern React Patterns Every Developer Should Know in 2025',
    excerpt: 'Explore the latest React patterns and best practices that will make your code more maintainable and performant.',
    content: `# Modern React Patterns Every Developer Should Know in 2025

React has evolved significantly over the years, and staying up-to-date with modern patterns is crucial for writing maintainable, performant applications.

## 1. Server Components and Client Components

With React 18 and Next.js 13+, we now have a clear distinction between server and client components...

## 2. Custom Hooks for Complex State Management

Custom hooks remain one of the most powerful patterns in React...

## 3. Compound Components Pattern

This pattern allows you to create flexible and reusable component APIs...

## Conclusion

These patterns will help you write better React code in 2025. Stay tuned for more advanced topics!`,
    author: 'Utku Demirtaş',
    publishedAt: '2025-01-15',
    updatedAt: '2025-01-16',
    tags: ['react', 'typescript', 'nextjs'],
    category: 'technology',
    coverImage: '/blog/react-patterns-2025.jpg',
    readingTime: 8,
    isPublished: true,
    language: 'en',
    seo: {
      title: 'Modern React Patterns 2025 | Utku Demirtaş Blog',
      description: 'Learn the latest React patterns and best practices for 2025. Server components, custom hooks, and more.',
      keywords: ['React', 'JavaScript', 'Frontend', 'Web Development', '2025']
    }
  },
  {
    id: '2',
    slug: 'docker-microservices-architecture',
    title: 'Building Scalable Microservices with Docker and Kubernetes',
    excerpt: 'Learn how to design, build, and deploy microservices using Docker containers and Kubernetes orchestration.',
    content: `# Building Scalable Microservices with Docker and Kubernetes

Microservices architecture has become the go-to approach for building scalable applications...

## Why Microservices?

Traditional monolithic applications can become difficult to maintain as they grow...

## Docker Fundamentals

Docker provides the perfect foundation for microservices...

## Kubernetes Orchestration

Kubernetes takes container management to the next level...`,
    author: 'Utku Demirtaş',
    publishedAt: '2025-01-10',
    tags: ['docker', 'kubernetes', 'devops', 'microservices'],
    category: 'devops',
    readingTime: 12,
    isPublished: true,
    language: 'en',
    seo: {
      title: 'Docker Microservices with Kubernetes | DevOps Guide',
      description: 'Complete guide to building scalable microservices using Docker and Kubernetes.',
      keywords: ['Docker', 'Kubernetes', 'Microservices', 'DevOps', 'Containers']
    }
  },
  {
    id: '3',
    slug: 'software-engineer-career-path',
    title: 'From Junior to Senior: A Software Engineer\'s Journey',
    excerpt: 'My personal journey from a junior developer to a senior engineer, including lessons learned and career advice.',
    content: `# From Junior to Senior: A Software Engineer's Journey

Every developer's journey is unique, but there are common patterns and milestones...

## Starting as a Junior Developer

When I first started my career, I was overwhelmed by the amount of things I didn't know...

## The Mid-Level Plateau

After a few years, many developers hit what I call the "mid-level plateau"...

## Breaking into Senior Roles

Becoming a senior engineer isn't just about technical skills...`,
    author: 'Utku Demirtaş',
    publishedAt: '2025-01-05',
    tags: ['career-tips', 'software-engineering', 'professional-development'],
    category: 'career',
    readingTime: 6,
    isPublished: true,
    language: 'en',
    seo: {
      title: 'Software Engineer Career Path | Junior to Senior Guide',
      description: 'Personal insights on growing from junior to senior software engineer.',
      keywords: ['Career', 'Software Engineer', 'Professional Development', 'Programming']
    }
  },
  {
    id: '4',
    slug: 'music-theory-for-programmers',
    title: 'Music Theory Concepts That Make You a Better Programmer',
    excerpt: 'Discover how musical concepts like patterns, rhythm, and composition can improve your coding skills.',
    content: `# Music Theory Concepts That Make You a Better Programmer

As both a musician and a programmer, I've noticed fascinating parallels between music and code...

## Patterns and Repetition

In music, patterns are fundamental. Similarly, in programming, recognizing patterns is crucial...

## Rhythm and Flow

Musical rhythm teaches us about timing and flow, concepts that apply to code structure...

## Composition and Architecture

Just as a symphony has movement and structure, good software has clear architecture...`,
    author: 'Utku Demirtaş',
    publishedAt: '2024-12-28',
    tags: ['music-theory', 'programming', 'creativity'],
    category: 'music-code',
    readingTime: 10,
    isPublished: true,
    language: 'en',
    seo: {
      title: 'Music Theory for Programmers | Creative Coding',
      description: 'How music theory concepts can improve your programming skills.',
      keywords: ['Music Theory', 'Programming', 'Creativity', 'Software Development']
    }
  }
]

// Utility functions
export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug && post.isPublished)
}

export function getBlogPostsByCategory(categorySlug: string): BlogPost[] {
  return blogPosts.filter(post => post.category === categorySlug && post.isPublished)
}

export function getBlogPostsByTag(tagSlug: string): BlogPost[] {
  return blogPosts.filter(post => 
    post.tags.some(tag => tag === tagSlug) && post.isPublished
  )
}

export function getRecentBlogPosts(limit: number = 3): BlogPost[] {
  return blogPosts
    .filter(post => post.isPublished)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit)
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.split(' ').length
  return Math.ceil(wordCount / wordsPerMinute)
}

export function formatDate(dateString: string, locale: string = 'en-US'): string {
  const date = new Date(dateString)
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long', 
    day: 'numeric'
  })
}
