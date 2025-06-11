import { useRef, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

export default function ScrollCamera() {
  const { camera } = useThree()
  const [scrollProgress, setScrollProgress] = useState(0)
  const controlsRef = useRef()

  useEffect(() => {
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight
      setScrollProgress(window.scrollY / max)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useFrame(() => {
    // Always apply scroll-based camera movement - this takes priority
    // Initial camera position: [0, 0, 7]
    // Moon position: [2.2, 1.2, 0]
    
    // As user scrolls, move camera closer to the Moon
    const initialPosition = [0, 0, 7]
    const targetPosition = [1.2, 1.2, 4] // Close to moon but not too close
    
    // Calculate the base camera position based on scroll
    const baseX = initialPosition[0] + (targetPosition[0] - initialPosition[0]) * scrollProgress
    const baseY = initialPosition[1] + (targetPosition[1] - initialPosition[1]) * scrollProgress
    const baseZ = initialPosition[2] + (targetPosition[2] - initialPosition[2]) * scrollProgress
    
    // Update the controls target to follow the moon based on scroll
    const moonPosition = [2.2, 1.2, 0]
    const lookAtX = moonPosition[0] * scrollProgress
    const lookAtY = moonPosition[1] * scrollProgress
    const lookAtZ = moonPosition[2]
      if (controlsRef.current) {
      // Set the target to look at the moon
      controlsRef.current.target.set(lookAtX, lookAtY, lookAtZ)
      
      // If user hasn't interacted recently, smoothly move camera to scroll position
      camera.position.lerp({ x: baseX, y: baseY, z: baseZ }, 0.05)
      
      controlsRef.current.update()
    }
  })
  return (
    <OrbitControls 
      ref={controlsRef}
      enablePan={false} // Disable panning to keep focus on moon
      enableZoom={false} // Disable zoom - use only page scrolling for camera movement
      enableRotate={true}
      enableDamping={true}
      dampingFactor={0.15} // Slightly more damping for smoother feel
      rotateSpeed={0.3} // Slower rotation for more control
      autoRotate={false} // Don't auto-rotate
      autoRotateSpeed={0}
    />
  )
}
