'use client'

import React, { useRef, useEffect, useState } from 'react';
import { Box, Slider, Typography, Grid, Paper, Button } from '@mui/material';
import { keyframes } from '@mui/system';
import anime from 'animejs/lib/anime.es.js';

// Animation
const glow = keyframes`
  0% {
    box-shadow: 0 0 10px rgba(100, 181, 246, 0.7);
  }
  50% {
    box-shadow: 0 0 20px rgba(100, 181, 246, 0.9);
  }
  100% {
    box-shadow: 0 0 10px rgba(100, 181, 246, 0.7);
  }
`;

export default function OrbitalAnimation() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [eccentricity, setEccentricity] = useState(0.5);
  const [speed, setSpeed] = useState(2);
  const [isPlaying, setIsPlaying] = useState(true);
  
  useEffect(() => {
    // Initialize canvas
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Create orbital path
    const a = 120; // semi-major axis
    const c = a * eccentricity; // distance from center to focus
    const b = Math.sqrt(a * a - c * c); // semi-minor axis
    
    let t = 0;
    let planet = { x: 0, y: 0 };
    
    // Create animation
    if (animationRef.current) {
      animationRef.current.pause();
    }
    
    const drawScene = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw background stars
      for (let i = 0; i < 100; i++) {
        const starX = Math.random() * width;
        const starY = Math.random() * height;
        const starSize = Math.random() * 1.5;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.7 + 0.3})`;
        ctx.beginPath();
        ctx.arc(starX, starY, starSize, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Draw orbital path
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(width/2, height/2, a, b, 0, 0, Math.PI * 2);
      ctx.stroke();
      
      // Draw sun
      ctx.fillStyle = '#FDB813';
      ctx.beginPath();
      ctx.arc(width/2 + c, height/2, 15, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw glow around sun
      const gradient = ctx.createRadialGradient(
        width/2 + c, height/2, 15,
        width/2 + c, height/2, 40
      );
      gradient.addColorStop(0, 'rgba(253, 184, 19, 0.5)');
      gradient.addColorStop(1, 'rgba(253, 184, 19, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(width/2 + c, height/2, 40, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw planet
      ctx.fillStyle = '#64B5F6';
      ctx.beginPath();
      ctx.arc(planet.x, planet.y, 8, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw line connecting sun and planet
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(width/2 + c, height/2);
      ctx.lineTo(planet.x, planet.y);
      ctx.stroke();
    };
    
    animationRef.current = anime({
      duration: 6000 / speed,
      easing: 'linear',
      update: function() {
        if (!isPlaying) return;
        
        // Calculate planet position using parametric equation of ellipse
        t = (t + (speed / 60)) % (Math.PI * 2);
        planet.x = width/2 + a * Math.cos(t);
        planet.y = height/2 + b * Math.sin(t);
        
        drawScene();
      },
      loop: true
    });
    
    // Initial draw
    drawScene();
    
    return () => {
      if (animationRef.current) {
        animationRef.current.pause();
      }
    };
  }, [eccentricity, speed, isPlaying]);
  
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        backgroundColor: 'rgba(25, 25, 35, 0.9)',
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        border: '1px solid rgba(100, 181, 246, 0.3)',
        mb: 4,
        animation: `${glow} 4s infinite ease-in-out`,
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, color: '#64B5F6' }}>
        Orbital Mechanics Visualization
      </Typography>
      
      <Box sx={{ width: '100%', overflow: 'hidden', mb: 3 }}>
        <canvas 
          ref={canvasRef} 
          width={600} 
          height={300}
          style={{ width: '100%', height: 'auto', maxWidth: '600px', margin: '0 auto', display: 'block' }}
        />
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Typography variant="body2" gutterBottom>
            Eccentricity: {eccentricity.toFixed(2)}
          </Typography>
          <Slider
            value={eccentricity}
            onChange={(e, newValue) => setEccentricity(newValue)}
            min={0}
            max={0.9}
            step={0.01}
            sx={{
              '& .MuiSlider-thumb': {
                color: '#64B5F6',
              },
              '& .MuiSlider-track': {
                color: '#64B5F6',
              },
              '& .MuiSlider-rail': {
                color: '#555',
              }
            }}
          />
        </Grid>
        
        <Grid item xs={12} md={5}>
          <Typography variant="body2" gutterBottom>
            Orbital Speed: {speed.toFixed(1)}x
          </Typography>
          <Slider
            value={speed}
            onChange={(e, newValue) => setSpeed(newValue)}
            min={0.5}
            max={5}
            step={0.1}
            sx={{
              '& .MuiSlider-thumb': {
                color: '#64B5F6',
              },
              '& .MuiSlider-track': {
                color: '#64B5F6',
              },
              '& .MuiSlider-rail': {
                color: '#555',
              }
            }}
          />
        </Grid>
        
        <Grid item xs={12} md={2} sx={{ display: 'flex', alignItems: 'center' }}>
          <Button 
            variant="contained" 
            onClick={togglePlayPause}
            sx={{
              mt: 1,
              backgroundColor: isPlaying ? '#64B5F6' : '#9575CD',
              '&:hover': {
                backgroundColor: isPlaying ? '#2196F3' : '#7E57C2',
              },
              width: '100%'
            }}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 3, p: 2, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 1 }}>
        <Typography variant="body2" sx={{ color: '#E0E0E0' }}>
          Kepler's First Law: Planets move in elliptical orbits with the sun at one focus.
        </Typography>
        <Typography variant="caption" sx={{ color: '#aaa', mt: 1, display: 'block' }}>
          Adjust the eccentricity to see how the orbit shape changes from nearly circular (e ≈ 0) to highly elliptical (e ≈ 1).
        </Typography>
      </Box>
    </Paper>
  );
}