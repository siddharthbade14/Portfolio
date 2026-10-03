import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * Custom Blood Cursor matching reference site:
 * - Inner 8px blood neon spark (.cursor-dot)
 * - Outer 36px expanding ring (.cursor-trail) that expands to 58px on hover
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const trailRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot = dotRef.current
    const trail = trailRef.current
    if (!dot || !trail) return

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY

      // Instant follow for dot
      gsap.to(dot, {
        x: mouseX,
        y: mouseY,
        duration: 0,
        overwrite: true,
      })

      // Smooth lag interpolation for trail
      gsap.to(trail, {
        x: mouseX,
        y: mouseY,
        duration: 0.18,
        ease: 'power2.out',
        overwrite: true,
      })
    }

    const onMouseEnterInteractive = () => {
      trail.classList.add('active')
    }

    const onMouseLeaveInteractive = () => {
      trail.classList.remove('active')
    }

    window.addEventListener('mousemove', onMouseMove)

    const attachHoverListeners = () => {
      const targets = document.querySelectorAll(
        'a, button, [role="button"], input, textarea, .project-card, .about-image-card, .interactive-hover'
      )
      targets.forEach((el) => {
        el.addEventListener('mouseenter', onMouseEnterInteractive)
        el.addEventListener('mouseleave', onMouseLeaveInteractive)
      })
    }

    attachHoverListeners()

    // Observer to attach to dynamically rendered elements
    const observer = new MutationObserver(attachHoverListeners)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <div id="cursorDot" ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div id="cursorTrail" ref={trailRef} className="cursor-trail" aria-hidden="true" />
    </>
  )
}
