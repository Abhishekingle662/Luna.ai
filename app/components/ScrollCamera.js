import { useRef, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

export default function ScrollCamera() {
  const { camera } = useThree()
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isUserInteracting, setIsUserInteracting] = useState(false)
  const controlsRef = useRef()
  const lastInteractionTime = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight
      setScrollProgress(window.scrollY / max)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Track user interaction with controls
  useEffect(() => {
    if (controlsRef.current) {
      const controls = controlsRef.current
      
      const onStart = () => {
        setIsUserInteracting(true)
        lastInteractionTime.current = Date.now()
      }
      
      const onEnd = () => {
        setIsUserInteracting(false)
        lastInteractionTime.current = Date.now()
      }
      
      controls.addEventListener('start', onStart)
      controls.addEventListener('end', onEnd)
      
      return () => {
        controls.removeEventListener('start', onStart)
        controls.removeEventListener('end', onEnd)
      }
    }
  }, [])
  useFrame(() => {
    if (!controlsRef.current) return
      // Initial camera position: [0, 0, 7]
    // Moon position: [2.2, 1.2, 0]
    
    // As user scrolls, move camera closer to the Moon and eventually inside it
    const initialPosition = [0, 0, 7]
    const approachPosition = [1.8, 1.2, 3.5] // Approach the moon
    const insideMoonPosition = [2.2, 1.2, 0.2] // Inside the moon to see Luna
    
    let targetPosition
    if (scrollProgress < 0.8) {
      // Normal approach to the moon
      const normalProgress = scrollProgress / 0.8
      targetPosition = [
        initialPosition[0] + (approachPosition[0] - initialPosition[0]) * normalProgress,
        initialPosition[1] + (approachPosition[1] - initialPosition[1]) * normalProgress,
        initialPosition[2] + (approachPosition[2] - initialPosition[2]) * normalProgress
      ]
    } else {
      // Final 20% of scroll - move camera inside the moon
      const insideProgress = (scrollProgress - 0.8) / 0.2
      targetPosition = [
        approachPosition[0] + (insideMoonPosition[0] - approachPosition[0]) * insideProgress,
        approachPosition[1] + (insideMoonPosition[1] - approachPosition[1]) * insideProgress,
        approachPosition[2] + (insideMoonPosition[2] - approachPosition[2]) * insideProgress
      ]
    }
    
    // Calculate the base camera position based on scroll
    const baseX = targetPosition[0]
    const baseY = targetPosition[1] 
    const baseZ = targetPosition[2]
    
    // Update the controls target to follow the moon based on scroll
    const moonPosition = [2.2, 1.2, 0]
    const lookAtX = moonPosition[0] * scrollProgress
    const lookAtY = moonPosition[1] * scrollProgress
    const lookAtZ = moonPosition[2]
    
    // Set the target to look at the moon
    controlsRef.current.target.set(lookAtX, lookAtY, lookAtZ)
    
    // Only apply scroll-based camera movement if user isn't interacting
    // and hasn't interacted recently (give 1.5 seconds after interaction ends)
    const timeSinceLastInteraction = Date.now() - lastInteractionTime.current
    const shouldReturnToPosition = !isUserInteracting && timeSinceLastInteraction > 1500
    
    if (shouldReturnToPosition) {
      // Smoothly return camera to scroll-based position
      camera.position.lerp({ x: baseX, y: baseY, z: baseZ }, 0.03)    }
    
    controlsRef.current.update()
  })
    return (
    <OrbitControls 
      ref={controlsRef}
      enablePan={false} // Disable panning to keep focus on moon
      enableZoom={false} // Disable zoom - use only page scrolling for camera movement
      enableRotate={true}
      enableDamping={true}
      dampingFactor={0.08} // Lower damping for smoother, more responsive rotation
      rotateSpeed={0.4} // Balanced rotation speed
      autoRotate={false} // Don't auto-rotate
      autoRotateSpeed={0}
      minPolarAngle={0} // Allow full vertical rotation
      maxPolarAngle={Math.PI} // Allow full vertical rotation
      minDistance={0.1} // Allow very close distances to see inside moon
      maxDistance={8} // Maximum distance from target
    />
  )
}
