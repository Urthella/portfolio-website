// Single source of truth for the portfolio content (real, current data).
// Edit here; the v2 components read everything from this file.

export const PHOTO = "/PP.jpg"

export const profile = {
  name: "Utku Demirtaş",
  handle: "utkudem1rtas",
  role: "Software Engineer",
  focus: "Backend · Distributed Systems · AI",
  location: "Konya, Türkiye",
  available: true,
  tagline:
    "I build the part you don't see: engines that decide in milliseconds, services that talk to each other, and AI that answers back.",
  site: "utkudemirtas.tech",
  resume: "/Utku Demirtas CV.pdf",
  chips: ["DevOps & Cloud", "Cybersecurity", "Guitarist", "Calisthenics"],
  socials: {
    github: "https://github.com/Urthella",
    linkedin: "https://www.linkedin.com/in/utkudemirtas/",
    instagram: "https://www.instagram.com/utkudem1rtas/",
    medium: "https://medium.com/@urthella1",
  },
}

export const about = {
  bio: [
    "Computer engineering graduate with hands-on backend and DevOps experience. Most recently I built the backend and document-management infrastructure of an HR platform at Extramus, with RBAC, secure uploads, CI/CD and containerized services.",
    "I like systems that have to be correct under pressure: real-time bidding engines, secure REST APIs, message queues, and the CI/CD plus Docker plumbing that ships them. Comfortable across Node/TypeScript, Spring Boot/Java and Python.",
    "Outside the terminal I'm a long-time guitarist and a calisthenics athlete, and the discipline of both feeds back into how I build.",
  ],
  focus: "Applying my backend, DevOps and AI-integration experience to build reliable, scalable systems.",
  languages: [
    { name: "Turkish", level: "Native" },
    { name: "English", level: "C1" },
    { name: "Spanish", level: "A1" },
  ],
}

// About block: one card per focus area (the heading joins their titles), plus quick stats.
export const aboutHero = {
  intro: [
    "I'm a computer engineer who ships production systems, like a live-stream auction platform and the document backend of an HR platform.",
    "Backends in Node, NestJS, Spring Boot and Python; distributed systems that stay correct under load, from atomic bid engines to sagas and job queues; and AI features grounded in real data. Docker and CI/CD ship all of it.",
  ],
  sides: [
    {
      key: "backend",
      accent: "pink",
      icon: "server",
      title: "BACKEND",
      text: "Secure REST APIs and real-time services in NestJS, Spring Boot and FastAPI.",
    },
    {
      key: "distributed",
      accent: "cyan",
      icon: "network",
      title: "DISTRIBUTED SYSTEMS",
      text: "Atomic bid engines, sagas, rate limiters and job queues over Redis, RabbitMQ and Postgres.",
    },
    {
      key: "ai",
      accent: "amber",
      icon: "brain",
      title: "AI",
      text: "RAG with pgvector and cited answers, LLM features on the OpenAI API, and ML models.",
    },
  ],
  note: "// Secure uploads, RBAC and green CI on an HR platform at Extramus, plus test and CI work merged into a dozen shipped repos.",
  stats: [
    { value: "23+", label: "Projects", accent: "lime" },
    { value: "8", label: "Languages", accent: "pink" },
    { value: "5", label: "Experiences", accent: "cyan" },
    { value: "2026", label: "Graduated", accent: "amber" },
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
    role: "Founder / Lead Developer",
    org: "Okut Gitsin",
    kind: "work",
    date: "Nov 2025 - Present",
    points: [
      "Designed and built a live-stream vehicle auction platform end to end, from data model to deployment",
      "Engineered an atomic bid engine on Redis and Lua for millisecond-level, race-free bidding",
      "Built real-time bidding over WebSocket and live video auctions with LiveKit",
      "Added an escrow payment flow (held, refunded, forfeited) with IBAN verification, Helmet CSP/HSTS, rate limiting and GitHub Actions CI/CD",
    ],
    stack: ["NestJS", "Next.js", "PostgreSQL", "Prisma", "Redis", "Socket.IO", "LiveKit"],
  },
  {
    role: "AI Trainer (Contract)",
    org: "Mercor",
    kind: "work",
    date: "Aug 2026 - Nov 2026",
    points: [
      "Scored and compared a frontier LLM's responses against task-specific quality rubrics",
      "Rewrote weak responses into reference-quality answers for text-optimization tasks",
      "Wrote prompts designed to surface failures in reasoning, accuracy and instruction-following",
      "Authored evaluation rubrics defining what a good response looks like for each task",
      "Earned Mercor's Mastering Model Mechanics certification (token prediction, prompt and context engineering)",
    ],
    stack: ["LLM evaluation", "Prompt engineering", "Rubric design", "Context engineering"],
  },
  {
    role: "DevOps & Backend Developer",
    org: "Extramus",
    kind: "work",
    date: "Jul 2025 - Sep 2025",
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
    date: "Jun 2024 - Aug 2024",
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
    date: "2022 - 2023",
    points: [
      "Helped manage the cybersecurity team",
      "Delivered training on data security and web security",
      "Led several projects and coordinated teamwork",
    ],
  },
  {
    role: "Team Leader & Design Engineer",
    org: "Teknofest / Ouroboros Team",
    kind: "volunteer",
    date: "2021 - 2022",
    points: [
      "Led the drone design and development process",
      "Managed technical coordination within the team",
    ],
  },
  {
    role: "B.Sc. Computer Engineering",
    org: "Konya Food and Agriculture University",
    kind: "education",
    date: "2022 - 2026",
    points: ["Computer engineering, with a focus on backend systems and DevOps"],
  },
]

export const skillGroups: { label: string; items: string[] }[] = [
  { label: "Languages", items: ["Java 17", "Python", "JavaScript", "TypeScript", "SQL", "Verilog"] },
  { label: "Frontend", items: ["Next.js", "React", "Tailwind CSS"] },
  { label: "Backend", items: ["Node.js", "Express.js", "NestJS", "Spring Boot 3", "REST APIs"] },
  { label: "Databases", items: ["PostgreSQL", "MongoDB", "Redis", "Prisma"] },
  { label: "DevOps & Tools", items: ["Docker", "GitHub Actions", "Kafka", "RabbitMQ", "Prometheus", "OpenTelemetry", "Linux", "Postman"] },
  { label: "Cloud & AI", items: ["AWS", "AWS ML Foundations", "OpenAI API", "FastAPI"] },
  { label: "Security & Realtime", items: ["OWASP", "Wireshark", "Burp Suite", "WebSocket", "LiveKit"] },
]

export const marqueeTech = [
  "TypeScript", "Node.js", "NestJS", "Next.js", "React", "Spring Boot", "Java", "Python",
  "PostgreSQL", "Redis", "Prisma", "MongoDB", "Kafka", "Docker", "GitHub Actions", "Linux",
]

export type Category = "Full-stack" | "AI/ML" | "Systems" | "Security" | "Web3" | "Web"

export interface Project {
  name: string
  blurb: string
  stack: string[]
  category: Category
  href: string
  live?: string
  featured?: boolean
  wip?: boolean
  waitlist?: boolean
  privateRepo?: boolean
  collab?: boolean
}

export const projects: Project[] = [
  // Flagship and the newest, most topical work first
  {
    name: "Okut Gitsin",
    blurb: "Live-stream vehicle auction platform: token-based entry, a Redis and Lua atomic bid engine, WebSocket real-time bidding, LiveKit broadcasting and an escrow payment flow. Launching soon, the waitlist is open at okutgitsin.com.",
    stack: ["NestJS", "Next.js", "PostgreSQL", "Prisma", "Redis", "Socket.IO", "LiveKit"],
    category: "Full-stack",
    href: "https://okutgitsin.com",
    live: "https://okutgitsin.com",
    featured: true,
    waitlist: true,
    privateRepo: true,
  },
  {
    name: "tiny-kv-raft",
    blurb: "A replicated key-value store on openraft, with a Jepsen-style linearizability checker that runs it under network partitions, lost messages and crashes.",
    stack: ["Rust", "openraft", "Raft", "Linearizability"],
    category: "Systems",
    href: "https://github.com/Urthella/tiny-kv-raft",
    featured: true,
  },
  {
    name: "agent-trace-viewer",
    blurb: "A local viewer for AI agent traces in OpenTelemetry's GenAI conventions: runs, model and tool calls on one timeline, failures surfaced, and tokens counted once.",
    stack: ["TypeScript", "OpenTelemetry", "GenAI", "AI agents"],
    category: "AI/ML",
    href: "https://github.com/Urthella/agent-trace-viewer",
    featured: true,
  },
  {
    name: "blob-fee-audit",
    blurb: "Recomputes Ethereum's blob fee block by block, EIP-4844 as Osaka changed it with EIP-7918, against the blob schedule the node reports, and checks the chain agrees.",
    stack: ["TypeScript", "Ethereum", "EIP-4844", "EIP-7918"],
    category: "Web3",
    href: "https://github.com/Urthella/blob-fee-audit",
    featured: true,
  },
  {
    name: "sct-check",
    blurb: "Is this certificate really in Certificate Transparency? Verifies every embedded SCT against Chrome's log list and proves inclusion, for static-ct-api (tiled) and RFC 6962 logs.",
    stack: ["TypeScript", "TLS", "X.509", "Merkle trees"],
    category: "Security",
    href: "https://github.com/Urthella/sct-check",
    featured: true,
  },
  {
    name: "raft-visualizer",
    blurb: "Raft in the browser: crash nodes, split the network and watch five safety properties checked live, including a replay of the paper's Figure 8 bug.",
    stack: ["TypeScript", "Raft", "Consensus", "Simulation"],
    category: "Systems",
    href: "https://github.com/Urthella/raft-visualizer",
  },
  {
    name: "baited",
    blurb: "Would your coding agent hand over your .env? Harmless traps for the agent you actually run, to see whether a prompt injection can talk it into it.",
    stack: ["TypeScript", "AI agents", "Prompt injection", "Sandbox"],
    category: "Security",
    href: "https://github.com/Urthella/baited",
  },
  {
    name: "mcp-postgres-guard",
    blurb: "An MCP server that lets AI agents query Postgres without being able to break it: read-only, time-limited and row-limited.",
    stack: ["Go", "MCP", "PostgreSQL", "AI agents"],
    category: "AI/ML",
    href: "https://github.com/Urthella/mcp-postgres-guard",
  },
  {
    name: "lsm-lite",
    blurb: "A small LSM-tree key-value store in Rust, tested by crashing it at every filesystem operation on a simulated disk that loses whatever wasn't synced.",
    stack: ["Rust", "LSM-tree", "WAL", "Crash testing"],
    category: "Systems",
    href: "https://github.com/Urthella/lsm-lite",
  },
  {
    name: "llm-gateway-go",
    blurb: "One OpenAI-compatible endpoint for every LLM provider: fallback, per-client keys and limits, streaming and metrics.",
    stack: ["Go", "LLM", "OpenAI-compatible", "Metrics"],
    category: "AI/ML",
    href: "https://github.com/Urthella/llm-gateway-go",
  },
  {
    name: "webhook-relay",
    blurb: "Signed webhook delivery on Postgres: retries with backoff, dead letters and redrive, Standard Webhooks signatures, and SSRF protection that checks addresses at connect time.",
    stack: ["Go", "PostgreSQL", "Standard Webhooks", "SSRF"],
    category: "Systems",
    href: "https://github.com/Urthella/webhook-relay",
  },
  {
    name: "op-fee-audit",
    blurb: "Recomputes OP Stack L1 data fees from each transaction's own bytes (FastLZ, Fjord) and checks the receipts agree, on Base, OP Mainnet and the Superchain.",
    stack: ["TypeScript", "OP Stack", "Ethereum L2", "FastLZ"],
    category: "Web3",
    href: "https://github.com/Urthella/op-fee-audit",
  },
  {
    name: "ari-check",
    blurb: "Ask the CA when to renew: reads TLS certificates and fetches their ACME Renewal Information (RFC 9773) window.",
    stack: ["TypeScript", "ACME", "TLS", "RFC 9773"],
    category: "Security",
    href: "https://github.com/Urthella/ari-check",
  },
  {
    name: "pq-hybrid-kex",
    blurb: "X-Wing, the ML-KEM-768 + X25519 hybrid post-quantum KEM, written out readably in Rust and checked against the draft's test vectors.",
    stack: ["Rust", "Post-quantum", "ML-KEM", "X25519"],
    category: "Security",
    href: "https://github.com/Urthella/pq-hybrid-kex",
  },
  {
    name: "outbox-relay",
    blurb: "Publishes committed rows of a Postgres outbox table to NATS JetStream straight from a logical replication slot, with no polling.",
    stack: ["Go", "PostgreSQL", "NATS JetStream", "Outbox"],
    category: "Systems",
    href: "https://github.com/Urthella/outbox-relay",
  },
  {
    name: "agent-memory-sqlite",
    blurb: "Persistent, searchable memory for coding agents: an MCP server on SQLite FTS5 with zero native dependencies.",
    stack: ["TypeScript", "MCP", "SQLite FTS5", "AI agents"],
    category: "AI/ML",
    href: "https://github.com/Urthella/agent-memory-sqlite",
  },
  {
    name: "cargo-trustpub",
    blurb: "How was each dependency in Cargo.lock published, Trusted Publishing or a token? Flags crates that went back to a token and checks their release runs on GitHub.",
    stack: ["Rust", "Cargo", "Supply chain", "GitHub Actions"],
    category: "Security",
    href: "https://github.com/Urthella/cargo-trustpub",
  },
  {
    name: "rs-loadgen",
    blurb: "An HTTP load generator in plain Rust that measures latency from when each request was due, so a stalled server can't hide its stall (coordinated omission).",
    stack: ["Rust", "Load testing", "HTTP", "Latency"],
    category: "Systems",
    href: "https://github.com/Urthella/rs-loadgen",
  },
  {
    name: "Penpick",
    blurb: "A marketplace for pen collectors, built with Next.js 16 and Prisma on Neon Postgres. Launching soon, the waitlist is open at penpick.com.tr.",
    stack: ["Next.js", "Prisma", "Neon Postgres", "Tailwind v4"],
    category: "Full-stack",
    href: "https://penpick.com.tr",
    live: "https://penpick.com.tr",
    wip: true,
    waitlist: true,
    privateRepo: true,
  },
  // The distributed-systems series
  {
    name: "Realtime Collab Editor",
    blurb: "Google-Docs-style collaborative editor: Yjs CRDTs synced over a custom WebSocket server, live cursors and presence, JWT sharing, and debounced snapshot persistence with version history.",
    stack: ["React", "Yjs", "WebSocket", "Node.js", "SQLite"],
    category: "Full-stack",
    href: "https://github.com/Urthella/realtime-collab-editor",
  },
  {
    name: "Distributed Rate Limiter",
    blurb: "API gateway with token bucket, sliding window and fixed window limiters, backed by atomic Redis Lua scripts so limits hold across replicas. Prometheus metrics and a Grafana dashboard.",
    stack: ["TypeScript", "Redis", "Lua", "Prometheus", "Grafana"],
    category: "Systems",
    href: "https://github.com/Urthella/distributed-rate-limiter",
  },
  {
    name: "Codebase RAG Q&A",
    blurb: "Ask questions about a repo and get answers with file:line citations: tree-sitter AST chunking, hybrid BM25 and vector retrieval, and an eval harness (94% hit@3).",
    stack: ["Python", "FastAPI", "tree-sitter", "pgvector"],
    category: "AI/ML",
    href: "https://github.com/Urthella/rag-codebase-qa",
  },
  {
    name: "Event-Driven Order System",
    blurb: "Five microservices coordinating an order saga, with compensating transactions, idempotent consumers under at-least-once delivery, and one OpenTelemetry trace per order.",
    stack: ["TypeScript", "RabbitMQ", "OpenTelemetry", "Docker"],
    category: "Systems",
    href: "https://github.com/Urthella/event-driven-order-system",
  },
  {
    name: "Job Queue Orchestrator",
    blurb: "A from-scratch mini Celery: race-safe job claiming, exponential backoff with a dead-letter queue, a crash-recovery reaper and a DAG workflow engine with a dashboard.",
    stack: ["Python", "asyncio", "FastAPI", "SQLite", "PostgreSQL"],
    category: "Systems",
    href: "https://github.com/Urthella/job-queue-orchestrator",
  },
  // Earlier work
  {
    name: "Reveil",
    blurb: "AI-assisted self-management platform: authentication, behavior tracking and AI-assisted features via prompt-based workflows over a NestJS and FastAPI backend.",
    stack: ["React Native", "NestJS", "FastAPI", "PostgreSQL", "OpenAI API"],
    category: "AI/ML",
    href: "https://github.com/Urthella/Reveil",
    wip: true,
  },
  {
    name: "Costsight",
    blurb: "Cloud-cost anomaly detection on AWS CUR data using STL, Isolation Forest and Z-Score detectors, with severity-banded alerts and a Streamlit dashboard.",
    stack: ["Python", "scikit-learn", "Streamlit", "AWS"],
    category: "AI/ML",
    href: "https://github.com/Urthella/costsight",
  },
  {
    name: "MIPS16 Pipeline Simulator",
    blurb: "A 5-stage 16-bit MIPS pipeline simulator with hazard handling (forwarding, stalls, flushes). Java 17 backend, React/TS frontend and Verilog RTL.",
    stack: ["Java 17", "React", "Verilog"],
    category: "Systems",
    href: "https://github.com/Urthella/MIPS16-pipeline-simulator",
  },
  {
    name: "This Portfolio",
    blurb: "The site you're on, built with Next.js 15, React 19, Tailwind and Framer Motion, with a WebGL fluid background.",
    stack: ["Next.js", "TypeScript", "Tailwind", "Framer Motion", "WebGL"],
    category: "Web",
    href: "https://github.com/Urthella/portfolio-website",
  },
  // Collaborations: repos where I'm a collaborator and shipped green-CI test/CI work.
  {
    name: "ragdesk",
    blurb: "Multi-tenant, AI-powered knowledge SaaS where teams chat over their own documents. I contributed the web test suite (Vitest) and wired it into CI.",
    stack: ["Next.js", "Vitest", "RAG", "CI"],
    category: "AI/ML",
    href: "https://github.com/thefcan/ragdesk",
    collab: true,
  },
  {
    name: "k8s-resilience-harness",
    blurb: "A Kubernetes resilience and chaos-testing harness in Go. I added build-info wiring and k8s-client tests to green the CI.",
    stack: ["Go", "Kubernetes", "Chaos", "CI"],
    category: "Systems",
    href: "https://github.com/thefcan/k8s-resilience-harness",
    collab: true,
  },
  {
    name: "gochain",
    blurb: "A Go blockchain exercised with race, property and fuzz testing. I contributed command-layer tests.",
    stack: ["Go", "Fuzz", "Property tests"],
    category: "Systems",
    href: "https://github.com/thefcan/gochain",
    collab: true,
  },
  {
    name: "rust-url-shortener",
    blurb: "A production-style URL shortener in Rust with Axum and Tokio. I contributed the Store trait tests.",
    stack: ["Rust", "Axum", "Tokio", "Docker"],
    category: "Systems",
    href: "https://github.com/thefcan/rust-url-shortener",
    collab: true,
  },
  {
    name: "femheat",
    blurb: "A from-scratch 2D finite-element heat-conduction solver in modern C++17. I added Point and Material GoogleTest coverage.",
    stack: ["C++17", "FEM", "GoogleTest"],
    category: "Systems",
    href: "https://github.com/thefcan/femheat",
    collab: true,
  },
]

export const categories: ("All" | Category)[] = ["All", "Full-stack", "AI/ML", "Systems", "Security", "Web3", "Web"]

export const hobbies: { icon: string; title: string; text: string }[] = [
  {
    icon: "music",
    title: "Music & Guitar",
    text: "8+ years across electric, classical and acoustic guitar, plus bass and drums, from classical blues to modern metal. The discipline of music feeds straight back into how I build.",
  },
  {
    icon: "dumbbell",
    title: "Fitness & Sports",
    text: "Calisthenics athlete and a former provincial basketball champion. Training keeps my focus sharp through long build sessions.",
  },
  {
    icon: "book",
    title: "Reading & RPGs",
    text: "Fantasy and sci-fi, philosophy, and immersive RPGs: fuel for creativity, perspective and problem-solving.",
  },
  {
    icon: "pen",
    title: "Collecting & Trading",
    text: "I discover, collect and trade high-quality pens, and run a small community around them (@pen.pick / penpick).",
  },
]

export const MEDIUM = "https://medium.com/@urthella1"

export const articles: { title: string; blurb: string; tag: string; href: string }[] = [
  {
    title: "The Part Where the Fun Begins: Social Engineering",
    blurb: "How social-engineering attacks actually work, and how to defend against them.",
    tag: "Security",
    href: MEDIUM,
  },
  {
    title: "SQL Injection: The Vulnerability That Never Goes Away",
    blurb: "A deep dive into SQLi: attack methods and the protection techniques that hold up.",
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
    text: "Personalized instruction from beginner to advanced, covering technique, musicality and long-term progress.",
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
