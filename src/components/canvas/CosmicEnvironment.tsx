import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import * as THREE from 'three'

interface CosmicEnvironmentProps {
  particleCount?: number
}

/**
 * Deep Space Cosmic Environment:
 * - Drei Stars (6,000 multi-depth stars with realistic twinkling)
 * - Drifting stardust particles catching distant light
 * - Deep-space nebula backlight
 */
export default function CosmicEnvironment({ particleCount = 280 }: CosmicEnvironmentProps) {
  const dustRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  // Floating stardust data
  const particles = useMemo(() => {
    const data = []
    for (let i = 0; i < particleCount; i++) {
      data.push({
        pos: new THREE.Vector3(
          (Math.random() - 0.5) * 45,
          (Math.random() - 0.5) * 25,
          (Math.random() - 0.5) * 45
        ),
        speed: 0.05 + Math.random() * 0.1,
        phase: Math.random() * Math.PI * 2,
        scale: 0.015 + Math.random() * 0.025,
      })
    }
    return data
  }, [particleCount])

  const time = useRef(0)

  useFrame((_, delta) => {
    time.current += delta
    const mesh = dustRef.current
    if (!mesh) return

    const t = time.current
    particles.forEach((p, i) => {
      // Gentle floating oscillation
      dummy.position.set(
        p.pos.x + Math.sin(t * p.speed + p.phase) * 0.4,
        p.pos.y + Math.cos(t * p.speed * 0.8 + p.phase) * 0.3,
        p.pos.z + Math.sin(t * p.speed * 0.6 + p.phase) * 0.4
      )
      const currentScale = p.scale * (1 + Math.sin(t * 1.5 + p.phase) * 0.3)
      dummy.scale.setScalar(currentScale)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <group>
      {/* ── Realistic 3D Deep Space Starfield ── */}
      <Stars
        radius={120}
        depth={60}
        count={5500}
        factor={4}
        saturation={0}
        fade
        speed={0.8}
      />

      {/* ── Drifting Cosmic Dust / Stardust ── */}
      <instancedMesh
        ref={dustRef}
        args={[undefined, undefined, particleCount]}
        frustumCulled={false}
      >
        <sphereGeometry args={[1, 4, 4]} />
        <meshBasicMaterial
          color="#00e5ff"
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
        />
      </instancedMesh>

      {/* ── Deep Space Backlights (Simulates galactic rim & distant nebula) ── */}
      <pointLight
        position={[-20, 15, -30]}
        intensity={1.8}
        color="#7b2cbf"
        distance={90}
        decay={2}
      />
      <pointLight
        position={[25, -15, -25]}
        intensity={1.2}
        color="#0077b6"
        distance={80}
        decay={2}
      />
    </group>
  )
}
