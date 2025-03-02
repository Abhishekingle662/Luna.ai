'use client';

import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  CardMedia, 
  Grid, 
  Container,
  Tabs,
  Tab
} from '@mui/material';
import SpaceFactGenerator from './SpaceFactGenerator';
import GravitySimulator from './GravitySimulator';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// Import particles background dynamically to avoid SSR issues
const ParticlesBg = dynamic(() => import('particles-bg'), { ssr: false });

export default function GamesPage() {
  const [activeTab, setActiveTab] = useState(0);

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        background: 'radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%)',
        px: { xs: 2, md: 0 },
        py: { xs: 4, md: 6 }
      }}
    >
      {/* Particle Background */}
      <ParticlesBg type="cobweb" bg={true} color="#8364E8" num={50} />
      
      {/* Header */}
      <Container maxWidth="lg">
        <Box textAlign="center" mb={6}>
          <Typography 
            variant="h3" 
            component="h1"
            sx={{
              color: '#fff',
              fontFamily: 'var(--font-space-grotesk), sans-serif',
              fontWeight: 700,
              mb: 2,
              textShadow: '0 0 10px rgba(149, 117, 205, 0.7)',
            }}
          >
            Cosmic Games & Activities
          </Typography>
          
          <Tabs 
            value={activeTab} 
            onChange={handleChange} 
            centered
            textColor="secondary"
            indicatorColor="secondary"
            sx={{ 
              mb: 4,
              '& .MuiTab-root': { color: 'rgba(255,255,255,0.7)' },
              '& .Mui-selected': { color: '#9575CD !important' }
            }}
          >
            <Tab label="Space Facts" />
            <Tab label="Gravity Simulator" />
          </Tabs>
          
          {/* Games Content */}
          <Box>
            {activeTab === 0 && <SpaceFactGenerator />}
            {activeTab === 1 && <GravitySimulator />}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}