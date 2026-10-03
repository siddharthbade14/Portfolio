import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface FloatingParticlesProps {
  count?: number
  spread?: number
  color?: string
  speed?: number
}

/**
 * Background floating particle field used across multiple sections.
 * Uses InstancedMesh for performance.
 */
export default function FloatingParticles({
  count  = 300,
  spread = 20,
  color  = '#00e5ff',
  speed  = 0.3,
}: FloatingParticlesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null)

  const { positions, velocities, phases } = useMemo(() => {
    const p: THREE.Vector3[] = []
    const v: THREE.Vector3[] = []
    const ph: number[]       = []
    for (let i = 0; i < count; i++) {
      p.push(new THREE.Vector3(
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread * 0.4,
      ))
      v.push(new THREE.Vector3(
        (Math.random() - 0.5) * 0.002 * speed,
        (Math.random() - 0.5) * 0.002 * speed,
        0,
      ))
      ph.push(Math.random() * Math.PI * 2)
    }
    return { positions: p, velocities: v, phases: ph }
  }, [count, spread, speed])

  const dummy = useMemo(() => new THREE.Object3D(), [])
  const time  = useRef(0)

  useFrame((_, delta) => {
    time.current += delta
    const mesh = meshRef.current
    if (!mesh) return

    for (let i = 0; i < count; i++) {
      const p  = positions[i]
      const v  = velocities[i]
      const ph = phases[i]

      p.addScaledVector(v, 1)

      // Wrap around
      const half = spread / 2
      if (Math.abs(p.x) > half) p.x *= -0.98
      if (Math.abs(p.y) > half) p.y *= -0.98

      const scale = 0.012 + 0.006 * Math.sin(time.current + ph)
      dummy.position.copy(p)
      dummy.scale.setScalar(scale)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    }
    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} frustumCulled={false}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color={color} transparent opacity={0.4} />
    </instancedMesh>
  )
}
