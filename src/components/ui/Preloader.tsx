import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

interface PreloaderProps {
  onComplete: () => void
}

/**
 * Preloader matching Dark Blood Obsidian aesthetic:
 * - 0→100% counter with blood-text styling
 * - Glowing Kamui Cyber Crest
 * - Upward curtain wipe reveal
 */
export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const obj = { val: 0 }
    const tl = gsap.timeline()

    tl.to(obj, {
      val: 100,
      duration: 1.2,
      ease: 'power2.inOut',
      onUpdate() {
        setProgress(Math.round(obj.val))
      },
    })

    tl.to(
      containerRef.current,
      {
        clipPath: 'inset(0 0 100% 0)',
        duration: 0.65,
        ease: 'power3.inOut',
        onComplete,
      },
      '+=0.1'
    )

    return () => {
      tl.kill()
    }
  }, [onComplete])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[99999] bg-[#050206] flex flex-col items-center justify-center gap-6"
      style={{ clipPath: 'inset(0 0 0% 0)' }}
      aria-label="Loading portfolio"
      role="status"
    >
      {/* Brand Icon with Pulsing Blood Glow */}
      <div className="relative w-16 h-16 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-[rgba(255,0,60,0.35)] blur-md animate-pulse" />
        <div className="relative w-14 h-14 rounded-full border border-[rgba(255,0,60,0.6)] bg-[#0d020a] flex items-center justify-center text-white font-['Syne'] font-black text-xl tracking-wider shadow-[0_0_20px_var(--blood-glow)]">
          SB
        </div>
      </div>

      {/* Counter */}
      <div className="flex items-baseline gap-1">
        <span className="font-['Syne'] text-5xl md:text-6xl font-black text-white tabular-nums blood-text">
          {String(progress).padStart(2, '0')}
        </span>
        <span className="font-['Space_Grotesk'] text-[var(--blood-neon)] text-xl font-bold">%</span>
      </div>

      {/* Progress Bar */}
      <div className="w-48 h-1 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[var(--blood-dark)] to-[var(--blood-neon)] transition-all duration-100 ease-out shadow-[0_0_10px_var(--blood-neon)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="font-['Space_Grotesk'] text-[10px] tracking-[0.25em] text-[var(--blood-neon)] uppercase font-semibold">
        INITIALIZING REALM // SIDDHARTH BADE
      </p>
    </div>
  )
}
