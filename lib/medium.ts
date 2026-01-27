
interface MediumFeedItem {
    title: string
    pubDate: string
    link: string
    guid: string
    author: string
    thumbnail: string
    description: string
    content: string
    categories: string[]
}

interface MediumFeed {
    status: string
    feed: {
        url: string
        title: string
        link: string
        author: string
        description: string
        image: string
    }
    items: MediumFeedItem[]
}

export async function getMediumPosts(username: string): Promise<MediumFeedItem[]> {
    try {
        const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@${username}`)
        const data: MediumFeed = await res.json()

        if (data.status === 'ok') {
            return data.items
        }
        return []
    } catch (error) {
        console.error('Error fetching Medium posts:', error)
        return []
    }
}
