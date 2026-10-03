import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import * as THREE from 'three'

interface RealisticSpaceSceneProps {
  scrollProgress: number
  mouseX: number
  mouseY: number
  isMobile: boolean
  reducedMotion: boolean
}

/**
 * Dark Blood Obsidian Deep Space & Crimson Embers Scene:
 * Faithful to https://new-portfolio-five-kappa-35.vercel.app/
 * - 4,000 crisp deep space stars
 * - Dual-layer floating crimson embers and cursed ash particles drifting in 3D
 * - Scroll and mouse-driven cinematic camera drift
 */
export default function RealisticSpaceScene({
  scrollProgress,
  mouseX,
  mouseY,
  isMobile,
  reducedMotion,
}: RealisticSpaceSceneProps) {
  const embersRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const count = isMobile ? 120 : 260

  // Ambient floating crimson embers
  const embers = useMemo(() => {
    const arr = []
    for (let i = 0; i < count; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 36,
        y: (Math.random() - 0.5) * 32,
        z: (Math.random() - 0.5) * 28,
        speedY: 0.12 + Math.random() * 0.28,
        driftX: (Math.random() - 0.5) * 0.08,
        phase: Math.random() * Math.PI * 2,
        scale: 0.015 + Math.random() * 0.035,
      })
    }
    return arr
  }, [count])

  const time = useRef(0)

  useFrame((state, delta) => {
    time.current += delta
    const t = time.current

    // Update drifting crimson embers
    const mesh = embersRef.current
    if (mesh) {
      embers.forEach((ember, i) => {
        // Particles drift gently upward and sway in sinusoidal breeze
        let py = ember.y + ((t * ember.speedY) % 32)
        if (py > 16) py -= 32
        const px = ember.x + Math.sin(t * 0.6 + ember.phase) * 0.6 + ember.driftX * t
        const pz = ember.z + Math.cos(t * 0.5 + ember.phase) * 0.4

        dummy.position.set(px, py, pz)
        const scaleMod = ember.scale * (1 + Math.sin(t * 1.5 + ember.phase) * 0.3)
        dummy.scale.setScalar(scaleMod)
        dummy.updateMatrix()
        mesh.setMatrixAt(i, dummy.matrix)
      })
      mesh.instanceMatrix.needsUpdate = true
    }

    // Scroll-driven camera parallax
    if (!reducedMotion) {
      const targetY = 0.5 - scrollProgress * 2.8 - mouseY * 0.25
      const targetX = mouseX * 0.4 + scrollProgress * 0.6
      const targetZ = 10 - scrollProgress * 1.2

      state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, delta * 2.5)
      state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, delta * 2.5)
      state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, delta * 2.5)
      state.camera.lookAt(0, 0, 0)
    }
  })

  return (
    <group>
      {/* ── Deep Space Crisp Stars ── */}
      <Stars
        radius={120}
        depth={60}
        count={4000}
        factor={3.2}
        saturation={0}
        fade
        speed={0.4}
      />

      {/* ── Floating Crimson Blood Embers ── */}
      <instancedMesh
        ref={embersRef}
        args={[undefined, undefined, count]}
        frustumCulled={false}
      >
        <sphereGeometry args={[1, 6, 6]} />
        <meshBasicMaterial
          color="#ff003c"
          transparent
          opacity={0.45}
          blending={THREE.AdditiveBlending}
        />
      </instancedMesh>
    </group>
  )
}
