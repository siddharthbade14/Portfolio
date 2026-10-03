import { useEffect, useState } from 'react'

const NAV_LINKS = [
  { href: '#hero', label: 'HOME' },
  { href: '#about', label: 'ABOUT' },
  { href: '#skills', label: 'SKILLS' },
  { href: '#projects', label: 'PROJECTS' },
  { href: '#education', label: 'EDUCATION' },
  { href: '#contact', label: 'CONTACT' },
]

interface NavbarProps {
  scrollProgress?: number
  onOpenResume?: () => void
}

/**
 * Floating Pill Navbar matching reference site:
 * - Kamui Cyber Crest SVG with animated orbit ring and rotating katana blades
 * - Brand metadata (SIDDHARTH + AI & DS badge + pulsing role dot)
 * - Navigation links with blood-neon underline indicator
 * - In-app resume viewer trigger ('RESUME')
 * - Live status beacon ('AVAILABLE FOR WORK')
 * - Mobile responsive drawer
 */
export default function Navbar({ onOpenResume }: NavbarProps) {
  const [activeSection, setActive] = useState('hero')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const sectionIds = ['hero', 'about', 'skills', 'projects', 'education', 'contact']
      const scrollY = window.scrollY + 200

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i]
        const el = document.getElementById(id)
        if (el && el.offsetTop <= scrollY) {
          setActive(id)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false)
    const el = document.querySelector(href)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleResumeClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setMobileMenuOpen(false)
    if (onOpenResume) {
      onOpenResume()
    } else {
      window.dispatchEvent(new CustomEvent('open-resume'))
    }
  }

  return (
    <header className="navbar-fixed-container">
      <nav className="navbar-pill" aria-label="Primary navigation">
        {/* Brand with Kamui Cyber Crest Logo */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault()
            handleNavClick('#hero')
          }}
          className="nav-brand"
          aria-label="Siddharth Bade Home"
        >
          <div className="brand-crest">
            <div className="crest-aura-pulse" />
            <svg
              viewBox="0 0 52 52"
              className="crest-svg"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <radialGradient id="kamuiVoid" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#080104" />
                  <stop offset="60%" stopColor="#1a020b" />
                  <stop offset="100%" stopColor="#ff003c" stopOpacity="0.85" />
                </radialGradient>
                <linearGradient id="kamuiBlade" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="25%" stopColor="#ff4d79" />
                  <stop offset="65%" stopColor="#ff003c" />
                  <stop offset="100%" stopColor="#7a0016" />
                </linearGradient>
                <radialGradient id="kamuiPupil" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="40%" stopColor="#ff1a4e" />
                  <stop offset="100%" stopColor="#660012" />
                </radialGradient>
                <filter id="kamuiGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="1.8" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Outer Tech Orbit Rings */}
              <circle cx="26" cy="26" r="23" fill="none" stroke="rgba(255, 0, 60, 0.25)" strokeWidth="1.2" />
              <circle
                cx="26"
                cy="26"
                r="23"
                fill="none"
                stroke="#ff003c"
                strokeWidth="2"
                strokeDasharray="14 38"
                strokeLinecap="round"
                className="kamui-orbit-ring"
              />
              <circle cx="26" cy="26" r="20.5" fill="none" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="0.8" strokeDasharray="4 8" />

              {/* Crimson Iris Bed */}
              <circle cx="26" cy="26" r="19.5" fill="url(#kamuiVoid)" stroke="rgba(255, 0, 60, 0.55)" strokeWidth="1.4" />

              {/* 3 Sleek Kamui Void Katana Blades */}
              <g className="kamui-blades-group">
                {/* Blade 1 (Top) */}
                <path d="M26,26 C26,14 35.5,9 37.5,7 C33.5,15.5 33,22 26,26 Z" fill="url(#kamuiBlade)" filter="url(#kamuiGlow)" />
                {/* Blade 2 (Bottom Right) */}
                <path d="M26,26 C36.2,32 40,42.5 40.5,45 C32.2,41 27.2,37.2 26,26 Z" fill="url(#kamuiBlade)" filter="url(#kamuiGlow)" />
                {/* Blade 3 (Bottom Left) */}
                <path d="M26,26 C15.8,32 12,42.5 11.5,45 C19.8,41 24.8,37.2 26,26 Z" fill="url(#kamuiBlade)" filter="url(#kamuiGlow)" />

                {/* Central Energy Pupil */}
                <circle cx="26" cy="26" r="5.2" fill="#060103" stroke="#ff003c" strokeWidth="1.5" />
                <circle cx="26" cy="26" r="2.8" fill="url(#kamuiPupil)" />
                <circle cx="24.9" cy="24.9" r="1" fill="#ffffff" />
              </g>
            </svg>
          </div>

          <div className="brand-meta">
            <div className="brand-title-row">
              <span className="brand-title">SIDDHARTH</span>
              <span className="brand-dev-badge">AI &amp; DS</span>
            </div>
            <div className="brand-role-row">
              <span className="role-pulse-dot" />
              <span className="brand-role">AI &amp; DATA SCIENCE ENGINEER</span>
            </div>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <ul className="nav-links hidden md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.href.slice(1)
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault()
                    handleNavClick(link.href)
                  }}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                >
                  {link.label}
                </a>
              </li>
            )
          })}
          <li>
            <button
              type="button"
              onClick={handleResumeClick}
              className="nav-link cursor-pointer flex items-center gap-1.5"
            >
              <i className="fa-solid fa-file-lines text-xs text-[var(--blood-neon)]" />
              <span>RESUME</span>
            </button>
          </li>
        </ul>

        {/* Right Status Beacon */}
        <div className="hidden lg:flex nav-status-pill">
          <span className="status-beacon" />
          <span className="status-text">AVAILABLE FOR WORK</span>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="md:hidden flex flex-col items-center justify-center gap-1.5 p-2 text-white cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          <span className={`block w-6 h-0.5 bg-white transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-white transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full mt-3 left-4 right-4 p-5 rounded-2xl border border-[rgba(255,0,60,0.3)] backdrop-blur-2xl bg-[#090209]/95 flex flex-col gap-3 shadow-[0_15px_40px_rgba(0,0,0,0.9)] animate-in fade-in duration-200">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick(link.href)
                }}
                className="text-sm font-bold tracking-widest text-[#cbd5e1] hover:text-[#ff003c] py-2 px-3 rounded-lg hover:bg-white/[0.04] transition-colors"
              >
                {link.label}
              </a>
            ))}
            <button
              type="button"
              onClick={handleResumeClick}
              className="text-left text-sm font-bold tracking-widest text-[var(--blood-neon)] py-2 px-3 rounded-lg hover:bg-white/[0.04] transition-colors flex items-center gap-2"
            >
              <i className="fa-solid fa-file-lines" />
              <span>VIEW RESUME (PDF)</span>
            </button>
            <div className="pt-2 border-t border-[rgba(255,0,60,0.2)] flex items-center justify-between">
              <span className="text-xs text-[var(--blood-neon)] font-bold tracking-wider flex items-center gap-2">
                <span className="status-beacon" /> AVAILABLE FOR WORK
              </span>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
