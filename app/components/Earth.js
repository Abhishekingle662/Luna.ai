import React, { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'

export default function Earth(props) {
  const ref = useRef()
  // track page scroll progress 0 → 1
  const [scrollProgress, setScrollProgress] = useState(0)
  const [error, setError] = useState(null)

  // Always call useGLTF at the top level
  const gltfData = useGLTF('/models/planet_earth.glb')
  
  useEffect(() => {
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight
      setScrollProgress(window.scrollY / max)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Handle loading and error states
  const scene = gltfData?.scene
  const isLoading = !scene
  
  // Log loading status for debugging
  useEffect(() => {
    if (scene && !error) {
      console.log('Earth model loaded successfully! 🌍')
    }
  }, [scene, error])
  useFrame(() => {
    if (!ref.current || !scene) return
      // Only apply scroll-based rotation if not being manually controlled
    if (!props.disableScrollRotation) {
      // rotate counterclockwise as you scroll down (slowest rotation)
      ref.current.rotation.y = -scrollProgress * Math.PI * 0.1  // Reduced from 2 to 0.5
    }
      // Keep Earth at a distant position, minimal movement
    const baseZ = props.position?.[2] ?? 0
    ref.current.position.z = baseZ - scrollProgress * 0.5 // Much less movement
      // Use Earth's scale (much smaller and distant)
    const baseScale = Array.isArray(props.scale) ? props.scale[0] : props.scale || 0.5
    const minScale = baseScale * 0.8 // Scale down to 80% at maximum scroll
    const currentScale = baseScale - (scrollProgress * (baseScale - minScale))
    ref.current.scale.setScalar(currentScale)
  })

  // Show loading state or error if needed
  if (isLoading) {
    return (      
      <mesh ref={ref} {...props}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color="#4A90E2" opacity={0.7} transparent />
      </mesh>
    )
  }
  
  if (error || !scene) {
    console.error('Error loading Earth model:', error);
    return (
      <mesh ref={ref} {...props}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color="#4A90E2" />
      </mesh>
    )
  }

  return (
    <primitive
      ref={ref}
      object={scene}
      {...props}
      onPointerOver={() => (document.body.style.cursor = 'grab')}
      onPointerOut={() => (document.body.style.cursor = 'auto')}
    />
  )
}

// Preload the Earth model (client-side only)
if (typeof window !== 'undefined') {
  // Preload with three.js useGLTF
  useGLTF.preload('/models/planet_earth.glb')
}
