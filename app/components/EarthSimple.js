import React, { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'

export default function EarthSimple(props) {
  const ref = useRef()
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight
      setScrollProgress(window.scrollY / max)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Simple GLTF loading with error handling
  console.log('🌍 Starting to load Earth model...')
  
  const { scene, error } = useGLTF('/models/planet_earth.glb')

  // Log loading status
  useEffect(() => {
    console.log('🌍 Earth component state:', { scene: !!scene, error: !!error })
    if (scene) {
      console.log('✅ Earth model loaded successfully!', scene)
    }
    if (error) {
      console.error('❌ Error loading Earth model:', error)
    }
  }, [scene, error])

  useFrame(() => {
    if (!ref.current) return
      // Only apply scroll-based rotation if not being manually controlled
    if (!props.disableScrollRotation) {
      // rotate clockwise as you scroll down (slowest rotation)
      ref.current.rotation.y = scrollProgress * Math.PI * 0.5  // Reduced from 2 to 0.5
    }
    
    // Keep Earth at a very distant position, almost no movement
    const baseZ = props.position?.[2] ?? 0
    ref.current.position.z = baseZ - scrollProgress * 0.2 // Minimal movement
    
    // Slightly scale down the Earth as you scroll (very small and distant)
    const baseScale = Array.isArray(props.scale) ? props.scale[0] : props.scale || 0.3
    const minScale = baseScale * 0.9 // Only minimal scaling change
    const currentScale = baseScale - (scrollProgress * (baseScale - minScale))
    ref.current.scale.setScalar(currentScale)
  })

  // Show fallback while loading or if error
  if (!scene || error) {
    return (
      <mesh ref={ref} {...props}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial 
          color={error ? "#8b949e" : "#4A90E2"} 
          wireframe={!scene && !error}
        />
      </mesh>
    )
  }

  return (
    <primitive
      ref={ref}
      object={scene}
      scale={props.scale}
      {...props}
      onPointerOver={() => (document.body.style.cursor = 'grab')}
      onPointerOut={() => (document.body.style.cursor = 'auto')}
    />
  )
}

// Preload the model
useGLTF.preload('/models/planet_earth.glb')
