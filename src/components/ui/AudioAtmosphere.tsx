import { useState, useRef, useEffect } from 'react'

/**
 * AudioAtmosphere: Floating sound-bars toggle matching reference site:
 * - Uses Web Audio API to synthesize a subtle, cinematic dark-ambient cyberpunk drone
 * - No external sound files needed — instant loading, reliable, zero CORS/404 issues
 * - 3 animated sound bars indicating active atmospheric sound
 */
export default function AudioAtmosphere() {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const masterGainRef = useRef<GainNode | null>(null)
  const oscsRef = useRef<OscillatorNode[]>([])

  const stopAtmosphere = () => {
    if (masterGainRef.current && audioCtxRef.current) {
      const now = audioCtxRef.current.currentTime
      masterGainRef.current.gain.cancelScheduledValues(now)
      masterGainRef.current.gain.linearRampToValueAtTime(0.0001, now + 0.6)
      setTimeout(() => {
        oscsRef.current.forEach((osc) => {
          try {
            osc.stop()
            osc.disconnect()
          } catch {
            // Ignore already stopped oscillators
          }
        })
        oscsRef.current = []
      }, 650)
    }
    setIsPlaying(false)
  }

  const startAtmosphere = () => {
    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (!AudioCtxClass) return

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtxClass()
      }

      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume()
      }

      const ctx = audioCtxRef.current
      const now = ctx.currentTime

      const masterGain = ctx.createGain()
      masterGain.gain.setValueAtTime(0.0001, now)
      masterGain.gain.linearRampToValueAtTime(0.035, now + 1.2) // Subtle, unobtrusive volume
      masterGain.connect(ctx.destination)
      masterGainRef.current = masterGain

      // Lowpass filter to ensure deep, warm cinematic rumble
      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(260, now)
      filter.Q.setValueAtTime(2.0, now)
      filter.connect(masterGain)

      // Twin detuned oscillators for atmospheric chorus
      const freqs = [55, 110, 164.81] // A1, A2, E3
      const oscs: OscillatorNode[] = []

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator()
        osc.type = idx === 0 ? 'sine' : 'triangle'
        osc.frequency.setValueAtTime(freq, now)
        osc.detune.setValueAtTime((idx - 1) * 6, now)

        const subGain = ctx.createGain()
        subGain.gain.setValueAtTime(idx === 0 ? 0.8 : 0.4, now)

        osc.connect(subGain)
        subGain.connect(filter)
        osc.start(now)
        oscs.push(osc)
      })

      oscsRef.current = oscs
      setIsPlaying(true)
    } catch (e) {
      console.warn('Web Audio not allowed or failed:', e)
    }
  }

  const toggleAudio = () => {
    if (isPlaying) {
      stopAtmosphere()
    } else {
      startAtmosphere()
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {})
      }
    }
  }, [])

  return (
    <button
      id="audioToggle"
      onClick={toggleAudio}
      className={`audio-toggle ${isPlaying ? 'active' : ''}`}
      aria-label="Toggle Atmosphere Audio"
      title="Toggle Cyber Atmosphere Audio"
    >
      <div className="sound-bars">
        <span className="bar" />
        <span className="bar" />
        <span className="bar" />
      </div>
      <span className="audio-text">
        {isPlaying ? 'ATMOSPHERE: ON' : 'ATMOSPHERE: OFF'}
      </span>
    </button>
  )
}
