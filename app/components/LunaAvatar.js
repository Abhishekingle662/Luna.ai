import React, { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text, useGLTF } from '@react-three/drei'
import { useRouter } from 'next/navigation'

export default function LunaAvatar({ scrollProgress, ...props }) {
  const groupRef = useRef()
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const [animationTime, setAnimationTime] = useState(0)
  const [hasError, setHasError] = useState(false)
  const [entranceAnimation, setEntranceAnimation] = useState(0)
  const [moonData, setMoonData] = useState({ position: [0, 0, 2], scale: 1.2 })
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  
  // Dynamic signboard states
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [messageTimer, setMessageTimer] = useState(0)
  const [isGlitching, setIsGlitching] = useState(false)
  const [glitchTimer, setGlitchTimer] = useState(0)
  
  // Messages to cycle through
  const messages = [
    "Hey there!\nI'm Luna, your cosmic companion",
    "I'm here to help you explore\nthe universe of AI possibilities",
    "Ready to embark on this\njourney together?"
  ]
  
  // Ensure currentMessageIndex is valid
  const currentMessage = messages[currentMessageIndex] || messages[0] || ""
  
  // Load Luna model
  const { scene: lunaScene, error: lunaError } = useGLTF('/models/luna.glb')
  
  // Handle click/touch events
  const handleLunaClick = (event) => {
    event.stopPropagation()
    setIsClicked(true)
    
    // Add a small delay for visual feedback before navigation
    setTimeout(() => {
      router.push('/chat')
    }, 200)
  }
  
  const handleLunaHover = (event) => {
    event.stopPropagation()
    setIsHovered(true)
    setShowTooltip(true)
  }
  
  const handleLunaLeave = (event) => {
    event.stopPropagation()
    setIsHovered(false)
    setIsClicked(false)
    setShowTooltip(false)
  }
  
  // Listen for moon position updates
  useEffect(() => {
    const handleMoonPosition = (event) => {
      setMoonData(event.detail)
    }
    
    window.addEventListener('moonPosition', handleMoonPosition)
    return () => window.removeEventListener('moonPosition', handleMoonPosition)
  }, [])

  // Luna becomes visible when user scrolls close to the moon (80% scroll progress)
  useEffect(() => {
    try {
      const shouldBeVisible = scrollProgress > 0.8
      if (shouldBeVisible !== isVisible) {
        console.log(`Luna Avatar visibility changing: ${isVisible} → ${shouldBeVisible} (scroll: ${scrollProgress.toFixed(3)})`)
        setIsVisible(shouldBeVisible)
        if (shouldBeVisible) {
          setEntranceAnimation(0) // Reset entrance animation when becoming visible
          setCurrentMessageIndex(0) // Reset message cycle
          setMessageTimer(0)
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
    
    // Handle message cycling and glitch effects
    setMessageTimer(prev => prev + delta)
    setGlitchTimer(prev => prev + delta)
    
    // Message duration: 3 seconds per message
    if (messageTimer >= 3) {
      setIsGlitching(true)
      
      // Glitch for 0.3 seconds before changing message
      if (messageTimer >= 3.3) {
        setCurrentMessageIndex(prev => (prev + 1) % messages.length)
        setMessageTimer(0)
        setIsGlitching(false)
        setGlitchTimer(0)
      }
    }
    
    // Smooth entrance animation
    if (entranceAnimation < 1) {
      setEntranceAnimation(prev => Math.min(prev + delta * 2, 1)) // 0.5 second entrance
    }
    
    // Position avatar relative to moon with offset to avoid collision
    const moonPos = moonData.position
    const offset = {
      x: 0.8,  // Position to the right of moon
      y: 0.4,  // Position above moon
      z: 0.6   // Position in front of moon (closer to camera)
    }
    
    // Apply offset relative to moon position with floating animation
    groupRef.current.position.x = moonPos[0] + offset.x
    groupRef.current.position.y = moonPos[1] + offset.y + Math.sin(animationTime * 0.8) * 0.1
    groupRef.current.position.z = moonPos[2] + offset.z
    
    // Subtle rotation for life-like movement
    groupRef.current.rotation.y = Math.sin(animationTime * 0.5) * 0.1
    
    // Entrance animation combined with breathing effect and distance scaling
    const breathingScale = 1 + Math.sin(animationTime * 1.5) * 0.05
    const entranceScale = entranceAnimation // Smooth scale from 0 to 1
    
    // Scale up with distance - avatar gets larger as it approaches camera
    const distanceScale = 1 + scrollProgress * 1.5 // Scale up to 2.5x when fully scrolled
    
    // Add hover and click effects
    const hoverScale = isHovered ? 1.1 : 1.0
    const clickScale = isClicked ? 0.95 : 1.0
    
    const finalScale = breathingScale * entranceScale * distanceScale * hoverScale * clickScale
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
  
  // Generate glitch effects
  const getGlitchText = (text) => {
    if (!text || typeof text !== 'string') return ""
    if (!isGlitching) return text
    
    const glitchChars = '█▓▒░!@#$%^&*()_+-=[]{}|;:,.<>?'
    const glitchIntensity = Math.sin(glitchTimer * 50) * 0.5 + 0.5
    
    return text.split('').map(char => {
      if (char === '\n' || char === ' ') return char
      return Math.random() < glitchIntensity * 0.3 
        ? glitchChars[Math.floor(Math.random() * glitchChars.length)]
        : char
    }).join('')
  }
  
  const getGlitchColor = () => {
    if (!isGlitching) return "#00aaff"  // Bright blue for normal text
  
    // Bright colors for glitch effect
    const colors = ["#ff0066", "#00ff66", "#6600ff", "#ff6600", "#0066ff"]
    return colors[Math.floor(Math.random() * colors.length)]
  }
  
  const getGlitchPosition = () => {
    if (!isGlitching) return [0.3, 0.2, -1]
    
    const jitter = 0.02
    return [
      0.3 + (Math.random() - 0.5) * jitter,
      0.2 + (Math.random() - 0.5) * jitter,
      -1
    ]
  }
  
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
          color='red'
          anchorX="center"
          anchorY="middle"
        >
          {"Luna (Loading...)"}
        </Text>
      </group>
    )
  }

  return (
    <group ref={groupRef} {...props}>
      {/* Luna 3D Model - No longer clickable */}
      <primitive 
        object={lunaScene.clone()} 
        scale={[0.15, 0.15, 0.15]} 
        position={[-0.6, -0.5, -1]}
        rotation={[0, -20.2, -0.1]}
      />
      
      {/* Calculate position once to avoid multiple random calls */}
      {(() => {
        const basePosition = getGlitchPosition()
        return (
          <group>
            {/* Border mesh - Clickable */}
            <mesh 
              position={[basePosition[0], basePosition[1], basePosition[2] - 0.002]}
              onClick={handleLunaClick}
              onPointerOver={handleLunaHover}
              onPointerOut={handleLunaLeave}
              style={{ 
                cursor: isClicked 
                  ? 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\' viewBox=\'0 0 32 32\'><circle cx=\'16\' cy=\'16\' r=\'12\' fill=\'%23ff6600\' stroke=\'%23ffffff\' stroke-width=\'2\'/><text x=\'16\' y=\'20\' font-family=\'Arial\' font-size=\'12\' fill=\'%23ffffff\' text-anchor=\'middle\'>🚀</text></svg>"), auto'
                  : isHovered 
                    ? 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\' viewBox=\'0 0 32 32\'><circle cx=\'16\' cy=\'16\' r=\'12\' fill=\'%2300aaff\' stroke=\'%23ffffff\' stroke-width=\'2\'/><text x=\'16\' y=\'20\' font-family=\'Arial\' font-size=\'12\' fill=\'%23ffffff\' text-anchor=\'middle\'>🌙</text></svg>"), auto'
                    : 'pointer' 
              }}
            >
              <planeGeometry args={[1.35, 0.35]} />
              <meshBasicMaterial 
                color={isGlitching ? "#ff0066" : "#4a90e2"}
                transparent 
                opacity={0.6}
              />
            </mesh>
            
            {/* Dynamic Signboard background - Clickable */}
            <mesh 
              position={[basePosition[0], basePosition[1], basePosition[2] - 0.001]}
              onClick={handleLunaClick}
              onPointerOver={handleLunaHover}
              onPointerOut={handleLunaLeave}
              style={{ 
                cursor: isClicked 
                  ? 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\' viewBox=\'0 0 32 32\'><circle cx=\'16\' cy=\'16\' r=\'12\' fill=\'%23ff6600\' stroke=\'%23ffffff\' stroke-width=\'2\'/><text x=\'16\' y=\'20\' font-family=\'Arial\' font-size=\'12\' fill=\'%23ffffff\' text-anchor=\'middle\'>🚀</text></svg>"), auto'
                  : isHovered 
                    ? 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\' viewBox=\'0 0 32 32\'><circle cx=\'16\' cy=\'16\' r=\'12\' fill=\'%2300aaff\' stroke=\'%23ffffff\' stroke-width=\'2\'/><text x=\'16\' y=\'20\' font-family=\'Arial\' font-size=\'12\' fill=\'%23ffffff\' text-anchor=\'middle\'>🌙</text></svg>"), auto'
                    : 'pointer' 
              }}
            >
              <planeGeometry args={[1.3, 0.3]} />
              <meshBasicMaterial 
                color={isGlitching ? "#ffffff" : "#1a365d"} 
                transparent 
                opacity={isGlitching ? 0.9 : 0.95} 
              />
            </mesh>
            
            {/* Dynamic Text with glitch effects - Clickable */}
            <Text
              position={basePosition}
              fontSize={0.08}
              color={getGlitchColor()}
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.001}
              outlineColor={isGlitching ? "#000000" : "#ffffff"}
              onClick={handleLunaClick}
              onPointerOver={handleLunaHover}
              onPointerOut={handleLunaLeave}
              style={{ 
                cursor: isClicked 
                  ? 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\' viewBox=\'0 0 32 32\'><circle cx=\'16\' cy=\'16\' r=\'12\' fill=\'%23ff6600\' stroke=\'%23ffffff\' stroke-width=\'2\'/><text x=\'16\' y=\'20\' font-family=\'Arial\' font-size=\'12\' fill=\'%23ffffff\' text-anchor=\'middle\'>🚀</text></svg>"), auto'
                  : isHovered 
                    ? 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'32\' height=\'32\' viewBox=\'0 0 32 32\'><circle cx=\'16\' cy=\'16\' r=\'12\' fill=\'%2300aaff\' stroke=\'%23ffffff\' stroke-width=\'2\'/><text x=\'16\' y=\'20\' font-family=\'Arial\' font-size=\'12\' fill=\'%23ffffff\' text-anchor=\'middle\'>🌙</text></svg>"), auto'
                    : 'pointer' 
              }}
            >
              {getGlitchText(currentMessage)}
            </Text>
          </group>
        )
      })()}
      
      {/* Hover Tooltip */}
      {showTooltip && (() => {
        const basePosition = getGlitchPosition()
        return (
          <group>
            {/* Tooltip background */}
            <mesh position={[basePosition[0], basePosition[1] + 0.25, basePosition[2] + 0.01]}>
              <planeGeometry args={[1.8, 0.4]} />
              <meshBasicMaterial 
                color="#2a2a2a" 
                transparent 
                opacity={0.9}
              />
            </mesh>
            
            {/* Tooltip border */}
            <mesh position={[basePosition[0], basePosition[1] + 0.25, basePosition[2] + 0.005]}>
              <planeGeometry args={[1.85, 0.45]} />
              <meshBasicMaterial 
                color="#4a90e2" 
                transparent 
                opacity={0.8}
              />
            </mesh>
            
            {/* Tooltip text */}
            <Text
              position={[basePosition[0], basePosition[1] + 0.25, basePosition[2] + 0.02]}
              fontSize={0.06}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.002}
              outlineColor="#000000"
            >
              Click to start chatting with Luna.ai
            </Text>
          </group>
        )
      })()}
      
      {/* Optional: Glitch overlay effect */}
      {isGlitching && (
        <mesh position={[0.3, 0.2, -0.99]}>
          <planeGeometry args={[1.3, 0.3]} />
          <meshBasicMaterial 
            color="#ffffff" 
            transparent 
            opacity={Math.sin(glitchTimer * 100) * 0.1 + 0.05}
          />
        </mesh>
      )}
    </group>
  )
}

// Preload the Luna model
useGLTF.preload('/models/luna.glb')
