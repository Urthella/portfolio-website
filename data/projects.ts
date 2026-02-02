
export interface Repo {
    id: number
    name: string
    description: string
    stargazers_count: number
    forks_count: number
    language: string
    html_url: string
}

export const repoDetails: Record<string, { description?: string, language?: string }> = {
    "portfolio-website": {
        description: "My personal portfolio website built with Next.js, TypeScript, and Tailwind CSS. Features interactive terminal, blog system, and modern UI.",
        language: "TypeScript"
    },
    "Reveil": {
        description: "A comprehensive backend and optional mobile application system. Includes advanced authentication and AI integration.",
        language: "TypeScript"
    },
    "Urthella": {
        description: "My personal configuration and profile repository.",
        language: "Markdown"
    },
    "algortihm-test-sim": {
        description: "Algorithm testing simulation environment for performance analysis and visualization.",
        language: "TypeScript"
    },
    "-MIPS16-pipeline-sim": {
        description: "A simulation of the MIPS16 pipeline architecture for educational purposes.",
        language: "TypeScript"
    },
    "atomic-challanges": {
        description: "Collection of atomic coding challenges and solutions for practicing problem-solving skills.",
        language: "TypeScript"
    }
}
