import { certificates, achievements } from '../../data'

/**
 * Certifications section matching reference site:
 * - Section tag '// VERIFIED CREDENTIALS'
 * - Section title 'HONORS & <span className="blood-text">CERTIFICATIONS</span>'
 * - Dark Blood Obsidian glass cards
 * - Tata GenAI Powered Data Analytics Job Simulation (Forage)
 * - Academic Excellence Rank 1st and Branch Treasurer
 */
export default function Certifications() {
  return (
    <section id="certifications" className="section certifications-section">
      <div className="section-content">
        <div className="section-tag">// VERIFIED CREDENTIALS</div>
        <h2 className="section-title">
          HONORS &amp; <span className="blood-text">CERTIFICATIONS</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* ── Primary Verified Certificate (Tata GenAI) ── */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="glass-card p-8 md:p-9 relative overflow-hidden"
              >
                {/* Certificate Header */}
                <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--blood-neon)] to-[var(--blood-dark)] text-white flex items-center justify-center text-3xl shadow-[0_0_25px_var(--blood-glow)] border border-[var(--blood-primary)]">
                      <i className={cert.icon} />
                    </div>
                    <div>
                      <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[rgba(255,0,60,0.12)] border border-[rgba(255,0,60,0.35)] text-[var(--blood-neon)] text-xs font-bold uppercase mb-1.5 tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--blood-neon)] animate-pulse" />
                        {cert.badge} &bull; {cert.year}
                      </span>
                      <h3 className="font-['Syne'] font-extrabold text-xl sm:text-2xl text-white leading-tight">
                        {cert.title}
                      </h3>
                      <p className="text-xs sm:text-sm font-semibold text-[var(--text-silver)] mt-0.5">
                        {cert.issuer} &bull; Credential ID: {cert.credentialId}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wide">
                    <i className="fa-solid fa-circle-check" />
                    <span>Official Verified</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm md:text-[15px] text-[var(--text-silver)] leading-relaxed mb-6">
                  {cert.description}
                </p>

                {/* Skills Tags */}
                <div className="pt-4 border-t border-[rgba(255,0,60,0.18)]">
                  <span className="block text-xs font-bold text-[var(--blood-neon)] uppercase tracking-wider mb-2.5">
                    Verified Competencies
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {cert.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-white/[0.04] text-[var(--text-silver)] border border-[rgba(255,0,60,0.25)]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Academic Honors & Leadership ── */}
          <div className="flex flex-col gap-6">
            {achievements.map((ach, idx) => (
              <div
                key={idx}
                className="glass-card p-6 md:p-7 flex flex-col justify-between"
              >
                <div className="flex items-center gap-3.5 mb-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
                    style={{
                      backgroundColor: `${ach.color}18`,
                      color: ach.color,
                      border: `1px solid ${ach.color}50`,
                      boxShadow: `0 0 15px ${ach.color}30`,
                    }}
                  >
                    <i className={ach.icon} />
                  </div>
                  <div>
                    <h4 className="font-['Syne'] font-bold text-base text-white">
                      {ach.title}
                    </h4>
                    <span className="text-xs text-[var(--blood-neon)] font-semibold tracking-wider uppercase">
                      Official Honor
                    </span>
                  </div>
                </div>

                <p className="text-xs md:text-sm text-[var(--text-silver)] leading-relaxed">
                  {ach.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
