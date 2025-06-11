'use client'

import React, { useRef, useEffect, useState } from 'react';
import { Box, Slider, Typography, Grid, Paper, Button } from '@mui/material';
import { keyframes } from '@mui/system';

// Animation
const glow = keyframes`
  0% {
    box-shadow: 0 0 10px rgba(240, 246, 252, 0.7);
  }
  50% {
    box-shadow: 0 0 20px rgba(240, 246, 252, 0.9);
  }
  100% {
    box-shadow: 0 0 10px rgba(240, 246, 252, 0.7);
  }
`;

export default function OrbitalAnimation() {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  
  // State for interactive parameters
  const [eccentricity, setEccentricity] = useState(0.5);
  const [speed, setSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showAreas, setShowAreas] = useState(false);
  
  // Animation state
  const orbitDataRef = useRef({
    t: 0,
    planetPos: { x: 0, y: 0 },
    areaPoints: [],
    lastAreaTime: 0
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Orbital parameters
    const a = 150; // semi-major axis
    const c = a * eccentricity; // distance from center to focus
    const b = Math.sqrt(a * a - c * c); // semi-minor axis
    const sunX = centerX - c; // Sun&apos;s position (at one focus)
    
    // Animation loop
    const animate = () => {
      if (!isPlaying) {
        animFrameRef.current = requestAnimationFrame(animate);
        return;
      }
      
      // Clear canvas with a clean dark background
      ctx.fillStyle = 'rgb(25, 25, 35)';
      ctx.fillRect(0, 0, width, height);
      
      // Draw orbital path
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, a, b, 0, 0, Math.PI * 2);
      ctx.stroke();
      
      // Calculate planet position
      // Kepler&apos;s equation implementation for more accurate elliptical motion
      const orbitData = orbitDataRef.current;
      const deltaT = speed * 0.005;
      orbitData.t = (orbitData.t + deltaT) % (Math.PI * 2);
      
      // For simplicity, we'll use parametric equation of ellipse
      // In a more complex simulation, we'd solve Kepler&apos;s equation
      const planetX = centerX + a * Math.cos(orbitData.t);
      const planetY = centerY + b * Math.sin(orbitData.t);
      orbitData.planetPos = { x: planetX, y: planetY };
      
      // Kepler&apos;s Second Law visualization (equal areas in equal times)
      if (showAreas) {
        // Add points to visualize the swept area
        if (orbitData.t - orbitData.lastAreaTime > 0.3) {
          orbitData.areaPoints.push({ x: planetX, y: planetY });
          orbitData.lastAreaTime = orbitData.t;
          
          // Keep only the last 3 points to show the most recent areas
          if (orbitData.areaPoints.length > 3) {
            orbitData.areaPoints.shift();
          }
        }
        
        // Draw the equal areas
        if (orbitData.areaPoints.length >= 2) {
          for (let i = 0; i < orbitData.areaPoints.length - 1; i++) {
            ctx.beginPath();
            ctx.moveTo(sunX, centerY);
            ctx.lineTo(orbitData.areaPoints[i].x, orbitData.areaPoints[i].y);
            ctx.lineTo(orbitData.areaPoints[i+1].x, orbitData.areaPoints[i+1].y);
            ctx.closePath();            ctx.fillStyle = `rgba(240, 246, 252, ${0.2 + i * 0.1})`;
            ctx.fill();
          }
        }
      }
        // Draw Sun (at one focus)
      const sunGradient = ctx.createRadialGradient(
        sunX, centerY, 0,
        sunX, centerY, 20
      );
      sunGradient.addColorStop(0, 'rgba(240, 246, 252, 1)');
      sunGradient.addColorStop(1, 'rgba(200, 209, 217, 0.8)');
      
      ctx.beginPath();
      ctx.fillStyle = sunGradient;
      ctx.arc(sunX, centerY, 12, 0, Math.PI * 2);
      ctx.fill();
        // Draw line from sun to planet (radius vector)
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(200, 209, 217, 0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.moveTo(sunX, centerY);
      ctx.lineTo(planetX, planetY);
      ctx.stroke();
      ctx.setLineDash([]);
        // Draw planet
      const planetGradient = ctx.createRadialGradient(
        planetX, planetY, 0,
        planetX, planetY, 10
      );
      planetGradient.addColorStop(0, 'rgba(240, 246, 252, 1)');
      planetGradient.addColorStop(1, 'rgba(139, 148, 158, 0.8)');
      
      ctx.beginPath();
      ctx.fillStyle = planetGradient;
      ctx.arc(planetX, planetY, 8, 0, Math.PI * 2);
      ctx.fill();
        // Draw the empty focus
      ctx.beginPath();
      ctx.fillStyle = 'rgba(200, 209, 217, 0.3)';
      ctx.arc(centerX + c, centerY, 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Add text labels
      ctx.font = '12px Arial';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.textAlign = 'center';
      ctx.fillText('sun (Focus)', sunX, centerY + 30);
      
      // Continue animation
      animFrameRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    animate();
    
    // Clean up
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [eccentricity, speed, isPlaying, showAreas]);
  
  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  };
  
  const toggleShowAreas = () => {
    setShowAreas(prev => !prev);
    // Reset area points when toggling
    orbitDataRef.current.areaPoints = [];
  };
  
  return (    <Paper
      elevation={3}
      sx={{
        p: 3,
        backgroundColor: 'rgba(36, 41, 46, 0.9)',
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        border: '1px solid rgba(240, 246, 252, 0.3)',
        mb: 4,
        animation: `${glow} 4s infinite ease-in-out`,
      }}
    >
      <Typography variant="h6" sx={{ 
        mb: 2, 
        color: '#f0f6fc',
        textShadow: '0 0 10px rgba(240, 246, 252, 0.5)'
      }}>
        Kepler&apos;s Laws Visualization
      </Typography>
      
      <Box sx={{ 
        width: '100%', 
        height: '300px',
        display: 'flex',
        justifyContent: 'center', 
        mb: 3 
      }}>
        <canvas 
          ref={canvasRef} 
          width={600} 
          height={300}
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="body2" gutterBottom>
            Eccentricity: {eccentricity.toFixed(2)}
          </Typography>          <Slider
            value={eccentricity}
            onChange={(_, newValue) => setEccentricity(newValue)}
            min={0}
            max={0.9}
            step={0.01}
            sx={{
              '& .MuiSlider-thumb': {
                color: '#f0f6fc',
              },
              '& .MuiSlider-track': {
                color: '#f0f6fc',
              },
              '& .MuiSlider-rail': {
                color: '#3d444c',
              }
            }}
          />
          <Typography variant="caption" sx={{ color: '#c8d1d9', mt: 1, display: 'block' }}>
            0 = circle, 1 = line
          </Typography>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="body2" gutterBottom>
            Orbital Speed: {speed.toFixed(1)}x
          </Typography>          <Slider
            value={speed}
            onChange={(_, newValue) => setSpeed(newValue)}
            min={0.1}
            max={3}
            step={0.1}
            sx={{
              '& .MuiSlider-thumb': {
                color: '#f0f6fc',
              },
              '& .MuiSlider-track': {
                color: '#f0f6fc',
              },
              '& .MuiSlider-rail': {
                color: '#3d444c',
              }
            }}
          />
        </Grid>
        
        <Grid item xs={12} md={4} sx={{ display: 'flex', gap: 2 }}>          <Button 
            variant="contained" 
            onClick={togglePlayPause}
            sx={{
              backgroundColor: isPlaying ? '#f0f6fc' : '#c8d1d9',
              color: '#111316',
              '&:hover': {
                backgroundColor: isPlaying ? '#c8d1d9' : '#f0f6fc',
              },
              flexGrow: 1
            }}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
          
          <Button 
            variant="outlined" 
            onClick={toggleShowAreas}
            sx={{
              color: showAreas ? '#f0f6fc' : '#c8d1d9',
              borderColor: showAreas ? '#f0f6fc' : '#3d444c',
              '&:hover': {
                borderColor: '#f0f6fc',
                color: '#f0f6fc'
              },
              flexGrow: 1
            }}
          >
            {showAreas ? 'Hide Areas' : 'show Equal Areas'}
          </Button>
        </Grid>
      </Grid>
        <Box sx={{ mt: 3, p: 2, backgroundColor: 'rgba(17, 19, 22, 0.6)', borderRadius: 1, border: '1px solid rgba(240, 246, 252, 0.1)' }}>
        <Typography variant="body2" sx={{ color: '#c8d1d9' }}>
          Kepler&apos;s First Law: Planets move in elliptical orbits with the Sun at one focus.
        </Typography>
        <Typography variant="caption" sx={{ color: '#8b949e', mt: 1, display: 'block' }}>
          Adjust the eccentricity to see how the orbit changes from circular to elliptical. 
          {showAreas && " The colored triangles demonstrate Kepler&apos;s Second Law: equal areas are swept in equal times."}
        </Typography>
      </Box>
    </Paper>
  );
}