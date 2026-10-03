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
 * On mobile, replaces the heavy WebGL canvas with a lightweight CSS background
 * to prevent GPU lag on low-end phones.
 */
export default function Scene({
  scrollProgress,
  mouseX,
  mouseY,
  isMobile,
  reducedMotion,
}: SceneProps) {
  // On mobile: skip WebGL entirely — use a pure CSS space background instead
  if (isMobile) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(ellipse at 70% 20%, rgba(255,0,60,0.07) 0%, transparent 55%), ' +
            'radial-gradient(ellipse at 30% 80%, rgba(100,0,20,0.05) 0%, transparent 50%), ' +
            '#050206',
        }}
        aria-hidden="true"
      />
    )
  }

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
          antialias: false,          // off — huge perf win, barely visible
          alpha: true,
          powerPreference: 'high-performance',
          precision: 'mediump',      // medium precision is fine for this scene
        }}
        dpr={[1, 1.5]}               // cap at 1.5x — was allowing full 3x on Retina
        style={{ background: 'transparent' }}
        frameloop="demand"           // only re-render on change, not every frame
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
