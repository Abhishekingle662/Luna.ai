'use client'

import React, { useState, useEffect } from 'react';
import { Box, Slider, Typography, Grid, Paper } from '@mui/material';
import dynamic from 'next/dynamic';
import { keyframes } from '@mui/system';

// Use dynamic import to avoid SSR issues with p5
const ReactP5Wrapper = dynamic(() => import('react-p5-wrapper').then(mod => mod.ReactP5Wrapper), {
  ssr: false,
});

// Animation
const glow = keyframes`
  0% {
    box-shadow: 0 0 10px rgba(149, 117, 205, 0.7);
  }
  50% {
    box-shadow: 0 0 20px rgba(149, 117, 205, 0.9);
  }
  100% {
    box-shadow: 0 0 10px rgba(149, 117, 205, 0.7);
  }
`;

export default function GravityVisualization() {
  // State for sliders
  const [mass1, setMass1] = useState(50);
  const [mass2, setMass2] = useState(80);
  const [distance, setDistance] = useState(200);
  
  // Calculate force based on Newton's Law
  const G = 6.67430; // Universal gravitational constant (scaled for visualization)
  const force = G * (mass1 * mass2) / (distance * distance);
  const force_normalized = Math.min(Math.max(force / 300, 0.1), 1);
  
  // P5 sketch function
  const sketch = p5 => {
    p5.setup = () => {
      p5.createCanvas(600, 300);
      p5.noStroke();
    };
    
    p5.updateWithProps = props => {
      if (props.mass1 !== undefined) setMass1(props.mass1);
      if (props.mass2 !== undefined) setMass2(props.mass2);
      if (props.distance !== undefined) setDistance(props.distance);
    };
    
    p5.draw = () => {
      // Background
      p5.background(25, 25, 35);
      
      // Calculate sizes based on mass
      const size1 = Math.sqrt(mass1) * 3;
      const size2 = Math.sqrt(mass2) * 3;
      
      // Calculate positions
      const center = p5.width / 2;
      const pos1 = center - distance / 2;
      const pos2 = center + distance / 2;
      
      // Draw force line
      p5.stroke(149, 117, 205, 150 * force_normalized);
      p5.strokeWeight(force_normalized * 10);
      p5.line(pos1, p5.height/2, pos2, p5.height/2);
      p5.noStroke();
      
      // Draw masses
      p5.fill(149, 117, 205);
      p5.ellipse(pos1, p5.height/2, size1, size1);
      p5.fill(100, 181, 246);
      p5.ellipse(pos2, p5.height/2, size2, size2);
      
      // Draw force arrows
      drawArrow(p5, pos1, p5.height/2, 1, force_normalized);
      drawArrow(p5, pos2, p5.height/2, -1, force_normalized);
      
      // Draw distance
      p5.stroke(255, 255, 255, 100);
      p5.strokeWeight(1);
      p5.line(pos1, p5.height/2 + 60, pos2, p5.height/2 + 60);
      p5.noStroke();
      p5.fill(255);
      p5.textAlign(p5.CENTER);
      p5.text(`${distance.toFixed(0)} units`, center, p5.height/2 + 80);
    };
    
    function drawArrow(p5, x, y, direction, magnitude) {
      const arrowSize = 15 * magnitude;
      p5.fill(255, 150);
      p5.push();
      p5.translate(x + direction * 30, y);
      p5.rotate(direction === 1 ? 0 : p5.PI);
      p5.triangle(0, -arrowSize/2, arrowSize, 0, 0, arrowSize/2);
      p5.pop();
    }
  };
  
  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        backgroundColor: 'rgba(25, 25, 35, 0.9)',
        backdropFilter: 'blur(10px)',
        borderRadius: '12px',
        border: '1px solid rgba(149, 117, 205, 0.3)',
        mb: 4,
        animation: `${glow} 4s infinite ease-in-out`,
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, color: '#9575CD' }}>
        Interactive Gravity Simulator
      </Typography>
      
      <Box sx={{ width: '100%', overflow: 'hidden', mb: 3 }}>
        <ReactP5Wrapper sketch={sketch} mass1={mass1} mass2={mass2} distance={distance} />
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Typography variant="body2" gutterBottom>
            Mass 1: {mass1} units
          </Typography>
          <Slider
            value={mass1}
            onChange={(e, newValue) => setMass1(newValue)}
            min={10}
            max={200}
            sx={{
              '& .MuiSlider-thumb': {
                color: '#9575CD',
              },
              '& .MuiSlider-track': {
                color: '#9575CD',
              },
              '& .MuiSlider-rail': {
                color: '#555',
              }
            }}
          />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Typography variant="body2" gutterBottom>
            Mass 2: {mass2} units
          </Typography>
          <Slider
            value={mass2}
            onChange={(e, newValue) => setMass2(newValue)}
            min={10}
            max={200}
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
        
        <Grid item xs={12} md={4}>
          <Typography variant="body2" gutterBottom>
            Distance: {distance} units
          </Typography>
          <Slider
            value={distance}
            onChange={(e, newValue) => setDistance(newValue)}
            min={80}
            max={500}
            sx={{
              '& .MuiSlider-thumb': {
                color: '#fff',
              },
              '& .MuiSlider-track': {
                color: '#ccc',
              },
              '& .MuiSlider-rail': {
                color: '#555',
              }
            }}
          />
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 3, p: 2, backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 1 }}>
        <Typography variant="body2" sx={{ color: '#E0E0E0' }}>
          Force: <strong style={{ color: '#9575CD' }}>{force.toFixed(2)} N</strong>
        </Typography>
        <Typography variant="caption" sx={{ color: '#aaa', mt: 1, display: 'block' }}>
          As you adjust the masses and distance, watch how the gravitational force changes according to Newton's Law:
          F = G(m₁m₂)/r²
        </Typography>
      </Box>
    </Paper>
  );
}