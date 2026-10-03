import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Preload, AdaptiveDpr } from '@react-three/drei'
import RealisticSpaceScene from './RealisticSpaceScene'

interface SceneProps {
  scrollProgress: number
  mouseX: number
  mouseY: number
  isMobile: boolean
  reducedMotion: boolean
}

/**
 * Main R3F Canvas: Photorealistic 3D Moon and deep space celestial canvas.
 * Elegant, realistic, and matches the reference site theme.
 */
export default function Scene({
  scrollProgress,
  mouseX,
  mouseY,
  isMobile,
  reducedMotion,
}: SceneProps) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 1.0, 10], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, Math.min(window.devicePixelRatio, 2)]}
        style={{ background: 'transparent' }}
        frameloop="always"
      >
        <AdaptiveDpr pixelated />

        <Suspense fallback={null}>
          <RealisticSpaceScene
            scrollProgress={scrollProgress}
            mouseX={mouseX}
            mouseY={mouseY}
            isMobile={isMobile}
            reducedMotion={reducedMotion}
          />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  )
}
