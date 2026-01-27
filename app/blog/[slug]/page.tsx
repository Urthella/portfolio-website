
import Link from 'next/link'
import { getPostBySlug } from '@/lib/mdx'
import { ArrowLeft, Calendar, Tag } from 'lucide-react'
import { Badge } from "@/components/ui/badge"

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const { frontmatter, content } = await getPostBySlug(slug)

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden">
            <article className="max-w-3xl mx-auto px-4 py-20">
                <Link href="/blog" className="inline-flex items-center text-gray-400 hover:text-cyan-400 transition-colors mb-8">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Blog
                </Link>

                <header className="mb-12 border-b border-gray-800 pb-12">
                    <div className="flex flex-wrap gap-2 mb-4">
                        {frontmatter.tags.map(tag => (
                            <Badge key={tag} className="bg-gray-800 text-cyan-400 hover:bg-gray-700">
                                <Tag className="w-3 h-3 mr-1" />
                                {tag}
                            </Badge>
                        ))}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6">
                        {frontmatter.title}
                    </h1>
                    <div className="flex items-center text-gray-400">
                        <Calendar className="w-5 h-5 mr-2" />
                        <time>{frontmatter.date}</time>
                    </div>
                </header>

                <div className="prose prose-invert prose-lg max-w-none prose-headings:text-gray-200 prose-a:text-cyan-400 hover:prose-a:text-cyan-300">
                    {content}
                </div>
            </article>
        </div>
    )
}
