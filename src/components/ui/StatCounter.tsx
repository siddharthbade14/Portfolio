import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface StatCounterProps {
  value: number
  suffix: string
  label: string
  decimals?: number
  delay?: number
}

/**
 * Animated stat counter — counts from 0 to `value` when it enters the viewport.
 */
export default function StatCounter({ value, suffix, label, decimals = 0, delay = 0 }: StatCounterProps) {
  const numRef = useRef<HTMLSpanElement>(null)
  const hasRun = useRef(false)

  useEffect(() => {
    const el = numRef.current
    if (!el) return

    const obs = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !hasRun.current) {
          hasRun.current = true
          const obj = { val: 0 }
          gsap.to(obj, {
            val: value,
            duration: 1.8,
            delay,
            ease: 'power2.out',
            onUpdate() {
              el.textContent = obj.val.toFixed(decimals) + suffix
            },
          })
          obs.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [value, suffix, decimals, delay])

  return (
    <div className="text-center px-6" role="group" aria-label={`${label}: ${value}${suffix}`}>
      <span
        ref={numRef}
        className="block font-display font-extrabold text-5xl text-gradient-cyan tabular-nums"
      >
        {'0'.padEnd(decimals > 0 ? 4 : 1, '0')}
      </span>
      <span className="block font-mono text-xs tracking-[0.15em] text-[var(--text-secondary)] uppercase mt-1">
        {label}
      </span>
    </div>
  )
}
