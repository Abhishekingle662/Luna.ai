import React, { useMemo, useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'

export default function Starfield({ 
  scale = 1, 
  position = [0, 0, 1000], 
  rotation = [0, 0, 0],
  autoRotate = true,
  rotationSpeed = 0.01
}) {
  const ref = useRef()
  
  // Load the stars 3D model
  const { scene: starsModel, error } = useGLTF('/models/stars.glb')
  
  // Log loading status for debugging
  useEffect(() => {
    if (starsModel) {
      console.log('✨ Stars model loaded successfully!', starsModel)
    }
    if (error) {
      console.error('❌ Error loading stars model:', error)
    }
  }, [starsModel, error])

  // Fallback star positions for when model fails to load (reduced count since it's just fallback)
  const fallbackPositions = useMemo(() => {
    const count = 500 // Fixed reasonable fallback count
    const radius = 150
    const depth = 200
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      // Generate stars in a spherical distribution around the entire scene
      // Use spherical coordinates for even distribution
      const phi = Math.random() * Math.PI * 2 // azimuthal angle (0 to 2π)
      const costheta = Math.random() * 2 - 1 // cos of polar angle (-1 to 1)
      const theta = Math.acos(costheta) // polar angle
      const r = radius + Math.random() * depth // distance from center
      
      // Convert spherical to cartesian coordinates
      arr[i * 3 + 0] = r * Math.sin(theta) * Math.cos(phi) // x
      arr[i * 3 + 1] = r * Math.sin(theta) * Math.sin(phi) // y
      arr[i * 3 + 2] = r * Math.cos(theta) // z (can be positive or negative)
    }
    return arr
  }, [])

  // Fallback star sizes for when model fails to load
  const fallbackSizes = useMemo(() => {
    const count = 500 // Fixed reasonable fallback count
    const arr = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      arr[i] = Math.random() * 2 + 0.5 // Random size between 0.5 and 2.5
    }
    return arr
  }, [])
  useFrame((_, delta) => {
    if (ref.current && autoRotate) {
      ref.current.rotation.y += delta * rotationSpeed
    }
  })  // If stars model loaded successfully, use it
  if (starsModel && !error) {
    return (
      <group 
        ref={ref}
        position={position}
        rotation={rotation}
        scale={scale}
      >
        <primitive 
          object={starsModel.clone()} 
        />
      </group>
    )
  }
  // Fallback to original point-based stars if model fails to load
  return (
    <group 
      ref={ref}
      position={position}
      rotation={rotation}
      scale={scale}
    >
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={fallbackPositions.length / 3}
            array={fallbackPositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={fallbackSizes.length}
            array={fallbackSizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          color={0xf0f6fc}
          size={1}
          sizeAttenuation
          depthWrite={false}
          opacity={0.9}
          transparent
          vertexColors={false}
        />
      </points>
    </group>
  )
}

// Preload the stars model
useGLTF.preload('/models/stars.glb')