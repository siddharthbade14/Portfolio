import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface HeroOrbProps {
  mouseX: number
  mouseY: number
  isMobile: boolean
}

/**
 * Instanced particle sphere (~5k particles on desktop, 1k on mobile).
 * Reacts to mouse movement with a gentle magnetic distortion.
 */
export default function HeroOrb({ mouseX, mouseY, isMobile }: HeroOrbProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const COUNT   = isMobile ? 800 : 4800

  // Generate sphere positions + random offsets
  const { positions, phases } = useMemo(() => {
    const pos: THREE.Vector3[] = []
    const ph: number[]         = []
    for (let i = 0; i < COUNT; i++) {
      // Fibonacci sphere for even distribution
      const phi   = Math.acos(1 - (2 * (i + 0.5)) / COUNT)
      const theta = Math.PI * (1 + Math.sqrt(5)) * i
      const r     = 2.2 + (Math.random() - 0.5) * 0.4
      pos.push(new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi),
      ))
      ph.push(Math.random() * Math.PI * 2)
    }
    return { positions: pos, phases: ph }
  }, [COUNT])

  const dummy = useMemo(() => new THREE.Object3D(), [])
  const clock  = useRef(0)

  useFrame((_, delta) => {
    clock.current += delta
    const mesh = meshRef.current
    if (!mesh) return

    const t  = clock.current
    const mx = mouseX * 0.3  // how much mouse displaces
    const my = mouseY * 0.3

    for (let i = 0; i < COUNT; i++) {
      const p   = positions[i]
      const ph  = phases[i]
      // Gentle breathing pulse
      const scale = 0.025 + 0.008 * Math.sin(t * 1.2 + ph)
      // Mouse magnetic distortion
      const distort = Math.sin(t * 0.8 + ph) * 0.04
      dummy.position.set(
        p.x + mx * (1 - p.z * 0.15) + distort,
        p.y + my * (1 - p.z * 0.15) + distort,
        p.z,
      )
      dummy.scale.setScalar(scale)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    }
    mesh.instanceMatrix.needsUpdate = true
    // Slow auto-rotation
    mesh.rotation.y += delta * 0.05
    mesh.rotation.x += delta * 0.02
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]} frustumCulled={false}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshStandardMaterial
        color="#00e5ff"
        emissive="#00e5ff"
        emissiveIntensity={1.5}
        transparent
        opacity={0.8}
        roughness={0}
        metalness={0}
      />
    </instancedMesh>
  )
}
