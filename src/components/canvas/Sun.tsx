import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface SunProps {
  radius?: number
}

/**
 * Procedural glowing Sun at the center of the solar system.
 * Layered with an inner core, a pulsating solar flare corona,
 * and omnidirectional radiance that illuminates orbiting planets.
 */
export default function Sun({ radius = 1.8 }: SunProps) {
  const coreRef = useRef<THREE.Mesh>(null)
  const coronaRef = useRef<THREE.Mesh>(null)
  const haloRef = useRef<THREE.Mesh>(null)
  const time = useRef(0)

  useFrame((_, delta) => {
    time.current += delta

    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.08
    }

    if (coronaRef.current) {
      coronaRef.current.rotation.y -= delta * 0.12
      coronaRef.current.rotation.z += delta * 0.05
      // Gentle pulsing of the outer corona
      const pulse = 1 + Math.sin(time.current * 1.5) * 0.04
      coronaRef.current.scale.setScalar(pulse)
    }

    if (haloRef.current) {
      haloRef.current.rotation.z += delta * 0.03
      const haloPulse = 1 + Math.cos(time.current * 1.2) * 0.06
      haloRef.current.scale.setScalar(haloPulse)
    }
  })

  return (
    <group position={[0, 0, 0]}>
      {/* ── Sun Point Light (Casts dramatic light across all planets) ── */}
      <pointLight
        position={[0, 0, 0]}
        intensity={8}
        color="#ffaa44"
        distance={70}
        decay={1.2}
      />
      {/* Secondary softer cyan fill light for cyber aesthetic */}
      <pointLight
        position={[0, 2, 0]}
        intensity={2}
        color="#00e5ff"
        distance={40}
        decay={2}
      />

      {/* ── Inner Core ── */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial
          color="#ff7b00"
          emissive="#ff9900"
          emissiveIntensity={2.5}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>

      {/* ── Outer Solar Corona (Pulsing additive glow layer) ── */}
      <mesh ref={coronaRef} scale={1.14}>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshBasicMaterial
          color="#ffaa33"
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>

      {/* ── Extended Atmospheric Halo (Soft outer glow) ── */}
      <mesh ref={haloRef} scale={1.35}>
        <sphereGeometry args={[radius, 24, 24]} />
        <meshBasicMaterial
          color="#ff5500"
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  )
}
