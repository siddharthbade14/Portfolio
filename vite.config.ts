import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const threeModules  = ['three', '@react-three/fiber', '@react-three/drei', '@react-three/postprocessing', 'postprocessing']
const gsapModules   = ['gsap', 'lenis']
const framerModules = ['framer-motion']
const reactModules  = ['react', 'react-dom']

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei'],
  },
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (threeModules.some(m => id.includes(m)))  return 'vendor-three'
          if (gsapModules.some(m => id.includes(m)))   return 'vendor-gsap'
          if (framerModules.some(m => id.includes(m))) return 'vendor-framer'
          if (reactModules.some(m => id.includes(m)))  return 'vendor-react'
        },
      },
    },
  },
})
