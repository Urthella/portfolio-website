
import fs from 'fs'
import path from 'path'
import { compileMDX } from 'next-mdx-remote/rsc'

const postsDirectory = path.join(process.cwd(), 'content/posts')

export async function getPostBySlug(slug: string) {
    const realSlug = slug.replace(/\.mdx$/, '')
    const fullPath = path.join(postsDirectory, `${realSlug}.mdx`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    const { content, frontmatter } = await compileMDX<{ title: string; date: string; description: string; tags: string[] }>({
        source: fileContents,
        options: { parseFrontmatter: true }
    })

    return { slug: realSlug, frontmatter, content }
}

export async function getAllPosts() {
    if (!fs.existsSync(postsDirectory)) {
        return []
    }

    const files = fs.readdirSync(postsDirectory)
    const posts = await Promise.all(
        files.map(async (file) => {
            const { slug, frontmatter } = await getPostBySlug(file)
            return { slug, frontmatter }
        })
    )

    // Sort posts by date in descending order
    return posts.sort((a, b) => (a.frontmatter.date < b.frontmatter.date ? 1 : -1))
}
