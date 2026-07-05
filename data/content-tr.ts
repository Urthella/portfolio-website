// Turkish content bundle. Same shape as the EN bundle in data/i18n.tsx.
// Non-translated fields (names, links, stacks, tech, socials) stay as-is.

export const tr = {
  profile: {
    role: "Fullstack Geliştirici",
    focus: "Backend & DevOps Mühendisi",
    tagline:
      "Backend ve DevOps ağırlıklı fullstack mühendisi. Prodüksiyon sistemleri kuruyorum: gerçek zamanlı motorlar, güvenli API'ler, CI/CD ve konteynerler. Ayrıca gitarist ve kalisteni sporcusuyum.",
    chips: ["Backend & DevOps", "Siber Güvenlik", "Gitarist", "Kalisteni"],
  },

  about: {
    bio: [
      "Uygulamalı backend ve DevOps deneyimi olan bir bilgisayar mühendisliği öğrencisiyim. En son Extramus'ta bir İK platformunun backend ve doküman yönetim altyapısını kurdum: RBAC, güvenli yüklemeler, CI/CD ve konteynerize servisler.",
      "Baskı altında doğru çalışması gereken sistemleri severim: gerçek zamanlı teklif motorları, güvenli REST API'ler, mesaj kuyrukları ve bunları taşıyan CI/CD artı Docker altyapısı. Node/TypeScript, Spring Boot/Java ve Python arasında rahatım.",
      "Terminalin dışında uzun yıllardır gitaristim ve kalisteni sporcusuyum; her ikisinin disiplini de nasıl kod yazdığıma geri besleniyor.",
    ],
    focus: "Backend, DevOps ve yapay zeka entegrasyonu deneyimimi güvenilir, ölçeklenebilir sistemler kurmak için uyguluyorum.",
    languages: [
      { name: "Türkçe", level: "Ana dil" },
      { name: "İngilizce", level: "C1" },
      { name: "İspanyolca", level: "A1" },
    ],
  },

  aboutHero: {
    lead: "BACKEND",
    tail: "DEVOPS",
    intro: [
      "Gerçek zamanlı açık artırma motorlarından Kubernetes dayanıklılık testlerine kadar prodüksiyon sistemleri geliştiren bir bilgisayar mühendisiyim.",
      "Bir tarafta Node, NestJS, Spring Boot ve Python ile ölçeklenebilir backend'ler. Diğer tarafta bunları taşıyan Docker, CI/CD ve bulut altyapısı. İkisini de gerçek projelerle besliyorum.",
    ],
    sides: [
      {
        key: "backend",
        accent: "pink",
        icon: "server",
        title: "BACKEND TARAFI",
        text: "Gerçek zamanlı teklif motorları, güvenli REST API'ler, mesaj kuyrukları ve veritabanları. Node/TypeScript, Spring Boot/Java ve Python.",
      },
      {
        key: "devops",
        accent: "cyan",
        icon: "container",
        title: "DEVOPS TARAFI",
        text: "Dockerize servisler, GitHub Actions CI/CD, Kubernetes dayanıklılığı ve güvenli, konteynerize dağıtımlar.",
      },
    ],
    note: "// Extramus'ta bir İK platformunda güvenli yüklemeler, RBAC ve yeşil CI, artı bir düzine projede birleştirilen test ve CI çalışması.",
    stats: [
      { value: "18+", label: "Proje", accent: "lime" },
      { value: "8", label: "Dil", accent: "pink" },
      { value: "5", label: "Deneyim", accent: "cyan" },
      { value: "2026", label: "Mezuniyet", accent: "amber" },
    ],
  },

  experiences: [
    {
      role: "Kurucu & Fullstack Mühendis",
      org: "Okut Gitsin",
      kind: "work",
      date: "Kas 2025 - Günümüz",
      points: [
        "Canlı yayınlı araç açık artırma platformunu uçtan uca tasarlayıp geliştirdim: veri modelinden dağıtıma",
        "Redis ve Lua ile milisaniye seviyesinde, yarışsız teklif için atomik bir teklif motoru kurdum",
        "WebSocket ile gerçek zamanlı teklif ve LiveKit ile canlı video açık artırması geliştirdim",
        "Emanet ödeme akışı (bloke, iade, temerrüt) ve IBAN doğrulaması, Helmet CSP/HSTS, rate limiting ve GitHub Actions CI/CD ekledim",
      ],
      stack: ["NestJS", "Next.js", "PostgreSQL", "Prisma", "Redis", "Socket.IO", "LiveKit"],
    },
    {
      role: "DevOps ve Backend Geliştirici",
      org: "Extramus",
      kind: "work",
      date: "Tem 2025 - Eyl 2025",
      points: [
        "İK yönetim backend bileşenlerini ve doküman yönetim altyapısını kurdum",
        "Rol tabanlı erişim kontrolü ile güvenli dosya yükleme mekanizmaları geliştirdim",
        "GitHub Actions CI/CD hatlarıyla test ve dağıtımı otomatikleştirdim",
        "Tutarlı ortamlar için backend servislerini Docker ile konteynerize ettim",
      ],
      stack: ["Node.js", "TypeScript", "PostgreSQL", "Docker", "GitHub Actions"],
    },
    {
      role: "Ar-Ge Mühendislik Stajyeri",
      org: "Telenity (Ar-Ge)",
      kind: "work",
      date: "Haz 2024 - Ağu 2024",
      points: [
        "Spring Boot ile backend modülleri geliştirdim",
        "Java, MongoDB, Kafka ve SQL tabanlı sistemlerle çalıştım",
        "Hata ayıklama, performans optimizasyonu ve sistem kararlılığına odaklandım",
        "Güvenli backend servis geliştirmeye katkı sağladım",
      ],
      stack: ["Spring Boot", "Java", "MongoDB", "Kafka"],
    },
    {
      role: "Eğitmen ve Yardımcı Lider",
      org: "Anticverse Tech",
      kind: "volunteer",
      date: "2022 - 2023",
      points: [
        "Siber güvenlik ekibinin yönetimine yardımcı oldum",
        "Veri güvenliği ve web güvenliği eğitimleri verdim",
        "Birçok projeye liderlik ettim ve ekip çalışmasını koordine ettim",
      ],
    },
    {
      role: "Takım Lideri ve Tasarım Mühendisi",
      org: "Teknofest / Ouroboros Takımı",
      kind: "volunteer",
      date: "2021 - 2022",
      points: [
        "Drone tasarım ve geliştirme sürecine liderlik ettim",
        "Ekip içi teknik koordinasyonu yönettim",
      ],
    },
    {
      role: "Bilgisayar Mühendisliği Lisans",
      org: "Konya Gıda ve Tarım Üniversitesi",
      kind: "education",
      date: "2022 - 2026",
      points: ["Backend sistemleri ve DevOps odağıyla bilgisayar mühendisliği"],
    },
  ],

  skillGroups: [
    { label: "Diller", items: ["Java", "Python", "JavaScript", "TypeScript", "SQL", "Verilog"] },
    { label: "Frontend", items: ["Next.js", "React", "Vue.js", "Tailwind CSS"] },
    { label: "Backend", items: ["Node.js", "Express.js", "NestJS", "Spring Boot", "REST API"] },
    { label: "Veritabanları", items: ["PostgreSQL", "MongoDB", "MySQL", "Redis", "Prisma"] },
    { label: "DevOps ve Araçlar", items: ["Docker", "GitHub Actions", "Kafka", "Linux", "Postman"] },
    { label: "Bulut ve Yapay Zeka", items: ["AWS", "AWS ML Foundations", "OpenAI API", "FastAPI"] },
    { label: "Güvenlik ve Gerçek Zamanlı", items: ["OWASP", "Wireshark", "Burp Suite", "WebSocket", "LiveKit"] },
  ],

  projects: [
    {
      name: "Okut Gitsin",
      blurb:
        "Canlı yayınlı araç açık artırma platformu: token tabanlı giriş, Redis ve Lua ile atomik teklif motoru, WebSocket ile gerçek zamanlı teklif, LiveKit yayını ve emanet ödeme akışı.",
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
        "Yapay zeka destekli öz yönetim platformu: kimlik doğrulama, davranış takibi ve NestJS ile FastAPI backend üzerinde prompt tabanlı yapay zeka özellikleri.",
      stack: ["React Native", "NestJS", "FastAPI", "PostgreSQL", "OpenAI API"],
      category: "AI/ML",
      href: "https://github.com/Urthella/Reveil",
      featured: true,
      wip: true,
    },
    {
      name: "Costsight",
      blurb:
        "AWS CUR verisinde bulut maliyet anomali tespiti: STL, Isolation Forest ve Z-Score dedektörleri, önem seviyesine göre uyarılar ve Streamlit paneli.",
      stack: ["Python", "scikit-learn", "Streamlit", "AWS"],
      category: "AI/ML",
      href: "https://github.com/Urthella/costsight",
      featured: true,
    },
    {
      name: "Penpick",
      blurb:
        "Kalem koleksiyoncuları için pazar yeri; Next.js 16 ve Neon Postgres üzerinde Prisma ile kuruldu. Hala geliştiriliyor, penpick.vercel.app'te canlı bir önizleme var.",
      stack: ["Next.js", "Prisma", "Neon Postgres", "Tailwind v4"],
      category: "Full-stack",
      href: "https://penpick.vercel.app",
      live: "https://penpick.vercel.app",
      privateRepo: true,
      wip: true,
    },
    {
      name: "Used Car Platform",
      blurb:
        "JWT kimlik doğrulama, rol tabanlı erişim (admin, satıcı, alıcı), favoriler, uygulama içi mesajlaşma ve Cypress E2E içeren ikinci el araç pazar yeri.",
      stack: ["Next.js", "Express", "MongoDB", "Cypress"],
      category: "Full-stack",
      href: "https://github.com/Urthella/used-car-platform",
    },
    {
      name: "MIPS16 Pipeline Simulator",
      blurb:
        "Tehlike yönetimli (forwarding, stall, flush) 5 aşamalı 16-bit MIPS pipeline simülatörü. Java backend, React/TS frontend ve Verilog RTL.",
      stack: ["Java", "React", "Verilog"],
      category: "Systems",
      href: "https://github.com/Urthella/MIPS16-pipeline-simulator",
    },
    {
      name: "Algorithm Analyzer",
      blurb:
        "Performans ve bellek görselleştirmeli sıralama algoritması kıyaslama aracı (Quick, Heap, Shell, Merge, Radix).",
      stack: ["Spring Boot", "Java", "React", "Vite"],
      category: "Systems",
      href: "https://github.com/Urthella/algortihm-test-sim",
    },
    {
      name: "URL Scanner",
      blurb:
        "Bir URL'yi çeken, HTML'i anahtar kelimeler için tarayan, formları BeautifulSoup ile ayrıştırıp POST ile yoklayan bir Python aracı.",
      stack: ["Python", "requests", "BeautifulSoup"],
      category: "Security",
      href: "https://github.com/Urthella/url",
    },
    {
      name: "Bash Port Scanner",
      blurb: "Hedef bir hostta 1'den 65535'e portları tarayan, /dev/tcp kullanan saf Bash ile yazılmış küçük bir TCP port tarayıcı.",
      stack: ["Bash", "Networking"],
      category: "Security",
      href: "https://github.com/Urthella/Bash",
    },
    {
      name: "This Portfolio",
      blurb:
        "Şu an gezdiğin site; Next.js 15, React 19, Tailwind ve Framer Motion ile, WebGL akışkan arka plan içerir.",
      stack: ["Next.js", "TypeScript", "Tailwind", "Framer Motion", "WebGL"],
      category: "Web",
      href: "https://github.com/Urthella/portfolio-website",
    },
    {
      name: "ragdesk",
      blurb:
        "Ekiplerin kendi dokümanları üzerinden sohbet ettiği çok kiracılı, yapay zeka destekli bilgi SaaS'ı. Web test paketini (Vitest) yazıp CI'a bağladım.",
      stack: ["Next.js", "Vitest", "RAG", "CI"],
      category: "AI/ML",
      href: "https://github.com/thefcan/ragdesk",
      collab: true,
    },
    {
      name: "k8s-resilience-harness",
      blurb: "Go ile yazılmış bir Kubernetes dayanıklılık ve kaos test aracı. CI'ı yeşile çevirmek için build-info ve k8s-client testleri ekledim.",
      stack: ["Go", "Kubernetes", "Chaos", "CI"],
      category: "Systems",
      href: "https://github.com/thefcan/k8s-resilience-harness",
      collab: true,
    },
    {
      name: "gochain",
      blurb: "Race, property ve fuzz testleriyle sınanan bir Go blockchain. Komut katmanı testlerine katkı sağladım.",
      stack: ["Go", "Fuzz", "Property tests"],
      category: "Systems",
      href: "https://github.com/thefcan/gochain",
      collab: true,
    },
    {
      name: "gocontainer",
      blurb: "Go ile yazılmış minimal bir Linux konteyner çalışma zamanı. Config yardımcıları, testler ve bir go-test CI adımı ekledim.",
      stack: ["Go", "Linux", "Namespaces", "CI"],
      category: "Systems",
      href: "https://github.com/thefcan/gocontainer",
      collab: true,
    },
    {
      name: "rust-url-shortener",
      blurb: "Rust, Axum ve Tokio ile prodüksiyon tarzı bir URL kısaltıcı. Store trait testlerine katkı sağladım.",
      stack: ["Rust", "Axum", "Tokio", "Docker"],
      category: "Systems",
      href: "https://github.com/thefcan/rust-url-shortener",
      collab: true,
    },
    {
      name: "femheat",
      blurb: "Modern C++17 ile sıfırdan yazılmış 2B sonlu elemanlar ısı iletim çözücüsü. Point ve Material için GoogleTest kapsamı ekledim.",
      stack: ["C++17", "FEM", "GoogleTest"],
      category: "Systems",
      href: "https://github.com/thefcan/femheat",
      collab: true,
    },
    {
      name: "dolap-sale-prediction",
      blurb: "Bir Dolap ilanının 7 gün içinde satılıp satılmayacağını tahmin eden uçtan uca bir ML projesi. Pytest paketini ve ilk CI akışını kurdum.",
      stack: ["Python", "scikit-learn", "pytest", "CI"],
      category: "AI/ML",
      href: "https://github.com/thefcan/dolap-sale-prediction",
      collab: true,
    },
    {
      name: "unity-match3",
      blurb: "Temiz mimari üzerine kurulu, süre yarışı bir Unity match-3 bulmacası. game-ci test akışını ekledim.",
      stack: ["Unity", "C#", "game-ci"],
      category: "Systems",
      href: "https://github.com/thefcan/unity-match3",
      collab: true,
    },
  ],

  hobbies: [
    {
      icon: "music",
      title: "Müzik ve Gitar",
      text: "Elektro, klasik ve akustik gitarda 8+ yıl, ayrıca bas ve davul; klasik bluestan modern metale. Müziğin disiplini doğrudan nasıl kod yazdığıma geri besleniyor.",
    },
    {
      icon: "dumbbell",
      title: "Fitness ve Spor",
      text: "Kalisteni sporcusu ve eski bir il basketbol şampiyonu. Antrenman, uzun geliştirme seanslarında odağımı keskin tutuyor.",
    },
    {
      icon: "book",
      title: "Okuma ve RPG",
      text: "Fantastik ve bilim kurgu, felsefe ve sürükleyici RPG'ler: yaratıcılık, bakış açısı ve problem çözme için yakıt.",
    },
    {
      icon: "pen",
      title: "Koleksiyon ve Takas",
      text: "Kaliteli kalemler keşfeder, biriktirir ve takas ederim; etrafında küçük bir topluluk yürütüyorum (@pen.pick / penpick).",
    },
  ],

  articles: [
    {
      title: "İşin Eğlenceli Kısmı: Sosyal Mühendislik",
      blurb: "Sosyal mühendislik saldırıları gerçekte nasıl işler ve onlara karşı nasıl savunma yapılır.",
      tag: "Güvenlik",
    },
    {
      title: "SQL Injection: Asla Bitmeyen Zafiyet",
      blurb: "SQLi'ye derin bir bakış: saldırı yöntemleri ve gerçekten işe yarayan korunma teknikleri.",
      tag: "Güvenlik",
    },
    {
      title: "OSI Modelini Anlamak",
      blurb: "Ağ iletişiminin altında yatan OSI modelinin katmanları ve mekanikleri.",
      tag: "Ağ",
    },
    {
      title: "VPN: Dijital Dünyanın Güvenli Geçidi",
      blurb: "VPN'ler nasıl çalışır, gerçek güvenlik avantajları nelerdir ve doğru olanı nasıl seçilir.",
      tag: "Güvenlik",
    },
  ],

  services: [
    {
      title: "Gitar Dersleri",
      text: "Başlangıçtan ileri seviyeye kişiye özel eğitim; teknik, müzikalite ve uzun vadeli ilerleme.",
      includes: ["Teknik ve teori temelleri", "Tarza yönelik pratik", "Yapılandırılmış ilerleme"],
    },
    {
      title: "Fitness Koçluğu",
      text: "Hareket kalitesi, süreklilik ve sürdürülebilir antrenman alışkanlıklarına odaklı hedef odaklı koçluk.",
      includes: ["Antrenman yapısı ve ilerleme", "Egzersiz seçimi ve teknik", "Yaşam tarzına uygun planlar"],
    },
    {
      title: "Beslenme Rehberliği",
      text: "Sürdürülebilir beslenme alışkanlıkları ve yaşam tarzı farkındalığı için klinik olmayan rehberlik.",
      includes: ["Beslenme alışkanlığı analizi", "Porsiyon ve zamanlama ilkeleri", "Beslenme eğitimi"],
    },
  ],

  ui: {
    nav: { about: "Hakkımda", experience: "Deneyim", skills: "Yetenekler", projects: "Projeler", hobbies: "Hobiler", contact: "İletişim", blog: "Blog" },
    hero: {
      rotating: ["Fullstack Geliştirici", "Backend & DevOps", "Gerçek zamanlı sistemler", "Güvenli API'ler"],
      viewProjects: "Projeleri gör",
      resume: "Özgeçmiş",
    },
    idcard: {
      access: "// ERİŞİM",
      allAreas: "TÜM ALANLAR",
      contact: "// İLETİŞİM",
      findOnline: "// çevrimiçi bul",
      flipBack: "geri çevirmek için dokun",
      clickFlip: "çevirmek için karta tıkla",
      statusAvailable: "İşe müsait",
    },
    headings: {
      about: { label: "Hakkımda" },
      experience: { label: "Deneyim", title: "Nerelerde bulundum" },
      skills: { label: "Yetenekler", title: "Kullandığım teknolojiler" },
      featured: {
        label: "Öne çıkanlar",
        title: "Ürettiklerim",
        subtitle: "En gurur duyduğum işlere dönen bir bakış; pazar yerlerinden bunları taşıyan CI/CD'ye.",
        seeAll: "Tüm projeleri gör",
      },
      projects: {
        label: "Projeler",
        title: "Seçili işler",
        subtitle: "Açık artırma motorları, ML dedektörleri, işlemci simülatörleri ve güvenlik araçları. Stack boyunca bir yelpaze, artı katkı verdiğim repolar.",
        collab: "iş birliği",
      },
      hobbies: {
        label: "Kodun ötesi",
        title: "Klavye dışında",
        subtitle: "Beni keskin, yaratıcı ve biraz inatçı tutan disiplinler.",
      },
      services: {
        label: "Koçluk",
        title: "Aynı zamanda koçluk yapıyorum",
        subtitle: "Yılların pratiği, paylaşıldı: gitar, antrenman ve sürdürülebilir beslenme alışkanlıkları.",
      },
      articles: {
        label: "Yazılar",
        title: "Medium'da",
        subtitle: "Güvenlik, ağ ve zanaat üzerine notlar.",
      },
      contact: {
        label: "İletişim",
        title: "Bir şeyler inşa edelim",
        subtitle: "Stajlara, freelance işlere ve iş birliğine açığım. Bir mesaj bırak, en kısa sürede dönerim.",
      },
    },
    featured: {
      cards: [
        { title: "Okut Gitsin", tag: "Amiral Gemisi SaaS", desc: "Canlı yayınlı araç açık artırma platformu: gerçek zamanlı teklif, güvenli ödeme, okutgitsin.com'da canlı." },
        { title: "Penpick", tag: "Geliştiriliyor", desc: "Kalem koleksiyoncuları için pazar yeri, hala geliştiriliyor, canlı önizleme penpick.vercel.app." },
        { title: "Extramus İK", tag: "Backend ve Güvenlik", desc: "İK platformu backend'i: RBAC, güvenli yüklemeler, yük altında konteynerize servisler." },
        { title: "CI/CD Altyapısı", tag: "DevOps", desc: "Bir düzine projede Dockerize hatlar ve yeşil GitHub Actions." },
      ],
    },
    github: {
      title: "// github @Urthella",
      viewProfile: "profili gör →",
      heatmap: "katkı (son bir yıl)",
      stats: [
        { value: "10+", label: "Açık repo" },
        { value: "8", label: "Birleşen PR (2026)" },
        { value: "6", label: "Kullanılan dil" },
      ],
    },
    contact: {
      name: "Ad",
      email: "E-posta",
      message: "Mesaj",
      send: "Mesaj gönder",
      sending: "Gönderiliyor…",
      success: "Mesaj gönderildi, en kısa sürede dönerim. Teşekkürler!",
      error: "Bir şeyler ters gitti, doğrudan e-posta gönder.",
      findMe: "// çevrimiçi bul",
      backToTop: "Başa dön",
      built: "Next.js & Framer Motion ile yapıldı.",
      dragWords: "kelimeleri sürükle ↔",
      falling: "Backend DevOps ve Güvenlik odaklı. Node TypeScript Java Spring Kafka Docker CI/CD Redis Postgres. güvenilir bir şeyler inşa edelim",
      fallingHl: ["backend", "devops", "güvenlik", "inşa", "edelim", "güvenilir"],
    },
    snap: {
      kicker: "// mükemmel denge",
      line: "Bir sonraki tasarımın bir şıklatma uzağında.",
      snap: "parmaklarını şıklat",
      restore: "evreni geri getir",
    },
    statement: ["GERÇEK ZAMANLI SİSTEMLER", "GÜVENLİ API'LER. TEMİZ CI/CD.", "BACKEND, DEVOPS VE KAOS", "HADİ BİR ŞEY İNŞA EDELİM"],
    showcase: { featured: "// öne çıkan", name: "Okut Gitsin", caption: "Bir canlı açık artırma platformu, içiyle dışıyla." },
    terminal: {
      whoami: "Halil Utku Demirtaş, backend & devops ağırlıklı fullstack mühendisi",
    },
  },
}
