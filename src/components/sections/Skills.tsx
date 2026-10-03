import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

interface TechItem {
  name: string
  color: string
  bg: string
  badgeText: string
  iconClass: string
  category: string
}

const TECH_LIST: TechItem[] = [
  { name: 'Python', color: '#4ade80', bg: '#042810', badgeText: 'PY', iconClass: 'devicon-python-plain', category: 'Core Language' },
  { name: 'FastAPI', color: '#00e5ff', bg: '#021f26', badgeText: 'API', iconClass: 'devicon-fastapi-plain', category: 'Backend REST' },
  { name: 'React.js', color: '#38bdf8', bg: '#042238', badgeText: 'REACT', iconClass: 'devicon-react-original', category: 'Frontend Architecture' },
  { name: 'Java', color: '#ff7043', bg: '#2e1204', badgeText: 'JAVA', iconClass: 'devicon-java-plain', category: 'OOP & Systems' },
  { name: 'C++', color: '#29b6f6', bg: '#02182b', badgeText: 'C++', iconClass: 'devicon-cplusplus-plain', category: 'Algorithms & DSA' },
  { name: 'JavaScript', color: '#facc15', bg: '#2b2603', badgeText: 'JS', iconClass: 'devicon-javascript-plain', category: 'Modern Web' },
  { name: 'Transformers', color: '#ff003c', bg: '#260209', badgeText: 'AI/ML', iconClass: 'fa-solid fa-brain', category: 'Deep Learning / NLP' },
  { name: 'Judge0 API', color: '#a855f7', bg: '#1f042e', badgeText: 'EXEC', iconClass: 'fa-solid fa-gavel', category: 'Sandboxed Execution' },
  { name: 'SQLite', color: '#38bdf8', bg: '#031a29', badgeText: 'SQL', iconClass: 'devicon-sqlite-plain', category: 'Database Engine' },
  { name: 'Git & GitHub', color: '#ffffff', bg: '#1c0309', badgeText: 'GIT', iconClass: 'devicon-github-original', category: 'Version Control' },
  { name: 'Tailwind CSS', color: '#38bdf8', bg: '#041c30', badgeText: 'CSS', iconClass: 'devicon-tailwindcss-plain', category: 'Styling Systems' },
  { name: 'Vercel', color: '#ffffff', bg: '#140308', badgeText: 'VERCEL', iconClass: 'devicon-vercel-original', category: 'Cloud Deployment' },
]

interface SkillsProps {
  isMobile?: boolean
}

/**
 * Skills section:
 * - Desktop: Centered 3D Interactive Gyroscope Stage with Three.js Glowing Tech Core & orbiting badges.
 * - Mobile (< 768px): Zero-latency, highly optimized CSS Cyber Grid with Devicon icons to preserve battery & FPS.
 */
export default function Skills({ isMobile }: SkillsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)

  // Internal fallback if isMobile prop is not supplied
  const [internalMobile, setInternalMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  )

  useEffect(() => {
    if (isMobile !== undefined) return
    const onResize = () => setInternalMobile(window.innerWidth < 768)
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [isMobile])

  const effectiveMobile = isMobile !== undefined ? isMobile : internalMobile

  useEffect(() => {
    // Strictly bypass Three.js WebGL allocation on mobile devices
    if (effectiveMobile) return

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

    // Optimized Renderer: DPR capped at 1.5 for performance
    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
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

    const coreGeo = new THREE.SphereGeometry(1.9, 48, 48)
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
    const coronaGeo = new THREE.SphereGeometry(1.98, 24, 24)
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
    const outerRingGeo = new THREE.TorusGeometry(outerRadius, 0.013, 16, 120)
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

    // Crisp Canvas Badge Texture Generator (Clean Monogram / Modern Typography)
    const createBadgeTexture = (tech: TechItem) => {
      const SIZE = 256
      const C = SIZE / 2
      const canvas = document.createElement('canvas')
      canvas.width = SIZE
      canvas.height = SIZE
      const ctx = canvas.getContext('2d')
      if (!ctx) return new THREE.Texture()

      // Halo
      const halo = ctx.createRadialGradient(C, C, C * 0.55, C, C, C)
      halo.addColorStop(0, tech.color + '55')
      halo.addColorStop(0.6, tech.color + '18')
      halo.addColorStop(1, 'transparent')
      ctx.beginPath()
      ctx.arc(C, C, C, 0, Math.PI * 2)
      ctx.fillStyle = halo
      ctx.fill()

      // Background
      const bgGrad = ctx.createRadialGradient(C - 20, C - 20, 10, C, C, C * 0.85)
      bgGrad.addColorStop(0, tech.bg + 'ff')
      bgGrad.addColorStop(0.55, tech.bg + 'ee')
      bgGrad.addColorStop(1, '#050008ff')
      ctx.beginPath()
      ctx.arc(C, C, C * 0.8, 0, Math.PI * 2)
      ctx.fillStyle = bgGrad
      ctx.fill()

      // Outer neon border
      ctx.beginPath()
      ctx.arc(C, C, C * 0.8, 0, Math.PI * 2)
      ctx.strokeStyle = tech.color
      ctx.lineWidth = 5
      ctx.shadowColor = tech.color
      ctx.shadowBlur = 18
      ctx.stroke()
      ctx.shadowBlur = 0

      // Inner ring
      ctx.beginPath()
      ctx.arc(C, C, C * 0.65, 0, Math.PI * 2)
      ctx.strokeStyle = tech.color + '55'
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Modern Monogram Typography
      ctx.font = `800 48px "Space Grotesk", "Outfit", sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.shadowColor = tech.color
      ctx.shadowBlur = 14
      ctx.fillStyle = tech.color
      ctx.fillText(tech.badgeText, C, C - 14)
      ctx.shadowBlur = 0

      // Name label
      ctx.font = `700 20px "Outfit", "Plus Jakarta Sans", sans-serif`
      ctx.fillStyle = '#ffffff'
      ctx.shadowColor = tech.color
      ctx.shadowBlur = 10
      ctx.fillText(tech.name, C, C + 52)
      ctx.shadowBlur = 0

      // Bottom accent
      const lineX1 = C - 32
      const lineX2 = C + 32
      const lineY = C + 72
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

    // Orbiting Badges
    const mainRadius = 3.4
    const badgeGeo = new THREE.CircleGeometry(0.46, 36)
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

      const badgeLight = new THREE.PointLight(tech.color, 0.5, 2.5)
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

    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
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
      obs.disconnect()

      // Deep WebGL cleanup
      coreGeo.dispose()
      coreMat.dispose()
      coronaGeo.dispose()
      coronaMat.dispose()
      outerRingGeo.dispose()
      outerRingMat.dispose()
      badgeGeo.dispose()
      coreTexture.dispose()

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [effectiveMobile])

  return (
    <section id="skills" className="section skills-section">
      <div className="skills-wrapper">
        <div className="skills-header text-center">
          <div className="section-tag">03 // TECHNICAL ARSENAL</div>
          <h2 className="section-title">
            TECHNICAL <span className="blood-text">ARSENAL</span>
          </h2>
          <p className="section-subtitle max-w-xl mx-auto text-sm text-[var(--text-silver)] mt-3">
            Core programming languages, frameworks, AI/ML stacks, and cloud tools engineered for production systems.
          </p>
        </div>

        {/* ── Mobile View: Ultra-Fast Responsive Cyber Grid ── */}
        {effectiveMobile ? (
          <div className="skills-mobile-grid mt-8">
            {TECH_LIST.map((tech) => (
              <div
                key={tech.name}
                className="skills-mobile-card"
                style={{ '--tech-color': tech.color } as React.CSSProperties}
              >
                <div
                  className="skills-mobile-icon"
                  style={{
                    color: tech.color,
                    background: `linear-gradient(135deg, ${tech.bg}, #050008)`,
                    boxShadow: `0 0 15px ${tech.color}22`,
                    borderColor: `${tech.color}44`,
                  }}
                >
                  <i className={`${tech.iconClass} text-2xl`} />
                </div>
                <div className="skills-mobile-content">
                  <span className="skills-mobile-name">{tech.name}</span>
                  <span className="skills-mobile-category">{tech.category}</span>
                </div>
                <div
                  className="skills-mobile-indicator"
                  style={{
                    backgroundColor: tech.color,
                    boxShadow: `0 0 8px ${tech.color}`,
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          /* ── Desktop View: Centered Giant 3D Interactive Gyroscope Stage ── */
          <div ref={stageRef} className="skills-hero-3d-stage" id="skills3dStage">
            <div
              ref={containerRef}
              className="skills-canvas-container"
              id="skills3dCanvasContainer"
            />
          </div>
        )}
      </div>
    </section>
  )
}
