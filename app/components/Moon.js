import React, { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'

export default function Moon(props) {
  const ref = useRef()
  // track page scroll progress 0 → 1
  const [scrollProgress, setScrollProgress] = useState(0)
  const [error, setError] = useState(null)

  // Always call useGLTF at the top level
  const gltfData = useGLTF('/models/moon.glb')
  
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
    }
  }, [scene, error])

  useFrame(() => {
    if (!ref.current || !scene) return
    
    // rotate clockwise as you scroll down
    ref.current.rotation.y = scrollProgress * Math.PI * 2
    
    // Keep moon at a consistent distance, but slightly move it back to prevent covering text
    const baseZ = props.position?.[2] ?? 0
    ref.current.position.z = baseZ + scrollProgress * 2
    
    // Slightly scale down the moon as you scroll to prevent it from covering text
    const baseScale = Array.isArray(props.scale) ? props.scale[0] : props.scale || 1
    const minScale = baseScale * 0.7 // Scale down to 70% at maximum scroll
    const currentScale = baseScale - (scrollProgress * (baseScale - minScale))
    ref.current.scale.setScalar(currentScale)
  })
  // Show loading state or error if needed
  if (isLoading) {
    return (      <mesh ref={ref} {...props}>
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
      scale={props.scale}
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