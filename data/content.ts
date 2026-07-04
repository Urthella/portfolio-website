// Single source of truth for the portfolio content (real, current data).
// Edit here — the v2 components read everything from this file.

export const PHOTO = "/PP.jpg"

export const profile = {
  name: "Utku Demirtaş",
  handle: "Urthella",
  role: "Fullstack Developer",
  focus: "Backend & DevOps Engineer",
  location: "Konya, Türkiye",
  available: true,
  tagline:
    "Backend & DevOps-leaning fullstack engineer — I build production systems: real-time engines, secure APIs, CI/CD and containers. Also a guitarist and calisthenics athlete.",
  email: "utkudemirtas0@gmail.com",
  phone: "+90 507 045 16 23",
  site: "utkuwankenobi.tech",
  resume: "/Utku Demirtas CV.pdf",
  chips: ["Backend & DevOps", "Cybersecurity", "Guitarist", "Calisthenics"],
  socials: {
    github: "https://github.com/Urthella",
    linkedin: "https://www.linkedin.com/in/utkudemirtas/",
    instagram: "https://www.instagram.com/utkudem1rtas/",
    medium: "https://medium.com/@utkudemirtas0",
  },
}

export const about = {
  bio: [
    "Computer engineering student with hands-on backend and DevOps experience — most recently building the backend and document-management infrastructure of an HR platform at Extramus, with RBAC, secure uploads, CI/CD and containerized services.",
    "I like systems that have to be correct under pressure: real-time bidding engines, secure REST APIs, message queues, and the CI/CD + Docker plumbing that ships them. Comfortable across Node/TypeScript, Spring Boot/Java and Python.",
    "Outside the terminal I'm a long-time guitarist and a calisthenics athlete — the discipline of both feeds back into how I build.",
  ],
  focus:
    "Applying my backend, DevOps and AI-integration experience to build reliable, scalable systems.",
  languages: [
    { name: "Turkish", level: "Native" },
    { name: "English", level: "C1" },
    { name: "Spanish", level: "A1" },
  ],
}

export interface Experience {
  role: string
  org: string
  kind: "work" | "volunteer" | "education"
  date: string
  points: string[]
  stack?: string[]
}

export const experiences: Experience[] = [
  {
    role: "DevOps & Backend Developer",
    org: "Extramus",
    kind: "work",
    date: "Jul 2025 — Sep 2025",
    points: [
      "Built HR-management backend components and document-management infrastructure",
      "Implemented secure file-upload mechanisms with role-based access control",
      "Automated testing and deployment with GitHub Actions CI/CD pipelines",
      "Containerized backend services with Docker for consistent environments",
    ],
    stack: ["Node.js", "TypeScript", "PostgreSQL", "Docker", "GitHub Actions"],
  },
  {
    role: "R&D Engineering Intern",
    org: "Telenity (R&D)",
    kind: "work",
    date: "Jun 2024 — Aug 2024",
    points: [
      "Developed backend modules with Spring Boot",
      "Worked with Java, MongoDB, Kafka and SQL-based systems",
      "Focused on bug fixing, performance optimization and system stability",
      "Contributed to secure backend service development",
    ],
    stack: ["Spring Boot", "Java", "MongoDB", "Kafka"],
  },
  {
    role: "Educator & Co-leader",
    org: "Anticverse Tech",
    kind: "volunteer",
    date: "2022 — 2023",
    points: [
      "Helped manage the cybersecurity team",
      "Delivered training on data security and web security",
      "Led several projects and coordinated teamwork",
    ],
  },
  {
    role: "Team Leader & Design Engineer",
    org: "Teknofest — Ouroboros Team",
    kind: "volunteer",
    date: "2021 — 2022",
    points: [
      "Led the drone design and development process",
      "Managed technical coordination within the team",
    ],
  },
  {
    role: "B.Sc. Computer Engineering",
    org: "Konya Food and Agriculture University",
    kind: "education",
    date: "2022 — 2026",
    points: ["Computer engineering, with a focus on backend systems and DevOps"],
  },
]

export const skillGroups: { label: string; items: string[] }[] = [
  { label: "Languages", items: ["Java", "Python", "JavaScript", "TypeScript", "SQL", "Verilog"] },
  { label: "Frontend", items: ["Next.js", "React", "Vue.js", "Tailwind CSS"] },
  { label: "Backend", items: ["Node.js", "Express.js", "NestJS", "Spring Boot", "REST APIs"] },
  { label: "Databases", items: ["PostgreSQL", "MongoDB", "MySQL", "Redis", "Prisma"] },
  { label: "DevOps & Tools", items: ["Docker", "GitHub Actions", "Kafka", "Linux", "Postman"] },
  { label: "Security & Realtime", items: ["OWASP", "Wireshark", "Burp Suite", "WebSocket", "LiveKit"] },
]

export const marqueeTech = [
  "TypeScript", "Node.js", "NestJS", "Next.js", "React", "Spring Boot", "Java", "Python",
  "PostgreSQL", "Redis", "Prisma", "MongoDB", "Kafka", "Docker", "GitHub Actions", "Linux",
]

export type Category = "Full-stack" | "AI/ML" | "Systems" | "Security" | "Web"

export interface Project {
  name: string
  blurb: string
  stack: string[]
  category: Category
  href: string
  live?: string
  featured?: boolean
  wip?: boolean
  privateRepo?: boolean
}

export const projects: Project[] = [
  {
    name: "Okut Gitsin",
    blurb:
      "Live-stream vehicle auction platform: token-based entry, a Redis + Lua atomic bid engine, WebSocket real-time bidding, LiveKit broadcasting and an escrow payment flow.",
    stack: ["NestJS", "Next.js", "PostgreSQL", "Prisma", "Redis", "Socket.IO", "LiveKit"],
    category: "Full-stack",
    href: "https://okutgitsin.com",
    live: "https://okutgitsin.com",
    featured: true,
    privateRepo: true,
  },
  {
    name: "Reveil",
    blurb:
      "AI-assisted self-management platform: authentication, behavior tracking and AI-assisted features via prompt-based workflows over a NestJS + FastAPI backend.",
    stack: ["React Native", "NestJS", "FastAPI", "PostgreSQL", "OpenAI API"],
    category: "AI/ML",
    href: "https://github.com/Urthella/Reveil",
    featured: true,
    wip: true,
  },
  {
    name: "Costsight",
    blurb:
      "Cloud-cost anomaly detection on AWS CUR data — STL, Isolation Forest and Z-Score detectors with severity-banded alerts and a Streamlit dashboard.",
    stack: ["Python", "scikit-learn", "Streamlit", "AWS"],
    category: "AI/ML",
    href: "https://github.com/Urthella/costsight",
    featured: true,
  },
  {
    name: "Penpick",
    blurb: "A marketplace for pen collectors — Next.js 16 + Prisma on Neon Postgres.",
    stack: ["Next.js", "Prisma", "Neon Postgres", "Tailwind v4"],
    category: "Full-stack",
    href: "https://penpick.vercel.app",
    live: "https://penpick.vercel.app",
    privateRepo: true,
  },
  {
    name: "Used Car Platform",
    blurb:
      "A used-car marketplace with JWT auth, role-based access (admin / seller / buyer), favorites, in-app messaging and Cypress E2E.",
    stack: ["Next.js", "Express", "MongoDB", "Cypress"],
    category: "Full-stack",
    href: "https://github.com/Urthella/used-car-platform",
  },
  {
    name: "MIPS16 Pipeline Simulator",
    blurb:
      "A 5-stage 16-bit MIPS pipeline simulator with hazard handling (forwarding, stalls, flushes) — Java backend, React/TS frontend and Verilog RTL.",
    stack: ["Java", "React", "Verilog"],
    category: "Systems",
    href: "https://github.com/Urthella/MIPS16-pipeline-simulator",
  },
  {
    name: "Algorithm Analyzer",
    blurb:
      "A sorting-algorithm benchmarking tool (Quick / Heap / Shell / Merge / Radix) with performance and memory visualization.",
    stack: ["Spring Boot", "Java", "React", "Vite"],
    category: "Systems",
    href: "https://github.com/Urthella/algortihm-test-sim",
  },
  {
    name: "URL Scanner",
    blurb:
      "A Python tool that fetches a URL, scans the HTML for keywords, parses forms with BeautifulSoup and probes them via POST.",
    stack: ["Python", "requests", "BeautifulSoup"],
    category: "Security",
    href: "https://github.com/Urthella/url",
  },
  {
    name: "Bash Port Scanner",
    blurb: "A tiny TCP port scanner in pure Bash using /dev/tcp — sweeps ports 1–65535 on a target host.",
    stack: ["Bash", "Networking"],
    category: "Security",
    href: "https://github.com/Urthella/Bash",
  },
  {
    name: "This Portfolio",
    blurb:
      "The site you're on — Next.js 15, React 19, Tailwind and Framer Motion, with a Spline 3D scene.",
    stack: ["Next.js", "TypeScript", "Tailwind", "Framer Motion", "Spline"],
    category: "Web",
    href: "https://github.com/Urthella/portfolio-website",
  },
]

export const categories: ("All" | Category)[] = ["All", "Full-stack", "AI/ML", "Systems", "Security", "Web"]

export const hobbies: { icon: string; title: string; text: string }[] = [
  {
    icon: "music",
    title: "Music & Guitar",
    text: "8+ years across electric, classical and acoustic guitar, plus bass and drums — from classical blues to modern metal. The discipline of music feeds straight back into how I build.",
  },
  {
    icon: "dumbbell",
    title: "Fitness & Sports",
    text: "Calisthenics athlete and a former provincial basketball champion. Training keeps my focus sharp through long build sessions.",
  },
  {
    icon: "book",
    title: "Reading & RPGs",
    text: "Fantasy and sci-fi, philosophy, and immersive RPGs — fuel for creativity, perspective and problem-solving.",
  },
  {
    icon: "pen",
    title: "Collecting & Trading",
    text: "I discover, collect and trade high-quality pens, and run a small community around them (@pen.pick / penpick).",
  },
]

export const MEDIUM = "https://medium.com/@utkudemirtas0"

export const articles: { title: string; blurb: string; tag: string; href: string }[] = [
  {
    title: "The Part Where the Fun Begins: Social Engineering",
    blurb: "How social-engineering attacks actually work — and how to defend against them.",
    tag: "Security",
    href: MEDIUM,
  },
  {
    title: "SQL Injection: The Vulnerability That Never Goes Away",
    blurb: "A deep dive into SQLi — attack methods and the protection techniques that hold up.",
    tag: "Security",
    href: MEDIUM,
  },
  {
    title: "Understanding the OSI Model",
    blurb: "The layers and mechanics of the OSI model that sit under network communication.",
    tag: "Networking",
    href: MEDIUM,
  },
  {
    title: "VPN: The Secure Gateway of the Digital World",
    blurb: "How VPNs work, their real security advantages, and how to pick the right one.",
    tag: "Security",
    href: MEDIUM,
  },
]

export const services: { title: string; text: string; includes: string[] }[] = [
  {
    title: "Guitar Lessons",
    text: "Personalized instruction from beginner to advanced — technique, musicality and long-term progress.",
    includes: ["Technique & theory fundamentals", "Style-oriented practice", "Structured progression"],
  },
  {
    title: "Fitness Coaching",
    text: "Goal-oriented coaching focused on movement quality, consistency and sustainable training habits.",
    includes: ["Training structure & progression", "Exercise selection & technique", "Lifestyle-aware plans"],
  },
  {
    title: "Nutrition Guidance",
    text: "Non-clinical guidance for building sustainable eating habits and lifestyle awareness.",
    includes: ["Eating-habit analysis", "Portion & timing principles", "Nutrition education"],
  },
]
