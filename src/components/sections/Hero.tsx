import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface HeroProps {
  loaded?: boolean
  onOpenResume?: () => void
}

/**
 * Hero section matching reference site:
 * - Left column: Tech badge, Hello world intro, stacked gothic name (SIDDHARTH BADE in blood-text),
 *   professional summary, CTA buttons (VIEW PROJECTS, GET IN TOUCH, VIEW RESUME), scroll hint.
 * - Right column: Character stage with interactive flashlight CSS masking reveal!
 */
export default function Hero({ loaded = true, onOpenResume }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const villainRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (!loaded) return

    const tl = gsap.timeline({ delay: 0.15 })

    if (leftRef.current) {
      tl.fromTo(
        leftRef.current.children,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.08,
          ease: 'power3.out',
        }
      )
    }

    if (stageRef.current) {
      tl.fromTo(
        stageRef.current,
        { opacity: 0, scale: 0.94 },
        { opacity: 1, scale: 1, duration: 0.8, ease: 'power2.out' },
        '-=0.5'
      )
    }
  }, [loaded])

  // Mouse move flashlight mask interaction
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return
    const rect = stageRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    stageRef.current.style.setProperty('--mask-x', `${x}px`)
    stageRef.current.style.setProperty('--mask-y', `${y}px`)
  }

  const handleMouseLeave = () => {
    if (!stageRef.current) return
    stageRef.current.style.setProperty('--mask-x', '-999px')
    stageRef.current.style.setProperty('--mask-y', '-999px')
  }

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="hero" ref={heroRef} className="section hero-section pt-36 pb-20">
      <div className="hero-split-grid">
        {/* ── Left Column: Typography, Name & CTAs ── */}
        <div ref={leftRef} className="hero-text-side">
          <div className="tech-badge">
            <i className="fa-solid fa-code" /> AI &amp; DATA SCIENCE ENGINEER
          </div>

          <div className="hero-name-block">
            <span className="hero-intro">HELLO WORLD, I AM</span>
            <h1 className="hero-stylish-name">
              <span className="name-first">SIDDHARTH</span>
              <span className="name-last blood-text">BADE</span>
            </h1>
          </div>

          <p className="hero-desc">
            Third-year B.Tech Artificial Intelligence &amp; Data Science student (Rank 1st, 8.47 SGPA) specializing in end-to-end intelligent systems, machine learning architectures, and full-stack web platforms.
          </p>

          <div className="hero-cta">
            <button
              onClick={() => scrollTo('projects')}
              className="btn btn-blood"
            >
              <span>VIEW PROJECTS</span>
              <i className="fa-solid fa-arrow-right text-xs" />
            </button>

            <button
              onClick={() => scrollTo('contact')}
              className="btn btn-glass"
            >
              <span>GET IN TOUCH</span>
              <i className="fa-regular fa-paper-plane text-xs" />
            </button>

            <button
              onClick={() => {
                if (onOpenResume) {
                  onOpenResume()
                } else {
                  window.dispatchEvent(new CustomEvent('open-resume'))
                }
              }}
              className="btn btn-glass resume-hero-btn"
            >
              <i className="fa-solid fa-file-lines text-xs" />
              <span>VIEW RESUME</span>
            </button>
          </div>

          <div className="scroll-hint cursor-pointer" onClick={() => scrollTo('about')}>
            <span className="scroll-text">EXPLORE PORTFOLIO</span>
            <div className="scroll-arrow">
              <i className="fa-solid fa-angles-down" />
            </div>
          </div>
        </div>

        {/* ── Right Column: Interactive Character Mask Stage ── */}
        <div className="hero-image-side">
          <div
            ref={stageRef}
            id="characterMaskStage"
            className="character-mask-stage"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              // @ts-expect-error custom CSS var
              '--mask-x': '-999px',
              '--mask-y': '-999px',
            }}
          >
            {/* Layer 1: Normal Form (Base) */}
            <img
              src="/assets/images/hero_avatar.jpg"
              alt="Siddharth Bade Normal Form"
              className="character-layer character-normal"
            />

            {/* Layer 2: Cyber Alter-Ego (Revealed via Dynamic CSS Masking) */}
            <img
              ref={villainRef}
              src="/assets/images/villain_cutout.jpg"
              alt="Siddharth Bade Cyber Alter-Ego"
              className="character-layer character-villain"
            />

            {/* Ground Radial Shadow */}
            <div className="character-shadow-radial" />

            {/* Interactive Hint Badge */}
            <div className="mask-interactive-hint">
              <i className="fa-solid fa-eye" />
              <span>HOVER TO REVEAL CYBER ALTER-EGO</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
