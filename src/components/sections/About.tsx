import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { personal, stats } from '../../data'

gsap.registerPlugin(ScrollTrigger)

/**
 * About section:
 * - Two-column interactive showcase with ARIA live region for accessibility.
 * - Left column: Clickable avatar card with persona badge, corner brackets & click hint.
 * - Right column: 3D Flipping dossier container (State 1: Professional, State 2: Dossier).
 * - GSAP ScrollTrigger: Text reveals and animated numerical stats counter driven by data.ts.
 */
export default function About() {
  const [isFlipped, setIsFlipped] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  const toggleDossier = () => {
    setIsFlipped((prev) => !prev)
  }

  // Scroll animations & dynamic counter
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || !sectionRef.current) return

    const ctx = gsap.context(() => {
      // Header entrance animation
      gsap.from('.about-header-anim', {
        x: -25,
        opacity: 0,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.about-header-anim',
          start: 'top 85%',
        },
      })

      // Dynamic counting stats
      const statElements = document.querySelectorAll('.dynamic-stat-value')
      statElements.forEach((el) => {
        const targetVal = parseFloat(el.getAttribute('data-target') || '0')
        const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10)
        const suffix = el.getAttribute('data-suffix') || ''

        const counterObj = { val: 0 }
        gsap.to(counterObj, {
          val: targetVal,
          duration: 1.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 85%',
            once: true,
          },
          onUpdate: () => {
            el.textContent = `${counterObj.val.toFixed(decimals)}${suffix}`
          },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="about" className="section about-section">
      <div className="about-two-col-grid">
        {/* ── Left Column: Clickable Avatar Card ── */}
        <div
          id="aboutImageCard"
          onClick={toggleDossier}
          className={`about-image-card glass-card ${isFlipped ? 'villain-mode' : ''}`}
          title="Click to flip dossier"
          role="button"
          tabIndex={0}
          aria-expanded={isFlipped}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              toggleDossier()
            }
          }}
        >
          <div className="slot-corner top-left" />
          <div className="slot-corner top-right" />
          <div className="slot-corner bottom-left" />
          <div className="slot-corner bottom-right" />

          {/* Persona Badge */}
          <div className="about-persona-badge" id="aboutPersonaBadge">
            <span className="w-2 h-2 rounded-full bg-[var(--blood-neon)] animate-pulse" />
            <span>{isFlipped ? 'SYSTEM DOSSIER' : 'AI & DATA SCIENCE'}</span>
          </div>

          {/* Character Backdrop Aura */}
          <div className="about-character-backdrop" />

          {/* Character Image */}
          <img
            src="/assets/images/about_character.jpg"
            alt="Siddharth Bade Standing Pose"
            className="about-character-img"
            loading="lazy"
          />

          {/* Click Hint */}
          <div className="about-click-hint">
            <i className="fa-solid fa-hand-pointer text-xs" />
            <span>{isFlipped ? 'CLICK TO RESTORE' : 'CLICK TO REVEAL DOSSIER'}</span>
          </div>
        </div>

        {/* ── Right Column: 3D Flipping Content Panel with ARIA Live Region ── */}
        <div
          id="aboutContent"
          className={`about-content glass-card ${isFlipped ? 'villain-content' : ''}`}
          aria-live="polite"
          aria-atomic="true"
        >
          {/* STATE 1: Professional Info */}
          <div className="about-info-state" id="aboutInfo1">
            <div className="about-header-anim">
              <div className="section-tag">02 // ABOUT ME</div>
              <h2 className="section-title about-state1-title">
                ENGINEERING<br />
                WITH <span className="blood-text">PURPOSE</span>
              </h2>
            </div>
            <div className="about-text">
              <p className="lead-text">
                I bridge the gap between algorithmic intelligence and rock-solid software engineering.
              </p>
              <p>
                Third-year B.Tech Artificial Intelligence &amp; Data Science student at Adsul's Technical Campus, Ahilyanagar. Ranked 1st across the combined first-year engineering batch with an 8.47/10 SGPA. I specialize in building end-to-end intelligent systems, machine learning applications, and full-stack web platforms.
              </p>

              {/* Stats Row fed dynamically from data.ts */}
              <div ref={statsRef} className="stats-row">
                {stats.slice(0, 3).map((st) => (
                  <div key={st.label} className="stat-box">
                    <span
                      className="stat-number dynamic-stat-value"
                      data-target={st.value}
                      data-decimals={st.decimals ?? (Number.isInteger(st.value) ? 0 : 2)}
                      data-suffix={st.suffix || ''}
                    >
                      {st.value}{st.suffix}
                    </span>
                    <span className="stat-label">{st.label.toUpperCase()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* STATE 2: Personal Dossier (Beyond The Code) */}
          <div className="about-info-state" id="aboutInfo2">
            <div className="section-tag villain-tag">// PERSONAL DOSSIER</div>
            <h2 className="section-title about-state2-title">
              BEYOND <span className="blood-text">THE</span> CODE
            </h2>
            <div className="about-text personal-info">
              <div className="info-row">
                <i className="fa-solid fa-graduation-cap info-icon" />
                <div className="info-data">
                  <span className="info-label">ACADEMIC STATUS</span>
                  <span className="info-value">3rd Year B.Tech &nbsp;<span className="year-badge">RANK 1ST</span></span>
                </div>
              </div>

              <div className="info-row">
                <i className="fa-solid fa-microchip info-icon" />
                <div className="info-data">
                  <span className="info-label">BRANCH</span>
                  <span className="info-value">Artificial Intelligence &amp; Data Science</span>
                </div>
              </div>

              <div className="info-row">
                <i className="fa-solid fa-building-columns info-icon" />
                <div className="info-data">
                  <span className="info-label">COLLEGE</span>
                  <span className="info-value">Adsul's Technical Campus, Ahilyanagar</span>
                </div>
              </div>

              <div className="info-row">
                <i className="fa-solid fa-location-dot info-icon" />
                <div className="info-data">
                  <span className="info-label">LOCATION</span>
                  <span className="info-value">{personal.location}</span>
                </div>
              </div>

              <div className="info-row">
                <i className="fa-solid fa-code info-icon" />
                <div className="info-data">
                  <span className="info-label">CORE ARSENAL</span>
                  <span className="info-value">Python &bull; FastAPI &bull; React.js &bull; sentence-transformers &bull; Judge0 &bull; SQLite</span>
                </div>
              </div>

              <div className="info-row">
                <i className="fa-solid fa-award info-icon" />
                <div className="info-data">
                  <span className="info-label">ACHIEVEMENTS</span>
                  <span className="info-value">Tata GenAI Certified &bull; Branch Treasurer (AI &amp; DS)</span>
                </div>
              </div>

              <div className="info-row goal-row">
                <i className="fa-solid fa-fire info-icon" />
                <div className="info-data">
                  <span className="info-label">VISION</span>
                  <span className="info-value goal-value">Ship robust software that solves real human problems</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
