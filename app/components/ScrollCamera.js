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
    
    // Keep camera at fixed position [0, 0, 7]
    const cameraPosition = [0, 0, 7]
    
    // Only apply camera position if user isn't interacting
    const timeSinceLastInteraction = Date.now() - lastInteractionTime.current
    const shouldReturnToPosition = !isUserInteracting && timeSinceLastInteraction > 1500
    
    if (shouldReturnToPosition) {
      camera.position.lerp({ x: cameraPosition[0], y: cameraPosition[1], z: cameraPosition[2] }, 0.03)
    }
    
    // Keep controls target fixed at the center where moon will approach
    controlsRef.current.target.set(0, 0, 0)
    
    controlsRef.current.update()
  })

  // Return scroll progress so parent components can use it to position moon/avatar
  useEffect(() => {
    // Dispatch custom event with scroll progress for moon/avatar positioning
    window.dispatchEvent(new CustomEvent('moonScrollProgress', { 
      detail: { scrollProgress } 
    }))
  }, [scrollProgress])

  return (
    <OrbitControls 
      ref={controlsRef}
      enablePan={false}
      enableZoom={false}
      enableRotate={true}
      enableDamping={true}
      dampingFactor={0.08}
      rotateSpeed={0.4}
      autoRotate={false}
      autoRotateSpeed={0}
      minPolarAngle={0}
      maxPolarAngle={Math.PI}
      minDistance={0.1}
      maxDistance={8}
    />
  )
}
