import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { education } from '../../data'

gsap.registerPlugin(ScrollTrigger)

export default function Education() {
  const sectionRef = useRef<HTMLElement>(null)
  const spineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion || !sectionRef.current) return

    const ctx = gsap.context(() => {
      // Header entrance
      gsap.from('.education-header-anim', {
        x: -25,
        opacity: 0,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.education-header-anim',
          start: 'top 85%',
        },
      })

      // Spine animation
      if (spineRef.current) {
        gsap.fromTo(
          spineRef.current,
          { scaleY: 0, transformOrigin: 'top center' },
          {
            scaleY: 1,
            duration: 1.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: spineRef.current,
              start: 'top 85%',
            },
          }
        )
      }

      // Timeline items stagger
      gsap.from('.timeline-item-anim', {
        x: 35,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.timeline-container-anim',
          start: 'top 80%',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="education" className="section education-section">
      <div className="section-content">
        <div className="education-header-anim text-center md:text-left mb-14">
          <div className="section-tag">05 // ACADEMIC TIMELINE</div>
          <h2 className="section-title">
            ACADEMIC <span className="blood-text">TIMELINE</span>
          </h2>
        </div>

        {/* Clean Vertical Timeline */}
        <div className="timeline-container-anim relative max-w-3xl mx-auto md:mx-0 pl-12 md:pl-16">
          {/* Spine */}
          <div
            ref={spineRef}
            className="absolute left-4 md:left-5 top-2 bottom-4 w-[2px] bg-gradient-to-b from-[var(--blood-neon)] via-[var(--blood-dark)] to-transparent opacity-60"
            aria-hidden="true"
          />

          <div className="space-y-10">
            {education.map((item) => (
              <div key={item.step} className="timeline-item-anim relative group">
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
