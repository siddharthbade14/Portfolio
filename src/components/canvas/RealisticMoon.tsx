import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface RealisticMoonProps {
  mouseX: number
  mouseY: number
  isMobile: boolean
  scrollProgress: number
}

/**
 * Procedural Photorealistic 3D Moon:
 * - Generates high-resolution lunar texture & bump map procedurally (craters, maria, ejecta rays).
 * - Realistic directional sunlight creating natural crescent shadows and crater depth.
 * - Gentle axial rotation, scroll parallax drift, and mouse-tilt interaction.
 */
export default function RealisticMoon({ mouseX, mouseY, isMobile, scrollProgress }: RealisticMoonProps) {
  const moonRef = useRef<THREE.Mesh>(null)

  // Generate procedural lunar surface textures
  const { colorMap, bumpMap } = useMemo(() => {
    const width = 1024
    const height = 512
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')!

    // Base lunar highland regolith (light silver-grey)
    ctx.fillStyle = '#b0b5be'
    ctx.fillRect(0, 0, width, height)

    // Noise variation (micro-texture)
    const imgData = ctx.getImageData(0, 0, width, height)
    const data = imgData.data
    for (let i = 0; i < data.length; i += 4) {
      const n = (Math.random() - 0.5) * 28
      data[i] = Math.max(0, Math.min(255, data[i] + n))
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + n))
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + n + 4))
    }
    ctx.putImageData(imgData, 0, 0)

    // Lunar Maria (Dark volcanic basalt plains)
    const maria = [
      { x: 300, y: 200, rx: 140, ry: 90 },
      { x: 420, y: 170, rx: 90, ry: 80 },
      { x: 540, y: 220, rx: 110, ry: 95 },
      { x: 260, y: 320, rx: 120, ry: 85 },
      { x: 620, y: 280, rx: 80, ry: 70 },
      { x: 740, y: 210, rx: 95, ry: 80 },
      { x: 180, y: 190, rx: 70, ry: 60 },
    ]

    maria.forEach((m) => {
      const grad = ctx.createRadialGradient(m.x, m.y, 10, m.x, m.y, m.rx)
      grad.addColorStop(0, 'rgba(45, 48, 56, 0.75)')
      grad.addColorStop(0.5, 'rgba(65, 70, 80, 0.55)')
      grad.addColorStop(0.85, 'rgba(95, 100, 110, 0.25)')
      grad.addColorStop(1, 'transparent')
      ctx.fillStyle = grad
      ctx.beginPath()
      ctx.ellipse(m.x, m.y, m.rx, m.ry, Math.PI * 0.1, 0, Math.PI * 2)
      ctx.fill()
    })

    // Procedural impact craters
    for (let i = 0; i < 280; i++) {
      const cx = Math.random() * width
      const cy = Math.random() * height
      const cr = 2 + Math.random() * 22

      // Crater floor (shadowed)
      ctx.beginPath()
      ctx.arc(cx, cy, cr, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(25, 27, 32, 0.55)'
      ctx.fill()

      // Crater rim highlight (sun catches eastern rim)
      ctx.beginPath()
      ctx.arc(cx - cr * 0.2, cy - cr * 0.1, cr * 0.95, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(225, 230, 240, 0.65)'
      ctx.lineWidth = Math.max(1, cr * 0.2)
      ctx.stroke()

      // Central peak in larger craters
      if (cr > 10) {
        ctx.beginPath()
        ctx.arc(cx, cy, cr * 0.18, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(230, 235, 245, 0.8)'
        ctx.fill()
      }
    }

    // Ejecta rays (Tycho / Copernicus style)
    const rayCenters = [{ x: 450, y: 380 }, { x: 320, y: 160 }]
    rayCenters.forEach((center) => {
      for (let a = 0; a < 24; a++) {
        const angle = (a / 24) * Math.PI * 2 + (Math.random() - 0.5) * 0.2
        const len = 60 + Math.random() * 120
        ctx.beginPath()
        ctx.moveTo(center.x, center.y)
        ctx.lineTo(center.x + Math.cos(angle) * len, center.y + Math.sin(angle) * len)
        ctx.strokeStyle = 'rgba(240, 245, 255, 0.22)'
        ctx.lineWidth = 1 + Math.random() * 1.5
        ctx.stroke()
      }
    })

    const cTexture = new THREE.CanvasTexture(canvas)
    cTexture.wrapS = THREE.RepeatWrapping
    cTexture.wrapT = THREE.ClampToEdgeWrapping

    return { colorMap: cTexture, bumpMap: cTexture }
  }, [])

  useFrame((_, delta) => {
    const mesh = moonRef.current
    if (!mesh) return

    // Slow realistic axial rotation
    mesh.rotation.y += delta * 0.03

    // Gentle mouse tilt
    const targetRotX = -mouseY * 0.08
    const targetRotZ = mouseX * 0.05
    mesh.rotation.x = THREE.MathUtils.lerp(mesh.rotation.x, targetRotX, delta * 2)
    mesh.rotation.z = THREE.MathUtils.lerp(mesh.rotation.z, targetRotZ, delta * 2)
  })

  // Position the moon elegantly in the upper-right cosmic background with subtle scroll parallax
  const posX = (isMobile ? 1.8 : 4.5) - scrollProgress * 0.8
  const posY = (isMobile ? 2.2 : 2.5) - scrollProgress * 1.5
  const posZ = isMobile ? -3 : -2
  const radius = isMobile ? 1.8 : 2.5

  return (
    <group position={[posX, posY, posZ]}>
      {/* ── Realistic Directional Sunlight from the side ── */}
      <directionalLight
        position={[-7, 3, 6]}
        intensity={3.4}
        color="#f8fafc"
      />

      {/* ── Soft Earthshine / Secondary Ambient Fill ── */}
      <ambientLight intensity={0.12} color="#94a3b8" />

      {/* ── Subtle Atmospheric / Silver Rim Backlight ── */}
      <pointLight
        position={[4, 3, -4]}
        intensity={1.0}
        color="#e2e8f0"
        distance={20}
      />

      {/* ── Moon Mesh ── */}
      <mesh ref={moonRef} castShadow receiveShadow>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial
          map={colorMap}
          bumpMap={bumpMap}
          bumpScale={0.06}
          roughness={0.88}
          metalness={0.05}
        />
      </mesh>

      {/* ── Soft Ethereal Lunar Atmosphere Halo ── */}
      <mesh scale={1.04}>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshBasicMaterial
          color="#dbeafe"
          transparent
          opacity={0.07}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  )
}
