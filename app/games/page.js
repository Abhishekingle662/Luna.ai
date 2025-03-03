'use client';

import { useState, useEffect } from 'react';
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
  Tab,
  useMediaQuery,
  Stack
} from '@mui/material';
import SpaceFactGenerator from './SpaceFactGenerator';
import GravitySimulator from './GravitySimulator';
import NasaEyes from './NasaEyes';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; 
import HomeIcon from '@mui/icons-material/Home'; 

// Import particles background dynamically to avoid SSR issues
const ParticlesBg = dynamic(() => import('particles-bg'), { ssr: false });

export default function GamesPage() {
  const [activeTab, setActiveTab] = useState(0);
  const isMobile = useMediaQuery('(max-width:600px)');

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
        {/* Navigation Buttons - Hidden on mobile */}
        <Stack 
          direction="row" 
          spacing={2} 
          sx={{ 
            mb: 3, 
            justifyContent: 'flex-start', 
            display: { xs: isMobile ? 'none' : 'flex', md: 'flex' } 
          }}
        >
          <Button
            component={Link}
            href="/"
            startIcon={<HomeIcon />}
            size="small"
            sx={{
              color: '#9575CD',
              borderColor: 'rgba(149, 117, 205, 0.5)',
              '&:hover': {
                borderColor: '#9575CD',
                backgroundColor: 'rgba(149, 117, 205, 0.1)',
              },
              backdropFilter: 'blur(5px)',
              borderRadius: '30px',
              px: 2,
            }}
            variant="outlined"
          >
            Home
          </Button>

          <Button
            component={Link}
            href="/chat"
            startIcon={<ArrowBackIcon />}
            size="small"
            sx={{
              color: '#9575CD',
              borderColor: 'rgba(149, 117, 205, 0.5)',
              '&:hover': {
                borderColor: '#9575CD',
                backgroundColor: 'rgba(149, 117, 205, 0.1)',
              },
              backdropFilter: 'blur(5px)',
              borderRadius: '30px',
              px: 2,
            }}
            variant="outlined"
          >
            Back to Chat
          </Button>
        </Stack>

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
            <Tab label="NASA Eyes Visualization" />

          </Tabs>
          
          {/* Games Content */}
          <Box>
            {activeTab === 0 && <SpaceFactGenerator />}
            {activeTab === 1 && <GravitySimulator />}
            {activeTab === 2 && <NasaEyes />}

          </Box>
        </Box>
      </Container>
    </Box>
  );
}