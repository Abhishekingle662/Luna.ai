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
import SolarSystemExplorer from './SolarSystemExplorer';
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
              fontFamily: 'var(--font-exo-2), sans-serif',
              fontWeight: 700,
              mb: 2,
              textShadow: '0 0 10px rgba(149, 117, 205, 0.7)',
            }}
          >
            Cosmic Games & Activities
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              maxWidth: '800px',
              mx: 'auto', 
              mb: 4,
              fontFamily: 'var(--font-space-grotesk), sans-serif',
            }}
          >
            Explore the universe through interactive educational games
          </Typography>
          
          <Button
            component={Link}
            href="/chat"
            variant="contained"
            sx={{
              background: 'linear-gradient(45deg, #5D3FD3 30%, #7B68EE 90%)',
              boxShadow: '0 0 10px rgba(149, 117, 205, 0.7)',
              px: 4,
              py: 1.2,
              borderRadius: '30px',
              fontWeight: 600,
            }}
          >
            Back to Chat
          </Button>
        </Box>
        
        {/* Game Content */}
        <Box
          sx={{
            backgroundColor: 'rgba(25, 25, 35, 0.75)',
            backdropFilter: 'blur(10px)',
            borderRadius: { xs: '15px', md: '30px' },
            border: '1px solid rgba(149, 117, 205, 0.3)',
            boxShadow: '0 0 20px rgba(149, 117, 205, 0.5)',
            overflow: 'hidden',
            mb: 4,
          }}
        >
          <Tabs 
            value={activeTab} 
            onChange={handleChange} 
            centered
            sx={{
              '& .MuiTab-root': {
                color: 'rgba(255, 255, 255, 0.6)',
                fontFamily: 'var(--font-space-grotesk), sans-serif',
                fontWeight: 500,
                fontSize: '1rem',
              },
              '& .Mui-selected': {
                color: '#9575CD',
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#5D3FD3',
              },
              borderBottom: '1px solid rgba(149, 117, 205, 0.2)',
            }}
          >
            <Tab label="Solar System Explorer" />
            {/* Add more tabs for future games */}
            <Tab label="Coming Soon: Cosmic Quiz" disabled />
            <Tab label="Coming Soon: Gravity Simulator" disabled />
          </Tabs>
          
          <Box p={{ xs: 2, md: 4 }}>
            {activeTab === 0 && (
              <Box>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: '#9575CD', 
                    mb: 2,
                    fontFamily: 'var(--font-space-grotesk), sans-serif',
                  }}
                >
                  Solar System Explorer
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.8)', 
                    mb: 3,
                    fontFamily: 'var(--font-space-grotesk), sans-serif',
                  }}
                >
                  Explore our solar system to learn fascinating facts about the planets. Click on any celestial body to reveal educational information about its characteristics and the missions that have studied it.
                </Typography>
                <SolarSystemExplorer />
              </Box>
            )}
            
            {/* Other game tabs would be added here */}
          </Box>
        </Box>
        
        {/* Footer Note */}
        <Typography 
          variant="body2" 
          align="center" 
          sx={{ color: 'rgba(255, 255, 255, 0.5)', mt: 4 }}
        >
          &copy; {new Date().getFullYear()} Abhishek Ingle. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}