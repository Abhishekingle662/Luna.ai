'use client'

import React, { useRef, useEffect, useState } from 'react';
import { Box, Slider, Typography, Grid, Paper } from '@mui/material';
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

export default function GravityVisualization() {
  // State for sliders
  const [mass1, setMass1] = useState(50);
  const [mass2, setMass2] = useState(80);
  const [distance, setDistance] = useState(200);
  
  // Animation state
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  
  // Calculate force based on Newton&apos;s Law
  const G = 6.67430; // Universal gravitational constant (scaled for visualization)
  const force = G * (mass1 * mass2) / (distance * distance);
  const force_normalized = Math.min(Math.max(force / 300, 0.1), 1);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Smooth animation function
    const draw = () => {      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(17, 19, 22, 1)';
      ctx.fillRect(0, 0, width, height);
      
      // Calculate sizes based on mass
      const size1 = Math.sqrt(mass1) * 3;
      const size2 = Math.sqrt(mass2) * 3;
      
      // Calculate positions
      const center = width / 2;
      const pos1 = center - distance / 2;
      const pos2 = center + distance / 2;
        // Draw force line
      ctx.beginPath();
      ctx.strokeStyle = `rgba(240, 246, 252, ${150 * force_normalized})`;
      ctx.lineWidth = force_normalized * 10;
      ctx.moveTo(pos1, height/2);
      ctx.lineTo(pos2, height/2);
      ctx.stroke();
      
      // Draw masses
      ctx.fillStyle = 'rgba(240, 246, 252, 1)';
      ctx.beginPath();
      ctx.arc(pos1, height/2, size1, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = 'rgba(200, 209, 217, 1)';
      ctx.beginPath();
      ctx.arc(pos2, height/2, size2, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw force arrows
      drawArrow(ctx, pos1, height/2, 1, force_normalized);
      drawArrow(ctx, pos2, height/2, -1, force_normalized);
        // Draw distance line
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(200, 209, 217, 0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 3]);
      ctx.moveTo(pos1, height/2 + 60);
      ctx.lineTo(pos2, height/2 + 60);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Draw distance label
      ctx.fillStyle = 'rgba(240, 246, 252, 0.7)';
      ctx.font = '12px Space Grotesk, Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`Distance: ${distance.toFixed(0)} units`, center, height/2 + 80);
    };
      const drawArrow = (ctx, x, y, direction, magnitude) => {
      const arrowSize = 15 * magnitude;
      ctx.fillStyle = 'rgba(240, 246, 252, 0.7)';
      ctx.save();
      ctx.translate(x + direction * 30, y);
      ctx.rotate(direction === 1 ? 0 : Math.PI);
      ctx.beginPath();
      ctx.moveTo(0, -arrowSize/2);
      ctx.lineTo(arrowSize, 0);
      ctx.lineTo(0, arrowSize/2);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };
    
    // Initial draw
    draw();
    
    // Clean up any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    // We don't need a continuous animation here since we're only updating when parameters change
    
  }, [mass1, mass2, distance, force_normalized]);
    return (
    <Paper
      elevation={3}
      sx={{
        p: 3,        backgroundColor: 'rgba(36, 41, 46, 0.9)',
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
        Interactive Gravity Simulator
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
      
      <Grid container spacing={3}>        <Grid item xs={12} md={4}>
          <Typography variant="body2" gutterBottom>
            Primary Mass: {mass1} units
          </Typography>
          <Slider
            value={mass1}
            onChange={(e, newValue) => setMass1(newValue)}
            min={10}
            max={200}
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
        
        <Grid item xs={12} md={4}>
          <Typography variant="body2" gutterBottom>
            Secondary Mass: {mass2} units
          </Typography>
          <Slider
            value={mass2}
            onChange={(e, newValue) => setMass2(newValue)}
            min={10}
            max={200}
            sx={{
              '& .MuiSlider-thumb': {
                color: '#c8d1d9',
              },
              '& .MuiSlider-track': {
                color: '#c8d1d9',
              },
              '& .MuiSlider-rail': {
                color: '#3d444c',
              }
            }}
          />
        </Grid>
        
        <Grid item xs={12} md={4}>          <Typography variant="body2" gutterBottom>
            Distance: {distance} units
          </Typography>
          <Slider
            value={distance}
            onChange={(e, newValue) => setDistance(newValue)}
            min={80}
            max={400}
            sx={{
              '& .MuiSlider-thumb': {
                color: '#8b949e',
              },
              '& .MuiSlider-track': {
                color: '#8b949e',
              },
              '& .MuiSlider-rail': {
                color: '#3d444c',
              }
            }}
          />
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 3, p: 2, backgroundColor: 'rgba(17, 19, 22, 0.6)', borderRadius: 1, border: '1px solid rgba(240, 246, 252, 0.1)' }}>
        <Typography variant="body2" sx={{ color: '#c8d1d9' }}>
          Gravitational Force: <strong style={{ color: '#f0f6fc' }}>{force.toFixed(2)} N</strong>
        </Typography>
        <Typography variant="caption" sx={{ color: '#8b949e', mt: 1, display: 'block' }}>
          Newton&apos;s Law: F = G(m₁m₂)/r². When you increase mass, the force increases proportionally. When you increase distance, the force decreases with the square of the distance.
        </Typography>
      </Box>
    </Paper>
  );
}