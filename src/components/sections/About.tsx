import { useState } from 'react'
import { personal } from '../../data'

/**
 * About section matching reference site:
 * - Two-column interactive showcase
 * - Left column: Clickable avatar card with persona badge, corner brackets & click hint
 * - Right column: 3D Flipping dossier container alternating between:
 *    - STATE 1: Engineering With Purpose + verified stats (8.47 SGPA, 1st Batch Rank)
 *    - STATE 2: Beyond The Code (Personal Dossier)
 */
export default function About() {
  const [isFlipped, setIsFlipped] = useState(false)

  const toggleDossier = () => {
    setIsFlipped((prev) => !prev)
  }

  return (
    <section id="about" className="section about-section">
      <div className="about-two-col-grid">
        {/* ── Left Column: Clickable Avatar Card ── */}
        <div
          id="aboutImageCard"
          onClick={toggleDossier}
          className={`about-image-card glass-card ${isFlipped ? 'villain-mode' : ''}`}
          title="Click to flip dossier"
          role="button"
          tabIndex={0}
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
          />

          {/* Click Hint */}
          <div className="about-click-hint">
            <i className="fa-solid fa-hand-pointer text-xs" />
            <span>{isFlipped ? 'CLICK TO RESTORE' : 'CLICK TO REVEAL DOSSIER'}</span>
          </div>
        </div>

        {/* ── Right Column: 3D Flipping Content Panel ── */}
        <div
          id="aboutContent"
          className={`about-content glass-card ${isFlipped ? 'villain-content' : ''}`}
        >
          {/* STATE 1: Professional Info */}
          <div className="about-info-state" id="aboutInfo1">
            <div className="section-tag">02 // ABOUT ME</div>
            <h2 className="section-title about-state1-title">
              ENGINEERING<br />
              WITH <span className="blood-text">PURPOSE</span>
            </h2>
            <div className="about-text">
              <p className="lead-text">
                I bridge the gap between algorithmic intelligence and rock-solid software engineering.
              </p>
              <p>
                Third-year B.Tech Artificial Intelligence &amp; Data Science student at Adsul's Technical Campus, Ahilyanagar. Ranked 1st across the combined first-year engineering batch with an 8.47/10 SGPA. I specialize in building end-to-end intelligent systems, machine learning applications, and full-stack web platforms.
              </p>
              <div className="stats-row">
                <div className="stat-box">
                  <span className="stat-number">8.47</span>
                  <span className="stat-label">FIRST-YEAR SGPA</span>
                </div>
                <div className="stat-box">
                  <span className="stat-number">1st</span>
                  <span className="stat-label">BATCH RANK</span>
                </div>
                <div className="stat-box">
                  <span className="stat-number">5+</span>
                  <span className="stat-label">PROJECTS BUILT</span>
                </div>
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
