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
  Paper,
  CircularProgress
} from '@mui/material';
import LaunchIcon from '@mui/icons-material/Launch';

export default function NasaEyes() {
  const [hoveredOption, setHoveredOption] = useState(null);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const nasaOptions = [
    {
      id: 'eyes-on-earth',
      title: 'Eyes on Earth',
      description: 'Track satellites in real-time, explore Earth\'s vital signs, and visualize climate data.',
      image: 'https://cdn.mos.cms.futurecdn.net/n3jFt7cqbddTJa3fKhPzja-1200-80.jpg',
      link: 'https://eyes.nasa.gov/apps/earth/'
    },
    {
      id: 'eyes-on-solar-system',
      title: 'Eyes on the Solar System',
      description: 'Explore planets, moons, asteroids, comets and NASA\'s spacecraft in real-time 3D visualization.',
      image: 'https://cdn.arstechnica.net/wp-content/uploads/2023/07/GettyImages-460712793-scaled.jpg',
      link: 'https://eyes.nasa.gov/apps/orrery/'
    },
    {
      id: 'eyes-on-exoplanets',
      title: 'Eyes on Exoplanets',
      description: 'Explore the wonders of systems beyond our Sun, with planets orbiting distant stars.',
      image: 'https://time.com/wp-content/uploads/2015/11/exoplanets_by_jaysimons-d9dv6th-large.jpg',
      link: 'https://eyes.nasa.gov/apps/exo/'
    }
  ];

  if (!mounted) {
    return <CircularProgress sx={{ color: '#9575CD', my: 10 }} />;
  }

  return (
    <Box sx={{ position: 'relative', minHeight: '400px' }}>
      <Typography 
        variant="h5" 
        component="h2" 
        sx={{ 
          mb: 3,
          color: '#fff',
          textAlign: 'center',
          fontWeight: 500
        }}
      >
        NASA&apos;s  Interactive Visualizations
      </Typography>

      <Grid container spacing={3}>
        {nasaOptions.map((option) => (
          <Grid item xs={12} md={4} key={option.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'rgba(25, 25, 35, 0.8)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(149, 117, 205, 0.3)',
                boxShadow: hoveredOption === option.id ? '0 0 25px rgba(149, 117, 205, 0.8)' : '0 0 15px rgba(149, 117, 205, 0.3)',
                transition: 'all 0.3s ease',
                borderRadius: 2,
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-5px)',
                }
              }}
              onMouseEnter={() => setHoveredOption(option.id)}
              onMouseLeave={() => setHoveredOption(null)}
            >
              <CardMedia
                component="img"
                height="180"
                image={option.image}
                alt={option.title}
              />
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#9575CD',
                    mb: 1,
                    fontFamily: 'var(--font-space-grotesk), sans-serif',
                  }}
                >
                  {option.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#fff', mb: 2 }}>
                  {option.description}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  endIcon={<LaunchIcon />}
                  href={option.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    mt: 'auto',
                    color: '#9575CD',
                    borderColor: 'rgba(149, 117, 205, 0.5)',
                    '&:hover': {
                      borderColor: '#9575CD',
                      backgroundColor: 'rgba(149, 117, 205, 0.1)',
                    }
                  }}
                >
                  Launch Application
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography 
        variant="caption" 
        sx={{ 
          display: 'block',
          color: 'rgba(255,255,255,0.6)',
          mt: 4, 
          textAlign: 'center' 
        }}
      >
        Applications require WebGL-compatible browser. For the best experience, use Chrome, Firefox, or Edge.
            {<br />}
        Content and images courtesy of NASA.
      </Typography>
    </Box>
  );
}