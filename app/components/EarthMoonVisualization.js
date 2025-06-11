'use client'
import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Box, Typography, Paper, Button, Grid } from '@mui/material'
import Earth from './Earth'
import Moon from './Moon'
import Starfield from './Starfield'

// Component that shows Earth and Moon orbiting
function EarthMoonSystem({ isAnimating = true }) {
  const earthRef = useRef()
  const moonRef = useRef()
  const [time, setTime] = useState(0)
  useFrame((state, delta) => {
    if (!isAnimating) return
    
    setTime(prev => prev + delta * 0.3) // Even slower animation
    
    if (earthRef.current) {
      // Earth rotates on its own axis (slowest rotation)
      earthRef.current.rotation.y += delta * 0.2  // Reduced from 0.5 to 0.2
    }
    
    if (moonRef.current) {
      // Moon orbits around Earth
      const orbitRadius = 4
      moonRef.current.position.x = Math.cos(time) * orbitRadius
      moonRef.current.position.z = Math.sin(time) * orbitRadius
      // Moon also rotates (tidally locked - same rotation as orbit, but slower)      moonRef.current.rotation.y = time * 0.5  // Reduced from time to time * 0.5
    }
  })

  return (
    <>
      <Starfield 
        scale={0.8} 
        position={[0, 0, -30]}
        autoRotate={false}
      />
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      {/* Earth at center */}
      <Earth 
        ref={earthRef}
        position={[0, 0, 0]} 
        scale={2} 
        disableScrollRotation={true}
      />
      
      {/* Moon orbiting Earth */}
      <Moon 
        ref={moonRef}
        position={[4, 0, 0]} 
        scale={0.5} 
        disableScrollRotation={true}
      />
    </>
  )
}

export default function EarthMoonVisualization() {
  const [isAnimating, setIsAnimating] = useState(true)

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        backgroundColor: 'rgba(36, 41, 46, 0.9)',
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        border: '1px solid rgba(240, 246, 252, 0.3)',
        mb: 4,
      }}
    >
      <Typography variant="h6" sx={{ 
        mb: 2, 
        color: '#f0f6fc',
        textShadow: '0 0 10px rgba(240, 246, 252, 0.5)'
      }}>
        Earth-Moon System
      </Typography>
      
      <Typography variant="body2" sx={{ 
        mb: 3, 
        color: '#c8d1d9' 
      }}>
        Interactive 3D visualization of the Earth-Moon system showing orbital mechanics in action.
      </Typography>
      
      <Box sx={{ 
        width: '100%', 
        height: '400px',
        borderRadius: 2,
        overflow: 'hidden',
        backgroundColor: '#000',
        mb: 3
      }}>
        <Canvas
          camera={{ position: [8, 5, 8], fov: 60 }}
          style={{ width: '100%', height: '100%' }}
        >
          <color attach="background" args={['#000']} />
          <EarthMoonSystem isAnimating={isAnimating} />
          <OrbitControls 
            enablePan={true} 
            enableZoom={true} 
            enableRotate={true}
            minDistance={5}
            maxDistance={20}
          />
        </Canvas>
      </Box>
      
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6}>
          <Button 
            variant="contained" 
            onClick={() => setIsAnimating(!isAnimating)}
            sx={{
              backgroundColor: isAnimating ? '#f0f6fc' : '#c8d1d9',
              color: '#111316',
              '&:hover': {
                backgroundColor: isAnimating ? '#c8d1d9' : '#f0f6fc',
              },
              width: '100%'
            }}
          >
            {isAnimating ? 'Pause Animation' : 'Start Animation'}
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="caption" sx={{ 
            color: '#8b949e',
            display: 'block',
            mt: 1
          }}>
            Use mouse to rotate, zoom, and pan the view
          </Typography>
        </Grid>
      </Grid>
      
      <Box sx={{ 
        p: 2, 
        backgroundColor: 'rgba(17, 19, 22, 0.6)', 
        borderRadius: 1, 
        border: '1px solid rgba(240, 246, 252, 0.1)' 
      }}>
        <Typography variant="body2" sx={{ color: '#c8d1d9' }}>
          <strong>Key Facts:</strong>
        </Typography>        <Typography variant="caption" sx={{ color: '#8b949e', mt: 1, display: 'block' }}>
          • The Moon orbits Earth at an average distance of 384,400 km<br/>
          • Moon&apos;s orbital period: ~27.3 days<br/>
          • Moon is tidally locked to Earth (same side always faces Earth)<br/>
          • Earth&apos;s rotation: ~24 hours, Moon&apos;s orbit: ~27.3 days
        </Typography>
      </Box>
    </Paper>
  )
}
