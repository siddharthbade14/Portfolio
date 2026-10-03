// ============================================================
// data.ts — Single source of truth for Siddharth Bade's portfolio
// Sourced directly from official Resume and verified credentials
// ============================================================

export const personal = {
  name: 'Siddharth Bade',
  firstName: 'Siddharth',
  lastName: 'Bade',
  role: 'AI & Data Science Engineer',
  roleTag: 'AI & DATA SCIENCE ENGINEER',
  location: 'Ahilyanagar, Maharashtra, India',
  phone: '+91 9217212223',
  phoneRaw: '9217212223',
  email: 'siddharthsanjaybade212223@gmail.com',
  linkedin: 'https://linkedin.com/in/siddharth-bade-348184316',
  github: 'https://github.com/siddharthbade14',
  whatsapp: 'https://wa.me/919217212223',
  twitter: 'https://x.com/siddharthbade14',
  instagram: 'https://www.instagram.com/notsidatall',
  nexstepLive: 'https://nex-step-three.vercel.app',
  summary:
    'Third-year B.Tech Artificial Intelligence & Data Science student (ranked 1st in first-year batch, SGPA 8.47/10) who ships working projects end to end: NexStep, a full-stack AI career platform built for Smart India Hackathon 2026, and an OpenAI-powered voice assistant. Strong in Python, OOP and REST API development. Seeking a software development, backend or AI/ML internship.',
  bio1:
    "I'm an aspiring AI & Data Science Engineer and 3rd-year engineering student at Adsul's Technical Campus, Ahilyanagar. Ranked 1st across the combined first-year batch with an 8.47/10 SGPA. I specialize in building end-to-end intelligent systems, machine learning applications, and full-stack web platforms.",
  bio2:
    "From architecting NexStep (a full-stack AI career guidance platform for Smart India Hackathon 2026 as sole developer) to developing continuous hands-free voice assistants with OpenAI API and speech recognition, I focus on shipping robust software with clean code and production-grade architectures.",
  resumeUrl: '#',
}

export const stats = [
  { value: 8.47, suffix: '', label: 'First-Year SGPA', decimals: 2 },
  { value: 1, suffix: 'st', label: 'Batch Rank', decimals: 0 },
  { value: 5, suffix: '+', label: 'Projects Built', decimals: 0 },
  { value: 2024, suffix: '', label: 'College Batch', decimals: 0 },
]

export const skillsCarousel = [
  { name: 'Python', icon: 'devicon-python-plain' },
  { name: 'FastAPI', icon: 'devicon-fastapi-plain' },
  { name: 'React.js', icon: 'devicon-react-original' },
  { name: 'Java', icon: 'devicon-java-plain' },
  { name: 'C++', icon: 'devicon-cplusplus-plain' },
  { name: 'JavaScript', icon: 'devicon-javascript-plain' },
  { name: 'Tailwind CSS', icon: 'devicon-tailwindcss-plain' },
  { name: 'SQLite', icon: 'devicon-sqlite-plain' },
  { name: 'Git', icon: 'devicon-git-plain' },
  { name: 'GitHub', icon: 'devicon-github-original' },
  { name: 'Flutter', icon: 'devicon-flutter-plain' },
  { name: 'Vercel', icon: 'devicon-vercel-original' },
]

// 1:1 match with resume Technical Skills section
export const skills = [
  {
    category: 'Languages',
    color: '#38bdf8',
    items: ['Python', 'Java', 'C++', 'JavaScript'],
  },
  {
    category: 'Frameworks & Libraries',
    color: '#ef4444',
    items: ['FastAPI', 'React.js', 'Tailwind CSS', 'Flutter', 'sentence-transformers'],
  },
  {
    category: 'APIs & Data',
    color: '#38bdf8',
    items: ['REST API design & integration', 'OpenAI API', 'Judge0 API', 'SQLite'],
  },
  {
    category: 'Core Computer Science',
    color: '#a855f7',
    items: ['Data Structures & Algorithms', 'Object-Oriented Programming (OOP)', 'Operating Systems'],
  },
  {
    category: 'Tools & DevOps',
    color: '#10b981',
    items: ['Git', 'GitHub', 'Vercel', 'Python Virtual Environments'],
  },
]

export interface ProjectDetail {
  id: string
  title: string
  role: string
  badge: string
  badgeIcon: string
  subtitle: string
  description: string
  image: string
  tags: string[]
  github: string
  liveUrl: string | null
  featured: boolean
  bullets: string[]
  features: Array<{
    title: string
    desc: string
    icon: string
  }>
  architecture: {
    overview: string
    steps: Array<{
      step: string
      title: string
      desc: string
      icon: string
    }>
    techStack: Array<{
      label: string
      value: string
      icon: string
    }>
  }
}

export const projects: ProjectDetail[] = [
  {
    id: 'nexstep',
    title: 'NexStep: AI-Verified Career Guidance Platform',
    role: 'Smart India Hackathon 2026 (Team Project; Sole Developer)',
    badge: 'SIH 2026 Featured',
    badgeIcon: 'fa-solid fa-fire',
    subtitle: 'Full-stack AI career platform comparing B.Tech CSE/ECE syllabi against industry roles',
    description:
      'Solely designed and built a full-stack platform (React + FastAPI, 7 core user flows) that compares university syllabi against 3 industry roles to pinpoint skill gaps with sandboxed Judge0 code evaluation.',
    image: '/projects/nexstep.jpg',
    tags: ['React', 'Vite', 'Tailwind CSS', 'FastAPI', 'SQLite', 'sentence-transformers', 'Judge0 API'],
    github: 'https://github.com/siddharthbade14/NexStep',
    liveUrl: 'https://nex-step-three.vercel.app',
    featured: true,
    bullets: [
      'Solely designed and built a full-stack platform (React + FastAPI, 7 core user flows) that compares B.Tech CSE/ECE syllabi against 3 industry roles to pinpoint the exact skills a student is missing.',
      'Implemented semantic gap analysis using sentence-transformers (all-MiniLM-L6-v2) embeddings to compute an industry-readiness score and rank skill gaps.',
      'Developed a sandboxed Python code runner with Judge0 API integration that auto-grades submissions against 3 test cases, marking a skill verified only on passing, not on self-reported claims.',
      'Created sequenced learning milestones with re-check quizzes and an internship matcher over 12 Indian tech internships that explains "why you qualify"; deployed the frontend on Vercel.',
    ],
    features: [
      {
        title: '7 Core Full-Stack User Flows',
        desc: 'Sole developer who built the complete user journey: syllabus ingestion, role selection, skill diagnostics, verification, learning path, and internship matching.',
        icon: 'fa-solid fa-sitemap',
      },
      {
        title: 'Semantic Gap Analysis (all-MiniLM-L6-v2)',
        desc: 'Generates dense vector embeddings using sentence-transformers to calculate a true readiness percentage and dynamically prioritize high-impact skill deficiencies.',
        icon: 'fa-solid fa-brain',
      },
      {
        title: 'Sandboxed Python Runner (Judge0 API)',
        desc: 'Integrates automated code execution that evaluates candidate solutions against 3 test cases, certifying verified capability over unsubstantiated resume bullet points.',
        icon: 'fa-solid fa-code',
      },
      {
        title: 'Sequenced Milestones & 12 Internship Matches',
        desc: 'Curated milestone pathways with re-check quizzes and an intelligent internship recommendation algorithm matching candidates to opportunities at Swiggy, Zerodha, and CRED.',
        icon: 'fa-solid fa-graduation-cap',
      },
    ],
    architecture: {
      overview:
        'Engineered as a decoupled full-stack architecture: a high-speed React + Vite client consuming FastAPI endpoints. SQLite handles relational tracking of candidate progress, while sentence-transformers compute semantic similarity between academic curriculum modules and industry job descriptions.',
      steps: [
        {
          step: '01',
          title: 'Curriculum & JD Ingestion',
          desc: 'Parses academic B.Tech CSE/ECE curricula and cross-references against live employer requirements.',
          icon: 'fa-solid fa-file-lines',
        },
        {
          step: '02',
          title: 'Semantic Embedding Scoring',
          desc: 'Calculates all-MiniLM-L6-v2 vector embeddings to quantify readiness scores and rank skill gaps.',
          icon: 'fa-solid fa-microchip',
        },
        {
          step: '03',
          title: 'Judge0 Sandboxed Testing',
          desc: 'Executes candidate submissions against hidden test cases in secure execution environments.',
          icon: 'fa-solid fa-shield-halved',
        },
        {
          step: '04',
          title: 'Internship Recommendation',
          desc: 'Filters qualified opportunities across 12 Indian tech internships with explainable match rationale.',
          icon: 'fa-solid fa-rocket',
        },
      ],
      techStack: [
        { label: 'Frontend UI', value: 'React.js, Vite, Tailwind CSS, Lucide Icons', icon: 'fa-brands fa-react' },
        { label: 'Backend APIs', value: 'FastAPI (Python 3.11), Uvicorn, REST Endpoints', icon: 'fa-solid fa-server' },
        { label: 'AI & ML Pipeline', value: 'sentence-transformers (all-MiniLM-L6-v2)', icon: 'fa-solid fa-brain' },
        { label: 'Code Execution', value: 'Judge0 API Sandboxed Runner', icon: 'fa-solid fa-terminal' },
        { label: 'Database', value: 'SQLite Relational Database with schema persistence', icon: 'fa-solid fa-database' },
        { label: 'Cloud Deployment', value: 'Vercel Edge Platform with automated CI/CD', icon: 'fa-solid fa-cloud-arrow-up' },
      ],
    },
  },
  {
    id: 'jarvis',
    title: 'JARVIS Voice Assistant',
    role: 'Autonomous AI Voice Agent',
    badge: 'AI Voice Assistant',
    badgeIcon: 'fa-solid fa-robot',
    subtitle: 'Hands-free Python voice assistant with wake-word detection and OpenAI API reasoning',
    description:
      'Developed a Python voice assistant with wake-word ("Jarvis") detection, speech recognition and text-to-speech for continuous, hands-free interaction, plus news APIs and OS command automation.',
    image: '/projects/jarvis.jpg',
    tags: ['Python', 'OpenAI API', 'Speech Recognition', 'Text-to-Speech', 'OS Automation'],
    github: 'https://github.com/siddharthbade14/Jarvis-voice-assistant',
    liveUrl: null,
    featured: true,
    bullets: [
      'Developed a Python voice assistant with wake-word ("Jarvis") detection, speech recognition and text-to-speech for continuous, hands-free interaction.',
      'Integrated the OpenAI API for AI responses to open-ended queries, plus a news API and commands to open websites and play music.',
      'Secured API keys with environment variables, .gitignore and a .env.example template.',
    ],
    features: [
      {
        title: 'Wake-Word ("Jarvis") Detection',
        desc: 'Continuous audio listening thread using PyAudio and threshold calibration to trigger immediately on the "Jarvis" hotword.',
        icon: 'fa-solid fa-microphone',
      },
      {
        title: 'OpenAI API Contextual Intelligence',
        desc: 'Streams transcribed speech prompts to OpenAI LLM endpoints for intelligent question answering, code assistance, and reasoning.',
        icon: 'fa-solid fa-robot',
      },
      {
        title: 'Hands-Free OS & Web Automation',
        desc: 'Built-in intents to launch applications, search the web, fetch live news headlines via News API, and play media hands-free.',
        icon: 'fa-solid fa-desktop',
      },
      {
        title: 'Enterprise Secret Management',
        desc: 'Strict isolation of OpenAI tokens using environment variables, clean .env templates, and zero secret leakage in git history.',
        icon: 'fa-solid fa-key',
      },
    ],
    architecture: {
      overview:
        'Constructed around a low-latency Python audio loop: an acoustic sensor thread captures audio, cleans noise with speech_recognition, dispatches structured context to the OpenAI API, and outputs speech using offline pyttsx3 synthesis.',
      steps: [
        {
          step: '01',
          title: 'Audio Ingestion',
          desc: 'Samples microphone input with energy threshold calibration for background ambient noise.',
          icon: 'fa-solid fa-microphone',
        },
        {
          step: '02',
          title: 'Wake Word & STT',
          desc: 'Identifies the "Jarvis" activation trigger and converts audio frames into clean string tokens.',
          icon: 'fa-solid fa-wave-square',
        },
        {
          step: '03',
          title: 'OpenAI Intent Resolution',
          desc: 'Parses conversational intent, queries OpenAI API, or routes to system commands (news, websites, music).',
          icon: 'fa-solid fa-brain',
        },
        {
          step: '04',
          title: 'Speech Synthesis (TTS)',
          desc: 'Renders natural voice output through pyttsx3 audio stream without requiring cloud latency.',
          icon: 'fa-solid fa-volume-high',
        },
      ],
      techStack: [
        { label: 'Language', value: 'Python 3.10+', icon: 'fa-brands fa-python' },
        { label: 'AI Reasoning', value: 'OpenAI GPT API', icon: 'fa-solid fa-robot' },
        { label: 'Speech Recognition', value: 'Google SpeechRecognition & PyAudio', icon: 'fa-solid fa-microphone' },
        { label: 'Voice Synthesis', value: 'pyttsx3 Text-to-Speech Engine', icon: 'fa-solid fa-volume-high' },
        { label: 'External APIs', value: 'News API, Webbrowser API, OS Subprocesses', icon: 'fa-solid fa-network-wired' },
      ],
    },
  },
]

export const education = [
  {
    step: '01',
    degree: 'B.Tech in Artificial Intelligence & Data Science',
    institution: "Adsul's Technical Campus",
    location: 'Ahilyanagar, Maharashtra',
    period: '2024 – Present',
    current: true,
    description: 'Ranked 1st in the batch with a 8.47 SGPA. Currently in Semester V, building expertise in AI, Data Science, and full-stack development.',
  },
  {
    step: '02',
    degree: 'Higher Secondary Certificate (12th HSC)',
    institution: 'Pemraj Sarda College',
    location: 'Ahilyanagar, Maharashtra',
    period: '2024',
    current: false,
    description: 'Science stream with a focus on Mathematics, Physics, and Computer Science.',
  },
  {
    step: '03',
    degree: 'Secondary School Certificate (10th SSC)',
    institution: 'Dr. J. Paulbudhe M. V.',
    location: 'Ahilyanagar, Maharashtra',
    period: '2022',
    current: false,
    description: 'Completed with First Class Distinction — 88% aggregate score.',
  },
]

// 1:1 match with resume Virtual Experience section & certificate
export const certificates = [
  {
    id: 'tata-genai',
    title: 'Tata GenAI Powered Data Analytics Job Simulation',
    issuer: 'Tata iQ via Forage',
    year: '2026',
    credentialId: 'Tata-GenAI-Forage-2026',
    icon: 'fa-solid fa-award',
    badge: 'Official Forage Certification',
    description:
      'Completed a virtual job simulation applying GenAI to real-world data analytics scenarios. Built predictive business analytics models, conducted exploratory data analysis, and delivered executive AI-powered insights.',
    skills: ['Generative AI', 'Data Analytics', 'Business Intelligence', 'Data Modeling', 'Tata iQ'],
    verified: true,
  },
]

// 1:1 match with resume Leadership & Achievements section
export const achievements = [
  {
    title: 'Academic Excellence (Rank 1st)',
    description:
      'Awarded an official certificate and trophy for ranking 1st across the combined first-year engineering batch with an 8.47 / 10 SGPA.',
    icon: 'fa-solid fa-trophy',
    color: '#eab308',
  },
  {
    title: 'Branch Treasurer (AI & Data Science)',
    description:
      'Elected Branch Treasurer for the AI & Data Science department: manage branch-level finances, allocate event budgets, and coordinate with faculty.',
    icon: 'fa-solid fa-briefcase',
    color: '#38bdf8',
  },
]
