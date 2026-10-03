import { useState, useEffect } from 'react'
import { projects, type ProjectDetail } from '../../data'

/**
 * Projects section matching reference site:
 * - Section tag '04 // PORTFOLIO SHOWCASE'
 * - Section title 'FEATURED PROJECTS' (with blood-text gradient)
 * - Strictly 2 projects (NexStep SIH '26 and JARVIS)
 * - Glassmorphic card styling, overlay badges, code tags ('FEATURED // 01', 'FEATURED // 02')
 * - Action buttons ('Open Project', 'GitHub', 'Details')
 * - Full-screen Project Details Modal with system architecture & features
 */
export default function Projects() {
  const [activeModalProject, setActiveModalProject] = useState<ProjectDetail | null>(null)

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (activeModalProject) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [activeModalProject])

  const openModal = (proj: ProjectDetail) => {
    setActiveModalProject(proj)
  }

  const closeModal = () => {
    setActiveModalProject(null)
  }

  return (
    <section id="projects" className="section projects-section">
      <div className="section-content">
        <div className="section-tag">04 // PORTFOLIO SHOWCASE</div>
        <h2 className="section-title">
          FEATURED <span className="blood-text">PROJECTS</span>
        </h2>

        <div className="projects-grid">
          {projects.map((proj, idx) => (
            <div
              key={proj.id}
              className="project-card glass-card"
              tabIndex={0}
            >
              {/* Thumbnail with overlay badge */}
              <div className="project-thumb">
                <img
                  src={proj.image}
                  alt={`${proj.title} Preview`}
                  loading="lazy"
                />
                <div className="project-overlay-badge">
                  <i className={proj.badgeIcon} />
                  <span>{proj.badge.toUpperCase()}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="project-card-body">
                <div className="project-header">
                  <span className="project-code">
                    FEATURED // 0{idx + 1}
                  </span>
                  <div className="project-links">
                    <a
                      href={proj.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="GitHub Repository"
                      title="GitHub Repository"
                    >
                      <i className="fa-brands fa-github" />
                    </a>
                    {proj.liveUrl && (
                      <a
                        href={proj.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Live Demo"
                        title="Open Live App"
                      >
                        <i className="fa-solid fa-arrow-up-right-from-square" />
                      </a>
                    )}
                  </div>
                </div>

                <h3 className="project-title">{proj.title}</h3>
                <p className="project-desc">{proj.description}</p>

                {/* Tech Pills */}
                <div className="card-pills">
                  {proj.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>

                {/* Actions */}
                <div className="project-actions">
                  {proj.liveUrl && (
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="proj-btn live-btn"
                    >
                      <span>Open Project</span>
                      <i className="fa-solid fa-arrow-up-right-from-square text-xs" />
                    </a>
                  )}
                  <a
                    href={proj.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="proj-btn github-btn"
                  >
                    <i className="fa-brands fa-github text-sm" />
                    <span>GitHub</span>
                  </a>
                  <button
                    type="button"
                    className="proj-btn detail-btn"
                    onClick={() => openModal(proj)}
                  >
                    <span>Details</span>
                    <i className="fa-solid fa-expand text-xs" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── PROJECT DETAILS MODAL ── */}
      {activeModalProject && (
        <div
          className="project-modal active"
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-backdrop" onClick={closeModal} />
          <div className="modal-container">
            {/* Close Button */}
            <button
              type="button"
              className="modal-close-btn"
              onClick={closeModal}
              aria-label="Close modal"
            >
              <i className="fa-solid fa-xmark" />
            </button>

            {/* Modal Hero */}
            <div className="modal-hero">
              <img
                src={activeModalProject.image}
                alt={activeModalProject.title}
                className="modal-hero-img"
              />
              <div className="modal-hero-overlay">
                <div className="modal-pill">
                  <i className={activeModalProject.badgeIcon} />
                  <span>{activeModalProject.badge}</span>
                </div>
                <h2 className="modal-title">{activeModalProject.title}</h2>
                <p className="modal-subtitle">{activeModalProject.subtitle}</p>
                <div className="modal-hero-actions">
                  {activeModalProject.liveUrl && (
                    <a
                      href={activeModalProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="modal-btn modal-btn-primary"
                    >
                      <i className="fa-solid fa-arrow-up-right-from-square text-xs" />
                      <span>Open Live Project</span>
                    </a>
                  )}
                  <a
                    href={activeModalProject.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="modal-btn modal-btn-secondary"
                  >
                    <i className="fa-brands fa-github text-sm" />
                    <span>GitHub Repository</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Modal Details Grid */}
            <div className="modal-details-grid">
              {/* Features Card */}
              <div className="detail-card">
                <div className="detail-card-header">
                  <div className="detail-icon">
                    <i className="fa-solid fa-layer-group" />
                  </div>
                  <div>
                    <h3>Project Features &amp; Capabilities</h3>
                    <span className="detail-subhead">Key verified engineering modules</span>
                  </div>
                </div>

                <ul className="features-list">
                  {activeModalProject.features.map((feat, fIdx) => (
                    <li key={fIdx}>
                      <i className="fa-solid fa-circle-check" />
                      <div>
                        <strong>{feat.title}</strong>
                        <p>{feat.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Architecture & Pipeline Card */}
              <div className="detail-card">
                <div className="detail-card-header">
                  <div className="detail-icon">
                    <i className="fa-solid fa-microchip" />
                  </div>
                  <div>
                    <h3>System Architecture &amp; Data Pipeline</h3>
                    <span className="detail-subhead">End-to-end execution breakdown</span>
                  </div>
                </div>

                <p className="text-sm text-[var(--text-silver)] leading-relaxed mb-6">
                  {activeModalProject.architecture.overview}
                </p>

                {/* Steps */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {activeModalProject.architecture.steps.map((st) => (
                    <div
                      key={st.step}
                      className="p-4 rounded-xl bg-black/40 border border-white/5 flex gap-3"
                    >
                      <div className="flex flex-col items-center">
                        <span className="font-['Space_Grotesk'] text-xs font-bold text-[var(--blood-neon)]">
                          {st.step}
                        </span>
                        <i className={`${st.icon} text-sm text-[var(--text-muted)] mt-1.5`} />
                      </div>
                      <div>
                        <strong className="block text-xs font-bold text-white mb-1">
                          {st.title}
                        </strong>
                        <p className="text-[11px] text-[var(--text-silver)] leading-relaxed">
                          {st.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tech Stack List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-[rgba(255,0,60,0.15)]">
                  {activeModalProject.architecture.techStack.map((tech, tIdx) => (
                    <div
                      key={tIdx}
                      className="p-3 rounded-lg bg-white/[0.02] border border-white/5"
                    >
                      <span className="flex items-center gap-1.5 text-[11px] font-bold text-[var(--cyan-accent)] mb-1">
                        <i className={tech.icon} />
                        {tech.label}
                      </span>
                      <p className="text-xs text-white/90">
                        {tech.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              {activeModalProject.liveUrl && (
                <a
                  href={activeModalProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modal-btn modal-btn-primary"
                >
                  <span>Launch Live Platform</span>
                  <i className="fa-solid fa-arrow-right text-xs" />
                </a>
              )}
              <a
                href={activeModalProject.github}
                target="_blank"
                rel="noopener noreferrer"
                className="modal-btn modal-btn-secondary"
              >
                <i className="fa-brands fa-github text-sm" />
                <span>GitHub Repository</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
