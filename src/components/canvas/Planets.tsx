import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface MoonData {
  radius: number
  distance: number
  speed: number
  color: string
  emissive?: string
}

interface PlanetConfig {
  name: string
  radius: number
  distance: number
  speed: number
  color: string
  roughness: number
  metalness: number
  emissive?: string
  emissiveIntensity?: number
  axialTilt: number
  spinSpeed: number
  inclination: number
  initialAngle: number
  rings?: {
    innerRadius: number
    outerRadius: number
    color: string
    opacity: number
    tilt: [number, number, number]
  }
  atmosphere?: {
    color: string
    scale: number
    opacity: number
  }
  moons?: MoonData[]
}

const PLANETS_DATA: PlanetConfig[] = [
  {
    name: 'Ignis',
    radius: 0.36,
    distance: 4.4,
    speed: 0.65,
    color: '#e65100',
    roughness: 0.8,
    metalness: 0.3,
    emissive: '#bf360c',
    emissiveIntensity: 0.4,
    axialTilt: 0.1,
    spinSpeed: 0.8,
    inclination: 0.08,
    initialAngle: 0.5,
  },
  {
    name: 'Nexus', // The AI & Data Core Planet
    radius: 0.7,
    distance: 7.6,
    speed: 0.42,
    color: '#0077b6',
    roughness: 0.4,
    metalness: 0.2,
    emissive: '#0096c7',
    emissiveIntensity: 0.3,
    axialTilt: 0.41, // ~23.5 deg
    spinSpeed: 0.5,
    inclination: 0.03,
    initialAngle: 2.1,
    atmosphere: {
      color: '#00e5ff',
      scale: 1.18,
      opacity: 0.4,
    },
    moons: [
      {
        radius: 0.14,
        distance: 1.35,
        speed: 1.8,
        color: '#e0e1dd',
        emissive: '#00e5ff',
      },
    ],
  },
  {
    name: 'Kronos', // The Majestic Ringed Giant
    radius: 1.3,
    distance: 12.2,
    speed: 0.24,
    color: '#d4a373',
    roughness: 0.6,
    metalness: 0.1,
    emissive: '#8d6e63',
    emissiveIntensity: 0.15,
    axialTilt: 0.47,
    spinSpeed: 0.7,
    inclination: -0.05,
    initialAngle: 4.2,
    rings: {
      innerRadius: 1.7,
      outerRadius: 3.2,
      color: '#f4a261',
      opacity: 0.75,
      tilt: [0.5, 0.2, 0],
    },
    moons: [
      {
        radius: 0.18,
        distance: 3.8,
        speed: 1.1,
        color: '#fdf0d5',
      },
    ],
  },
  {
    name: 'Zephyr', // Ice & Violet Gas Giant
    radius: 0.92,
    distance: 17.4,
    speed: 0.16,
    color: '#5a189a',
    roughness: 0.5,
    metalness: 0.2,
    emissive: '#7b2cbf',
    emissiveIntensity: 0.35,
    axialTilt: 0.65,
    spinSpeed: 0.4,
    inclination: 0.06,
    initialAngle: 1.2,
    atmosphere: {
      color: '#9b5de5',
      scale: 1.14,
      opacity: 0.45,
    },
    rings: {
      innerRadius: 1.25,
      outerRadius: 1.8,
      color: '#c77dff',
      opacity: 0.4,
      tilt: [1.2, 0.3, 0],
    },
  },
  {
    name: 'Axiom', // Outer Crystalline Outpost
    radius: 0.34,
    distance: 22.8,
    speed: 0.09,
    color: '#00f5d4',
    roughness: 0.3,
    metalness: 0.7,
    emissive: '#00bbf9',
    emissiveIntensity: 0.5,
    axialTilt: 0.2,
    spinSpeed: 0.3,
    inclination: -0.1,
    initialAngle: 5.4,
  },
]

function SinglePlanet({ config }: { config: PlanetConfig }) {
  const bodyRef = useRef<THREE.Mesh>(null)
  const moonRefs = useRef<(THREE.Mesh | null)[]>([])

  useFrame((_, delta) => {
    // Planet axial spin
    if (bodyRef.current) {
      bodyRef.current.rotation.y += delta * config.spinSpeed
    }

    // Moons orbit around planet
    if (config.moons && config.moons.length > 0) {
      config.moons.forEach((m, idx) => {
        const moonMesh = moonRefs.current[idx]
        if (moonMesh) {
          const t = performance.now() * 0.001 * m.speed
          moonMesh.position.x = Math.cos(t) * m.distance
          moonMesh.position.z = Math.sin(t) * m.distance
          moonMesh.position.y = Math.sin(t * 1.5) * 0.15
        }
      })
    }
  })

  // Pre-calculate circular orbit ring geometry
  const orbitRingGeo = useMemo(() => {
    return new THREE.RingGeometry(
      config.distance - 0.025,
      config.distance + 0.025,
      128
    )
  }, [config.distance])

  return (
    <>
      {/* ── Orbital Trajectory Line (XZ plane) ── */}
      <mesh
        geometry={orbitRingGeo}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
      >
        <meshBasicMaterial
          color="#00e5ff"
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ── Planet Group placed in orbit ── */}
      <PlanetOrbitController config={config}>
        {/* Planet tilt */}
        <group rotation={[config.axialTilt, 0, 0]}>
          {/* Planet Body */}
          <mesh ref={bodyRef}>
            <sphereGeometry args={[config.radius, 32, 32]} />
            <meshStandardMaterial
              color={config.color}
              roughness={config.roughness}
              metalness={config.metalness}
              emissive={config.emissive || '#000000'}
              emissiveIntensity={config.emissiveIntensity || 0}
            />
          </mesh>

          {/* Optional Atmospheric Glow Shell */}
          {config.atmosphere && (
            <mesh scale={config.atmosphere.scale}>
              <sphereGeometry args={[config.radius, 24, 24]} />
              <meshBasicMaterial
                color={config.atmosphere.color}
                transparent
                opacity={config.atmosphere.opacity}
                blending={THREE.AdditiveBlending}
                side={THREE.BackSide}
              />
            </mesh>
          )}

          {/* Optional Planetary Rings (e.g. Kronos / Zephyr) */}
          {config.rings && (
            <mesh rotation={config.rings.tilt}>
              <ringGeometry
                args={[config.rings.innerRadius, config.rings.outerRadius, 64]}
              />
              <meshStandardMaterial
                color={config.rings.color}
                roughness={0.7}
                metalness={0.2}
                transparent
                opacity={config.rings.opacity}
                side={THREE.DoubleSide}
              />
            </mesh>
          )}

          {/* Optional Moons */}
          {config.moons?.map((moon, mIdx) => (
            <mesh
              key={mIdx}
              ref={(el) => {
                moonRefs.current[mIdx] = el
              }}
              position={[moon.distance, 0, 0]}
            >
              <sphereGeometry args={[moon.radius, 16, 16]} />
              <meshStandardMaterial
                color={moon.color}
                emissive={moon.emissive || '#000000'}
                emissiveIntensity={moon.emissive ? 0.4 : 0}
                roughness={0.8}
              />
            </mesh>
          ))}
        </group>
      </PlanetOrbitController>
    </>
  )
}

function PlanetOrbitController({
  config,
  children,
}: {
  config: PlanetConfig
  children: React.ReactNode
}) {
  const groupRef = useRef<THREE.Group>(null)
  const angleRef = useRef(config.initialAngle)

  useFrame((_, delta) => {
    if (!groupRef.current) return
    // Advance orbit angle
    angleRef.current += delta * config.speed * 0.15
    const angle = angleRef.current
    const dist = config.distance

    groupRef.current.position.x = Math.cos(angle) * dist
    groupRef.current.position.z = Math.sin(angle) * dist
    groupRef.current.position.y = Math.sin(angle) * dist * config.inclination
  })

  return <group ref={groupRef}>{children}</group>
}

export default function Planets() {
  return (
    <group>
      {PLANETS_DATA.map((planet) => (
        <SinglePlanet key={planet.name} config={planet} />
      ))}
    </group>
  )
}
