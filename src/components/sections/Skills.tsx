import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface TechItem {
  name: string
  color: string
  bg: string
  symbol: string
}

const TECH_LIST: TechItem[] = [
  { name: 'Python', color: '#4ade80', bg: '#042810', symbol: '🐍' },
  { name: 'FastAPI', color: '#00e5ff', bg: '#021f26', symbol: '⚡' },
  { name: 'React', color: '#38bdf8', bg: '#042238', symbol: '⚛️' },
  { name: 'Java', color: '#ff7043', bg: '#2e1204', symbol: '☕' },
  { name: 'C++', color: '#29b6f6', bg: '#02182b', symbol: 'C++' },
  { name: 'JavaScript', color: '#facc15', bg: '#2b2603', symbol: 'JS' },
  { name: 'Transformers', color: '#ff003c', bg: '#260209', symbol: '🧠' },
  { name: 'Judge0 API', color: '#a855f7', bg: '#1f042e', symbol: '⚖️' },
  { name: 'SQLite', color: '#38bdf8', bg: '#031a29', symbol: '🗄️' },
  { name: 'Git & GitHub', color: '#ffffff', bg: '#1c0309', symbol: '🐙' },
  { name: 'Tailwind CSS', color: '#38bdf8', bg: '#041c30', symbol: '🎨' },
  { name: 'Vercel', color: '#ffffff', bg: '#140308', symbol: '▲' },
]

/**
 * Skills section matching reference site:
 * - TECHNICAL ARSENAL header
 * - Centered Giant 3D Interactive Gyroscope Stage
 * - Three.js Glowing Tech Core sphere with authentic emissive corona
 * - Celestial outer ring with gyroscopic 3D tilt
 * - 12 Tech badges orbiting in 3D space with real-time mouse parallax & drag rotation
 */
export default function Skills() {
  const containerRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const stage = stageRef.current
    if (!container || !stage) return

    let animationFrameId: number
    const scene = new THREE.Scene()
    const mainRig = new THREE.Group()
    const coreGroup = new THREE.Group()
    const orbitTrackGroup = new THREE.Group()
    const outerOrbitGroup = new THREE.Group()
    const techBadges: THREE.Mesh[] = []

    scene.add(mainRig)
    mainRig.add(coreGroup)
    mainRig.add(orbitTrackGroup)
    mainRig.add(outerOrbitGroup)

    mainRig.scale.set(1.05, 1.05, 1.05)

    // Camera
    const width = container.clientWidth || 1080
    const height = container.clientHeight || 700
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50)
    camera.position.set(0, 0, 11.5)

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.35
    container.appendChild(renderer.domElement)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x2a0614, 3.2)
    scene.add(ambientLight)

    const frontLight = new THREE.DirectionalLight(0xff2244, 2.8)
    frontLight.position.set(2.5, 3.0, 7.5)
    scene.add(frontLight)

    const sideRimLight = new THREE.PointLight(0xff003c, 12, 25)
    sideRimLight.position.set(-4.0, -1.5, 4.5)
    scene.add(sideRimLight)

    const topLight = new THREE.DirectionalLight(0xffe6e6, 1.4)
    topLight.position.set(0, 6, 6)
    scene.add(topLight)

    // Build Central Glowing Core
    const textureLoader = new THREE.TextureLoader()
    const coreTexture = textureLoader.load(
      '/assets/images/blood_moon_surface.jpg',
      () => {
        renderer.render(scene, camera)
      }
    )
    coreTexture.colorSpace = THREE.SRGBColorSpace
    coreTexture.wrapS = THREE.RepeatWrapping
    coreTexture.wrapT = THREE.ClampToEdgeWrapping

    const coreGeo = new THREE.SphereGeometry(1.9, 64, 64)
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: coreTexture,
      bumpMap: coreTexture,
      bumpScale: 0.08,
      roughness: 0.55,
      metalness: 0.15,
      emissive: 0xcc0033,
      emissiveMap: coreTexture,
      emissiveIntensity: 0.95,
    })
    const coreMesh = new THREE.Mesh(coreGeo, coreMat)
    coreGroup.add(coreMesh)

    // Atmospheric Corona Halo
    const coronaGeo = new THREE.SphereGeometry(1.98, 32, 32)
    const coronaMat = new THREE.MeshBasicMaterial({
      color: 0xff003c,
      transparent: true,
      opacity: 0.22,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
    })
    const coronaMesh = new THREE.Mesh(coronaGeo, coronaMat)
    coreGroup.add(coronaMesh)

    const coreGlow = new THREE.PointLight(0xff003c, 7.0, 14)
    coreGroup.add(coreGlow)

    // Celestial Outer Ring
    const outerRadius = 4.15
    const outerRingGeo = new THREE.TorusGeometry(outerRadius, 0.013, 16, 160)
    const outerRingMat = new THREE.MeshStandardMaterial({
      color: 0xff003c,
      emissive: 0xff003c,
      emissiveIntensity: 3.0,
      roughness: 0.15,
      metalness: 0.92,
    })
    const outerRingMesh = new THREE.Mesh(outerRingGeo, outerRingMat)
    outerOrbitGroup.add(outerRingMesh)

    orbitTrackGroup.rotation.x = Math.PI / 2.65
    orbitTrackGroup.rotation.y = Math.PI / 5.5
    outerOrbitGroup.rotation.x = -Math.PI / 3.1
    outerOrbitGroup.rotation.z = Math.PI / 4.8

    // Premium Badge Texture Generator — 256×256 canvas for crisp quality
    const createBadgeTexture = (tech: TechItem) => {
      const SIZE = 256
      const C = SIZE / 2  // center
      const canvas = document.createElement('canvas')
      canvas.width = SIZE
      canvas.height = SIZE
      const ctx = canvas.getContext('2d')
      if (!ctx) return new THREE.Texture()

      // ── 1. Outer soft halo (blurred glow ring behind the badge) ──
      const halo = ctx.createRadialGradient(C, C, C * 0.55, C, C, C)
      halo.addColorStop(0, tech.color + '55')
      halo.addColorStop(0.6, tech.color + '18')
      halo.addColorStop(1, 'transparent')
      ctx.beginPath()
      ctx.arc(C, C, C, 0, Math.PI * 2)
      ctx.fillStyle = halo
      ctx.fill()

      // ── 2. Deep glass background ──
      const bgGrad = ctx.createRadialGradient(C - 20, C - 20, 10, C, C, C * 0.85)
      bgGrad.addColorStop(0, tech.bg + 'ff')
      bgGrad.addColorStop(0.55, tech.bg + 'ee')
      bgGrad.addColorStop(1, '#050008ff')
      ctx.beginPath()
      ctx.arc(C, C, C * 0.8, 0, Math.PI * 2)
      ctx.fillStyle = bgGrad
      ctx.fill()

      // ── 3. Outer neon border with double-stroke glow ──
      ctx.beginPath()
      ctx.arc(C, C, C * 0.8, 0, Math.PI * 2)
      ctx.strokeStyle = tech.color
      ctx.lineWidth = 6
      ctx.shadowColor = tech.color
      ctx.shadowBlur = 22
      ctx.stroke()
      ctx.shadowBlur = 0

      // ── 4. Thin inner accent ring ──
      ctx.beginPath()
      ctx.arc(C, C, C * 0.65, 0, Math.PI * 2)
      ctx.strokeStyle = tech.color + '55'
      ctx.lineWidth = 1.5
      ctx.stroke()

      // ── 5. Inner radial shine (light reflection at top-left) ──
      const shine = ctx.createRadialGradient(C - 30, C - 30, 4, C, C, C * 0.78)
      shine.addColorStop(0, 'rgba(255,255,255,0.18)')
      shine.addColorStop(0.45, 'rgba(255,255,255,0.04)')
      shine.addColorStop(1, 'rgba(255,255,255,0)')
      ctx.beginPath()
      ctx.arc(C, C, C * 0.79, 0, Math.PI * 2)
      ctx.fillStyle = shine
      ctx.fill()

      // ── 6. Symbol / Emoji ──
      ctx.font = `bold 68px "Segoe UI Emoji", "Apple Color Emoji", "Outfit", sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.shadowColor = tech.color
      ctx.shadowBlur = 18
      ctx.fillStyle = tech.color
      ctx.fillText(tech.symbol, C, C - 16)
      ctx.shadowBlur = 0

      // ── 7. Name label ──
      ctx.font = `700 22px "Outfit", "Inter", sans-serif`
      ctx.fillStyle = '#ffffff'
      ctx.shadowColor = tech.color
      ctx.shadowBlur = 12
      ctx.fillText(tech.name, C, C + 55)
      ctx.shadowBlur = 0

      // ── 8. Bottom accent line ──
      const lineX1 = C - 34
      const lineX2 = C + 34
      const lineY = C + 74
      const lineGrad = ctx.createLinearGradient(lineX1, lineY, lineX2, lineY)
      lineGrad.addColorStop(0, 'transparent')
      lineGrad.addColorStop(0.5, tech.color)
      lineGrad.addColorStop(1, 'transparent')
      ctx.beginPath()
      ctx.moveTo(lineX1, lineY)
      ctx.lineTo(lineX2, lineY)
      ctx.strokeStyle = lineGrad
      ctx.lineWidth = 2
      ctx.stroke()

      const texture = new THREE.CanvasTexture(canvas)
      texture.minFilter = THREE.LinearMipmapLinearFilter
      texture.magFilter = THREE.LinearFilter
      texture.generateMipmaps = true
      return texture
    }

    // Orbiting Badges — larger radius for visual pop
    const mainRadius = 3.4
    const badgeGeo = new THREE.CircleGeometry(0.46, 48)
    const badgeCount = TECH_LIST.length

    TECH_LIST.forEach((tech, i) => {
      const angle = (i / badgeCount) * Math.PI * 2
      const badgeTexture = createBadgeTexture(tech)

      const badgeMat = new THREE.MeshBasicMaterial({
        map: badgeTexture,
        transparent: true,
        side: THREE.DoubleSide,
        alphaTest: 0.01,
      })
      const badgeMesh = new THREE.Mesh(badgeGeo, badgeMat)

      const x = Math.cos(angle) * mainRadius
      const y = Math.sin(angle) * mainRadius
      badgeMesh.position.set(x, y, 0)

      // Small point light per badge for ambient glow contribution
      const badgeLight = new THREE.PointLight(tech.color, 0.6, 2.5)
      badgeMesh.add(badgeLight)

      orbitTrackGroup.add(badgeMesh)
      techBadges.push(badgeMesh)
    })

    // Mouse Parallax & Drag Handling
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 }
    let isDragging = false
    let previousMousePosition = { x: 0, y: 0 }
    const dragRotation = { x: 0, y: 0 }

    const onSectionMouseMove = (e: MouseEvent) => {
      const rect = stage.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5

      mouse.targetX = x * 2
      mouse.targetY = y * 2

      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x
        const deltaY = e.clientY - previousMousePosition.y
        dragRotation.y += deltaX * 0.007
        dragRotation.x += deltaY * 0.007
        dragRotation.x = Math.max(-0.75, Math.min(0.75, dragRotation.x))
        previousMousePosition = { x: e.clientX, y: e.clientY }
      }
    }

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true
      previousMousePosition = { x: e.clientX, y: e.clientY }
    }

    const onMouseUp = () => {
      isDragging = false
    }

    stage.addEventListener('mousemove', onSectionMouseMove)
    stage.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)

    // Touch Support for mobile devices
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && isDragging) {
        const deltaX = e.touches[0].clientX - previousMousePosition.x
        const deltaY = e.touches[0].clientY - previousMousePosition.y
        dragRotation.y += deltaX * 0.007
        dragRotation.x += deltaY * 0.007
        dragRotation.x = Math.max(-0.75, Math.min(0.75, dragRotation.x))
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      }
    }

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      }
    }

    stage.addEventListener('touchmove', onTouchMove, { passive: true })
    stage.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onMouseUp)

    // Resize Handler
    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth || 1080
      const h = container.clientHeight || 700
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }

    window.addEventListener('resize', handleResize)

    // Visibility Observer
    let isVisible = true
    const obs = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting
    })
    obs.observe(stage)

    // Render Loop
    const clock = new THREE.Clock()

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      if (!isVisible) return

      const delta = clock.getDelta()

      // Continuous Core & Gyro Orbit Rotation
      coreMesh.rotation.y += delta * 0.12
      orbitTrackGroup.rotation.z += delta * 0.22
      outerOrbitGroup.rotation.y += delta * 0.08
      outerOrbitGroup.rotation.z += delta * 0.05

      // Face badges toward camera
      techBadges.forEach((badge) => {
        badge.quaternion.copy(camera.quaternion)
      })

      // Smooth Mouse Parallax & Drag Interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.05
      mouse.y += (mouse.targetY - mouse.y) * 0.05

      mainRig.rotation.y = mouse.x * 0.25 + dragRotation.y
      mainRig.rotation.x = -mouse.y * 0.25 + dragRotation.x

      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      stage.removeEventListener('mousemove', onSectionMouseMove)
      stage.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      stage.removeEventListener('touchmove', onTouchMove)
      stage.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onMouseUp)
      obs.disconnect()
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  return (
    <section id="skills" className="section skills-section">
      <div className="skills-wrapper">
        <div className="skills-header text-center">
          <div className="section-tag">03 // SKILLS</div>
          <h2 className="section-title">
            TECHNICAL <span className="blood-text">ARSENAL</span>
          </h2>
        </div>

        {/* Pure Centered Giant 3D Interactive Gyroscope Stage */}
        <div ref={stageRef} className="skills-hero-3d-stage" id="skills3dStage">
          <div
            ref={containerRef}
            className="skills-canvas-container"
            id="skills3dCanvasContainer"
          />
        </div>
      </div>
    </section>
  )
}
