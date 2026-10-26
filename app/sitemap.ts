import type { MetadataRoute } from 'next'

const ROUTES = ['', '/about', '/projects', '/writing', '/beyond', '/desktop']

export default function sitemap(): MetadataRoute.Sitemap {
    return ROUTES.map((route) => ({
        url: `https://utkudemirtas.tech${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: route === '' ? 1 : 0.8,
    }))
}
