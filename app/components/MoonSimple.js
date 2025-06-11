import React, { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'

export default function MoonSimple(props) {
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
  console.log('🌙 Starting to load moon model...')
  
  const { scene, error } = useGLTF('/models/moon.glb')

  // Log loading status
  useEffect(() => {
    console.log('🌙 Moon component state:', { scene: !!scene, error: !!error })
    if (scene) {
      console.log('✅ Moon model loaded successfully!', scene)
    }
    if (error) {
      console.error('❌ Error loading moon model:', error)
    }
  }, [scene, error])
  useFrame(() => {
    if (!ref.current) return
    
    // Only apply scroll-based rotation if not being manually controlled
    if (!props.disableScrollRotation) {
      // rotate anticlockwise as you scroll down
      ref.current.rotation.y = -scrollProgress * Math.PI * 2
    }
    
    // Keep moon at a consistent distance, but slightly move it back to prevent covering text
    const baseZ = props.position?.[2] ?? 0
    ref.current.position.z = baseZ + scrollProgress * 1.5
    
    // Slightly scale down the moon as you scroll to prevent it from covering text
    const baseScale = Array.isArray(props.scale) ? props.scale[0] : props.scale || 1
    const minScale = baseScale * 0.8 // Scale down to 80% at maximum scroll
    const currentScale = baseScale - (scrollProgress * (baseScale - minScale))
    ref.current.scale.setScalar(currentScale)
  })

  // Show fallback while loading or if error
  if (!scene || error) {
    return (      <mesh ref={ref} {...props}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial 
          color={error ? "#8b949e" : "#f0f6fc"} 
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
useGLTF.preload('/models/moon.glb')
