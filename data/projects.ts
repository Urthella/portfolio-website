
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
        description: "Personal portfolio built with Next.js 15, React 19, Tailwind, shadcn/ui — features a 3D Spline scene, bilingual TR/EN content, interactive terminal, and EmailJS contact form.",
        language: "TypeScript"
    },
    "Reveil": {
        description: "AI-powered habit-tracking mobile app — React Native (Expo) front-end + NestJS API + FastAPI AI engine, PostgreSQL persistence.",
        language: "TypeScript"
    },
    "costsight": {
        description: "Cloud cost anomaly detection on AWS CUR data — STL, Isolation Forest, and Z-Score detectors with severity-banded alerts and a Streamlit dashboard.",
        language: "Python"
    },
    "used-car-platform": {
        description: "Used-car marketplace — Next.js 14 + Node/Express + MongoDB with JWT auth, role-based access (admin/seller/buyer), favorites, messaging, and Cypress E2E.",
        language: "TypeScript"
    },
    "MIPS16-pipeline-simulator": {
        description: "5-stage 16-bit MIPS pipeline simulator with hazard detection (forwarding, stalls, flushes) — Java backend (Javalin), React/TS frontend, and Verilog RTL.",
        language: "TypeScript"
    },
    "algortihm-test-sim": {
        description: "Sorting algorithm benchmarking suite — Quick/Heap/Shell/Merge/Radix on Random/Sorted/Reverse data, with Spring Boot API + React UI.",
        language: "TypeScript"
    },
    "Urthella": {
        description: "My personal configuration and profile repository.",
        language: "Markdown"
    }
}
