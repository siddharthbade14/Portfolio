import { education } from '../../data'

export default function Education() {
  return (
    <section id="education" className="section education-section">
      <div className="section-content">
        <div className="text-center md:text-left mb-14">
          <div className="section-tag">// ACADEMIC BACKGROUND</div>
          <h2 className="section-title">
            ACADEMIC <span className="blood-text">TIMELINE</span>
          </h2>
        </div>

        {/* Clean Vertical Timeline */}
        <div className="relative max-w-3xl mx-auto md:mx-0 pl-12 md:pl-16">
          {/* Spine */}
          <div
            className="absolute left-4 md:left-5 top-2 bottom-4 w-[2px] bg-gradient-to-b from-[var(--blood-neon)] via-[var(--blood-dark)] to-transparent opacity-60"
            aria-hidden="true"
          />

          <div className="space-y-10">
            {education.map((item) => (
              <div key={item.step} className="relative group">
                {/* Node dot on spine */}
                <div
                  className="absolute -left-[35px] md:-left-[44px] top-5 w-4 h-4 rounded-full bg-[var(--blood-neon)] shadow-[0_0_12px_var(--blood-glow)] ring-4 ring-[#0a0309] transition-transform duration-300 group-hover:scale-125"
                  aria-hidden="true"
                />

                {/* Card */}
                <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm p-6 md:p-7 transition-all duration-300 hover:border-[var(--blood-neon)]/40 hover:bg-white/[0.05]">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-['Outfit'] font-bold text-lg md:text-xl text-white leading-snug mb-1">
                        {item.degree}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--blood-neon)]">
                        <i className="fa-solid fa-building-columns text-xs" />
                        <span>{item.institution}</span>
                        <span className="text-[var(--text-muted)]">·</span>
                        <span className="text-[var(--text-silver)] text-xs">{item.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start shrink-0">
                      {item.current && (
                        <span className="flex items-center gap-1.5 text-[11px] text-[var(--blood-neon)] bg-[rgba(255,0,60,0.1)] border border-[rgba(255,0,60,0.35)] px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--blood-neon)] animate-pulse" />
                          Current
                        </span>
                      )}
                      <span className="text-xs font-['Space_Grotesk'] text-[var(--text-silver)] bg-white/[0.04] border border-white/10 px-3 py-1 rounded-full">
                        {item.period}
                      </span>
                    </div>
                  </div>

                  {/* Optional short description */}
                  {item.description && (
                    <p className="text-sm text-[var(--text-silver)] leading-relaxed mt-2">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
