'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography,
  Container,
  Tabs,
  Tab,
  useMediaQuery,
  Stack,
  Button,
  CircularProgress
} from '@mui/material';
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import dynamic from 'next/dynamic';

// Use dynamic imports to prevent server-side rendering issues
const SpaceFactGenerator = dynamic(() => import('./SpaceFactGenerator'), {
  loading: () => <CircularProgress sx={{ color: 'rgba(240, 246, 252, 0.7)', my: 10 }} />,
  ssr: false
});

const GravitySimulator = dynamic(() => import('./GravitySimulator'), {
  loading: () => <CircularProgress sx={{ color: 'rgba(240, 246, 252, 0.7)', my: 10 }} />,
  ssr: false
});

const NasaEyes = dynamic(() => import('./NasaEyes'), {
  loading: () => <CircularProgress sx={{ color: 'rgba(240, 246, 252, 0.7)', my: 10 }} />,
  ssr: false
});

export default function GamesPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [mounted, setMounted] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Show loading spinner until client-side rendering is complete
  if (!mounted) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%)',
        }}
      >
        <CircularProgress sx={{ color: 'rgba(240, 246, 252, 0.7)' }} />
      </Box>
    );
  }

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
      {/* Header */}
      <Container maxWidth="lg">
        {/* Navigation Buttons */}
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
            href="/"            startIcon={<HomeIcon />}
            size="small"
            sx={{
              color: 'rgba(240, 246, 252, 0.7)',
              borderColor: 'rgba(240, 246, 252, 0.5)',
              '&:hover': {
                borderColor: 'rgba(240, 246, 252, 0.7)',
                backgroundColor: 'rgba(240, 246, 252, 0.1)',
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
            href="/chat"            startIcon={<ArrowBackIcon />}
            size="small"
            sx={{
              color: 'rgba(240, 246, 252, 0.7)',
              borderColor: 'rgba(240, 246, 252, 0.5)',
              '&:hover': {
                borderColor: 'rgba(240, 246, 252, 0.7)',
                backgroundColor: 'rgba(240, 246, 252, 0.1)',
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
            sx={{              mb: 4,
              '& .MuiTab-root': { color: 'rgba(255,255,255,0.7)' },
              '& .Mui-selected': { color: 'rgba(240, 246, 252, 0.7) !important' }
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