import { useState, useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

import Scene from './components/canvas/Scene'
import Cursor from './components/ui/Cursor'
import Preloader from './components/ui/Preloader'
import Navbar from './components/ui/Navbar'
import AudioAtmosphere from './components/ui/AudioAtmosphere'
import ResumeModal from './components/ui/ResumeModal'
import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Skills from './components/sections/Skills'
import Projects from './components/sections/Projects'
import Education from './components/sections/Education'
import Certifications from './components/sections/Certifications'
import Contact from './components/sections/Contact'

gsap.registerPlugin(ScrollTrigger)

function App() {
  const [loaded, setLoaded] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)
  const [isResumeOpen, setIsResumeOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)
  const [showBackToTop, setShowBackToTop] = useState(false)

  // Detect mobile / reduced motion
  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Update isMobile on resize / orientation change
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const lenisRef = useRef<Lenis | null>(null)

  /* ── Lenis smooth scroll + ScrollTrigger sync ── */
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    })
    lenisRef.current = lenis

    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)

    lenis.on('scroll', ({ progress, scroll }: { progress: number; scroll: number }) => {
      setScrollProgress(progress)
      setShowBackToTop(scroll > 500)
    })

    return () => {
      lenis.destroy()
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000)
      })
    }
  }, [])

  /* ── Mouse tracking for 3D parallax ── */
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMouseX((e.clientX / window.innerWidth) * 2 - 1)
      setMouseY((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  /* ── Listen for in-app open-resume events ── */
  useEffect(() => {
    const handleOpenResume = () => setIsResumeOpen(true)
    window.addEventListener('open-resume', handleOpenResume)
    return () => window.removeEventListener('open-resume', handleOpenResume)
  }, [])

  /* ── Preloader complete ── */
  const handleLoaded = useCallback(() => {
    setLoaded(true)
    setTimeout(() => ScrollTrigger.refresh(), 100)
  }, [])

  /* ── Back to Top ── */
  const scrollToTop = () => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { duration: 1.2 })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <>
      {/* Custom blood neon cursor */}
      {!isMobile && <Cursor />}

      {/* Cinematic preloader */}
      {!loaded && <Preloader onComplete={handleLoaded} />}

      {/* Cinematic Vignette Overlay */}
      <div className="vignette-overlay" aria-hidden="true" />

      {/* Fixed 3D WebGL Canvas */}
      <Scene
        scrollProgress={scrollProgress}
        mouseX={mouseX}
        mouseY={mouseY}
        isMobile={isMobile}
        reducedMotion={reducedMotion}
      />

      {/* Floating Pill Navbar with Kamui Cyber Crest & In-App Resume Trigger */}
      <Navbar
        scrollProgress={scrollProgress}
        onOpenResume={() => setIsResumeOpen(true)}
      />

      {/* Floating Audio Atmosphere Controller */}
      <AudioAtmosphere />

      {/* In-Website Resume Modal (Displays exact resume.pdf + interactive ATS view with zero redirection) */}
      <ResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />

      {/* Main Portfolio Sections */}
      <main id="main-content" className="relative z-10">
        <Hero
          loaded={loaded}
          onOpenResume={() => setIsResumeOpen(true)}
        />
        <About />
        <Skills isMobile={isMobile} />
        <Projects />
        <Education />
        <Certifications />
        <Contact
          onOpenResume={() => setIsResumeOpen(true)}
        />
      </main>

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="back-to-top-btn"
          aria-label="Back to top"
          title="Return to top"
        >
          <i className="fa-solid fa-arrow-up" />
        </button>
      )}
    </>
  )
}

export default App
