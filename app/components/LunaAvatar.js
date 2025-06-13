import React, { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, useGLTF } from '@react-three/drei'

export default function LunaAvatar({ scrollProgress, ...props }) {
  const groupRef = useRef()
  const [isVisible, setIsVisible] = useState(false)
  const [animationTime, setAnimationTime] = useState(0)
  const [hasError, setHasError] = useState(false)
  const [entranceAnimation, setEntranceAnimation] = useState(0)
  
  // Load Luna model
  const { scene: lunaScene, error: lunaError } = useGLTF('/models/luna.glb')
    // Luna becomes visible when user scrolls close to the moon (80% scroll progress)
  useEffect(() => {
    try {
      const shouldBeVisible = scrollProgress > 0.8
      if (shouldBeVisible !== isVisible) {
        console.log(`Luna Avatar visibility changing: ${isVisible} → ${shouldBeVisible} (scroll: ${scrollProgress.toFixed(3)})`)
        setIsVisible(shouldBeVisible)
        if (shouldBeVisible) {
          setEntranceAnimation(0) // Reset entrance animation when becoming visible
        }
      }
    } catch (error) {
      console.warn('Luna Avatar visibility update error:', error)
      setHasError(true)
    }
  }, [scrollProgress, isVisible])

  // Handle model loading errors
  useEffect(() => {
    if (lunaError) {
      console.error('Error loading Luna model:', lunaError)
      setHasError(true)
    } else if (lunaScene) {
      console.log('Luna model loaded successfully! ✨')
      setHasError(false)
    }
  }, [lunaScene, lunaError])

  useFrame((state, delta) => {
    if (!groupRef.current || !isVisible || !lunaScene) return
    
    setAnimationTime(prev => prev + delta)
    
    // Smooth entrance animation
    if (entranceAnimation < 1) {
      setEntranceAnimation(prev => Math.min(prev + delta * 2, 1)) // 0.5 second entrance
    }
    
    // Gentle floating animation
    const baseY = (props.position && props.position[1]) || 0
    groupRef.current.position.y = baseY + Math.sin(animationTime * 0.8) * 0.1
    
    // Subtle rotation for life-like movement
    groupRef.current.rotation.y = Math.sin(animationTime * 0.5) * 0.1
    
    // Entrance animation combined with breathing effect
    const breathingScale = 1 + Math.sin(animationTime * 1.5) * 0.05
    const entranceScale = entranceAnimation // Smooth scale from 0 to 1
    const finalScale = breathingScale * entranceScale
    groupRef.current.scale.setScalar(finalScale)
    
    // Entrance opacity animation
    if (groupRef.current.children) {
      groupRef.current.children.forEach(child => {
        if (child.material) {
          child.material.opacity = entranceAnimation
          child.material.transparent = true
        }
      })
    }
  })
  
  if (!isVisible || hasError) return null

  // Show fallback if Luna model failed to load
  if (lunaError || !lunaScene) {
    console.warn('Luna model not available, showing fallback')
    return (
      <group ref={groupRef} {...props}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.2]} />
          <meshStandardMaterial color="#e6f3ff" emissive="#4a90e2" emissiveIntensity={0.5} />
        </mesh>
        <Text
          position={[0, -0.4, 0]}
          fontSize={0.08}
          color="#e6f3ff"
          anchorX="center"
          anchorY="middle"
        >
          Luna (Loading...)
        </Text>
      </group>
    )
  }

return (
    <group ref={groupRef} {...props}>
        {/* Luna 3D Model */}
        <primitive 
            object={lunaScene.clone()} 
            scale={[0.2, 0.2, 0.2]} 
            position={[1, -1, 0]}
            rotation = {[0, -90, 0]}
        />
        
        {/* Welcome text that appears when Luna is visible
        <Text
            position={[0, .5, 0]}
            fontSize={0.08}
            color="#e6f3ff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.002}
            outlineColor="#1a365d"
        >
            Welcome to Luna.ai! 
        </Text> */}
        
        {/* Signboard background */}
        <mesh position={[0, 0.5, -0.01]}>
            <planeGeometry args={[1.5, 0.2]} />
            <meshBasicMaterial color="#1a365d" transparent opacity={0.9} />
        </mesh>
        
        <Text
            position={[0, 0.5, 0]}
            fontSize={0.05}
            color="#b3d9ff"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.001}
            outlineColor="#1a365d"
        >
            Hey there!
            I&apos;m Luna, your cosmic companion
        </Text>
    </group>
)
}

// Preload the Luna model
useGLTF.preload('/models/luna.glb')
