import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface CameraRigProps {
  scrollProgress: number
  mouseX: number
  mouseY: number
  isMobile: boolean
  reducedMotion: boolean
}

interface Waypoint {
  progress: number
  pos: THREE.Vector3
  target: THREE.Vector3
}

/**
 * CameraRig drives the 3D camera along a cinematic flight path through the solar system.
 * Position and focal target interpolate smoothly based on Lenis scroll progress,
 * with subtle mouse parallax for responsive depth.
 */
export default function CameraRig({
  scrollProgress,
  mouseX,
  mouseY,
  isMobile,
  reducedMotion,
}: CameraRigProps) {
  const currentTarget = useRef(new THREE.Vector3(0, 0, 0))

  // Waypoints mapped to each section of the portfolio
  const waypoints = useMemo<Waypoint[]>(() => {
    const zOffset = isMobile ? 3 : 0
    return [
      {
        // 01: Hero - Wide view of the glowing Sun and inner orbital plane
        progress: 0.0,
        pos: new THREE.Vector3(0, 3.2, 13 + zOffset),
        target: new THREE.Vector3(0, 0, 0),
      },
      {
        // 02: About - Approach the AI Core Planet (Nexus)
        progress: 0.18,
        pos: new THREE.Vector3(-3.8, 1.4, 8.2 + zOffset),
        target: new THREE.Vector3(-1.2, 0, 0),
      },
      {
        // 03: Skills - Dive through the Asteroid Belt and orbital planes
        progress: 0.38,
        pos: new THREE.Vector3(2.8, -1.6, 9.2 + zOffset),
        target: new THREE.Vector3(0.5, 0.2, 1.5),
      },
      {
        // 04: Projects - Majestic sweep beside the Ringed Giant (Kronos)
        progress: 0.58,
        pos: new THREE.Vector3(5.2, 3.2, 11.8 + zOffset),
        target: new THREE.Vector3(5.5, 1.0, 0),
      },
      {
        // 05: Education - Elevated galactic view over orbital discs
        progress: 0.78,
        pos: new THREE.Vector3(-5.2, 4.6, 15.0 + zOffset),
        target: new THREE.Vector3(0, 0, 0),
      },
      {
        // 06: Certifications - Celestial flyby towards outer worlds
        progress: 0.88,
        pos: new THREE.Vector3(3.2, 2.2, 13.5 + zOffset),
        target: new THREE.Vector3(1.2, 0, 0),
      },
      {
        // 07: Contact - Focused alignment with central Star
        progress: 1.0,
        pos: new THREE.Vector3(0, 1.5, 9.8 + zOffset),
        target: new THREE.Vector3(0, 0, 0),
      },
    ]
  }, [isMobile])

  // Helper to interpolate between waypoints
  const getInterpolatedTransform = (p: number) => {
    const clamped = Math.max(0, Math.min(1, p))

    // Find the current interval
    let idx = 0
    for (let i = 0; i < waypoints.length - 1; i++) {
      if (clamped >= waypoints[i].progress && clamped <= waypoints[i + 1].progress) {
        idx = i
        break
      }
    }

    const w0 = waypoints[idx]
    const w1 = waypoints[idx + 1]
    const range = w1.progress - w0.progress
    const rawT = range > 0 ? (clamped - w0.progress) / range : 0
    // Smoothstep interpolation for silky camera transitions
    const t = rawT * rawT * (3 - 2 * rawT)

    const pos = new THREE.Vector3().lerpVectors(w0.pos, w1.pos, t)
    const target = new THREE.Vector3().lerpVectors(w0.target, w1.target, t)

    return { pos, target }
  }

  useFrame((state, delta) => {
    if (reducedMotion) return

    const { pos: basePos, target: baseTarget } = getInterpolatedTransform(scrollProgress)

    // Gentle mouse parallax (clamped for comfort)
    const px = isMobile ? 0 : mouseX * 0.6
    const py = isMobile ? 0 : -mouseY * 0.4

    const targetPos = new THREE.Vector3(basePos.x + px, basePos.y + py, basePos.z)

    // Smooth camera damping
    const dampSpeed = Math.min(delta * 3.5, 0.2)
    state.camera.position.lerp(targetPos, dampSpeed)
    currentTarget.current.lerp(baseTarget, dampSpeed)

    state.camera.lookAt(currentTarget.current)
  })

  return null
}
