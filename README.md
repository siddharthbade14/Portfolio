# Siddharth Bade — Ultra-Premium Portfolio

A scroll-driven, WebGL-powered personal portfolio built with React, Three.js, GSAP, and Lenis.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server (hot-reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Editing Content

All portfolio text lives in a single file: **`src/data.ts`**

Open it and update any of these exports:

| Export | What it controls |
|---|---|
| `personal` | Name, location, email, LinkedIn, GitHub, subtitle lines, resume URL |
| `stats` | The 4 animated stat counters in the About section |
| `skills` | Skill categories and items |
| `projects` | Project cards (title, description, tags, github link) |
| `education` | Education timeline entries |
| `achievements` | Leadership & achievement badges |
| `certifications` | Certification cards |

**Example:** To add a new project, append an object to the `projects` array:

```ts
{
  id: 'my-new-project',
  title: 'My New Project',
  emoji: '🚀',
  description: 'A brief description of what it does.',
  tags: ['Python', 'FastAPI'],
  github: 'https://github.com/siddharthbade14/my-new-project',
  highlight: false,
  color: '#00e5ff',
},
```

## Changing the Resume Link

In `src/data.ts`, update `personal.resumeUrl`:

```ts
resumeUrl: 'https://your-resume-url.com/resume.pdf',
```

Or place your PDF in `/public/resume.pdf` and set `resumeUrl: '/resume.pdf'`.

## Deployment (Vercel)

1. Push to GitHub
2. Import the repo at [vercel.com](https://vercel.com)
3. Framework preset: **Vite** (auto-detected via `vercel.json`)
4. Click **Deploy**

No environment variables required.

## Tech Stack

- **Framework**: Vite + React + TypeScript
- **3D**: Three.js via @react-three/fiber & @react-three/drei
- **Post-processing**: @react-three/postprocessing (Bloom, ChromaticAberration, Vignette)
- **Scroll**: Lenis (smooth) + GSAP ScrollTrigger (animations)
- **Micro-interactions**: Framer Motion
- **Styling**: Tailwind CSS v4 + vanilla CSS custom properties

## Performance Notes

- DPR capped at 2× for mid-range laptops
- Mobile automatically reduces particle count (800 vs 4800) and hides the custom cursor
- `prefers-reduced-motion` disables all 3D and replaces with simple fades
