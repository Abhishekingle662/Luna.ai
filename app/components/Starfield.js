import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export default function Starfield({
  count = 1000,
  radius = 150,   // new prop: horizontal/vertical spread
  depth = 200     // new prop: how “deep” (z-axis)
}) {
  const ref = useRef()

  const positions = useMemo(() => {
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
  }, [count, radius, depth])

  // Create varying star sizes for more realism
  const sizes = useMemo(() => {
    const arr = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      arr[i] = Math.random() * 2 + 0.5 // Random size between 0.5 and 2.5
    }
    return arr
  }, [count])

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.01
  })
  return (
    <group ref={ref}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={sizes.length}
            array={sizes}
            itemSize={1}
          />
        </bufferGeometry>        <pointsMaterial
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