import React, { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import LunaAvatar from './LunaAvatar'

export default function Moon(props) {
  const ref = useRef()
  // track page scroll progress 0 → 1
  const [scrollProgress, setScrollProgress] = useState(0)
  const [error, setError] = useState(null)
  const [materialsInitialized, setMaterialsInitialized] = useState(false)
  const originalMaterials = useRef(new Map())

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
  const isLoading = !scene  // Log loading status for debugging
  useEffect(() => {
    if (scene && !error && !materialsInitialized) {
      console.log('Moon model loaded successfully! 🌙')
      
      // Store original material properties for safe restoration
      scene.traverse((child) => {
        if (child.isMesh && child.material) {
          const materials = Array.isArray(child.material) ? child.material : [child.material]
          materials.forEach((mat, index) => {
            const key = `${child.uuid}_${index}`
            originalMaterials.current.set(key, {
              transparent: mat.transparent,
              opacity: mat.opacity,
              material: mat
            })
          })
        }
      })
      setMaterialsInitialized(true)
    }
  }, [scene, error, materialsInitialized])
  useFrame(() => {
    if (!ref.current || !scene) return
    
    // Slowest rotation - much slower than before
    ref.current.rotation.y = scrollProgress * Math.PI * 0.1
    
    // Move moon from starting position towards camera as user scrolls
    const baseZ = props.position?.[2] ?? 2
    const targetZ = 3.5  // Keep moon further back (was 5)
    ref.current.position.z = baseZ + scrollProgress * (targetZ - baseZ)
    
    // Change these target positions to move moon relative to avatar
    const baseX = props.position?.[0] ?? 0
    const baseY = props.position?.[1] ?? 0
    
    // Position moon behind avatar (same X, Y but different Z in avatar positioning)
    const targetX = 0     // Center horizontally with avatar
    const targetY = 0     // Same height as avatar
    
    ref.current.position.x = baseX + scrollProgress * (targetX - baseX)
    ref.current.position.y = baseY + scrollProgress * (targetY - baseY)
    
    // Scale up the moon dramatically as it approaches
    const baseScale = 1.2
    const maxScale = 4.0
    const currentScale = baseScale + scrollProgress * (maxScale - baseScale)
    ref.current.scale.setScalar(currentScale)
    
    // Dispatch moon position for LunaAvatar to follow
    window.dispatchEvent(new CustomEvent('moonPosition', { 
      detail: { 
        position: [ref.current.position.x, ref.current.position.y, ref.current.position.z],
        scale: currentScale,
        scrollProgress 
      } 
    }))
    
    // Make moon transparent when user gets close (last 20% of scroll)
    if (materialsInitialized && scrollProgress > 0.8) {
      const transparencyProgress = (scrollProgress - 0.8) / 0.2
      const opacity = Math.max(0.8, 1 - (transparencyProgress * 0.7))
      
      // Apply transparency to moon materials safely
      originalMaterials.current.forEach((originalData, key) => {
        const mat = originalData.material
        if (mat && mat.opacity !== undefined) {
          mat.transparent = true
          mat.opacity = opacity
          mat.needsUpdate = true
        }
      })
    } else if (materialsInitialized) {
      // Reset to original opacity safely
      originalMaterials.current.forEach((originalData, key) => {
        const mat = originalData.material
        if (mat && mat.opacity !== undefined) {
          mat.transparent = originalData.transparent
          mat.opacity = originalData.opacity
          mat.needsUpdate = true
        }
      })
    }
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
  }  return (
    <>
      <primitive
        ref={ref}
        object={scene}
        {...props}
        onPointerOver={() => (document.body.style.cursor = 'grab')}
        onPointerOut={() => (document.body.style.cursor = 'auto')}
      />
      
      {/* Luna Avatar positioned in front of the Moon */}
      <LunaAvatar 
        position={[
          (props.position?.[0] ?? 0) + 0,    // Center with moon
          (props.position?.[1] ?? 0) + 0,    // Same height as moon  
          (props.position?.[2] ?? 0) + 2.0   // Move avatar further forward (was 1.0)
        ]} 
        scrollProgress={scrollProgress}
      />
    </>
  )
}

// Preload the moon model (client-side only)
if (typeof window !== 'undefined') {
  // Preload with three.js useGLTF
  useGLTF.preload('/models/moon.glb')
}