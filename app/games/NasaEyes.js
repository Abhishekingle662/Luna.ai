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
  Paper,
  Fade 
} from '@mui/material';
import LaunchIcon from '@mui/icons-material/Launch';

export default function NasaEyes() {
  const [hoveredOption, setHoveredOption] = useState(null);

const nasaOptions = [
    {
        id: 'eyes-on-earth',
        title: 'Eyes on Earth',
        description: 'Track satellites in real-time, explore Earths vital signs, and visualize climate data.',
        image: 'https://cdn.mos.cms.futurecdn.net/n3jFt7cqbddTJa3fKhPzja-1200-80.jpg',
        link: 'https://eyes.nasa.gov/apps/earth/'
    },
    {
        id: 'eyes-on-solar-system',
        title: 'Eyes on the Solar System',
        description: 'Explore planets, moons, asteroids, comets and NASA&apos;s spacecraft in real-time 3D visualization.',
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

  return (
    <Box sx={{ py: 2 }}>
      <Typography 
        variant="h5" 
        sx={{ 
          textAlign: 'center', 
          mb: 4,
          color: '#9575CD',
          textShadow: '0 0 5px rgba(149, 117, 205, 0.5)'
        }}
      >
        Explore NASA's Interactive 3D Visualizations
      </Typography>

      <Grid container spacing={3}>
        {nasaOptions.map((option) => (
          <Grid item xs={12} md={4} key={option.id}>
            <Fade in={true} timeout={800}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: 'rgba(25, 25, 35, 0.85)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(149, 117, 205, 0.3)',
                  boxShadow: hoveredOption === option.id 
                    ? '0 0 20px rgba(149, 117, 205, 0.6)' 
                    : '0 0 10px rgba(0, 0, 0, 0.5)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 0 25px rgba(149, 117, 205, 0.8)',
                  }
                }}
                onMouseEnter={() => setHoveredOption(option.id)}
                onMouseLeave={() => setHoveredOption(null)}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={option.image}
                  alt={option.title}
                  sx={{ 
                    borderBottom: '1px solid rgba(149, 117, 205, 0.3)',
                    filter: 'brightness(0.9)',
                    transition: 'filter 0.3s ease-in-out',
                    '&:hover': {
                      filter: 'brightness(1.1)',
                    }
                  }}
                />
                <CardContent sx={{ flexGrow: 1, pb: 0 }}>
                  <Typography 
                    variant="h6" 
                    component="h3" 
                    gutterBottom
                    sx={{ color: '#fff', fontWeight: 600 }}
                  >
                    {option.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}
                  >
                    {option.description}
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2, mt: 'auto' }}>
                  <Button 
                    variant="contained" 
                    fullWidth
                    href={option.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    endIcon={<LaunchIcon />}
                    sx={{
                      background: 'linear-gradient(45deg, #5D3FD3 30%, #7B68EE 90%)',
                      boxShadow: '0 0 10px rgba(149, 117, 205, 0.7)',
                      transition: 'all 0.2s',
                      '&:hover': {
                        transform: 'scale(1.02)',
                        boxShadow: '0 0 15px rgba(149, 117, 205, 1)',
                      },
                    }}
                  >
                    Launch Visualization
                  </Button>
                </Box>
              </Card>
            </Fade>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ textAlign: 'center', mt: 6 }}>
        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.6)', display: 'block', mb: 1 }}>
          Images and visualizations courtesy of NASA
        </Typography>
        <Button
          variant="outlined"
          href="https://eyes.nasa.gov/"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            color: '#9575CD',
            borderColor: 'rgba(149, 117, 205, 0.5)',
            '&:hover': {
              borderColor: '#9575CD',
              backgroundColor: 'rgba(149, 117, 205, 0.1)',
            },
            mt: 1
          }}
        >
          Explore All NASA Eyes Features
        </Button>
      </Box>
    </Box>
  );
}