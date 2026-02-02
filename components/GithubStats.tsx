
"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Github, Star, GitFork, BookOpen } from 'lucide-react'
import { Badge } from "@/components/ui/badge"

interface Repo {
    id: number
    name: string
    description: string
    stargazers_count: number
    forks_count: number
    language: string
    html_url: string
}

import { repoDetails } from '@/data/projects'

export default function GithubStats() {
    const [repos, setRepos] = useState<Repo[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('https://api.github.com/users/Urthella/repos?sort=updated&per_page=6')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    // Enrich data with manual details if missing from API
                    const enrichedRepos = data.map(repo => ({
                        ...repo,
                        description: repo.description || repoDetails[repo.name]?.description || 'No description available',
                        language: repo.language || repoDetails[repo.name]?.language || undefined
                    }))
                    setRepos(enrichedRepos)
                }
                setLoading(false)
            })
            .catch(err => {
                console.error('Failed to fetch repos:', err)
                setLoading(false)
            })
    }, [])

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-20">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-5xl font-bold text-white mb-6 flex items-center justify-center gap-4">
                        <Github className="w-12 h-12 text-white" />
                        GitHub Activity
                    </h2>
                    <p className="text-xl text-gray-400">Latest contributions and open source projects</p>
                </div>

                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-48 bg-gray-900/50 rounded-xl animate-pulse border border-gray-800" />
                        ))}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {repos.map(repo => (
                            <Card key={repo.id} className="bg-gray-900/80 border-gray-800 hover:border-gray-600 transition-all duration-300 hover:-translate-y-1 group">
                                <CardHeader>
                                    <CardTitle className="text-gray-200 flex items-center justify-between">
                                        <span className="truncate pr-4">{repo.name}</span>
                                        <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                            <Github className="w-6 h-6 text-white" />
                                        </a>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-gray-400 h-12 line-clamp-2 mb-4">
                                        {repo.description || 'No description available'}
                                    </CardDescription>
                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 text-gray-300" />
                                                <span>{repo.stargazers_count}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <GitFork className="w-4 h-4 text-gray-300" />
                                                <span>{repo.forks_count}</span>
                                            </div>
                                        </div>
                                        {repo.language && (
                                            <Badge variant="outline" className="border-gray-700 text-gray-300">
                                                {repo.language}
                                            </Badge>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                <div className="mt-12 text-center">
                    <img
                        src="https://ghchart.rshah.org/Urthella"
                        alt="Urthella's Github Chart"
                        className="mx-auto opacity-80 hover:opacity-100 transition-opacity filter grayscale invert"
                    />
                </div>
            </div>
        </section>
    )
}
