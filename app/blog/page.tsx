
import Link from 'next/link'
import { getAllPosts } from '@/lib/mdx'
import { getMediumPosts } from '@/lib/medium'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Tag, ExternalLink } from 'lucide-react'

export default async function BlogPage() {
    const internalPosts = await getAllPosts()
    const mediumPosts = await getMediumPosts('urthella1')

    // Normalize and merge posts
    const allPosts = [
        ...internalPosts.map(post => ({
            id: post.slug,
            title: post.frontmatter.title,
            date: post.frontmatter.date,
            description: post.frontmatter.description,
            tags: post.frontmatter.tags,
            link: `/blog/${post.slug}`,
            isExternal: false,
            source: 'Blog'
        })),
        ...mediumPosts.map(post => ({
            id: post.guid,
            title: post.title,
            date: post.pubDate.split(' ')[0], // Format: YYYY-MM-DD
            description: post.description.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...', // Strip HTML
            tags: post.categories,
            link: post.link,
            isExternal: true,
            source: 'Medium'
        }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden">
            <div className="max-w-4xl mx-auto px-4 py-20">
                <div className="mb-12">
                    <Link href="/" className="inline-flex items-center text-gray-400 hover:text-cyan-400 transition-colors mb-8">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
                        Blog & Articles
                    </h1>
                    <p className="text-xl text-gray-300">
                        Thoughts on technology, music, and the digital world.
                    </p>
                </div>

                <div className="grid gap-8">
                    {allPosts.map((post) => (
                        post.isExternal ? (
                            <a key={post.id} href={post.link} target="_blank" rel="noopener noreferrer">
                                <Card className="bg-gray-900/80 border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <ExternalLink className="w-24 h-24 text-purple-500" />
                                    </div>
                                    <CardHeader>
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <Badge variant="secondary" className="bg-purple-500/10 text-purple-400 border-purple-500/20">
                                                    Medium
                                                </Badge>
                                                <CardTitle className="text-2xl font-bold text-gray-200 group-hover:text-purple-400 transition-colors">
                                                    {post.title}
                                                </CardTitle>
                                            </div>
                                            <span className="text-sm text-gray-500 flex items-center shrink-0 ml-4">
                                                <Calendar className="w-4 h-4 mr-1" />
                                                {post.date}
                                            </span>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="text-gray-400 text-lg mb-4">
                                            {post.description}
                                        </CardDescription>
                                        <div className="flex flex-wrap gap-2">
                                            {post.tags.slice(0, 5).map(tag => (
                                                <Badge key={tag} variant="outline" className="border-gray-700 text-gray-400 group-hover:border-purple-500/30 group-hover:text-purple-400 transition-colors">
                                                    <Tag className="w-3 h-3 mr-1" />
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </a>
                        ) : (
                            <Link key={post.id} href={post.link}>
                                <Card className="bg-gray-900/80 border-gray-800 hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-1 group">
                                    <CardHeader>
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <Badge variant="secondary" className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20">
                                                    Blog
                                                </Badge>
                                                <CardTitle className="text-2xl font-bold text-gray-200 group-hover:text-cyan-400 transition-colors">
                                                    {post.title}
                                                </CardTitle>
                                            </div>
                                            <span className="text-sm text-gray-500 flex items-center shrink-0 ml-4">
                                                <Calendar className="w-4 h-4 mr-1" />
                                                {post.date}
                                            </span>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription className="text-gray-400 text-lg mb-4">
                                            {post.description}
                                        </CardDescription>
                                        <div className="flex flex-wrap gap-2">
                                            {post.tags.map(tag => (
                                                <Badge key={tag} variant="outline" className="border-gray-700 text-gray-400 group-hover:border-cyan-500/30 group-hover:text-cyan-400 transition-colors">
                                                    <Tag className="w-3 h-3 mr-1" />
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        )
                    ))}

                    {allPosts.length === 0 && (
                        <div className="text-center py-20 text-gray-500">
                            No posts found. Check back later!
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
