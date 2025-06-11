import React, { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'

export default function Moon(props) {
  const ref = useRef()
  // track page scroll progress 0 → 1
  const [scrollProgress, setScrollProgress] = useState(0)
  const [error, setError] = useState(null)

  // Always call useGLTF at the top level
  const gltfData = useGLTF('/models/the_moon.glb')
  
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
      console.log('Moon model loaded successfully! 🌙')
    }  }, [scene, error])
    useFrame(() => {
    if (!ref.current || !scene) return
    
    // Slowest rotation - much slower than before
    ref.current.rotation.y = scrollProgress * Math.PI * 0.1  // Reduced from 0.5 to 0.1 for slowest rotation
    
    // Keep moon at a consistent distance, but slightly move it back to prevent covering text
    const baseZ = props.position?.[2] ?? 0
    ref.current.position.z = baseZ + scrollProgress * 2
    
    // Use a much larger base scale for dramatic size increase
    const baseScale = 3 // Fixed large scale - ignoring props.scale
    const minScale = baseScale * 0.85 // Scale down to only 85% instead of 70%
    const currentScale = baseScale - (scrollProgress * (baseScale - minScale))
    ref.current.scale.setScalar(currentScale)
  })
  // Show loading state or error if needed
  if (isLoading) {
    return (      
    <mesh ref={ref} {...props}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color="#c8d1d9" opacity={0.7} transparent />
      </mesh>
    )
  }
  if (error || !scene) {
    console.error('Error loading moon model:', error);
    return (
      <mesh ref={ref} {...props}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial color="#f0f6fc" />
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

// Preload the moon model (client-side only)
if (typeof window !== 'undefined') {
  // Preload with three.js useGLTF
  useGLTF.preload('/models/moon.glb')
}