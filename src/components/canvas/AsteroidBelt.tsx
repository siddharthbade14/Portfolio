import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface AsteroidBeltProps {
  count?: number
  innerRadius?: number
  outerRadius?: number
}

/**
 * Procedural Asteroid Belt rendered via a single InstancedMesh.
 * Positioned between the inner and outer planetary systems.
 * Gently rotates around the central star.
 */
export default function AsteroidBelt({
  count = 380,
  innerRadius = 9.2,
  outerRadius = 10.8,
}: AsteroidBeltProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  // Generate initial asteroid positions, scales, and rotations
  const asteroidData = useMemo(() => {
    const items = []
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.1
      // Distribute radius with a slight Gaussian bias toward the center of the belt
      const r = innerRadius + Math.random() * (outerRadius - innerRadius)
      // Slight vertical dispersion
      const y = (Math.random() - 0.5) * 0.5

      const x = Math.cos(angle) * r
      const z = Math.sin(angle) * r

      const scale = 0.025 + Math.random() * 0.05
      const rotX = Math.random() * Math.PI
      const rotY = Math.random() * Math.PI
      const rotZ = Math.random() * Math.PI

      items.push({ x, y, z, scale, rotX, rotY, rotZ })
    }
    return items
  }, [count, innerRadius, outerRadius])

  // Initialize instances
  useEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return

    asteroidData.forEach((item, i) => {
      dummy.position.set(item.x, item.y, item.z)
      dummy.rotation.set(item.rotX, item.rotY, item.rotZ)
      dummy.scale.set(item.scale, item.scale * (0.8 + Math.random() * 0.4), item.scale)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    })
    mesh.instanceMatrix.needsUpdate = true
  }, [asteroidData, dummy])

  // Slowly rotate the entire belt
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.02
    }
  })

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, count]}
      frustumCulled={false}
    >
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#8d99ae"
        roughness={0.9}
        metalness={0.2}
      />
    </instancedMesh>
  )
}
